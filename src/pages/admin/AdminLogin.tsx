import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

export default function AdminLogin() {
  const { session, signIn } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-electric-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-electric-400/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-electric-400 mb-6 transition-smooth">
          <ArrowLeft className="w-4 h-4" />
          {t('home')}
        </Link>

        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-electric-400/10 items-center justify-center mb-4">
              <Truck className="w-7 h-7 text-electric-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-slate-400 mt-1">{t('signIn')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                  placeholder="admin@nipponauto.jp"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric-400 text-navy-950 font-semibold text-sm hover:bg-electric-400/90 transition-smooth glow-blue-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : t('signIn')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
