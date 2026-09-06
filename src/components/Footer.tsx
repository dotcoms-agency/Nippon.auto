import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/lib/hooks';

export default function Footer() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();

  const companyName = lang === 'ja' && settings?.company_name_ja
    ? settings.company_name_ja : settings?.company_name || 'Nippon Auto';

  return (
    <footer className="bg-navy-950 border-t border-navy-700/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-6 h-6 object-contain" />
              ) : (
                <Truck className="w-6 h-6 text-electric-400" />
              )}
              <span className="font-display text-lg font-bold text-white">{companyName}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {lang === 'ja'
                ? '日本全国に高品質な中古トラックを提供する信頼のディーラー。'
                : 'Your trusted dealer for premium used trucks across Japan.'}
            </p>
            <div className="flex gap-3">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-600 transition-smooth">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-600 transition-smooth">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-600 transition-smooth">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.line_url && (
                <a href={settings.line_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-navy-700 flex items-center justify-center text-slate-400 hover:text-electric-400 hover:bg-navy-600 transition-smooth">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('home') },
                { to: '/inventory', label: t('inventory') },
                { to: '/about', label: t('about') },
                { to: '/contact', label: t('contact') },
                { to: '/privacy', label: t('privacy') },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-electric-400 transition-smooth">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              {settings?.address && (
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4 text-electric-400 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-electric-400 transition-smooth">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="w-4 h-4 text-electric-400 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-electric-400 transition-smooth">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{t('businessHours')}</h3>
            <p className="text-sm text-slate-400">
              {lang === 'ja' && settings?.business_hours_ja ? settings.business_hours_ja : settings?.business_hours}
            </p>
            <div className="mt-4 p-3 glass rounded-xl">
              <p className="text-xs text-slate-300">
                {lang === 'ja' ? '日本国内販売のみ' : t('domesticSalesOnly')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-700/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {companyName}. {t('allRightsReserved')}
          </p>
          <p className="text-xs text-slate-500">{t('domesticSalesOnly')}</p>
        </div>
      </div>
    </footer>
  );
}
