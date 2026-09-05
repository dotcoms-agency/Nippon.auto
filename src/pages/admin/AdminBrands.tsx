import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useBrands } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';
import type { Brand } from '@/lib/supabase';

export default function AdminBrands() {
  const { t, lang } = useI18n();
  const { brands, loading } = useBrands();
  const [editing, setEditing] = useState<Brand | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    await supabase.from('brands').delete().eq('id', id);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('brandManagement')}</h1>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric-400 text-navy-950 text-sm font-semibold hover:bg-electric-400/90 transition-smooth glow-blue-sm"
        >
          <Plus className="w-4 h-4" />
          {t('addBrand')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400">{t('loading')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center gap-3 p-4 glass rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center font-display font-bold text-lg text-electric-400 flex-shrink-0">
                {brand.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{brand.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {lang === 'ja' && brand.name_ja ? brand.name_ja : brand.country}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditing(brand); setShowForm(true); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-700 transition-smooth"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-navy-700 transition-smooth"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <BrandForm brand={editing} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function BrandForm({ brand, onClose }: { brand: Brand | null; onClose: () => void }) {
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: brand?.name || '',
    name_ja: brand?.name_ja || '',
    logo_url: brand?.logo_url || '',
    country: brand?.country || 'Japan',
  });

  const handleSave = async () => {
    setSaving(true);
    if (brand) {
      await supabase.from('brands').update(form).eq('id', brand.id);
    } else {
      await supabase.from('brands').insert(form);
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
      className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white">
            {brand ? t('edit') : t('addBrand')}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Name (EN)</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Name (JA)</label>
            <input value={form.name_ja} onChange={(e) => setForm({ ...form, name_ja: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Logo URL</label>
            <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Country</label>
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-electric-400 text-navy-950 text-sm font-semibold hover:bg-electric-400/90 transition-smooth disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? t('loading') : t('save')}
            </button>
            <button onClick={onClose} className="px-4 py-3 rounded-xl glass text-white text-sm font-medium hover:bg-navy-700 transition-smooth">
              {t('cancel')}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
