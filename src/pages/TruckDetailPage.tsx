import { useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fuel, Gauge, Calendar, Cog, Palette, Zap, CheckCircle2,
  Phone, Mail, MessageCircle, Share2, ChevronLeft, ChevronRight,
  ZoomIn, X, Play, Send, ClipboardList,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTruck, useRelatedTrucks, useSettings, submitInquiry, formatPrice, formatMileage } from '@/lib/hooks';
import TruckCard from '@/components/TruckCard';
import { LoadingScreen } from '@/components/Skeletons';

export default function TruckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const { truck, loading } = useTruck(id);
  const { trucks: related, loading: relLoading } = useRelatedTrucks(truck?.brand_id || null, id);
  const { settings } = useSettings();

  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [inquireOpen, setInquireOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const openInquiry = useCallback(() => {
    const defaultMsg = lang === 'ja'
      ? `${brandName} ${truck?.model || ''}に興味があります。詳細をご連絡ください。`
      : `I'm interested in the ${brandName} ${truck?.model || ''}. Please contact me with more details.`;
    setInquiryForm({ name: '', email: '', phone: '', message: defaultMsg });
    setInquiryStatus('idle');
    setInquireOpen(true);
  }, [lang, brandName, truck?.model]);
  const galleryRef = useRef<HTMLDivElement>(null);

  if (loading) return <LoadingScreen />;
  if (!truck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Truck not found</p>
          <Link to="/inventory" className="text-electric-400 hover:underline">{t('backToInventory')}</Link>
        </div>
      </div>
    );
  }

  const images = truck.image_urls || [];
  const brandName = lang === 'ja' && truck.brand?.name_ja ? truck.brand.name_ja : truck.brand?.name || '';
  const description = lang === 'ja' && truck.description_ja ? truck.description_ja : truck.description;

  const scrollGallery = (dir: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const scrollAmount = 120;
    galleryRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `${brandName} ${truck.model}`, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch {}
    }
  };

  const specItems = [
    { icon: Calendar, label: t('year'), value: truck.year?.toString() || '-' },
    { icon: Gauge, label: t('mileage'), value: formatMileage(truck.mileage) },
    { icon: Cog, label: t('transmission'), value: truck.transmission || '-' },
    { icon: Fuel, label: t('fuel'), value: truck.fuel || '-' },
    { icon: Palette, label: t('colorLabel'), value: truck.color || '-' },
    { icon: Zap, label: t('engine'), value: truck.engine_cc ? `${truck.engine_cc.toLocaleString()}cc` : '-' },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link to="/inventory" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-electric-400 transition-smooth">
          <ChevronLeft className="w-4 h-4" />
          {t('backToInventory')}
        </Link>
      </div>

      {/* Gallery + Info */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass group">
              {images[activeImage] ? (
                <>
                  <img
                src={images[activeImage]} alt={`${brandName} ${truck.model}`} decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setZoomOpen(true)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-lg glass-strong flex items-center justify-center text-white hover:text-electric-400 transition-smooth"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-navy-800">
                  <Fuel className="w-16 h-16 text-slate-600" />
                </div>
              )}

              {truck.status === 'sold' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-bold tracking-wide">
                  {t('sold')}
                </div>
              )}
              {truck.status === 'reserved' && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-amber-500/90 text-navy-950 text-xs font-bold tracking-wide">
                  {t('reserved')}
                </div>
              )}

              {/* Video play button */}
              {truck.video_url && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg glass-strong text-white text-sm font-medium hover:text-electric-400 transition-smooth"
                >
                  <Play className="w-4 h-4" />
                  Video
                </button>
              )}

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((activeImage + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="relative">
                <div ref={galleryRef} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                        activeImage === i ? 'border-electric-400' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-electric-400 font-semibold uppercase tracking-wider">{brandName}</p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mt-1">
                {truck.model}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                {(() => {
                  const s = truck.status || (truck.is_sold ? 'sold' : 'available');
                  const styles: Record<string, string> = {
                    available: 'bg-electric-400/20 text-electric-400',
                    reserved: 'bg-amber-500/20 text-amber-400',
                    sold: 'bg-red-500/20 text-red-400',
                  };
                  return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[s] || styles.available}`}>{t(s)}</span>;
                })()}
                <span className="text-sm text-slate-400">{truck.views} views</span>
              </div>
            </motion.div>

            {/* Price */}
            <div className="p-5 glass rounded-2xl">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('price')}</p>
              {truck.price ? (
                <p className="text-3xl font-bold text-white">{formatPrice(truck.price)}</p>
              ) : (
                <p className="text-2xl text-slate-300">{t('priceOnRequest')}</p>
              )}
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {specItems.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="p-3 glass rounded-xl card-lift"
                >
                  <spec.icon className="w-5 h-5 text-electric-400 mb-2" />
                  <p className="text-xs text-slate-400">{spec.label}</p>
                  <p className="text-sm font-semibold text-white truncate">{spec.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Inquire button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={openInquiry}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-electric-400 to-electric-500 text-navy-950 font-bold text-sm hover:from-electric-400/90 hover:to-electric-500/90 transition-smooth glow-blue relative overflow-hidden"
            >
              <ClipboardList className="w-5 h-5" />
              {t('inquireAbout')}
              <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.button>

            {/* Contact buttons */}
            <div className="space-y-3">
              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric-400 text-navy-950 font-semibold text-sm hover:bg-electric-400/90 transition-smooth glow-blue-sm"
                >
                  <Phone className="w-4 h-4" />
                  {t('callNow')}
                </a>
              )}
              <div className="grid grid-cols-3 gap-3">
                {settings?.line_url && (
                  <a
                    href={settings.line_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl glass text-white text-xs font-medium hover:border-electric-400/40 transition-smooth"
                  >
                    <MessageCircle className="w-5 h-5 text-electric-400" />
                    {t('lineContact')}
                  </a>
                )}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}?subject=${encodeURIComponent(`Inquiry: ${brandName} ${truck.model}`)}`}
                    className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl glass text-white text-xs font-medium hover:border-electric-400/40 transition-smooth"
                  >
                    <Mail className="w-5 h-5 text-electric-400" />
                    {t('emailInquiry')}
                  </a>
                )}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 px-2 py-3 rounded-xl glass text-white text-xs font-medium hover:border-electric-400/40 transition-smooth"
                >
                  <Share2 className="w-5 h-5 text-electric-400" />
                  {t('share')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description + Specs + Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            {description && (
              <div className="p-6 glass rounded-2xl">
                <h2 className="font-display text-xl font-bold text-white mb-3">
                  {lang === 'ja' ? '車両説明' : 'Description'}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="p-6 glass rounded-2xl">
              <h2 className="font-display text-xl font-bold text-white mb-4">{t('specifications')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(truck.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-navy-700/50">
                    <span className="text-sm text-slate-400">{key}</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {truck.features && truck.features.length > 0 && (
              <div className="p-6 glass rounded-2xl">
                <h2 className="font-display text-xl font-bold text-white mb-4">{t('features')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {truck.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-electric-400 flex-shrink-0" />
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Condition */}
            {truck.condition_notes && (
              <div className="p-6 glass rounded-2xl">
                <h2 className="font-display text-xl font-bold text-white mb-3">{t('condition')}</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{truck.condition_notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Inquiry */}
          <div className="space-y-4">
            <div className="p-6 glass rounded-2xl sticky top-24">
              <h3 className="font-display text-lg font-bold text-white mb-4">{t('inquireAbout')}</h3>
              <div className="space-y-3">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-navy-800 hover:bg-navy-700 transition-smooth">
                    <Phone className="w-5 h-5 text-electric-400" />
                    <div>
                      <p className="text-xs text-slate-400">{t('phone')}</p>
                      <p className="text-sm text-white">{settings.phone}</p>
                    </div>
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-navy-800 hover:bg-navy-700 transition-smooth">
                    <Mail className="w-5 h-5 text-electric-400" />
                    <div>
                      <p className="text-xs text-slate-400">{t('email')}</p>
                      <p className="text-sm text-white truncate">{settings.email}</p>
                    </div>
                  </a>
                )}
                {settings?.line_url && (
                  <a href={settings.line_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#06C755]/20 hover:bg-[#06C755]/30 transition-smooth">
                    <MessageCircle className="w-5 h-5 text-[#06C755]" />
                    <div>
                      <p className="text-xs text-slate-400">LINE</p>
                      <p className="text-sm text-white">{t('lineContact')}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Trucks */}
        {!relLoading && related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-6">{t('relatedTrucks')}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((tr, i) => (
                <TruckCard key={tr.id} truck={tr} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {zoomOpen && images[activeImage] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-navy-950/95 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            src={images[activeImage]} alt="" className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:text-electric-400 transition-smooth">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Video modal */}
      {showVideo && truck.video_url && (
        <div
          className="fixed inset-0 z-[100] bg-navy-950/95 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
          <video src={truck.video_url} controls autoPlay className="max-w-full max-h-full rounded-lg" />
        </div>
      )}

      {/* Inquiry modal */}
      <AnimatePresence>
        {inquireOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-navy-950/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => {
              if (inquiryStatus !== 'sending') setInquireOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="w-full max-w-lg glass-strong rounded-2xl p-6 lg:p-8 my-8 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle glow accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-electric-400/5 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start justify-between mb-6 relative"
              >
                <div>
                  <h2 className="font-display text-xl lg:text-2xl font-bold text-white">
                    {t('inquireAbout')}
                  </h2>
                  <p className="mt-1 text-sm text-electric-400 font-semibold">
                    {brandName} {truck.model}
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (inquiryStatus !== 'sending') setInquireOpen(false);
                  }}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white hover:text-electric-400 transition-smooth flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>

              {/* Truck summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/60 mb-6 relative"
              >
                {images[0] ? (
                  <img src={images[0]} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
                    <Fuel className="w-5 h-5 text-slate-600" />
                  </div>
                )}
                <div className="min-w-0 flex-1 text-xs text-slate-400 space-y-0.5">
                  <p><span className="text-slate-500">{t('year')}:</span> <span className="text-slate-300">{truck.year || '-'}</span></p>
                  <p><span className="text-slate-500">{t('mileage')}:</span> <span className="text-slate-300">{formatMileage(truck.mileage)}</span></p>
                  <p><span className="text-slate-500">{t('price')}:</span> <span className="text-slate-300">{truck.price ? formatPrice(truck.price) : t('priceOnRequest')}</span></p>
                </div>
              </motion.div>

              {inquiryStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-4 py-8 text-center relative"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-electric-400/15 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-electric-400" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-sm text-electric-400 font-medium max-w-xs"
                  >
                    {t('messageSent')}
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setInquireOpen(false);
                      setInquiryStatus('idle');
                      setInquiryForm({ name: '', email: '', phone: '', message: '' });
                    }}
                    className="px-6 py-3 rounded-xl glass text-white text-sm font-medium hover:border-electric-400/40 transition-smooth"
                  >
                    {t('close')}
                  </motion.button>
                </motion.div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!inquiryForm.name || !inquiryForm.message) return;
                    setInquiryStatus('sending');
                    const ok = await submitInquiry({
                      ...inquiryForm,
                      truck_id: truck.id,
                    });
                    setInquiryStatus(ok ? 'success' : 'error');
                    if (ok) {
                      setInquiryForm({ name: '', email: '', phone: '', message: '' });
                    }
                  }}
                  className="space-y-4 relative"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      {t('yourName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        {t('yourPhone')}
                      </label>
                      <input
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        placeholder="Phone / LINE ID"
                        className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        {t('yourEmail')}
                      </label>
                      <input
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      {t('yourMessage')} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-800 rounded-xl text-sm text-white border border-navy-700 focus:border-electric-400/50 focus:outline-none transition-smooth resize-none"
                    />
                  </motion.div>

                  {inquiryStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm"
                    >
                      {t('messageError')}
                    </motion.div>
                  )}

                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={inquiryStatus === 'sending'}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric-400 text-navy-950 font-semibold text-sm hover:bg-electric-400/90 transition-smooth glow-blue-sm disabled:opacity-50 relative overflow-hidden"
                  >
                    {inquiryStatus === 'sending' ? (
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
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
