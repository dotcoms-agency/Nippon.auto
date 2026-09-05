import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSettings, submitInquiry } from '@/lib/hooks';

export default function ContactPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setStatus('sending');
    const ok = await submitInquiry(form);
    setStatus(ok ? 'success' : 'error');
    if (ok) {
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="relative py-12 lg:py-16 bg-navy-900/30 border-b border-navy-700/50">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-electric-400/5 rounded-full blur-[100px]" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white">
              {t('contactTitle')}
            </h1>
            <p className="mt-2 text-slate-400 text-sm max-w-xl">{t('contactSubtitle')}</p>
            <div className="mt-3 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 lg:p-8 glass rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t('yourName')} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t('yourEmail')}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t('yourPhone')}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t('yourMessage')} *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric-400 text-navy-950 font-semibold text-sm hover:bg-electric-400/90 transition-smooth glow-blue-sm disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                    {t('loading')}
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('sendMessage')}
                  </>
                )}
              </button>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-electric-400/10 text-electric-400 text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {t('messageSent')}
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm"
                >
                  {t('messageError')}
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact info + Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="p-4 glass rounded-xl hover:border-electric-400/40 transition-smooth">
                  <Phone className="w-5 h-5 text-electric-400 mb-2" />
                  <p className="text-xs text-slate-400">{t('phone')}</p>
                  <p className="text-sm text-white">{settings.phone}</p>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="p-4 glass rounded-xl hover:border-electric-400/40 transition-smooth">
                  <Mail className="w-5 h-5 text-electric-400 mb-2" />
                  <p className="text-xs text-slate-400">{t('email')}</p>
                  <p className="text-sm text-white truncate">{settings.email}</p>
                </a>
              )}
              {settings?.address && (
                <div className="p-4 glass rounded-xl">
                  <MapPin className="w-5 h-5 text-electric-400 mb-2" />
                  <p className="text-xs text-slate-400">{t('address')}</p>
                  <p className="text-sm text-white">{settings.address}</p>
                </div>
              )}
              {settings && (
                <div className="p-4 glass rounded-xl">
                  <Clock className="w-5 h-5 text-electric-400 mb-2" />
                  <p className="text-xs text-slate-400">{t('businessHours')}</p>
                  <p className="text-sm text-white">
                    {lang === 'ja' && settings.business_hours_ja ? settings.business_hours_ja : settings.business_hours}
                  </p>
                </div>
              )}
            </div>

            {settings?.line_url && (
              <a
                href={settings.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#06C755]/20 hover:bg-[#06C755]/30 transition-smooth"
              >
                <MessageCircle className="w-6 h-6 text-[#06C755]" />
                <div>
                  <p className="text-sm font-semibold text-white">LINE</p>
                  <p className="text-xs text-slate-400">{t('lineContact')}</p>
                </div>
              </a>
            )}

            <div className="aspect-[4/3] rounded-2xl overflow-hidden glass">
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.0!2d139.7671!3d35.6812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQwJzQzLjMiTiAxMznCsDQ2JzAxLjYiRQ!5e0!3m2!1sen!2sjp!4v1700000000000"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
