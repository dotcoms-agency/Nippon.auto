/*
# Create Full Nippon Auto Schema

## Summary
Replaces the incompatible default schema with the complete schema the frontend expects.
All existing tables are empty (0 rows), so dropping them loses no data.

## Tables Created
1. `brands` — truck manufacturers (Hino, Isuzu, etc.)
2. `trucks` — truck inventory with images, specs, features, status, views
3. `inquiries` — customer contact form submissions
4. `testimonials` — customer reviews
5. `settings` — single-row company settings (name, contact, social links, logo)
6. `truck_views` — per-visit view tracking for analytics
7. `site_visits` — daily aggregate visitor counts

## Tables Dropped (all empty, 0 rows)
- `trucks` (old incompatible schema)
- `truck_images` (frontend uses image_urls array on trucks instead)
- `enquiries` (frontend uses `inquiries`)
- `site_content` (frontend uses `settings`)
- `site_settings` (frontend uses `settings`)

## Storage Buckets
- `truck-images` — public read, authenticated write
- `brand-logos` — public read, authenticated write
- `truck-videos` — public read, authenticated write
- `company-assets` — public read, authenticated write

## Functions
- `increment_views(truck_id uuid)` — SECURITY DEFINER, increments truck view count and logs a view row

## Security (RLS)
- Public site reads: `anon, authenticated` SELECT on all tables
- Public inquiry submission: `anon, authenticated` INSERT on `inquiries`
- Admin writes: `authenticated` INSERT/UPDATE/DELETE on all tables
- `truck_views`: public INSERT (anyone can trigger a view), authenticated read
*/

-- ============================================================
-- 1. DROP OLD INCOMPATIBLE TABLES (all empty, 0 rows)
-- ============================================================
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS truck_images CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS trucks CASCADE;

-- ============================================================
-- 2. CREATE BRANDS
-- ============================================================
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ja text,
  logo_url text,
  country text DEFAULT 'Japan',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_brands" ON brands;
CREATE POLICY "public_read_brands" ON brands FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_brands" ON brands;
CREATE POLICY "auth_insert_brands" ON brands FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_brands" ON brands;
CREATE POLICY "auth_update_brands" ON brands FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_brands" ON brands;
CREATE POLICY "auth_delete_brands" ON brands FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. CREATE TRUCKS
-- ============================================================
CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  model text NOT NULL,
  year integer,
  price numeric,
  mileage integer,
  transmission text DEFAULT 'Manual',
  fuel text DEFAULT 'Diesel',
  body_type text,
  engine_cc integer,
  color text,
  image_urls text[] DEFAULT '{}',
  video_url text,
  specifications jsonb DEFAULT '{}'::jsonb,
  features text[] DEFAULT '{}',
  condition_notes text,
  description text,
  description_ja text,
  is_sold boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_trucks_featured ON trucks(is_featured);
CREATE INDEX IF NOT EXISTS idx_trucks_brand_id ON trucks(brand_id);
CREATE INDEX IF NOT EXISTS idx_trucks_created_at ON trucks(created_at DESC);

DROP POLICY IF EXISTS "public_read_trucks" ON trucks;
CREATE POLICY "public_read_trucks" ON trucks FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_trucks" ON trucks;
CREATE POLICY "auth_insert_trucks" ON trucks FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_trucks" ON trucks;
CREATE POLICY "auth_update_trucks" ON trucks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_trucks" ON trucks;
CREATE POLICY "auth_delete_trucks" ON trucks FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. CREATE INQUIRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

DROP POLICY IF EXISTS "public_read_inquiries" ON inquiries;
CREATE POLICY "public_read_inquiries" ON inquiries FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_inquiries" ON inquiries;
CREATE POLICY "auth_update_inquiries" ON inquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_inquiries" ON inquiries;
CREATE POLICY "auth_delete_inquiries" ON inquiries FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 5. CREATE TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ja text,
  rating integer DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment text,
  comment_ja text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 6. CREATE SETTINGS (single-row company config)
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Nippon Auto',
  company_name_ja text NOT NULL DEFAULT 'ニッポンオート',
  address text,
  phone text,
  email text,
  line_url text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  business_hours text,
  business_hours_ja text,
  logo_url text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_settings" ON settings;
CREATE POLICY "auth_insert_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_settings" ON settings;
CREATE POLICY "auth_update_settings" ON settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_settings" ON settings;
CREATE POLICY "auth_delete_settings" ON settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 7. CREATE TRUCK_VIEWS (per-visit view log)
-- ============================================================
CREATE TABLE IF NOT EXISTS truck_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id uuid REFERENCES trucks(id) ON DELETE CASCADE,
  viewer_hash text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE truck_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_truck_views_truck_id ON truck_views(truck_id);
CREATE INDEX IF NOT EXISTS idx_truck_views_created_at ON truck_views(created_at DESC);

DROP POLICY IF EXISTS "public_insert_truck_views" ON truck_views;
CREATE POLICY "public_insert_truck_views" ON truck_views FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_truck_views" ON truck_views;
CREATE POLICY "auth_read_truck_views" ON truck_views FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 8. CREATE SITE_VISITS (daily aggregate visitors)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date date NOT NULL UNIQUE,
  unique_visitors integer DEFAULT 0,
  total_page_views integer DEFAULT 0,
  truck_detail_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_site_visits_visit_date ON site_visits(visit_date DESC);

DROP POLICY IF EXISTS "public_read_site_visits" ON site_visits;
CREATE POLICY "public_read_site_visits" ON site_visits FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_site_visits" ON site_visits;
CREATE POLICY "auth_insert_site_visits" ON site_visits FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_site_visits" ON site_visits;
CREATE POLICY "auth_update_site_visits" ON site_visits FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_site_visits" ON site_visits;
CREATE POLICY "auth_delete_site_visits" ON site_visits FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 9. INCREMENT_VIEWS FUNCTION (SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION increment_views(truck_id uuid)
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

GRANT EXECUTE ON FUNCTION increment_views(uuid) TO anon, authenticated;

-- ============================================================
-- 10. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('truck-images', 'truck-images', true),
  ('brand-logos', 'brand-logos', true),
  ('truck-videos', 'truck-videos', true),
  ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Helper to drop+recreate storage policies
-- truck-images
DROP POLICY IF EXISTS "public_read_truck_images_bucket" ON storage.objects;
CREATE POLICY "public_read_truck_images_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'truck-images');
DROP POLICY IF EXISTS "auth_insert_truck_images_bucket" ON storage.objects;
CREATE POLICY "auth_insert_truck_images_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'truck-images');
DROP POLICY IF EXISTS "auth_update_truck_images_bucket" ON storage.objects;
CREATE POLICY "auth_update_truck_images_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'truck-images') WITH CHECK (bucket_id = 'truck-images');
DROP POLICY IF EXISTS "auth_delete_truck_images_bucket" ON storage.objects;
CREATE POLICY "auth_delete_truck_images_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'truck-images');

-- brand-logos
DROP POLICY IF EXISTS "public_read_brand_logos_bucket" ON storage.objects;
CREATE POLICY "public_read_brand_logos_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'brand-logos');
DROP POLICY IF EXISTS "auth_insert_brand_logos_bucket" ON storage.objects;
CREATE POLICY "auth_insert_brand_logos_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'brand-logos');
DROP POLICY IF EXISTS "auth_update_brand_logos_bucket" ON storage.objects;
CREATE POLICY "auth_update_brand_logos_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'brand-logos') WITH CHECK (bucket_id = 'brand-logos');
DROP POLICY IF EXISTS "auth_delete_brand_logos_bucket" ON storage.objects;
CREATE POLICY "auth_delete_brand_logos_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'brand-logos');

-- truck-videos
DROP POLICY IF EXISTS "public_read_truck_videos_bucket" ON storage.objects;
CREATE POLICY "public_read_truck_videos_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'truck-videos');
DROP POLICY IF EXISTS "auth_insert_truck_videos_bucket" ON storage.objects;
CREATE POLICY "auth_insert_truck_videos_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'truck-videos');
DROP POLICY IF EXISTS "auth_update_truck_videos_bucket" ON storage.objects;
CREATE POLICY "auth_update_truck_videos_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'truck-videos') WITH CHECK (bucket_id = 'truck-videos');
DROP POLICY IF EXISTS "auth_delete_truck_videos_bucket" ON storage.objects;
CREATE POLICY "auth_delete_truck_videos_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'truck-videos');

-- company-assets
DROP POLICY IF EXISTS "public_read_company_assets_bucket" ON storage.objects;
CREATE POLICY "public_read_company_assets_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'company-assets');
DROP POLICY IF EXISTS "auth_insert_company_assets_bucket" ON storage.objects;
CREATE POLICY "auth_insert_company_assets_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'company-assets');
DROP POLICY IF EXISTS "auth_update_company_assets_bucket" ON storage.objects;
CREATE POLICY "auth_update_company_assets_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'company-assets') WITH CHECK (bucket_id = 'company-assets');
DROP POLICY IF EXISTS "auth_delete_company_assets_bucket" ON storage.objects;
CREATE POLICY "auth_delete_company_assets_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'company-assets');
