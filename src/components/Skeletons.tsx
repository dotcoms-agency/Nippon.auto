import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

export default function SkeletonCard() {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-16 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="flex gap-2">
          <div className="h-2 w-12 skeleton rounded" />
          <div className="h-2 w-12 skeleton rounded" />
          <div className="h-2 w-12 skeleton rounded" />
        </div>
        <div className="h-4 w-20 skeleton rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-navy-950 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <Truck className="w-12 h-12 text-electric-400" />
        </motion.div>
        <div className="text-electric-400 font-display text-xl font-bold tracking-widest">
          NIPPON AUTO
        </div>
        <div className="mt-2 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-electric-400"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
