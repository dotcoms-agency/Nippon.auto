-- Enable Supabase Realtime for all public-facing tables
-- This allows the frontend postgres_changes subscriptions to receive
-- INSERT/UPDATE/DELETE events without page refresh.

ALTER PUBLICATION supabase_realtime ADD TABLE public.brands;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trucks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.truck_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;
