import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, X, Save, Star, CheckCircle2, Eye,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTrucks, useBrands, formatPrice } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';
import type { Truck } from '@/lib/supabase';

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
    window.location.reload();
  };

  const toggleFeatured = async (truck: Truck) => {
    await supabase.from('trucks').update({ is_featured: !truck.is_featured }).eq('id', truck.id);
    window.location.reload();
  };

  const toggleSold = async (truck: Truck) => {
    await supabase.from('trucks').update({ is_sold: !truck.is_sold }).eq('id', truck.id);
    window.location.reload();
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
          {filtered.map((truck) => (
            <div key={truck.id} className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-navy-700/30 transition-smooth">
              {/* Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-navy-800 flex-shrink-0">
                {truck.image_urls?.[0] ? (
                  <img src={truck.image_urls[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No img</div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {truck.brand?.name} {truck.model}
                  </p>
                  {truck.is_sold && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-semibold">SOLD</span>
                  )}
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

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
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
                  onClick={() => toggleSold(truck)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-smooth ${
                    truck.is_sold ? 'text-green-400 bg-green-400/10' : 'text-slate-400 hover:bg-navy-700'
                  }`}
                  title="Toggle Sold"
                >
                  <CheckCircle2 className="w-4 h-4" />
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
          ))}
        </div>
      )}

      {/* Form modal */}
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
    image_urls: truck?.image_urls?.join('\n') || '',
    video_url: truck?.video_url || '',
    features: truck?.features?.join('\n') || '',
    condition_notes: truck?.condition_notes || '',
    description: truck?.description || '',
    description_ja: truck?.description_ja || '',
    is_featured: truck?.is_featured || false,
    is_sold: truck?.is_sold || false,
  });

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
      image_urls: form.image_urls.split('\n').map(s => s.trim()).filter(Boolean),
      video_url: form.video_url || null,
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      condition_notes: form.condition_notes || null,
      description: form.description || null,
      description_ja: form.description_ja || null,
      is_featured: form.is_featured,
      is_sold: form.is_sold,
    };

    if (truck) {
      await supabase.from('trucks').update(data).eq('id', truck.id);
    } else {
      await supabase.from('trucks').insert(data);
    }

    setSaving(false);
    window.location.reload();
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
              <label className="block text-xs text-slate-300 mb-1">{t('bodyType')}</label>
              <input value={form.body_type} onChange={(e) => setForm({ ...form, body_type: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">{t('colorLabel')}</label>
            <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">{t('imageUrls')} (one per line)</label>
            <textarea rows={3} value={form.image_urls} onChange={(e) => setForm({ ...form, image_urls: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>

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

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-electric-400" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.is_sold} onChange={(e) => setForm({ ...form, is_sold: e.target.checked })} className="w-4 h-4 accent-electric-400" />
              Sold
            </label>
          </div>

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
