import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Trash2, Reply } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminInquiries } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';

export default function AdminInquiries() {
  const { t } = useI18n();
  const { inquiries, loading, error } = useAdminInquiries();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    await supabase.from('inquiries').delete().eq('id', id);
    window.location.reload();
  };

  const statusColors: Record<string, string> = {
    new: 'bg-electric-400/20 text-electric-400',
    contacted: 'bg-amber-400/20 text-amber-400',
    closed: 'bg-green-400/20 text-green-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('inquiryManagement')}</h1>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'contacted', 'closed'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
              filter === s
                ? 'bg-electric-400 text-navy-950'
                : 'glass text-slate-300 hover:text-white'
            }`}
          >
            {s === 'all' ? t('all') : t(s)}
            {s !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({inquiries.filter(i => i.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400">{t('loading')}</div>
      ) : error ? (
        <div className="text-center py-12 text-red-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq, i) => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="p-4 glass rounded-xl"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{inq.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[inq.status] || statusColors.new}`}>
                      {t(inq.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                    {inq.email && (
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-electric-400">
                        <Mail className="w-3 h-3" />
                        {inq.email}
                      </a>
                    )}
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-electric-400">
                        <Phone className="w-3 h-3" />
                        {inq.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.created_at).toLocaleString()}
                    </span>
                  </div>
                  {inq.message && (
                    <p className="mt-3 text-sm text-slate-300 bg-navy-800/50 rounded-lg p-3">
                      {inq.message}
                    </p>
                  )}
                  {inq.truck && (
                    <p className="mt-2 text-xs text-electric-400">
                      Re: {inq.truck.brand?.name} {inq.truck.model}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {inq.status !== 'contacted' && (
                    <button
                      onClick={() => updateStatus(inq.id, 'contacted')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-smooth"
                    >
                      {t('contacted')}
                    </button>
                  )}
                  {inq.status !== 'closed' && (
                    <button
                      onClick={() => updateStatus(inq.id, 'closed')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-smooth"
                    >
                      {t('closed')}
                    </button>
                  )}
                  {inq.email && (
                    <a
                      href={`mailto:${inq.email}?subject=Re: Your inquiry`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-700 transition-smooth"
                    >
                      <Reply className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-navy-700 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
