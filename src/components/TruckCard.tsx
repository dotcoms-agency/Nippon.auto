import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Gauge, Calendar, CheckCircle2 } from 'lucide-react';
import type { Truck } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { formatPrice, formatMileage } from '@/lib/hooks';

type Props = {
  truck: Truck;
  brandName?: string;
  index?: number;
};

export default function TruckCard({ truck, brandName, index = 0 }: Props) {
  const { t, lang } = useI18n();
  const image = truck.image_urls?.[0] || '';
  const displayName = brandName || truck.brand?.name || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/truck/${truck.id}`}
        className="group block h-full"
      >
        <div className="relative h-full glass rounded-xl overflow-hidden transition-smooth group-hover:border-electric-400/40 group-hover:glow-blue-sm group-hover:-translate-y-1.5 duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
            {image ? (
              <img
                src={image}
                alt={`${truck.brand?.name || ''} ${truck.model}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-navy-700 flex items-center justify-center">
                  <Fuel className="w-8 h-8 text-slate-600" />
                </div>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

            {/* Shine sweep on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            {/* Status badge */}
            {truck.is_sold ? (
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-red-500/90 text-white text-[10px] font-bold tracking-wide">
                {t('sold')}
              </div>
            ) : (
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-electric-400/90 text-navy-950 text-[10px] font-bold tracking-wide">
                {t('available')}
              </div>
            )}

            {/* Featured badge */}
            {truck.is_featured && !truck.is_sold && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-md glass-strong text-electric-400 text-[10px] font-bold animate-bounce-subtle">
                ★
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-electric-400 font-semibold uppercase tracking-wider truncate">
                  {displayName}
                </p>
                <h3 className="text-sm font-bold text-white truncate leading-tight group-hover:text-electric-400 transition-colors">
                  {truck.model}
                </h3>
              </div>
            </div>

            {/* Specs row */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-0.5">
                <Calendar className="w-3 h-3" />
                {truck.year || '-'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-0.5">
                <Gauge className="w-3 h-3" />
                {formatMileage(truck.mileage)}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-0.5">
                <Fuel className="w-3 h-3" />
                {truck.fuel || '-'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-1 border-t border-navy-700/50">
              {truck.price ? (
                <span className="text-base font-bold text-white group-hover:text-electric-400 transition-colors">
                  {formatPrice(truck.price)}
                </span>
              ) : (
                <span className="text-sm text-slate-400">{t('priceOnRequest')}</span>
              )}
              <CheckCircle2 className="w-4 h-4 text-electric-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
