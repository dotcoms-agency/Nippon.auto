import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/hooks';

export default function LineButton() {
  const { settings } = useSettings();
  if (!settings?.line_url) return null;

  return (
    <motion.a
      href={settings.line_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#06C755] text-white font-semibold text-sm shadow-2xl hover:scale-105 transition-smooth glow-blue-sm"
      aria-label="LINE Contact"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">LINE</span>
    </motion.a>
  );
}
