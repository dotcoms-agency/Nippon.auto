import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type TruckStatus = 'available' | 'reserved' | 'sold';

export type Brand = {
  id: string;
  name: string;
  name_ja: string | null;
  logo_url: string | null;
  country: string | null;
  created_at: string;
};

export type Truck = {
  id: string;
  brand_id: string | null;
  model: string;
  year: number | null;
  price: number | null;
  mileage: number | null;
  transmission: string | null;
  fuel: string | null;
  body_type: string | null;
  engine_cc: number | null;
  color: string | null;
  image_urls: string[];
  video_url: string | null;
  specifications: Record<string, string>;
  features: string[];
  condition_notes: string | null;
  description: string | null;
  description_ja: string | null;
  is_sold: boolean;
  is_featured: boolean;
  status: TruckStatus;
  views: number;
  created_at: string;
  brand?: Brand | null;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  truck_id: string | null;
  status: string;
  created_at: string;
  truck?: Truck | null;
};

export type Testimonial = {
  id: string;
  name: string;
  name_ja: string | null;
  rating: number;
  comment: string | null;
  comment_ja: string | null;
  created_at: string;
};

export type Settings = {
  id: string;
  company_name: string;
  company_name_ja: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  line_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  business_hours: string | null;
  business_hours_ja: string | null;
  logo_url: string | null;
  updated_at: string;
};

export type TruckView = {
  id: string;
  truck_id: string | null;
  viewer_hash: string | null;
  created_at: string;
};

export type SiteVisit = {
  id: string;
  visit_date: string;
  unique_visitors: number;
  total_page_views: number;
  truck_detail_views: number;
  created_at: string;
};
