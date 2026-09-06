/*
# Enhance schema: truck status, analytics, storage bucket, RLS fixes

## Changes

### 1. Truck Status ( trucks table )
- Add `status` column: text, default 'available', CHECK constraint allows 'available', 'reserved', 'sold'.
- Backfill: set status='sold' where is_sold=true, 'available' where is_sold=false.
- The `is_sold` boolean is kept for backward compatibility but the new `status` column is authoritative.

### 2. New table: truck_views
- Tracks individual truck page views with viewer fingerprint (anon IP + user agent hash) for unique counting.
- Columns: id, truck_id (FK), viewer_hash, created_at.
- RLS: public INSERT (anyone can record a view), no public SELECT/UPDATE/DELETE (admin only via authenticated).

### 3. New table: site_visits
- Tracks daily aggregated site visits for analytics dashboard.
- Columns: id, visit_date (unique), unique_visitors, total_page_views, truck_detail_views.
- RLS: public INSERT, authenticated SELECT.

### 4. Storage bucket: truck-images
- Public bucket for uploading truck photos.
- Policies: authenticated users can upload/update/delete; public can read.

### 5. Storage bucket: brand-logos
- Public bucket for brand logo uploads.

### 6. Updated increment_views function
- Now also inserts a row into truck_views for unique view tracking.
- Uses SECURITY DEFINER so it can write to truck_views even though the caller is anon.

### 7. RLS policy fix
- Add DELETE policy to settings table (was missing - admin couldn't reset settings).
*/

-- 1. Add status column to trucks
ALTER TABLE trucks ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'available';

-- Add CHECK constraint (drop first if exists for idempotency)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trucks_status_check') THEN
    ALTER TABLE trucks ADD CONSTRAINT trucks_status_check
      CHECK (status IN ('available', 'reserved', 'sold'));
  END IF;
END $$;

-- Backfill status from is_sold
UPDATE trucks SET status = 'sold' WHERE is_sold = true AND status = 'available';
UPDATE trucks SET status = 'available' WHERE is_sold = false;

-- 2. Create truck_views table
CREATE TABLE IF NOT EXISTS truck_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE,
  viewer_hash text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE truck_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_truck_views" ON truck_views;
CREATE POLICY "public_insert_truck_views" ON truck_views FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_truck_views" ON truck_views;
CREATE POLICY "admin_read_truck_views" ON truck_views FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_delete_truck_views" ON truck_views;
CREATE POLICY "admin_delete_truck_views" ON truck_views FOR DELETE
  TO authenticated USING (true);

-- Index for unique view counting
CREATE INDEX IF NOT EXISTS idx_truck_views_truck_id ON truck_views(truck_id);
CREATE INDEX IF NOT EXISTS idx_truck_views_viewer_hash ON truck_views(truck_id, viewer_hash);

-- 3. Create site_visits table
CREATE TABLE IF NOT EXISTS site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  unique_visitors integer NOT NULL DEFAULT 0,
  total_page_views integer NOT NULL DEFAULT 0,
  truck_detail_views integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_site_visits" ON site_visits;
CREATE POLICY "public_insert_site_visits" ON site_visits FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_site_visits" ON site_visits;
CREATE POLICY "public_update_site_visits" ON site_visits FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_site_visits" ON site_visits;
CREATE POLICY "admin_read_site_visits" ON site_visits FOR SELECT
  TO authenticated USING (true);

-- 4. Create storage bucket: truck-images
INSERT INTO storage.buckets (id, name, public) VALUES ('truck-images', 'truck-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_truck_images" ON storage.objects;
CREATE POLICY "public_read_truck_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'truck-images');

DROP POLICY IF EXISTS "auth_insert_truck_images" ON storage.objects;
CREATE POLICY "auth_insert_truck_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'truck-images');

DROP POLICY IF EXISTS "auth_update_truck_images" ON storage.objects;
CREATE POLICY "auth_update_truck_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'truck-images') WITH CHECK (bucket_id = 'truck-images');

DROP POLICY IF EXISTS "auth_delete_truck_images" ON storage.objects;
CREATE POLICY "auth_delete_truck_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'truck-images');

-- 5. Create storage bucket: brand-logos
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_brand_logos" ON storage.objects;
CREATE POLICY "public_read_brand_logos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "auth_insert_brand_logos" ON storage.objects;
CREATE POLICY "auth_insert_brand_logos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "auth_update_brand_logos" ON storage.objects;
CREATE POLICY "auth_update_brand_logos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'brand-logos') WITH CHECK (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "auth_delete_brand_logos" ON storage.objects;
CREATE POLICY "auth_delete_brand_logos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'brand-logos');

-- 6. Replace increment_views with version that also records in truck_views
CREATE OR REPLACE FUNCTION public.increment_views(truck_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE trucks SET views = views + 1 WHERE id = truck_id;
  INSERT INTO truck_views (truck_id) VALUES (truck_id);
END;
$$;

-- 7. Add missing DELETE policy to settings
DROP POLICY IF EXISTS "admin_delete_settings" ON settings;
CREATE POLICY "admin_delete_settings" ON settings FOR DELETE
  TO authenticated USING (true);
