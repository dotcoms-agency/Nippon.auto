import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Truck, Globe, ChevronDown } from 'lucide-react';
import { useI18n, type Lang } from '@/lib/i18n';
import { useBrands, useSettings } from '@/lib/hooks';

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const { brands } = useBrands();
  const { settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setBrandsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/inventory', label: t('inventory') },
    { to: '/about', label: t('about') },
    { to: '/contact', label: t('contact') },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
          scrolled ? 'glass-strong shadow-2xl' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-electric-400/30 blur-lg group-hover:bg-electric-400/60 transition-smooth animate-glow-pulse" />
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="relative w-7 h-7"
                >
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt="Logo" className="w-7 h-7 object-contain" />
                  ) : (
                    <Truck className="w-7 h-7 text-electric-400" />
                  )}
                </motion.div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-wide text-white group-hover:text-electric-400 transition-colors">
                  NIPPON AUTO
                </span>
                <span className="text-[10px] text-slate-400 tracking-widest">
                  USED TRUCKS JAPAN
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-smooth rounded-lg ${
                    isActive(link.to)
                      ? 'text-electric-400'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-electric-400/10 rounded-lg border border-electric-400/30"
                    />
                  )}
                </Link>
              ))}

              {/* Brands mega menu */}
              <div
                className="relative"
                onMouseEnter={() => setBrandsOpen(true)}
                onMouseLeave={() => setBrandsOpen(false)}
              >
                <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-smooth flex items-center gap-1">
                  {t('brands')}
                  <ChevronDown className={`w-4 h-4 transition-transform ${brandsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {brandsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                    >
                      <div className="glass-strong rounded-2xl p-6 w-96 grid grid-cols-2 gap-3 shadow-2xl">
                        {brands.map((brand) => (
                          <Link
                            key={brand.id}
                            to={`/inventory?brand=${brand.id}`}
                            className="flex items-center gap-2 p-3 rounded-xl hover:bg-electric-400/10 transition-smooth group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center text-electric-400 font-display font-bold text-lg overflow-hidden flex-shrink-0">
                              {brand.logo_url ? (
                                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                              ) : (
                                brand.name[0]
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white group-hover:text-electric-400">
                                {lang === 'ja' && brand.name_ja ? brand.name_ja : brand.name}
                              </div>
                              <div className="text-xs text-slate-400">{brand.country}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: language + mobile toggle */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher lang={lang} setLang={setLang} />

              <button
                className="lg:hidden p-2 text-white hover:text-electric-400 transition-smooth"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden glass-strong"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                      isActive(link.to)
                        ? 'bg-electric-400/10 text-electric-400 border border-electric-400/30'
                        : 'text-slate-300 hover:bg-navy-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-navy-700"
                >
                  {t('admin')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="h-16 lg:h-20" />
    </>
  );
}

function LanguageSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-slate-300 hover:text-electric-400 hover:bg-navy-700 transition-smooth"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-xs font-semibold">{lang}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute right-0 top-full mt-1 z-50 glass-strong rounded-lg overflow-hidden"
            >
              <button
                onClick={() => { setLang('en'); setOpen(false); }}
                className={`block w-full px-4 py-2 text-sm text-left transition-smooth ${
                  lang === 'en' ? 'text-electric-400 bg-electric-400/10' : 'text-slate-300 hover:bg-navy-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => { setLang('ja'); setOpen(false); }}
                className={`block w-full px-4 py-2 text-sm text-left transition-smooth ${
                  lang === 'ja' ? 'text-electric-400 bg-electric-400/10' : 'text-slate-300 hover:bg-navy-700'
                }`}
              >
                日本語
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
