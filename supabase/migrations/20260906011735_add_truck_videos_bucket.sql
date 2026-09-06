-- Create truck-videos storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('truck-videos', 'truck-videos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_truck_videos" ON storage.objects;
CREATE POLICY "public_read_truck_videos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'truck-videos');

DROP POLICY IF EXISTS "auth_insert_truck_videos" ON storage.objects;
CREATE POLICY "auth_insert_truck_videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'truck-videos');

DROP POLICY IF EXISTS "auth_update_truck_videos" ON storage.objects;
CREATE POLICY "auth_update_truck_videos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'truck-videos') WITH CHECK (bucket_id = 'truck-videos');

DROP POLICY IF EXISTS "auth_delete_truck_videos" ON storage.objects;
CREATE POLICY "auth_delete_truck_videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'truck-videos');
