import { motion } from 'framer-motion';
import { ShieldCheck, Award, Truck, Heart, Target, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/hooks';
import { aboutImage } from '@/lib/fallbackData';

export default function AboutPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();

  const values = [
    { icon: ShieldCheck, title: t('wcTitle1'), desc: t('wcDesc1') },
    { icon: Heart, title: lang === 'ja' ? '誠実' : 'Integrity', desc: lang === 'ja' ? '透明性と公正さをすべての取引に。' : 'Transparency and fairness in every transaction.' },
    { icon: Award, title: t('wcTitle2'), desc: t('wcDesc2') },
    { icon: Truck, title: t('wcTitle4'), desc: t('wcDesc4') },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutImage} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/60" />
        </div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-electric-400/10 rounded-full blur-[120px]" />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-sm text-electric-400 font-semibold uppercase tracking-wider mb-2">
              {lang === 'ja' ? '1995年創業' : 'Since 1995'}
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white">
              {t('aboutTitle')}
            </h1>
            <div className="mt-3 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">{t('ourStory')}</h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  {lang === 'ja'
                    ? 'ニッポンオートは1995年に東京で創業し、日本全国のビジネスに高品質な中古トラックを提供してきました。30年以上にわたり、私たちは日本の主要メーカーの商用車を厳選し、厳格な検査プロセスを経て販売しています。'
                    : 'Founded in 1995 in Tokyo, Nippon Auto has been providing high-quality used trucks to businesses across Japan for over 30 years. We carefully select commercial vehicles from Japan\'s leading manufacturers, putting each through our rigorous inspection process before sale.'}
                </p>
                <p>
                  {lang === 'ja'
                    ? '私たちの使命は、日本の物流・建設業を支える信頼できる車両を、公正な価格で提供することです。お客様の成功が私たちの成功です。'
                    : 'Our mission is to support Japan\'s logistics and construction industries with reliable vehicles at fair prices. Our customers\' success is our success.'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden glass"
            >
              <img src={aboutImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 glass rounded-2xl"
            >
              <div className="w-14 h-14 rounded-xl bg-electric-400/10 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-electric-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">{t('ourMission')}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'ja'
                  ? '日本全国のビジネスに、検査済みの高品質な中古トラックを公正な価格で提供し、お客様の事業成長を支援する。'
                  : 'To empower businesses across Japan with inspected, high-quality used trucks at fair prices, supporting our customers\' growth.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 glass rounded-2xl"
            >
              <div className="w-14 h-14 rounded-xl bg-electric-400/10 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-electric-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {lang === 'ja' ? 'ビジョン' : 'Our Vision'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'ja'
                  ? '日本で最も信頼される中古トラックディーラーとなること。品質と透明性の業界標準を確立する。'
                  : 'To be Japan\'s most trusted used truck dealer, setting the industry standard for quality and transparency.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('ourValues')}</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 glass rounded-2xl hover:border-electric-400/40 transition-smooth"
              >
                <div className="w-12 h-12 rounded-xl bg-electric-400/10 flex items-center justify-center mb-4">
                  <val.icon className="w-6 h-6 text-electric-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{val.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('ourLocation')}</h2>
            <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {settings?.address && (
                <div className="flex items-start gap-3 p-4 glass rounded-xl">
                  <MapPin className="w-5 h-5 text-electric-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{t('address')}</p>
                    <p className="text-sm text-white">{settings.address}</p>
                  </div>
                </div>
              )}
              {settings?.phone && (
                <div className="flex items-center gap-3 p-4 glass rounded-xl">
                  <Phone className="w-5 h-5 text-electric-400" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{t('phone')}</p>
                    <p className="text-sm text-white">{settings.phone}</p>
                  </div>
                </div>
              )}
              {settings?.email && (
                <div className="flex items-center gap-3 p-4 glass rounded-xl">
                  <Mail className="w-5 h-5 text-electric-400" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{t('email')}</p>
                    <p className="text-sm text-white">{settings.email}</p>
                  </div>
                </div>
              )}
              {settings && (
                <div className="p-4 glass rounded-xl">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('businessHours')}</p>
                  <p className="text-sm text-white">
                    {lang === 'ja' && settings.business_hours_ja ? settings.business_hours_ja : settings.business_hours}
                  </p>
                </div>
              )}
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden glass">
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.0!2d139.7671!3d35.6812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQwJzQzLjMiTiAxMznCsDQ2JzAxLjYiRQ!5e0!3m2!1sen!2sjp!4v1700000000000"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
