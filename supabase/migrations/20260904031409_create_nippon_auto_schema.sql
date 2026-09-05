/*
# Nippon Auto - Full Database Schema
Creates schema for a Japanese used truck dealership website with admin panel.
Public tables readable by anon; admin operations require authenticated.
*/

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
CREATE POLICY "public_read_brands" ON brands FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_brands" ON brands;
CREATE POLICY "admin_insert_brands" ON brands FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_brands" ON brands;
CREATE POLICY "admin_update_brands" ON brands FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_brands" ON brands;
CREATE POLICY "admin_delete_brands" ON brands FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS trucks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  model text NOT NULL,
  year int,
  price numeric DEFAULT 0,
  mileage int DEFAULT 0,
  transmission text DEFAULT 'Manual',
  fuel text DEFAULT 'Diesel',
  body_type text,
  engine_cc int,
  color text,
  image_urls text[] DEFAULT '{}',
  video_url text,
  specifications jsonb DEFAULT '{}',
  features text[] DEFAULT '{}',
  condition_notes text,
  description text,
  description_ja text,
  is_sold boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_trucks" ON trucks;
CREATE POLICY "public_read_trucks" ON trucks FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_trucks" ON trucks;
CREATE POLICY "admin_insert_trucks" ON trucks FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_trucks" ON trucks;
CREATE POLICY "admin_update_trucks" ON trucks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_trucks" ON trucks;
CREATE POLICY "admin_delete_trucks" ON trucks FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  message text,
  truck_id uuid REFERENCES trucks(id) ON DELETE SET NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_inquiries" ON inquiries;
CREATE POLICY "public_insert_inquiries" ON inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_inquiries" ON inquiries;
CREATE POLICY "admin_read_inquiries" ON inquiries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_inquiries" ON inquiries;
CREATE POLICY "admin_update_inquiries" ON inquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_inquiries" ON inquiries;
CREATE POLICY "admin_delete_inquiries" ON inquiries FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ja text,
  rating int DEFAULT 5,
  comment text,
  comment_ja text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_testimonials" ON testimonials;
CREATE POLICY "admin_insert_testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text DEFAULT 'Nippon Auto',
  company_name_ja text DEFAULT 'ニッポンオート',
  address text, phone text, email text, line_url text,
  facebook_url text, instagram_url text, twitter_url text,
  business_hours text, business_hours_ja text, logo_url text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_settings" ON settings;
CREATE POLICY "admin_insert_settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_trucks_brand ON trucks(brand_id);
CREATE INDEX IF NOT EXISTS idx_trucks_featured ON trucks(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_trucks_sold ON trucks(is_sold);
CREATE INDEX IF NOT EXISTS idx_trucks_created ON trucks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);

INSERT INTO settings (company_name, company_name_ja, address, phone, email, line_url, business_hours, business_hours_ja)
SELECT 'Nippon Auto', 'ニッポンオート', '1-2-3 Chuo, Tokyo, Japan', '+81-3-1234-5678', 'info@nipponauto.jp', 'https://line.me/ti/p/@nipponauto', 'Mon-Sat: 9:00-18:00', '月-土: 9:00-18:00'
WHERE NOT EXISTS (SELECT 1 FROM settings);

INSERT INTO brands (name, name_ja, country) SELECT 'Isuzu', 'いすゞ', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Isuzu');
INSERT INTO brands (name, name_ja, country) SELECT 'Hino', '日野', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Hino');
INSERT INTO brands (name, name_ja, country) SELECT 'Mitsubishi Fuso', '三菱ふそう', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Mitsubishi Fuso');
INSERT INTO brands (name, name_ja, country) SELECT 'Nissan Diesel', '日産ディーゼル', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Nissan Diesel');
INSERT INTO brands (name, name_ja, country) SELECT 'UD Trucks', 'UDトラックス', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'UD Trucks');
INSERT INTO brands (name, name_ja, country) SELECT 'Toyota', 'トヨタ', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Toyota');
INSERT INTO brands (name, name_ja, country) SELECT 'Mazda', 'マツダ', 'Japan' WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Mazda');
