import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

export type Lang = 'en' | 'ja';

type Dict = Record<string, { en: string; ja: string }>;

const dict: Dict = {
  // Nav
  home: { en: 'Home', ja: 'ホーム' },
  inventory: { en: 'Inventory', ja: '在庫' },
  about: { en: 'About', ja: '会社概要' },
  contact: { en: 'Contact', ja: 'お問い合わせ' },
  privacy: { en: 'Privacy Policy', ja: 'プライバシーポリシー' },
  brands: { en: 'Brands', ja: 'ブランド' },
  admin: { en: 'Admin', ja: '管理' },

  // Home
  heroTitle: {
    en: 'Premium Used Trucks',
    ja: 'プレミアム中古トラック',
  },
  heroSubtitle: {
    en: 'Japan\'s finest commercial vehicles, carefully selected and rigorously inspected.',
    ja: '厳選され、厳格に検査された日本最高品質の商用車。',
  },
  browseInventory: { en: 'Browse Inventory', ja: '在庫を見る' },
  contactUs: { en: 'Contact Us', ja: 'お問い合わせ' },
  featuredTrucks: { en: 'Featured Trucks', ja: '注目のトラック' },
  viewAll: { en: 'View All', ja: 'すべて見る' },
  popularBrands: { en: 'Popular Brands', ja: '人気ブランド' },
  whyChooseUs: { en: 'Why Choose Nippon Auto', ja: 'ニッポンオートが選ばれる理由' },
  latestArrivals: { en: 'Latest Arrivals', ja: '新着情報' },
  testimonials: { en: 'Customer Testimonials', ja: 'お客様の声' },
  readyToFind: {
    en: 'Ready to Find Your Perfect Truck?',
    ja: '理想のトラックを見つけませんか？',
  },
  startBrowsing: { en: 'Start Browsing', ja: '閲覧を始める' },

  // Why choose
  wcTitle1: { en: 'Rigorous Inspection', ja: '厳格な検査' },
  wcDesc1: {
    en: 'Every truck undergoes a 150-point inspection by certified technicians.',
    ja: 'すべてのトラックは認定技術者による150項目の検査を実施。',
  },
  wcTitle2: { en: 'Trusted Since 1995', ja: '1995年から信頼' },
  wcDesc2: {
    en: 'Over 30 years of delivering quality commercial vehicles across Japan.',
    ja: '30年以上にわたり日本全国に高品質な商用車を提供。',
  },
  wcTitle3: { en: 'Competitive Pricing', ja: '競争力のある価格' },
  wcDesc3: {
    en: 'Fair, transparent pricing with no hidden fees or surprises.',
    ja: '隠し費用なしの公正で透明な価格設定。',
  },
  wcTitle4: { en: 'Nationwide Delivery', ja: '全国配送' },
  wcDesc4: {
    en: 'We deliver your truck anywhere in Japan, fully insured.',
    ja: '完全保険付きで日本全国どこでも配送。',
  },

  // Inventory
  searchPlaceholder: { en: 'Search by model, brand...', ja: '車種、ブランドで検索...' },
  filters: { en: 'Filters', ja: 'フィルター' },
  brand: { en: 'Brand', ja: 'ブランド' },
  model: { en: 'Model', ja: 'モデル' },
  year: { en: 'Year', ja: '年式' },
  price: { en: 'Price', ja: '価格' },
  mileage: { en: 'Mileage', ja: '走行距離' },
  transmission: { en: 'Transmission', ja: 'ミッション' },
  fuel: { en: 'Fuel', ja: '燃料' },
  bodyType: { en: 'Body Type', ja: 'ボディタイプ' },
  sortBy: { en: 'Sort By', ja: '並び順' },
  newest: { en: 'Newest', ja: '新着順' },
  lowestPrice: { en: 'Lowest Price', ja: '価格が低い順' },
  highestPrice: { en: 'Highest Price', ja: '価格が高い順' },
  yearDesc: { en: 'Year', ja: '年式順' },
  noResults: { en: 'No trucks found matching your criteria.', ja: '条件に一致するトラックが見つかりません。' },
  clearFilters: { en: 'Clear Filters', ja: 'フィルターをクリア' },
  results: { en: 'Results', ja: '件' },
  allBrands: { en: 'All Brands', ja: 'すべてのブランド' },
  allTypes: { en: 'All Types', ja: 'すべて' },
  all: { en: 'All', ja: 'すべて' },

  // Truck details
  specifications: { en: 'Specifications', ja: '仕様' },
  features: { en: 'Features', ja: '装備' },
  condition: { en: 'Vehicle Condition', ja: '車両状態' },
  relatedTrucks: { en: 'Related Trucks', ja: '関連車両' },
  callNow: { en: 'Call Now', ja: '今すぐ電話' },
  emailInquiry: { en: 'Email Inquiry', ja: 'メール問い合わせ' },
  lineContact: { en: 'LINE Contact', ja: 'LINE問い合わせ' },
  share: { en: 'Share', ja: '共有' },
  sold: { en: 'SOLD', ja: '売約済み' },
  available: { en: 'Available', ja: '販売中' },
  reserved: { en: 'Reserved', ja: '予約済み' },
  engine: { en: 'Engine', ja: 'エンジン' },
  colorLabel: { en: 'Color', ja: 'カラー' },
  kms: { en: 'km', ja: 'km' },
  inquireAbout: { en: 'Inquire About This Truck', ja: 'このトラックについて問い合わせる' },

  // About
  aboutTitle: { en: 'About Nippon Auto', ja: 'ニッポンオートについて' },
  ourStory: { en: 'Our Story', ja: '私たちのストーリー' },
  ourMission: { en: 'Our Mission', ja: '私たちの使命' },
  ourValues: { en: 'Our Values', ja: '私たちの価値観' },
  ourLocation: { en: 'Our Location', ja: '事業所在地' },

  // Contact
  contactTitle: { en: 'Get in Touch', ja: 'お問い合わせ' },
  contactSubtitle: {
    en: 'We\'re here to help you find the perfect truck for your business.',
    ja: 'ビジネスに最適なトラックを見つけるお手伝いをいたします。',
  },
  yourName: { en: 'Your Name', ja: 'お名前' },
  yourEmail: { en: 'Email Address', ja: 'メールアドレス' },
  yourPhone: { en: 'Phone Number', ja: '電話番号' },
  yourMessage: { en: 'Message', ja: 'メッセージ' },
  sendMessage: { en: 'Send Message', ja: '送信' },
  businessHours: { en: 'Business Hours', ja: '営業時間' },
  address: { en: 'Address', ja: '住所' },
  phone: { en: 'Phone', ja: '電話' },
  email: { en: 'Email', ja: 'メール' },
  messageSent: { en: 'Your message has been sent successfully!', ja: 'メッセージが正常に送信されました！' },
  messageError: { en: 'Something went wrong. Please try again.', ja: 'エラーが発生しました。もう一度お試しください。' },

  // Footer
  quickLinks: { en: 'Quick Links', ja: 'クイックリンク' },
  contactInfo: { en: 'Contact Info', ja: '連絡先情報' },
  allRightsReserved: { en: 'All rights reserved.', ja: '全著作権所有。' },
  domesticSalesOnly: { en: 'Domestic sales only within Japan.', ja: '日本国内販売のみ。' },

  // Admin
  dashboard: { en: 'Dashboard', ja: 'ダッシュボード' },
  truckManagement: { en: 'Truck Management', ja: '車両管理' },
  brandManagement: { en: 'Brand Management', ja: 'ブランド管理' },
  inquiryManagement: { en: 'Inquiries', ja: '問い合わせ管理' },
  settings: { en: 'Settings', ja: '設定' },
  logout: { en: 'Logout', ja: 'ログアウト' },
  login: { en: 'Login', ja: 'ログイン' },
  emailLabel: { en: 'Email', ja: 'メール' },
  password: { en: 'Password', ja: 'パスワード' },
  signIn: { en: 'Sign In', ja: 'サインイン' },
  invalidCredentials: { en: 'Invalid email or password', ja: 'メールまたはパスワードが無効です' },
  addTruck: { en: 'Add Truck', ja: 'トラック追加' },
  editTruck: { en: 'Edit Truck', ja: 'トラック編集' },
  deleteTruck: { en: 'Delete Truck', ja: 'トラック削除' },
  save: { en: 'Save', ja: '保存' },
  cancel: { en: 'Cancel', ja: 'キャンセル' },
  delete: { en: 'Delete', ja: '削除' },
  edit: { en: 'Edit', ja: '編集' },
  add: { en: 'Add', ja: '追加' },
  confirmDelete: { en: 'Are you sure you want to delete this?', ja: '本当に削除しますか？' },
  totalTrucks: { en: 'Total Trucks', ja: '総車両数' },
  soldTrucks: { en: 'Sold Trucks', ja: '売約済み' },
  availableTrucks: { en: 'Available', ja: '販売中' },
  totalInquiries: { en: 'Inquiries', ja: '問い合わせ' },
  newInquiries: { en: 'New Inquiries', ja: '新規問い合わせ' },
  recentInquiries: { en: 'Recent Inquiries', ja: '最近の問い合わせ' },
  salesOverview: { en: 'Sales Overview', ja: '売上概況' },
  visitorAnalytics: { en: 'Visitor Analytics', ja: '訪問者分析' },
  addBrand: { en: 'Add Brand', ja: 'ブランド追加' },
  companyName: { en: 'Company Name', ja: '会社名' },
  logoUpload: { en: 'Logo Upload', ja: 'ロゴアップロード' },
  socialLinks: { en: 'Social Links', ja: 'ソーシャルリンク' },
  languageSettings: { en: 'Language Settings', ja: '言語設定' },
  saveSettings: { en: 'Save Settings', ja: '設定を保存' },
  settingsSaved: { en: 'Settings saved successfully!', ja: '設定が保存されました！' },
  status: { en: 'Status', ja: 'ステータス' },
  new: { en: 'New', ja: '新規' },
  contacted: { en: 'Contacted', ja: '対応済み' },
  closed: { en: 'Closed', ja: '完了' },
  uploadImages: { en: 'Upload Images', ja: '画像をアップロード' },
  uploadVideo: { en: 'Upload Video', ja: '動画をアップロード' },
  imageUrls: { en: 'Image URLs', ja: '画像URL' },
  backToInventory: { en: 'Back to Inventory', ja: '在庫に戻る' },
  backToTrucks: { en: 'Back to Trucks', ja: 'トラック一覧に戻る' },

  // Misc
  loading: { en: 'Loading...', ja: '読み込み中...' },
  priceOnRequest: { en: 'Price on Request', ja: '応相談' },
  perMonth: { en: 'per month', ja: '月間' },
  backToTop: { en: 'Back to top', ja: 'トップへ' },
};

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('nippon-auto-lang');
    return (saved === 'en' || saved === 'ja') ? saved : 'en';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('nippon-auto-lang', l);
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
