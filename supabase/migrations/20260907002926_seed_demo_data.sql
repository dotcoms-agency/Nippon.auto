/*
# Seed Demo Data for Nippon Auto

## Summary
Populates the newly created schema with realistic demo data so the website
and admin panel display content immediately.

## Data Inserted
1. **7 brands** — Hino, Isuzu, Mitsubishi Fuso, Nissan Diesel, Toyota, Mazda, Suzuki
2. **8 trucks** — full inventory with images, specs, features, varied statuses
3. **3 testimonials** — customer reviews with ratings
4. **1 settings row** — default company contact info
5. **site_visits** — 9 days of visitor history for dashboard chart

All truck images use real Pexels stock photo URLs.
*/

-- ============================================================
-- 1. BRANDS
-- ============================================================
INSERT INTO brands (id, name, name_ja, country) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Hino', '日野', 'Japan'),
  ('a1000000-0000-0000-0000-000000000002', 'Isuzu', 'いすゞ', 'Japan'),
  ('a1000000-0000-0000-0000-000000000003', 'Mitsubishi Fuso', '三菱ふそう', 'Japan'),
  ('a1000000-0000-0000-0000-000000000004', 'Nissan Diesel', '日産ディーゼル', 'Japan'),
  ('a1000000-0000-0000-0000-000000000005', 'Toyota', 'トヨタ', 'Japan'),
  ('a1000000-0000-0000-0000-000000000006', 'Mazda', 'マツダ', 'Japan'),
  ('a1000000-0000-0000-0000-000000000007', 'Suzuki', 'スズキ', 'Japan')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. TRUCKS
-- ============================================================
INSERT INTO trucks (id, brand_id, model, year, price, mileage, transmission, fuel, body_type, engine_cc, color, image_urls, features, condition_notes, description, description_ja, is_featured, status, is_sold, views, specifications) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Profia 480hl', 2019, 4800000, 185000, 'Manual', 'Diesel', 'Tractor Head', 12071, 'White',
    ARRAY['https://images.pexels.com/photos/18468424/pexels-photo-18468424.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/18468412/pexels-photo-18468412.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Air Suspension','Retarder','Power Window','Cold AC','ABS','Tire Pressure Monitor'],
    'Excellent condition. Fully serviced. No accident history.',
    'The Hino Profia is a heavy-duty truck known for durability and fuel efficiency. This 480hl model features a powerful 12L engine and comfortable cabin.',
    '日野プロフィアは耐久性と燃費に優れた大型トラックです。この480hlモデルは強力な12Lエンジンと快適なキャビンを備えています。',
    true, 'available', false, 247,
    '{"Engine":"12.0L Turbo Diesel","Output":"480 PS","Torque":"2,157 Nm","Wheelbase":"3,200mm","GVW":"20,000kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    'Giga CYZ 610', 2018, 3500000, 220000, 'Manual', 'Diesel', 'Flatbed', 9839, 'Blue',
    ARRAY['https://images.pexels.com/photos/37753989/pexels-photo-37753989.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/27508769/pexels-photo-27508769.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Hydraulic Lift','Side Guards','Power Steering','Cold AC','Air Brakes'],
    'Well maintained. Regular service records available.',
    'The Isuzu Giga is a heavy-duty truck built for long-haul transport. The CYZ 610 model offers excellent reliability and low operating costs.',
    'いすゞギガは長距離輸送に向けた大型トラックです。CYZ 610モデルは優れた信頼性と低ランニングコストを提供します。',
    true, 'available', false, 183,
    '{"Engine":"9.8L Turbo Diesel","Output":"350 PS","Torque":"1,520 Nm","Wheelbase":"4,500mm","GVW":"17,000kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    'Fighter FK617', 2020, 2800000, 95000, 'Automatic', 'Diesel', 'Box Truck', 7960, 'Red',
    ARRAY['https://images.pexels.com/photos/14283065/pexels-photo-14283065.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/6563903/pexels-photo-6563903.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Box Body','Roll-Up Door','Power Window','Cold AC','Backup Camera','ABS'],
    'Like new condition. Only 95,000km. Factory warranty remaining.',
    'The Mitsubishi Fuso Fighter is a versatile medium-duty truck perfect for urban delivery. This FK617 model features an automatic transmission for easy operation.',
    '三菱ふそうファイターは都市配送に最適な多用途中型トラックです。このFK617モデルは操作を容易にするオートマチックトランスミッションを備えています。',
    true, 'available', false, 312,
    '{"Engine":"8.0L Turbo Diesel","Output":"210 PS","Torque":"686 Nm","Wheelbase":"3,700mm","GVW":"10,000kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000004',
    'Quon CW6D460', 2017, 2500000, 310000, 'Manual', 'Diesel', 'Tractor Head', 12825, 'White',
    ARRAY['https://images.pexels.com/photos/34875545/pexels-photo-34875545.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Air Suspension','Retarder','Heated Seats','Power Window','Cold AC'],
    'Good condition. High mileage but regularly serviced. Ready for work.',
    'The Nissan Diesel Quon is a heavy-duty truck with a reputation for comfort and performance. The CW6D460 model is ideal for long-distance logistics.',
    '日産ディーゼルクオンは快適性と性能で定評のある大型トラックです。CW6D460モデルは長距離物流に最適です。',
    false, 'reserved', false, 156,
    '{"Engine":"12.8L Turbo Diesel","Output":"460 PS","Torque":"2,200 Nm","Wheelbase":"3,300mm","GVW":"22,000kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000005',
    'Dyna 150', 2021, 1800000, 42000, 'Automatic', 'Diesel', 'Flatbed', 2498, 'White',
    ARRAY['https://images.pexels.com/photos/11040957/pexels-photo-11040957.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/6940962/pexels-photo-6940962.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Flatbed','Drop Side','Power Steering','Cold AC','Backup Camera','Bluetooth'],
    'Excellent condition. Nearly new. Low mileage.',
    'The Toyota Dyna is a reliable light-duty truck popular for last-mile delivery. This 150 model offers excellent fuel economy and maneuverability.',
    'トヨタダイナはラストマイル配送に人気の信頼性の高い小型トラックです。この150モデルは優れた燃費と機動性を提供します。',
    true, 'available', false, 421,
    '{"Engine":"2.5L Turbo Diesel","Output":"100 PS","Torque":"300 Nm","Wheelbase":"2,500mm","GVW":"3,500kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000006',
    'Titan DX', 2016, 1500000, 280000, 'Manual', 'Diesel', 'Dump Truck', 4798, 'Yellow',
    ARRAY['https://images.pexels.com/photos/37124290/pexels-photo-37124290.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Dump Body','Hydraulic Lift','Power Steering','Cold AC','Heavy Duty Tires'],
    'Fair condition. Some cosmetic wear. Mechanically sound.',
    'The Mazda Titan is a sturdy medium-duty truck. This DX dump model is well-suited for construction site work and material transport.',
    'マツダタイタンは堅牢な中型トラックです。このDXダンプモデルは建設現場の作業や資材運搬に適しています。',
    false, 'available', false, 98,
    '{"Engine":"4.8L Turbo Diesel","Output":"150 PS","Torque":"490 Nm","Wheelbase":"3,100mm","GVW":"7,500kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'a1000000-0000-0000-0000-000000000002',
    'Elf NLR 610', 2019, 1200000, 145000, 'Manual', 'Diesel', 'Refrigerated Van', 2999, 'White',
    ARRAY['https://images.pexels.com/photos/38869179/pexels-photo-38869179.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/7363099/pexels-photo-7363099.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Refrigeration Unit','Insulated Box','Power Steering','Cold AC','Temperature Control'],
    'Good condition. Refrigeration unit recently serviced.',
    'The Isuzu Elf is a light-duty truck known worldwide for reliability. This NLR 610 refrigerated model is perfect for cold-chain logistics.',
    'いすゞエルフは世界的に信頼性で知られる小型トラックです。このNLR 610冷凍モデルはコールドチェーン物流に最適です。',
    true, 'sold', true, 289,
    '{"Engine":"3.0L Turbo Diesel","Output":"130 PS","Torque":"375 Nm","Wheelbase":"2,800mm","GVW":"4,500kg"}'
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'a1000000-0000-0000-0000-000000000003',
    'Canter FE647', 2020, 2200000, 67000, 'Manual', 'Diesel', 'Box Truck', 5193, 'White',
    ARRAY['https://images.pexels.com/photos/15084344/pexels-photo-15084344.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/9115461/pexels-photo-9115461.jpeg?auto=compress&cs=tinysrgb&w=800'],
    ARRAY['Box Body','Roll-Up Door','Power Window','Cold AC','Side Mirror Heating','ABS'],
    'Excellent condition. Low mileage. One owner.',
    'The Mitsubishi Fuso Canter is a global best-seller in the light-duty segment. This FE647 model combines efficiency with practical cargo space.',
    '三菱ふそうキャンターは小型トラック分野で世界的ベストセラーです。このFE647モデルは効率性と実用的な荷室を兼ね備えています。',
    false, 'available', false, 175,
    '{"Engine":"5.2L Turbo Diesel","Output":"175 PS","Torque":"520 Nm","Wheelbase":"3,400mm","GVW":"7,300kg"}'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (name, name_ja, rating, comment, comment_ja) VALUES
  ('Takeshi Yamamoto', '山本武', 5,
   'I purchased a Hino Profia from Nippon Auto and the entire process was smooth and professional. The truck has been running perfectly for over a year now.',
   'ニッポンオートで日野プロフィアを購入しました。プロセス全体がスムーズで専門的でした。トラックは1年以上完璧に稼働しています。'),
  ('Sarah Chen', 'チェン・サラ', 5,
   'Excellent service and quality trucks. The team helped me find the perfect Isuzu Elf for my delivery business. Highly recommended!',
   '素晴らしいサービスと高品質なトラック。配送業務に最適ないすゞエルフを見つけるのを手伝ってくれました。強くお勧めします！'),
  ('Michael OBrien', 'マイケル・オブライエン', 4,
   'Good selection of commercial trucks. Fair pricing and transparent condition reports. Will buy again.',
   '商用トラックの品揃えが豊富。適正な価格と透明な状態報告。また購入したいです。')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. SETTINGS
-- ============================================================
INSERT INTO settings (company_name, company_name_ja, address, phone, email, line_url, business_hours, business_hours_ja)
VALUES (
  'Nippon Auto',
  'ニッポンオート',
  '2-1-1 Haneda, Ota-ku, Tokyo, Japan',
  '+81-3-1234-5678',
  'info@nipponauto.jp',
  'https://line.me/ti/p/@nipponauto',
  'Mon-Sat: 9:00-18:00, Sun: Closed',
  '月-土: 9:00-18:00、日: 定休日'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. SITE VISITS (9 days of history for dashboard chart)
-- ============================================================
INSERT INTO site_visits (visit_date, unique_visitors, total_page_views, truck_detail_views) VALUES
  (CURRENT_DATE - INTERVAL '8 days', 45, 120, 32),
  (CURRENT_DATE - INTERVAL '7 days', 52, 135, 38),
  (CURRENT_DATE - INTERVAL '6 days', 38, 98, 25),
  (CURRENT_DATE - INTERVAL '5 days', 67, 180, 51),
  (CURRENT_DATE - INTERVAL '4 days', 71, 195, 55),
  (CURRENT_DATE - INTERVAL '3 days', 58, 152, 42),
  (CURRENT_DATE - INTERVAL '2 days', 82, 210, 68),
  (CURRENT_DATE - INTERVAL '1 day', 95, 245, 79),
  (CURRENT_DATE, 63, 178, 54)
ON CONFLICT (visit_date) DO NOTHING;
