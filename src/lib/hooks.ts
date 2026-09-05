import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Brand, Truck, Inquiry, Testimonial, Settings } from './supabase';
import { fallbackBrands, fallbackTrucks, fallbackTestimonials, fallbackSettings } from './fallbackData';

// Fetch from Supabase; only fall back to mock data on actual network/connection errors,
// NOT on empty results (an empty table is valid real data, not a failure).
async function fetchWithFallback<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  fallback: T
): Promise<T> {
  try {
    const { data, error } = await query;
    if (error) {
      console.warn('Supabase query error, using fallback:', error.message);
      return fallback;
    }
    if (data === null) return fallback;
    return data as T;
  } catch (err) {
    console.warn('Supabase connection error, using fallback:', err);
    return fallback;
  }
}

// For admin queries — no fallback. Surface errors so admin sees real DB state.
async function fetchAdmin<T>(
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

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>(fallbackBrands);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback(
      supabase.from('brands').select('*').order('name'),
      fallbackBrands
    ).then((data) => {
      setBrands(data as Brand[]);
      setLoading(false);
    });
  }, []);

  return { brands, loading };
}

export function useTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback(
      supabase.from('trucks').select('*, brand:brands(*)').order('created_at', { ascending: false }),
      fallbackTrucks
    ).then((data) => {
      setTrucks(data as Truck[]);
      setLoading(false);
    });
  }, []);

  return { trucks, loading };
}

export function useFeaturedTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback(
      supabase.from('trucks').select('*, brand:brands(*)').eq('is_featured', true).eq('is_sold', false).order('created_at', { ascending: false }).limit(6),
      fallbackTrucks.filter(t => t.is_featured && !t.is_sold)
    ).then((data) => {
      setTrucks(data as Truck[]);
      setLoading(false);
    });
  }, []);

  return { trucks, loading };
}

export function useLatestTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback(
      supabase.from('trucks').select('*, brand:brands(*)').eq('is_sold', false).order('created_at', { ascending: false }).limit(8),
      fallbackTrucks.filter(t => !t.is_sold).slice(0, 8)
    ).then((data) => {
      setTrucks(data as Truck[]);
      setLoading(false);
    });
  }, []);

  return { trucks, loading };
}

export function useTruck(id: string | undefined) {
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchWithFallback(
      supabase.from('trucks').select('*, brand:brands(*)').eq('id', id).maybeSingle(),
      null
    ).then((data) => {
      setTruck(data as Truck | null);
      setLoading(false);
    });

    // Increment view count (best-effort)
    supabase.rpc('increment_views', { truck_id: id }).then(({ error }) => {
      if (error) console.warn('Failed to increment views:', error.message);
    });
  }, [id]);

  return { truck, loading };
}

export function useRelatedTrucks(brandId: string | null, excludeId: string | undefined) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brandId) {
      setLoading(false);
      return;
    }
    fetchWithFallback(
      supabase.from('trucks').select('*, brand:brands(*)').eq('brand_id', brandId).not('id', 'eq', excludeId || '').eq('is_sold', false).limit(4),
      []
    ).then((data) => {
      setTrucks(data as Truck[]);
      setLoading(false);
    });
  }, [brandId, excludeId]);

  return { trucks, loading };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback(
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      fallbackTestimonials
    ).then((data) => {
      setTestimonials(data as Testimonial[]);
      setLoading(false);
    });
  }, []);

  return { testimonials, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(fallbackSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithFallback(
      supabase.from('settings').select('*').limit(1).maybeSingle(),
      fallbackSettings
    ).then((data) => {
      setSettings(data as Settings | null);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

// Admin hooks — no fallback, surface real errors
export function useAdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmin(
      supabase.from('inquiries').select('*, truck:trucks(*, brand:brands(*))').order('created_at', { ascending: false })
    ).then(({ data, error: err }) => {
      if (err) {
        setError(err);
        setInquiries([]);
      } else {
        setInquiries((data as Inquiry[]) || []);
        setError(null);
      }
      setLoading(false);
    });
  }, []);

  return { inquiries, loading, error, setInquiries };
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
