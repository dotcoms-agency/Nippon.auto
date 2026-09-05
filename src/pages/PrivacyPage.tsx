import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function PrivacyPage() {
  const { lang } = useI18n();

  const sections = lang === 'ja' ? [
    {
      title: 'プライバシーポリシー',
      body: 'ニッポンオート（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、以下のプライバシーポリシーを定めております。',
    },
    {
      title: '1. 収集する情報',
      body: '当社は、お問い合わせフォームを通じて、お名前、メールアドレス、電話番号、お問い合わせ内容を収集いたします。これらの情報は、お客様からのご要望に対応するためにのみ使用いたします。',
    },
    {
      title: '2. 情報の利用目的',
      body: '収集した個人情報は、お問い合わせへの回答、車両に関するご案内、サービス向上のための分析に使用いたします。第三者への販売や共有は行いません。',
    },
    {
      title: '3. 情報の保管と保護',
      body: '当社は、個人情報を安全に保管し、不正アクセス、紛失、改ざんを防ぐための適切な技術的・組織的措置を講じております。',
    },
    {
      title: '4. Cookieの使用',
      body: '当社のウェブサイトは、ユーザー体験向上のためにCookieを使用しております。ブラウザの設定でCookieを無効にすることができます。',
    },
    {
      title: '5. 第三者への提供',
      body: '当社は、法令に基づく要求がある場合を除き、お客様の個人情報を第三者に提供することはありません。',
    },
    {
      title: '6. お問い合わせ',
      body: 'プライバシーポリシーに関するお問い合わせは、お問い合わせフォームまたはメールにてご連絡ください。',
    },
  ] : [
    {
      title: 'Privacy Policy',
      body: 'Nippon Auto (hereinafter "the Company") recognizes the protection of customer personal information as an important responsibility and establishes the following privacy policy.',
    },
    {
      title: '1. Information We Collect',
      body: 'Through our contact form, we collect your name, email address, phone number, and inquiry message. This information is used solely to respond to your requests.',
    },
    {
      title: '2. Purpose of Information Use',
      body: 'The personal information we collect is used to respond to inquiries, provide vehicle information, and analyze for service improvement. We do not sell or share this information with third parties.',
    },
    {
      title: '3. Information Storage and Protection',
      body: 'We store personal information securely and take appropriate technical and organizational measures to prevent unauthorized access, loss, and alteration.',
    },
    {
      title: '4. Use of Cookies',
      body: 'Our website uses cookies to improve user experience. You can disable cookies through your browser settings.',
    },
    {
      title: '5. Third Party Disclosure',
      body: 'We do not disclose your personal information to third parties except when required by law.',
    },
    {
      title: '6. Contact',
      body: 'For inquiries regarding our privacy policy, please contact us through our contact form or email.',
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="relative py-12 lg:py-16 bg-navy-900/30 border-b border-navy-700/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl lg:text-5xl font-bold text-white"
          >
            {lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
          </motion.h1>
          <div className="mt-3 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="p-6 glass rounded-2xl"
          >
            <h2 className="font-display text-lg font-bold text-white mb-2">{section.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{section.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
