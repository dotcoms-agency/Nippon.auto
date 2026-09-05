/*
# Create storage bucket for logo uploads
Creates a public bucket for company logo and image uploads.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_company_assets" ON storage.objects;
CREATE POLICY "public_read_company_assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "admin_upload_company_assets" ON storage.objects;
CREATE POLICY "admin_upload_company_assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "admin_update_company_assets" ON storage.objects;
CREATE POLICY "admin_update_company_assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets') WITH CHECK (bucket_id = 'company-assets');

DROP POLICY IF EXISTS "admin_delete_company_assets" ON storage.objects;
CREATE POLICY "admin_delete_company_assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'company-assets');
