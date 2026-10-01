import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fuel, Gauge, Calendar, CheckCircle2, Eye } from 'lucide-react';
import type { Truck } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { formatPrice, formatMileage } from '@/lib/hooks';

type Props = {
  trucks: Truck[];
  showViews?: boolean;
};

export default function TruckCarousel({ trucks, showViews = false }: Props) {
  const { t } = useI18n();

  if (trucks.length === 0) return null;

  // Duplicate the array for seamless infinite loop
  const looped = [...trucks, ...trucks];

  return (
    <div className="relative overflow-hidden group">
      {/* Edge fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-navy-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-navy-950 to-transparent pointer-events-none" />

      <div className={`flex gap-3 sm:gap-4 lg:gap-6 w-max ${showViews ? 'truck-carousel-track-slow' : 'truck-carousel-track'}`}>
        {looped.map((truck, i) => (
          <CarouselCard key={`${truck.id}-${i}`} truck={truck} index={i} showViews={showViews} />
        ))}
      </div>
    </div>
  );
}

function CarouselCard({ truck, index, showViews }: { truck: Truck; index: number; showViews: boolean }) {
  const { t } = useI18n();
  const image = truck.image_urls?.[0] || '';
  const displayName = truck.brand?.name || '';
  const status = truck.status || (truck.is_sold ? 'sold' : 'available');

  const statusStyles: Record<string, string> = {
    available: 'bg-electric-400/90 text-navy-950',
    reserved: 'bg-amber-500/90 text-navy-950',
    sold: 'bg-red-500/90 text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min((index % 12) * 0.04, 0.3) }}
      className="flex-shrink-0 w-[160px] sm:w-[240px] lg:w-[300px]"
    >
      <Link
        to={`/truck/${truck.id}`}
        className="group/card block h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-full glass rounded-xl overflow-hidden transition-smooth group-hover/card:border-electric-400/40 group-hover/card:glow-blue-sm group-hover/card:-translate-y-1.5 duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
            {image ? (
              <img
                src={image}
                alt={`${truck.brand?.name || ''} ${truck.model}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-navy-700 flex items-center justify-center">
                  <Fuel className="w-8 h-8 text-slate-600" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-400/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-700" />

            <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide ${statusStyles[status] || statusStyles.available}`}>
              {t(status)}
            </div>

            {truck.is_featured && status !== 'sold' && (
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
                <h3 className="text-sm font-bold text-white truncate leading-tight group-hover/card:text-electric-400 transition-colors">
                  {truck.model}
                </h3>
              </div>
            </div>

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

            <div className="flex items-center justify-between pt-1 border-t border-navy-700/50">
              {truck.price ? (
                <span className="text-base font-bold text-white group-hover/card:text-electric-400 transition-colors">
                  {formatPrice(truck.price)}
                </span>
              ) : (
                <span className="text-sm text-slate-400">{t('priceOnRequest')}</span>
              )}
              {showViews ? (
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Eye className="w-3 h-3" />
                  {truck.views || 0}
                </span>
              ) : (
                <CheckCircle2 className="w-4 h-4 text-electric-400 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-300" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
