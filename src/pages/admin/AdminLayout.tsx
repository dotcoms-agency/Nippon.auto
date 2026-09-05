import { Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, Truck, Tag, Mail, Settings as SettingsIcon,
  LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="w-8 h-8 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/admin/trucks', icon: Truck, label: t('truckManagement') },
    { to: '/admin/brands', icon: Tag, label: t('brandManagement') },
    { to: '/admin/inquiries', icon: Mail, label: t('inquiryManagement') },
    { to: '/admin/settings', icon: SettingsIcon, label: t('settings') },
  ];

  const isActive = (path: string) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass-strong border-r border-navy-700/50 transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-navy-700/50">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-400/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-electric-400" />
            </div>
            <span className="font-display font-bold text-white text-sm">ADMIN PANEL</span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                isActive(item.to)
                  ? 'bg-electric-400/10 text-electric-400 border border-electric-400/30'
                  : 'text-slate-300 hover:bg-navy-700/50 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-navy-700/50">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-navy-700/50 transition-smooth mb-1">
            <Menu className="w-4 h-4" />
            {t('home')}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-smooth"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-navy-950/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 glass-strong border-b border-navy-700/50 p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-bold text-white text-sm">ADMIN</span>
          <div className="w-5" />
        </div>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
