/*
# Create increment_views function
Creates a SECURITY DEFINER function to increment truck view counts.
*/

CREATE OR REPLACE FUNCTION increment_views(truck_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE trucks SET views = views + 1 WHERE id = truck_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_views TO anon, authenticated;
