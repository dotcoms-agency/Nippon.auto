import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { Brand, Truck, Inquiry, Testimonial, Settings, SiteVisit } from './supabase';

async function fetchData<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data: data as T | null, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ---------- Public hooks with realtime ----------

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData<Brand[]>(supabase.from('brands').select('*').order('name')).then(({ data, error: err }) => {
      setBrands(data || []);
      setError(err);
      setLoading(false);
    });

    const channel = supabase
      .channel('brands-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => {
        fetchData<Brand[]>(supabase.from('brands').select('*').order('name')).then(({ data }) => {
          if (data) setBrands(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { brands, loading, error };
}

export function useTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData<Truck[]>(supabase.from('trucks').select('*, brand:brands(*)').order('created_at', { ascending: false })).then(({ data, error: err }) => {
      setTrucks(data || []);
      setError(err);
      setLoading(false);
    });

    const channel = supabase
      .channel('trucks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trucks' }, () => {
        fetchData<Truck[]>(supabase.from('trucks').select('*, brand:brands(*)').order('created_at', { ascending: false })).then(({ data }) => {
          if (data) setTrucks(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { trucks, loading, error };
}

export function useFeaturedTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData<Truck[]>(
      supabase.from('trucks').select('*, brand:brands(*)').eq('is_featured', true).neq('status', 'sold').order('created_at', { ascending: false }).limit(6)
    ).then(({ data }) => {
      setTrucks(data || []);
      setLoading(false);
    });

    const channel = supabase
      .channel('featured-trucks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trucks' }, () => {
        fetchData<Truck[]>(
          supabase.from('trucks').select('*, brand:brands(*)').eq('is_featured', true).neq('status', 'sold').order('created_at', { ascending: false }).limit(6)
        ).then(({ data }) => {
          if (data) setTrucks(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { trucks, loading };
}

export function useLatestTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData<Truck[]>(
      supabase.from('trucks').select('*, brand:brands(*)').neq('status', 'sold').order('created_at', { ascending: false }).limit(8)
    ).then(({ data }) => {
      setTrucks(data || []);
      setLoading(false);
    });

    const channel = supabase
      .channel('latest-trucks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trucks' }, () => {
        fetchData<Truck[]>(
          supabase.from('trucks').select('*, brand:brands(*)').neq('status', 'sold').order('created_at', { ascending: false }).limit(8)
        ).then(({ data }) => {
          if (data) setTrucks(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { trucks, loading };
}

export function useTruck(id: string | undefined) {
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    fetchData<Truck>(supabase.from('trucks').select('*, brand:brands(*)').eq('id', id).maybeSingle()).then(({ data, error: err }) => {
      setTruck(data);
      setError(err);
      setLoading(false);
    });

    // Increment view count (best-effort)
    supabase.rpc('increment_views', { truck_id: id }).then(({ error: rpcErr }) => {
      if (rpcErr) console.warn('Failed to increment views:', rpcErr.message);
    });

    const channel = supabase
      .channel(`truck-${id}-realtime`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trucks', filter: `id=eq.${id}` }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setTruck(null);
        } else {
          setTruck(payload.new as Truck);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  return { truck, loading, error };
}

export function useRelatedTrucks(brandId: string | null, excludeId: string | undefined) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brandId) {
      setLoading(false);
      return;
    }
    fetchData<Truck[]>(
      supabase.from('trucks').select('*, brand:brands(*)').eq('brand_id', brandId).not('id', 'eq', excludeId || '').neq('status', 'sold').limit(4)
    ).then(({ data }) => {
      setTrucks(data || []);
      setLoading(false);
    });
  }, [brandId, excludeId]);

  return { trucks, loading };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData<Testimonial[]>(supabase.from('testimonials').select('*').order('created_at', { ascending: false })).then(({ data }) => {
      setTestimonials(data || []);
      setLoading(false);
    });

    const channel = supabase
      .channel('testimonials-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        fetchData<Testimonial[]>(supabase.from('testimonials').select('*').order('created_at', { ascending: false })).then(({ data }) => {
          if (data) setTestimonials(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { testimonials, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData<Settings>(supabase.from('settings').select('*').limit(1).maybeSingle()).then(({ data }) => {
      setSettings(data);
      setLoading(false);
    });

    const channel = supabase
      .channel('settings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setSettings(null);
        } else {
          setSettings(payload.new as Settings);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { settings, loading };
}

// ---------- Admin hooks ----------

export function useAdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData<Inquiry[]>(
      supabase.from('inquiries').select('*, truck:trucks(*, brand:brands(*))').order('created_at', { ascending: false })
    ).then(({ data, error: err }) => {
      setInquiries(data || []);
      setError(err);
      setLoading(false);
    });

    const channel = supabase
      .channel('admin-inquiries-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => {
        fetchData<Inquiry[]>(
          supabase.from('inquiries').select('*, truck:trucks(*, brand:brands(*))').order('created_at', { ascending: false })
        ).then(({ data }) => {
          if (data) setInquiries(data);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const refresh = useCallback(() => {
    fetchData<Inquiry[]>(
      supabase.from('inquiries').select('*, truck:trucks(*, brand:brands(*))').order('created_at', { ascending: false })
    ).then(({ data }) => {
      if (data) setInquiries(data);
    });
  }, []);

  return { inquiries, loading, error, setInquiries, refresh };
}

// ---------- Analytics hooks ----------

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalTrucks: 0,
    soldTrucks: 0,
    availableTrucks: 0,
    reservedTrucks: 0,
    totalRevenue: 0,
    totalViews: 0,
    newInquiries: 0,
    totalInquiries: 0,
    uniqueVisitorsToday: 0,
    uniqueVisitorsTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [trucksRes, inquiriesRes, viewsRes, visitsRes] = await Promise.all([
        supabase.from('trucks').select('status, price, views'),
        supabase.from('inquiries').select('status'),
        supabase.from('truck_views').select('id, created_at'),
        supabase.from('site_visits').select('*').order('visit_date', { ascending: false }).limit(30),
      ]);

      const trucks = trucksRes.data || [];
      const inquiries = inquiriesRes.data || [];
      const views = viewsRes.data || [];
      const visits = visitsRes.data || [];

      const sold = trucks.filter((t: { status: string }) => t.status === 'sold');
      const available = trucks.filter((t: { status: string }) => t.status === 'available');
      const reserved = trucks.filter((t: { status: string }) => t.status === 'reserved');
      const revenue = sold.reduce((sum: number, t: { price: number | null }) => sum + (t.price || 0), 0);
      const totalViews = trucks.reduce((sum: number, t: { views: number | null }) => sum + (t.views || 0), 0);

      const today = new Date().toISOString().split('T')[0];
      const uniqueVisitorsToday = visits.find((v: { visit_date: string }) => v.visit_date === today)?.unique_visitors || 0;
      const uniqueVisitorsTotal = visits.reduce((sum: number, v: { unique_visitors: number }) => sum + (v.unique_visitors || 0), 0);

      setStats({
        totalTrucks: trucks.length,
        soldTrucks: sold.length,
        availableTrucks: available.length,
        reservedTrucks: reserved.length,
        totalRevenue: revenue,
        totalViews,
        newInquiries: inquiries.filter((i: { status: string }) => i.status === 'new').length,
        totalInquiries: inquiries.length,
        uniqueVisitorsToday,
        uniqueVisitorsTotal,
      });
      setLoading(false);
    }
    load();
  }, []);

  return { stats, loading };
}

export function useSalesChartData() {
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Get truck views per day for last 9 days
      const nineDaysAgo = new Date();
      nineDaysAgo.setDate(nineDaysAgo.getDate() - 8);
      const { data: viewsData } = await supabase
        .from('truck_views')
        .select('created_at')
        .gte('created_at', nineDaysAgo.toISOString());

      const days: Record<string, number> = {};
      for (let i = 8; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        days[key] = 0;
      }

      (viewsData || []).forEach((v: { created_at: string }) => {
        const key = v.created_at.split('T')[0];
        if (key in days) days[key]++;
      });

      const labels = Object.keys(days).map(k => {
        const d = new Date(k);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      });
      const values = Object.values(days);

      setData({ labels, values });
      setLoading(false);
    }
    load();
  }, []);

  return { data, loading };
}

export function useSiteVisits(): { visits: SiteVisit[]; loading: boolean } {
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData<SiteVisit[]>(
      supabase.from('site_visits').select('*').order('visit_date', { ascending: false }).limit(30)
    ).then(({ data }) => {
      setVisits(data || []);
      setLoading(false);
    });
  }, []);

  return { visits, loading };
}

export function useHomePageStats() {
  const [stats, setStats] = useState({ trucksSold: 0, totalTrucks: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('trucks').select('status, views');
      const trucks = data || [];
      setStats({
        trucksSold: trucks.filter((t: { status: string }) => t.status === 'sold').length,
        totalTrucks: trucks.length,
        totalViews: trucks.reduce((sum: number, t: { views: number | null }) => sum + (t.views || 0), 0),
      });
      setLoading(false);
    }
    load();
  }, []);

  return { stats, loading };
}

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  truck_id?: string;
}) {
  const { error } = await supabase.from('inquiries').insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    truck_id: data.truck_id || null,
  });
  if (error) {
    console.warn('Failed to submit inquiry:', error.message);
    return false;
  }
  return true;
}

export function formatPrice(price: number | null | undefined): string {
  if (!price || price === 0) return '';
  return `¥${price.toLocaleString('en-US')}`;
}

export function formatMileage(km: number | null | undefined): string {
  if (!km) return '-';
  return `${km.toLocaleString('en-US')} km`;
}

// Storage upload helpers
export async function uploadTruckImage(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `truck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('truck-images')
    .upload(fileName, file, { upsert: false });
  if (uploadError) {
    console.warn('Image upload failed:', uploadError.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from('truck-images').getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function uploadBrandLogo(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'png';
  const fileName = `brand-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('brand-logos')
    .upload(fileName, file, { upsert: false });
  if (uploadError) {
    console.warn('Logo upload failed:', uploadError.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from('brand-logos').getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function uploadTruckVideo(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'mp4';
  const fileName = `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('truck-videos')
    .upload(fileName, file, { upsert: false });
  if (uploadError) {
    console.warn('Video upload failed:', uploadError.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from('truck-videos').getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function uploadCompanyLogo(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'png';
  const fileName = `logo-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('company-assets')
    .upload(fileName, file, { upsert: true });
  if (uploadError) {
    console.warn('Logo upload failed:', uploadError.message);
    return null;
  }
  const { data: urlData } = supabase.storage.from('company-assets').getPublicUrl(fileName);
  return urlData.publicUrl;
}
