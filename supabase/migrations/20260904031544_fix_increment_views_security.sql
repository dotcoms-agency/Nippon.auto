/*
# Fix increment_views function security
Sets search_path and changes to SECURITY INVOKER so it doesn't need DEFINER privileges.
*/

DROP FUNCTION IF EXISTS increment_views(uuid);

CREATE OR REPLACE FUNCTION increment_views(truck_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  UPDATE trucks SET views = views + 1 WHERE id = truck_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_views TO anon, authenticated;
