import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';

export default function AdminSettings() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    company_name_ja: '',
    address: '',
    phone: '',
    email: '',
    line_url: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    business_hours: '',
    business_hours_ja: '',
    logo_url: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name || '',
        company_name_ja: settings.company_name_ja || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        line_url: settings.line_url || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        twitter_url: settings.twitter_url || '',
        business_hours: settings.business_hours || '',
        business_hours_ja: settings.business_hours_ja || '',
        logo_url: settings.logo_url || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    if (settings?.id) {
      await supabase.from('settings').update({ ...form, updated_at: new Date().toISOString() }).eq('id', settings.id);
    } else {
      await supabase.from('settings').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);
      setForm({ ...form, logo_url: urlData.publicUrl });
    } catch (err) {
      console.warn('Logo upload failed:', err);
    }
    setUploading(false);
  };

  const inputClass = "w-full px-3 py-2.5 bg-navy-800 rounded-lg text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth";
  const labelClass = "block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('settings')}</h1>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
      </div>

      {/* Company Info */}
      <div className="p-5 glass rounded-2xl space-y-4">
        <h2 className="text-sm font-semibold text-white">{t('companyName')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Company Name (EN)</label>
            <input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Company Name (JA)</label>
            <input value={form.company_name_ja} onChange={(e) => setForm({ ...form, company_name_ja: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('address')}</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>{t('phone')}</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('email')}</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>{t('businessHours')} (EN)</label>
            <input value={form.business_hours} onChange={(e) => setForm({ ...form, business_hours: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('businessHours')} (JA)</label>
            <input value={form.business_hours_ja} onChange={(e) => setForm({ ...form, business_hours_ja: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="p-5 glass rounded-2xl space-y-4">
        <h2 className="text-sm font-semibold text-white">{t('logoUpload')}</h2>
        <div className="flex items-center gap-4">
          {form.logo_url && (
            <div className="w-16 h-16 rounded-xl bg-navy-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg glass text-white text-sm font-medium cursor-pointer hover:bg-navy-700 transition-smooth">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Logo'}
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-5 glass rounded-2xl space-y-4">
        <h2 className="text-sm font-semibold text-white">{t('socialLinks')}</h2>

        <div>
          <label className={labelClass}>LINE URL</label>
          <input value={form.line_url} onChange={(e) => setForm({ ...form, line_url: e.target.value })} className={inputClass} placeholder="https://line.me/..." />
        </div>
        <div>
          <label className={labelClass}>Facebook URL</label>
          <input value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} className={inputClass} placeholder="https://facebook.com/..." />
        </div>
        <div>
          <label className={labelClass}>Instagram URL</label>
          <input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} className={inputClass} placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className={labelClass}>Twitter URL</label>
          <input value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} className={inputClass} placeholder="https://twitter.com/..." />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-electric-400 text-navy-950 text-sm font-semibold hover:bg-electric-400/90 transition-smooth glow-blue-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? t('loading') : t('saveSettings')}
        </button>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-electric-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t('settingsSaved')}
          </motion.div>
        )}
      </div>
    </div>
  );
}
