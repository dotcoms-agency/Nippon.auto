import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, Save, Star, Eye,
  Upload, ImageIcon, Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTrucks, useBrands, formatPrice, uploadTruckImage } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';
import type { Truck, TruckStatus } from '@/lib/supabase';

export default function AdminTrucks() {
  const { t, lang } = useI18n();
  const { trucks, loading } = useTrucks();
  const { brands } = useBrands();
  const [editing, setEditing] = useState<Truck | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = trucks.filter(tr =>
    tr.model.toLowerCase().includes(search.toLowerCase()) ||
    (tr.brand?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    await supabase.from('trucks').delete().eq('id', id);
  };

  const toggleFeatured = async (truck: Truck) => {
    await supabase.from('trucks').update({ is_featured: !truck.is_featured }).eq('id', truck.id);
  };

  const cycleStatus = async (truck: Truck) => {
    const current = truck.status || (truck.is_sold ? 'sold' : 'available');
    const next: TruckStatus = current === 'available' ? 'reserved' : current === 'reserved' ? 'sold' : 'available';
    await supabase.from('trucks').update({ status: next, is_sold: next === 'sold' }).eq('id', truck.id);
  };

  const statusColors: Record<string, string> = {
    available: 'text-electric-400 bg-electric-400/10',
    reserved: 'text-amber-400 bg-amber-400/10',
    sold: 'text-red-400 bg-red-400/10',
  };

  const statusLabels: Record<string, string> = {
    available: lang === 'ja' ? '販売中' : 'Available',
    reserved: lang === 'ja' ? '予約済み' : 'Reserved',
    sold: lang === 'ja' ? '売約済み' : 'Sold',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('truckManagement')}</h1>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-400 text-navy-950 text-sm font-semibold hover:bg-electric-400/90 transition-smooth glow-blue-sm"
        >
          <Plus className="w-4 h-4" />
          {t('addTruck')}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full px-4 py-3 glass rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-electric-400/50 transition-smooth"
      />

      {/* Truck list */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">{t('loading')}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((truck) => {
            const status = truck.status || (truck.is_sold ? 'sold' : 'available');
            return (
              <div key={truck.id} className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-navy-700/30 transition-smooth">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-navy-800 flex-shrink-0">
                  {truck.image_urls?.[0] ? (
                    <img src={truck.image_urls[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No img</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {truck.brand?.name} {truck.model}
                    </p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[status] || statusColors.available}`}>
                      {statusLabels[status]}
                    </span>
                    {truck.is_featured && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{truck.year}</span>
                    <span>{formatPrice(truck.price)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{truck.views}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => cycleStatus(truck)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-smooth ${statusColors[status] || statusColors.available}`}
                    title="Cycle status: Available → Reserved → Sold"
                  >
                    <span className="text-[10px] font-bold">{status === 'available' ? 'A' : status === 'reserved' ? 'R' : 'S'}</span>
                  </button>
                  <button
                    onClick={() => toggleFeatured(truck)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-smooth ${
                      truck.is_featured ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:bg-navy-700'
                    }`}
                    title="Toggle Featured"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setEditing(truck); setShowForm(true); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-700 transition-smooth"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(truck.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-navy-700 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <TruckForm
            truck={editing}
            brands={brands}
            onClose={() => setShowForm(false)}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TruckForm({ truck, brands, onClose, lang }: {
  truck: Truck | null;
  brands: { id: string; name: string }[];
  onClose: () => void;
  lang: string;
}) {
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    brand_id: truck?.brand_id || brands[0]?.id || '',
    model: truck?.model || '',
    year: truck?.year?.toString() || '',
    price: truck?.price?.toString() || '',
    mileage: truck?.mileage?.toString() || '',
    transmission: truck?.transmission || 'Manual',
    fuel: truck?.fuel || 'Diesel',
    body_type: truck?.body_type || '',
    engine_cc: truck?.engine_cc?.toString() || '',
    color: truck?.color || '',
    image_urls: truck?.image_urls || [] as string[],
    video_url: truck?.video_url || '',
    features: truck?.features?.join('\n') || '',
    condition_notes: truck?.condition_notes || '',
    description: truck?.description || '',
    description_ja: truck?.description_ja || '',
    is_featured: truck?.is_featured || false,
    status: (truck?.status || 'available') as TruckStatus,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingImages(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadTruckImage(file);
      if (url) urls.push(url);
    }
    setForm({ ...form, image_urls: [...form.image_urls, ...urls] });
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => {
    setForm({ ...form, image_urls: form.image_urls.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    setSaving(true);
    const data = {
      brand_id: form.brand_id || null,
      model: form.model,
      year: form.year ? parseInt(form.year) : null,
      price: form.price ? parseFloat(form.price) : 0,
      mileage: form.mileage ? parseInt(form.mileage) : 0,
      transmission: form.transmission,
      fuel: form.fuel,
      body_type: form.body_type || null,
      engine_cc: form.engine_cc ? parseInt(form.engine_cc) : null,
      color: form.color || null,
      image_urls: form.image_urls,
      video_url: form.video_url || null,
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      condition_notes: form.condition_notes || null,
      description: form.description || null,
      description_ja: form.description_ja || null,
      is_featured: form.is_featured,
      status: form.status,
      is_sold: form.status === 'sold',
    };

    if (truck) {
      await supabase.from('trucks').update(data).eq('id', truck.id);
    } else {
      await supabase.from('trucks').insert(data);
    }

    setSaving(false);
    onClose();
  };

  const inputClass = "w-full px-3 py-2 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">
            {truck ? t('editTruck') : t('addTruck')}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('brand')}</label>
              <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className={inputClass}>
                {brands.map(b => <option key={b.id} value={b.id} className="bg-navy-900">{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('model')}</label>
              <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('year')}</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('price')} (¥)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('mileage')} (km)</label>
              <input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('engine')} (cc)</label>
              <input type="number" value={form.engine_cc} onChange={(e) => setForm({ ...form, engine_cc: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('transmission')}</label>
              <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={inputClass}>
                <option value="Manual" className="bg-navy-900">Manual</option>
                <option value="Automatic" className="bg-navy-900">Automatic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('fuel')}</label>
              <select value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className={inputClass}>
                <option value="Diesel" className="bg-navy-900">Diesel</option>
                <option value="Petrol" className="bg-navy-900">Petrol</option>
                <option value="Hybrid" className="bg-navy-900">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TruckStatus })} className={inputClass}>
                <option value="available" className="bg-navy-900">{lang === 'ja' ? '販売中' : 'Available'}</option>
                <option value="reserved" className="bg-navy-900">{lang === 'ja' ? '予約済み' : 'Reserved'}</option>
                <option value="sold" className="bg-navy-900">{lang === 'ja' ? '売約済み' : 'Sold'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('bodyType')}</label>
              <input value={form.body_type} onChange={(e) => setForm({ ...form, body_type: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">{t('colorLabel')}</label>
              <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
            </div>
          </div>

          {/* Image uploads */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">{t('uploadImages')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.image_urls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500/80 text-white rounded-bl-lg opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-navy-600 flex items-center justify-center cursor-pointer hover:border-electric-400/50 transition-smooth">
                {uploadingImages ? (
                  <Loader2 className="w-5 h-5 text-electric-400 animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="text-[10px] text-slate-500">Click the dashed box to upload images. They are stored in Supabase Storage.</p>
          </div>

          {/* Video URL kept as text since video files are large */}
          <div>
            <label className="block text-xs text-slate-300 mb-1">Video URL</label>
            <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">{t('features')} (one per line)</label>
            <textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">{t('condition')}</label>
            <textarea rows={2} value={form.condition_notes} onChange={(e) => setForm({ ...form, condition_notes: e.target.value })} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Description (EN)</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Description (JA)</label>
              <textarea rows={3} value={form.description_ja} onChange={(e) => setForm({ ...form, description_ja: e.target.value })} className={inputClass} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-electric-400" />
            Featured
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.model}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-electric-400 text-navy-950 text-sm font-semibold hover:bg-electric-400/90 transition-smooth disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? t('loading') : t('save')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl glass text-white text-sm font-medium hover:bg-navy-700 transition-smooth"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
