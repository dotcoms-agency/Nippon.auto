import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { I18nProvider } from '@/lib/i18n';
import { AuthProvider } from '@/lib/auth';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LineButton from '@/components/LineButton';
import BackToTop from '@/components/BackToTop';

import HomePage from '@/pages/HomePage';
import InventoryPage from '@/pages/InventoryPage';
import TruckDetailPage from '@/pages/TruckDetailPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminTrucks from '@/pages/admin/AdminTrucks';
import AdminBrands from '@/pages/admin/AdminBrands';
import AdminInquiries from '@/pages/admin/AdminInquiries';
import AdminSettings from '@/pages/admin/AdminSettings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/inventory" element={<PageTransition><InventoryPage /></PageTransition>} />
          <Route path="/truck/:id" element={<PageTransition><TruckDetailPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="trucks" element={<AdminTrucks />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AnimatePresence>

      {!isAdmin && <Footer />}
      {!isAdmin && <LineButton />}
      {!isAdmin && <BackToTop />}
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
