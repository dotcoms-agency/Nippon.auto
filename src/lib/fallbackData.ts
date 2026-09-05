import type { Brand, Truck, Testimonial, Settings } from './supabase';

export const fallbackBrands: Brand[] = [
  { id: 'b1', name: 'Isuzu', name_ja: 'いすゞ', logo_url: null, country: 'Japan', created_at: '' },
  { id: 'b2', name: 'Hino', name_ja: '日野', logo_url: null, country: 'Japan', created_at: '' },
  { id: 'b3', name: 'Mitsubishi Fuso', name_ja: '三菱ふそう', logo_url: null, country: 'Japan', created_at: '' },
  { id: 'b4', name: 'Nissan Diesel', name_ja: '日産ディーゼル', logo_url: null, country: 'Japan', created_at: '' },
  { id: 'b5', name: 'UD Trucks', name_ja: 'UDトラックス', logo_url: null, country: 'Japan', created_at: '' },
  { id: 'b6', name: 'Toyota', name_ja: 'トヨタ', logo_url: null, country: 'Japan', created_at: '' },
];

const img1 = 'https://images.pexels.com/photos/18468424/pexels-photo-18468424.jpeg?auto=compress&cs=tinysrgb&w=800';
const img2 = 'https://images.pexels.com/photos/37753989/pexels-photo-37753989.jpeg?auto=compress&cs=tinysrgb&w=800';
const img3 = 'https://images.pexels.com/photos/11087830/pexels-photo-11087830.jpeg?auto=compress&cs=tinysrgb&w=800';
const img4 = 'https://images.pexels.com/photos/38559002/pexels-photo-38559002.jpeg?auto=compress&cs=tinysrgb&w=800';
const img5 = 'https://images.pexels.com/photos/6940962/pexels-photo-6940962.jpeg?auto=compress&cs=tinysrgb&w=800';
const img6 = 'https://images.pexels.com/photos/6563903/pexels-photo-6563903.jpeg?auto=compress&cs=tinysrgb&w=800';
const img7 = 'https://images.pexels.com/photos/11053643/pexels-photo-11053643.jpeg?auto=compress&cs=tinysrgb&w=800';
const img8 = 'https://images.pexels.com/photos/27508769/pexels-photo-27508769.jpeg?auto=compress&cs=tinysrgb&w=800';

export const fallbackTrucks: Truck[] = [
  {
    id: 't1', brand_id: 'b1', model: 'Elf NPR71', year: 2018, price: 2800000, mileage: 85000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Flatbed', engine_cc: 5200, color: 'White',
    image_urls: [img5, img1],
    video_url: null,
    specifications: { 'Engine': '5.2L Diesel', 'Payload': '3.5t', 'Wheelbase': '3,800mm', 'Gross Weight': '7,100kg' },
    features: ['Power Steering', 'Air Conditioning', 'Power Windows', 'ABS', 'Air Suspension Driver Seat'],
    condition_notes: 'Excellent condition. Recently serviced. New tires on front axle.',
    description: 'Well-maintained Isuzu Elf flatbed truck, perfect for construction and logistics.',
    description_ja: '建設・物流に最適な、状態良好ないすゞエルフフラットベッド。',
    is_sold: false, is_featured: true, views: 245, created_at: '2024-08-15T00:00:00Z',
  },
  {
    id: 't2', brand_id: 'b2', model: 'Dutro 155', year: 2019, price: 3500000, mileage: 65000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Box', engine_cc: 4000, color: 'Blue',
    image_urls: [img2, img8],
    video_url: null,
    specifications: { 'Engine': '4.0L Diesel', 'Payload': '3.0t', 'Wheelbase': '3,400mm', 'Gross Weight': '5,500kg' },
    features: ['Power Steering', 'Air Conditioning', 'Power Windows', 'ABS', 'Reverse Camera'],
    condition_notes: 'Like new. Single owner. Full service history available.',
    description: 'Hino Dutro box truck in pristine condition, ideal for urban deliveries.',
    description_ja: '都市部配送に最適な、極上状態の日野デュトロボックス。',
    is_sold: false, is_featured: true, views: 189, created_at: '2024-08-20T00:00:00Z',
  },
  {
    id: 't3', brand_id: 'b3', model: 'Fighter FK61', year: 2017, price: 2200000, mileage: 120000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Flatbed', engine_cc: 7800, color: 'White',
    image_urls: [img1, img5],
    video_url: null,
    specifications: { 'Engine': '7.8L Diesel', 'Payload': '5.0t', 'Wheelbase': '4,200mm', 'Gross Weight': '10,700kg' },
    features: ['Power Steering', 'Air Conditioning', 'ABS', 'Diff Lock'],
    condition_notes: 'Good working condition. Some cosmetic wear on body.',
    description: 'Mitsubishi Fuso Fighter, reliable workhorse for heavy-duty applications.',
    description_ja: '三菱ふそうファイター、重量級作業に最適な頼もしい一両。',
    is_sold: false, is_featured: true, views: 312, created_at: '2024-07-10T00:00:00Z',
  },
  {
    id: 't4', brand_id: 'b4', model: 'Quon CB410', year: 2016, price: 4500000, mileage: 180000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Tractor', engine_cc: 12900, color: 'Silver',
    image_urls: [img7, img4],
    video_url: null,
    specifications: { 'Engine': '12.9L Diesel', 'Output': '410ps', 'Wheelbase': '3,300mm', 'Gross Weight': '20,000kg' },
    features: ['Power Steering', 'Air Conditioning', 'Air Suspension', 'Retarder', 'Cruise Control'],
    condition_notes: 'Well maintained fleet vehicle. Engine overhauled at 150,000km.',
    description: 'Nissan Diesel Quon tractor head, powerful and reliable for long-haul transport.',
    description_ja: '日産ディーゼルクオン、長距離輸送に強力で信頼性の高いトラクタ。',
    is_sold: false, is_featured: false, views: 156, created_at: '2024-06-05T00:00:00Z',
  },
  {
    id: 't5', brand_id: 'b5', model: 'Quester GWE', year: 2020, price: 5200000, mileage: 45000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Tractor', engine_cc: 11000, color: 'Red',
    image_urls: [img6, img3],
    video_url: null,
    specifications: { 'Engine': '11.0L Diesel', 'Output': '380ps', 'Wheelbase': '3,500mm', 'Gross Weight': '22,000kg' },
    features: ['Power Steering', 'Air Conditioning', 'Air Suspension', 'Retarder', 'Lane Departure Warning'],
    condition_notes: 'Excellent. Like new condition with low mileage.',
    description: 'UD Quester tractor, modern design with advanced safety features.',
    description_ja: 'UDクエスター、先進安全機能を備えたモダンなトラクタ。',
    is_sold: false, is_featured: true, views: 278, created_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 't6', brand_id: 'b6', model: 'Dyna 150', year: 2018, price: 1900000, mileage: 95000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Flatbed', engine_cc: 3000, color: 'White',
    image_urls: [img5],
    video_url: null,
    specifications: { 'Engine': '3.0L Diesel', 'Payload': '2.0t', 'Wheelbase': '2,800mm', 'Gross Weight': '4,500kg' },
    features: ['Power Steering', 'Air Conditioning', 'Power Windows', 'ABS'],
    condition_notes: 'Good condition. Regular maintenance done.',
    description: 'Toyota Dyna, versatile light-duty truck for various applications.',
    description_ja: 'トヨタ・ダイナ、様々な用途に対応する多用途小型トラック。',
    is_sold: false, is_featured: false, views: 98, created_at: '2024-08-25T00:00:00Z',
  },
  {
    id: 't7', brand_id: 'b1', model: 'Forward FRR90', year: 2015, price: 1800000, mileage: 210000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Box', engine_cc: 7800, color: 'White',
    image_urls: [img1],
    video_url: null,
    specifications: { 'Engine': '7.8L Diesel', 'Payload': '5.5t', 'Wheelbase': '4,600mm', 'Gross Weight': '12,000kg' },
    features: ['Power Steering', 'Air Conditioning', 'ABS', 'Diff Lock'],
    condition_notes: 'Fair condition. Runs well but has some exterior scratches.',
    description: 'Isuzu Forward medium-duty box truck, proven reliability.',
    description_ja: 'いすゞフォワード中型ボックス、実績のある信頼性。',
    is_sold: true, is_featured: false, views: 167, created_at: '2024-05-12T00:00:00Z',
  },
  {
    id: 't8', brand_id: 'b2', model: 'Profia FR1', year: 2021, price: 6500000, mileage: 38000,
    transmission: 'Manual', fuel: 'Diesel', body_type: 'Tractor', engine_cc: 12900, color: 'Blue',
    image_urls: [img8, img2],
    video_url: null,
    specifications: { 'Engine': '12.9L Diesel', 'Output': '480ps', 'Wheelbase': '3,200mm', 'Gross Weight': '22,000kg' },
    features: ['Power Steering', 'Air Conditioning', 'Air Suspension', 'Retarder', 'Adaptive Cruise', 'Emergency Brake'],
    condition_notes: 'Mint condition. One owner, full service history.',
    description: 'Hino Profia heavy-duty tractor, top of the line with latest safety tech.',
    description_ja: '日野プロフィア、最新安全技術を搭載した最高峰の大型トラクタ。',
    is_sold: false, is_featured: false, views: 342, created_at: '2024-09-02T00:00:00Z',
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 'ts1', name: 'Takeshi Yamamoto', name_ja: '山本武志', rating: 5,
    comment: 'Excellent service and high-quality trucks. Found the perfect vehicle for my logistics company.',
    comment_ja: '素晴らしいサービスと高品質なトラック。物流会社に最適な車両が見つかりました。',
    created_at: '2024-08-01T00:00:00Z',
  },
  {
    id: 'ts2', name: 'Akira Sato', name_ja: '佐藤明', rating: 5,
    comment: 'Very professional and transparent. The inspection process gave me complete confidence.',
    comment_ja: '非常にプロフェッショナルで透明性がありました。検査プロセスに完全な信頼を持ちました。',
    created_at: '2024-07-15T00:00:00Z',
  },
  {
    id: 'ts3', name: 'Kenji Watanabe', name_ja: '渡辺健二', rating: 4,
    comment: 'Great selection of trucks and fair prices. The delivery was fast and smooth.',
    comment_ja: 'トラックの品揃えが豊富で価格も適正。配送も迅速でスムーズでした。',
    created_at: '2024-06-20T00:00:00Z',
  },
];

export const fallbackSettings: Settings = {
  id: 's1',
  company_name: 'Nippon Auto',
  company_name_ja: 'ニッポンオート',
  address: '1-2-3 Chuo, Tokyo, Japan',
  phone: '+81-3-1234-5678',
  email: 'info@nipponauto.jp',
  line_url: 'https://line.me/ti/p/@nipponauto',
  facebook_url: 'https://facebook.com/nipponauto',
  instagram_url: 'https://instagram.com/nipponauto',
  twitter_url: 'https://twitter.com/nipponauto',
  business_hours: 'Mon-Sat: 9:00-18:00',
  business_hours_ja: '月-土: 9:00-18:00',
  logo_url: null,
  updated_at: '',
};

export const heroImage = 'https://images.pexels.com/photos/11053643/pexels-photo-11053643.jpeg?auto=compress&cs=tinysrgb&w=1920';
export const heroImage2 = 'https://images.pexels.com/photos/2348359/pexels-photo-2348359.jpeg?auto=compress&cs=tinysrgb&w=1920';
export const aboutImage = 'https://images.pexels.com/photos/24343234/pexels-photo-24343234.jpeg?auto=compress&cs=tinysrgb&w=1200';
