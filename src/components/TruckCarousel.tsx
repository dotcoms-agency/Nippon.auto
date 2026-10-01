import { useRef, useEffect, useCallback, useState } from 'react';
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

const AUTO_SPEED = 0.35;
const AUTO_SPEED_SLOW = 0.25;
const RESUME_DELAY = 1500;
const DRAG_THRESHOLD = 8;

export default function TruckCarousel({ trucks, showViews = false }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const isInteractingRef = useRef(false);
  const lastResumeTimerRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const didDragRef = useRef(false);

  const speed = showViews ? AUTO_SPEED_SLOW : AUTO_SPEED;

  // GPU-friendly transform setter — uses translate3d for compositor-only animation
  const setOffset = useCallback((v: number) => {
    offsetRef.current = v;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-v}px, 0, 0)`;
    }
  }, []);

  // Measure half-width once and on resize (not every frame)
  const measureHalfWidth = useCallback(() => {
    if (trackRef.current) {
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    }
  }, []);

  useEffect(() => {
    if (trucks.length === 0) return;

    // Delay measurement until images have reserved layout space
    measureHalfWidth();
    const resizeObserver = new ResizeObserver(() => measureHalfWidth());
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    const tick = () => {
      if (!isInteractingRef.current && halfWidthRef.current > 0) {
        let next = offsetRef.current + speed;
        if (next >= halfWidthRef.current) {
          next -= halfWidthRef.current;
        }
        setOffset(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [trucks.length, speed, setOffset, measureHalfWidth]);

  const scheduleResume = useCallback(() => {
    if (lastResumeTimerRef.current) {
      clearTimeout(lastResumeTimerRef.current);
    }
    lastResumeTimerRef.current = window.setTimeout(() => {
      isInteractingRef.current = false;
    }, RESUME_DELAY);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isInteractingRef.current = true;
    didDragRef.current = false;
    dragStartRef.current = { x: e.clientX, offset: offsetRef.current };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isInteractingRef.current) return;
    const delta = e.clientX - dragStartRef.current.x;

    if (Math.abs(delta) > DRAG_THRESHOLD && !didDragRef.current) {
      didDragRef.current = true;
      setIsDragging(true);
    }

    let next = dragStartRef.current.offset - delta;
    const hw = halfWidthRef.current;
    if (hw > 0) {
      while (next < 0) next += hw;
      while (next >= hw) next -= hw;
    }
    setOffset(next);
  }, [setOffset]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    scheduleResume();
  }, [scheduleResume]);

  if (trucks.length === 0) return null;

  const looped = [...trucks, ...trucks];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-navy-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-navy-950 to-transparent pointer-events-none" />

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`flex gap-3 sm:gap-4 lg:gap-6 w-max ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          willChange: 'transform',
          touchAction: 'pan-y',
          transform: `translate3d(0, 0, 0)`,
        }}
      >
        {looped.map((truck, i) => (
          <CarouselCard
            key={`${truck.id}-${i}`}
            truck={truck}
            index={i}
            showViews={showViews}
            didDragRef={didDragRef}
          />
        ))}
      </div>
    </div>
  );
}

// Stable status styles object outside component to avoid re-creation
const statusStyles: Record<string, string> = {
  available: 'bg-electric-400/90 text-navy-950',
  reserved: 'bg-amber-500/90 text-navy-950',
  sold: 'bg-red-500/90 text-white',
};

function CarouselCard({
  truck,
  index,
  showViews,
  didDragRef,
}: {
  truck: Truck;
  index: number;
  showViews: boolean;
  didDragRef: React.RefObject<boolean>;
}) {
  const { t } = useI18n();
  const image = truck.image_urls?.[0] || '';
  const displayName = truck.brand?.name || '';
  const status = truck.status || (truck.is_sold ? 'sold' : 'available');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ duration: 0.3, delay: Math.min((index % 12) * 0.03, 0.2) }}
      className="flex-shrink-0 w-[160px] sm:w-[240px] lg:w-[300px]"
      style={{ willChange: 'auto' }}
    >
      <Link
        to={`/truck/${truck.id}`}
        className="group/card block h-full"
        onClick={(e) => {
          if (didDragRef.current) {
            e.preventDefault();
          }
        }}
        draggable={false}
      >
        <div className="relative h-full glass rounded-xl overflow-hidden transition-smooth group-hover/card:border-electric-400/40 group-hover/card:glow-blue-sm group-hover/card:-translate-y-1.5 duration-300">
          <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
            {image ? (
              <img
                src={image}
                alt={`${truck.brand?.name || ''} ${truck.model}`}
                loading="lazy"
                decoding="async"
                draggable={false}
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
