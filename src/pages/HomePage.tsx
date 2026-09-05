import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Truck, ArrowRight, Star, Quote, ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useFeaturedTrucks, useLatestTrucks, useBrands, useTestimonials } from '@/lib/hooks';
import { heroImage } from '@/lib/fallbackData';
import TruckCard from '@/components/TruckCard';
import { SkeletonGrid } from '@/components/Skeletons';
import AnimatedCounter from '@/components/AnimatedCounter';

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function HomePage() {
  const { t, lang } = useI18n();
  const { trucks: featured, loading: featLoading } = useFeaturedTrucks();
  const { trucks: latest, loading: latLoading } = useLatestTrucks();
  const { brands } = useBrands();
  const { testimonials } = useTestimonials();

  const whyChoose = [
    { icon: ShieldCheck, title: t('wcTitle1'), desc: t('wcDesc1') },
    { icon: Award, title: t('wcTitle2'), desc: t('wcDesc2') },
    { icon: Truck, title: t('wcTitle3'), desc: t('wcDesc3') },
    { icon: ArrowRight, title: t('wcTitle4'), desc: t('wcDesc4') },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover scale-105 animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-50" />

        {/* Floating glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-400/10 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-electric-400/5 rounded-full blur-[100px] animate-float-slow" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.div variants={itemReveal} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6">
              <span className="w-2 h-2 rounded-full bg-electric-400 pulse-dot" />
              <span className="text-xs text-electric-400 font-medium tracking-wider">
                {lang === 'ja' ? '国内販売専門' : 'DOMESTIC SALES ONLY · JAPAN'}
              </span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
              {t('heroTitle').split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={i === 1 || i === 2 ? 'gradient-text-animated' : ''}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </h1>

            <motion.p variants={itemReveal} className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </motion.p>

            <motion.div variants={itemReveal} className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/inventory"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric-400 text-navy-950 font-semibold text-sm hover:bg-electric-400/90 transition-smooth glow-blue hover:glow-blue-lg hover:scale-105"
              >
                {t('browseInventory')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass text-white font-semibold text-sm hover:border-electric-400/40 transition-smooth shine-effect"
              >
                {t('contactUs')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">
            {lang === 'ja' ? 'スクロール' : 'Scroll'}
          </span>
          <ChevronDown className="w-5 h-5 text-electric-400/60 scroll-indicator" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative -mt-px bg-navy-900/50 border-y border-navy-700/50 overflow-hidden">
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-400/50 to-transparent" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 500, suffix: '+', label: lang === 'ja' ? '販売実績' : 'Trucks Sold' },
              { value: 30, suffix: '+', label: lang === 'ja' ? '年の実績' : 'Years Experience' },
              { value: 150, suffix: '', label: lang === 'ja' ? '点検項目' : 'Point Inspection' },
              { value: 100, suffix: '%', label: lang === 'ja' ? '満足度' : 'Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center group"
              >
                <div className="text-3xl lg:text-4xl font-display font-bold gradient-text-animated group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs lg:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-400/30 to-transparent" />
      </section>

      {/* Featured Trucks */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl lg:text-4xl font-bold text-white"
              >
                {t('featuredTrucks')}
              </motion.h2>
              <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
            </div>
            <Link
              to="/inventory"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-electric-400 hover:gap-2 transition-all"
            >
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featLoading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {featured.map((truck, i) => (
                <TruckCard key={truck.id} truck={truck} index={i} />
              ))}
            </div>
          )}

          <div className="mt-6 sm:hidden">
            <Link
              to="/inventory"
              className="inline-flex items-center gap-1 text-sm text-electric-400"
            >
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-4xl font-bold text-white text-center mb-12"
          >
            {t('popularBrands')}
          </motion.h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/inventory?brand=${brand.id}`}
                  className="group flex flex-col items-center justify-center gap-2 p-4 lg:p-6 glass rounded-xl hover:border-electric-400/40 hover:glow-blue-sm transition-smooth rotating-border"
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-navy-700 flex items-center justify-center font-display font-bold text-xl lg:text-2xl text-electric-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {brand.name[0]}
                  </div>
                  <span className="text-xs lg:text-sm text-slate-300 group-hover:text-white text-center transition-colors">
                    {lang === 'ja' && brand.name_ja ? brand.name_ja : brand.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
              {t('whyChooseUs')}
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 mx-auto h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent origin-left"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="group relative p-6 glass rounded-2xl hover:border-electric-400/40 transition-smooth shine-effect card-lift"
              >
                <div className="absolute -inset-0.5 bg-electric-400/0 group-hover:bg-electric-400/5 rounded-2xl blur-xl transition-all" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-electric-400/10 flex items-center justify-center mb-4 group-hover:bg-electric-400/20 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-7 h-7 text-electric-400 group-hover:animate-bounce-subtle" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl lg:text-4xl font-bold text-white"
              >
                {t('latestArrivals')}
              </motion.h2>
              <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
            </div>
            <Link
              to="/inventory"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-electric-400 hover:gap-2 transition-all"
            >
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {latLoading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {latest.map((truck, i) => (
                <TruckCard key={truck.id} truck={truck} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-electric-400/5 rounded-full blur-[120px]" />
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white">
                {t('testimonials')}
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-2 mx-auto h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent origin-left"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {testimonials.map((ts, i) => (
                <motion.div
                  key={ts.id}
                  initial={{ opacity: 0, y: 40, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-6 glass rounded-2xl card-lift shine-effect"
                >
                  <Quote className="w-8 h-8 text-electric-400/30 mb-4" />
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < ts.rating ? 'text-electric-400 fill-electric-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    "{lang === 'ja' && ts.comment_ja ? ts.comment_ja : ts.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-400/20 to-navy-700 flex items-center justify-center text-electric-400 font-bold text-sm">
                      {(lang === 'ja' && ts.name_ja ? ts.name_ja : ts.name)[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {lang === 'ja' && ts.name_ja ? ts.name_ja : ts.name}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-800 to-navy-900" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-electric-400/10 rounded-full blur-[120px] animate-glow-pulse" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-white mb-4">
              {t('readyToFind')}
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <Link
              to="/inventory"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-electric-400 text-navy-950 font-semibold text-sm hover:bg-electric-400/90 transition-smooth glow-blue hover:glow-blue-lg hover:scale-105"
            >
              {t('startBrowsing')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
