-- ─────────────────────────────────────────────────────────────
-- AIE Fashionz — Seed Data
-- 20 products, 6 categories
-- Prices in pence (GBP × 100). Images: Unsplash (stored as JSONB on products).
-- Updated: 2026-03-23
-- ─────────────────────────────────────────────────────────────

-- Clean slate (dev only)
TRUNCATE product_variants, products, categories RESTART IDENTITY CASCADE;

-- ─────────────────────────────────────────────────────────────
-- Categories
-- ─────────────────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, image_url) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'Luxury Fabrics',
  'luxury-fabrics',
  'Premium African and international fabrics including Aso-oke, Ankara, lace, and George fabric.',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=700&fit=crop&crop=center&q=90&auto=format'
),
(
  'c2000000-0000-0000-0000-000000000002',
  'Bags & Shoes',
  'bags-shoes',
  'Curated luxury handbags, heeled sandals, and clutch bags for the modern woman.',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&h=700&fit=crop&crop=center&q=90&auto=format'
),
(
  'c3000000-0000-0000-0000-000000000003',
  'Jewellery',
  'jewellery',
  'Exquisite gold and statement jewellery including necklaces, earrings, bracelets, and rings.',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=700&fit=crop&crop=center&q=90&auto=format'
),
(
  'c4000000-0000-0000-0000-000000000004',
  'Party & Dinner Wear',
  'party-dinner-wear',
  'Show-stopping occasion wear including sequin dresses, maxi gowns, two-piece sets, and beaded blouses.',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=700&fit=crop&crop=top&q=90&auto=format'
),
(
  'c5000000-0000-0000-0000-000000000005',
  'Children''s Wear',
  'childrens-wear',
  'Beautiful traditional and occasion wear for children, crafted with care for comfort and elegance.',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1600&h=700&fit=crop&crop=center&q=90&auto=format'
),
(
  'c6000000-0000-0000-0000-000000000006',
  'Body Shapers',
  'body-shapers',
  'Premium shapewear including waist trainers, full body shapers, and thigh slimmers.',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=700&fit=crop&crop=center&q=90&auto=format'
);

-- ─────────────────────────────────────────────────────────────
-- Products  (images stored as JSONB array on the row)
-- ─────────────────────────────────────────────────────────────

-- ── Luxury Fabrics ───────────────────────────────────────────
INSERT INTO products (id, category_slug, title, slug, description, base_price, compare_price, images, is_active) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'luxury-fabrics',
  'Premium Aso-Oke Woven Fabric',
  'premium-aso-oke-woven-fabric',
  'Handwoven Aso-oke fabric from Yoruba artisans in South-West Nigeria. Features intricate geometric patterns with gold-threaded accents. Perfect for Agbada, Iro and Buba, or traditional head-ties. Priced per metre.',
  3200, 3800,
  '[
    {"url":"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Handwoven Aso-oke fabric with gold thread accents","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Close-up of Aso-oke geometric weave detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Aso-oke fabric draped showing full pattern","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a1000000-0000-0000-0000-000000000002',
  'luxury-fabrics',
  'Vibrant Ankara Print Fabric',
  'vibrant-ankara-print-fabric',
  'High-quality Dutch wax Ankara print fabric with rich, fade-resistant colours. Ideal for dresses, skirts, head-wraps, and statement blouses. Bold African motifs that celebrate heritage and style. Sold per metre.',
  1800, 2200,
  '[
    {"url":"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Bold geometric Ankara print fabric in vibrant colours","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Ankara fabric close-up showing wax print detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Ankara fabric folded showing colour depth","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a1000000-0000-0000-0000-000000000003',
  'luxury-fabrics',
  'Embroidered Swiss Lace Fabric',
  'embroidered-swiss-lace-fabric',
  'Exquisite Swiss voile lace with delicate floral embroidery and stone detailing. A favourite for Nigerian owambe parties, weddings, and high-society events. Lightweight yet luxurious. Priced per metre.',
  4500, 5200,
  '[
    {"url":"https://images.unsplash.com/photo-1556905055-8f358a7a564f?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Embroidered Swiss lace fabric with floral motifs","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Swiss lace embroidery and stone detail close-up","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Lace fabric drape showing sheer texture","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a1000000-0000-0000-0000-000000000004',
  'luxury-fabrics',
  'Royal George Fabric',
  'royal-george-fabric',
  'Authentic George fabric from India, renowned across West Africa for its lustrous texture and vibrant print. A staple for Igbo traditional ceremonies and Delta State occasions. Priced per metre.',
  3800, NULL,
  '[
    {"url":"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Royal George fabric with lustrous metallic border","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"George fabric detail showing silk-cotton sheen","is_primary":false}
  ]'::jsonb,
  true
),

-- ── Bags & Shoes ─────────────────────────────────────────────
(
  'a2000000-0000-0000-0000-000000000001',
  'bags-shoes',
  'Structured Leather Tote Bag',
  'structured-leather-tote-bag',
  'A timeless luxury tote crafted from full-grain leather with gold-tone hardware. Spacious interior with suede lining, interior zip pocket, and magnetic snap closure.',
  16500, 19500,
  '[
    {"url":"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Structured full-grain leather tote bag","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Tote bag gold hardware and strap detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=900&fit=crop&crop=center&q=85&auto=format","alt":"Tote interior showing suede lining and pockets","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a2000000-0000-0000-0000-000000000002',
  'bags-shoes',
  'Gold Block Heeled Sandals',
  'gold-block-heeled-sandals',
  'Elegant block-heeled sandals with an ankle strap and cushioned footbed. The chunky gold heel adds height without sacrificing comfort. Pairs beautifully with lace and Ankara outfits.',
  8500, 10500,
  '[
    {"url":"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Gold block heeled sandals with ankle strap","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Heel detail and cushioned footbed","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=900&fit=crop&crop=bottom&q=85&auto=format","alt":"Gold sandals side profile showing block heel height","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a2000000-0000-0000-0000-000000000003',
  'bags-shoes',
  'Beaded Evening Clutch Bag',
  'beaded-evening-clutch-bag',
  'A handcrafted evening clutch adorned with intricate beadwork and a metallic chain strap. Perfect for weddings, dinners, and special occasions.',
  7500, 9000,
  '[
    {"url":"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Beaded evening clutch with gold chain strap","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1067&fit=crop&crop=center&q=85&auto=format","alt":"Clutch beadwork detail and magnetic closure","is_primary":false}
  ]'::jsonb,
  true
),

-- ── Jewellery ────────────────────────────────────────────────
(
  'a3000000-0000-0000-0000-000000000001',
  'jewellery',
  '18ct Gold Layered Necklace',
  '18ct-gold-layered-necklace',
  'A stunning three-layer gold necklace featuring a delicate herringbone chain, a dainty ball chain, and a pearl-drop pendant chain. Finished in 18ct gold plating. Adjustable 40–45cm. Includes a luxury gift pouch.',
  6500, 8000,
  '[
    {"url":"https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Three-layer 18ct gold necklace on marble surface","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Gold layered necklace worn at collarbone","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1629224316810-9d8805b95eb0?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Pearl-drop pendant and herringbone chain close-up","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a3000000-0000-0000-0000-000000000002',
  'jewellery',
  'Oversized Statement Earrings',
  'oversized-statement-earrings',
  'Bold, oversized drop earrings featuring geometric resin panels in warm tones with a gold-tone hardware frame. Lightweight despite their impressive size — designed for all-day wear.',
  3500, NULL,
  '[
    {"url":"https://images.unsplash.com/photo-1630327989742-d4e71b6e6e42?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Oversized geometric resin drop earrings in warm tones","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Statement earring detail showing resin panel and hardware","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a3000000-0000-0000-0000-000000000003',
  'jewellery',
  'Gold Bangle Bracelet Set',
  'gold-bangle-bracelet-set',
  'A set of five stackable gold bangles in varying widths. Individually or stacked, they create an effortlessly curated look. Presented in a signature AIE Fashionz gift box. Fits most wrist sizes.',
  4800, 5800,
  '[
    {"url":"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Set of five gold bangles stacked on wrist","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Gold bangle set individual pieces on marble","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1067&fit=crop&crop=center&q=85&auto=format","alt":"Bangle width variation from slim to cuff style","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a3000000-0000-0000-0000-000000000004',
  'jewellery',
  'Cubic Zirconia Cocktail Ring',
  'cubic-zirconia-cocktail-ring',
  'A glamorous cocktail ring featuring a large oval-cut cubic zirconia surrounded by a halo of micro-pavé stones. Set in 18ct gold-plated silver. Available UK sizes J–P. Comes in a gift box.',
  5500, 6500,
  '[
    {"url":"https://images.unsplash.com/photo-1629224316810-9d8805b95eb0?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Cubic zirconia cocktail ring catching the light","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Ring halo detail and pavé stone setting","is_primary":false}
  ]'::jsonb,
  true
),

-- ── Party & Dinner Wear ───────────────────────────────────────
(
  'a4000000-0000-0000-0000-000000000001',
  'party-dinner-wear',
  'Gold Sequin Midi Dress',
  'gold-sequin-midi-dress',
  'An eye-catching all-over sequin midi dress with a flattering V-neckline, adjustable spaghetti straps, and a subtle side split. The champagne-gold sequins catch and reflect light for maximum impact. Fully lined with a concealed back zip.',
  13500, 16500,
  '[
    {"url":"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Gold sequin midi dress full length front view","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1529634221870-f36f09b6a09e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Sequin dress V-neckline and spaghetti strap detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1566479179817-6de3af2b9a7f?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Champagne-gold sequin side split and hem detail","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a4000000-0000-0000-0000-000000000002',
  'party-dinner-wear',
  'Floral Chiffon Maxi Gown',
  'floral-chiffon-maxi-gown',
  'A sweeping floor-length maxi gown in fluid chiffon with a bold floral print. Features a wrap-style bodice with long flutter sleeves and a self-tie belt at the waist. Fully lined.',
  11500, 14000,
  '[
    {"url":"https://images.unsplash.com/photo-1566479179817-6de3af2b9a7f?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Floral chiffon maxi gown full length","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Chiffon flutter sleeve and wrap bodice detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1529634221870-f36f09b6a09e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Floral print and self-tie belt close-up","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a4000000-0000-0000-0000-000000000003',
  'party-dinner-wear',
  'Ankara Two-Piece Co-ord Set',
  'ankara-two-piece-co-ord-set',
  'A bold and vibrant Ankara print two-piece set consisting of a cropped fitted blazer and wide-leg palazzo trousers. Statement-making at any owambe, birthday party, or cultural event.',
  9500, 11500,
  '[
    {"url":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Ankara two-piece blazer and palazzo trouser set","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Ankara cropped blazer lapel and print detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1566479179817-6de3af2b9a7f?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Wide-leg palazzo trousers drape and fit","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a4000000-0000-0000-0000-000000000004',
  'party-dinner-wear',
  'Beaded Lace Blouse',
  'beaded-lace-blouse',
  'A luxurious lace blouse featuring hand-applied bead embellishment across the neckline and cuffs. Balloon sleeves add drama while the relaxed silhouette ensures comfort. A timeless piece for owambe occasions.',
  8500, NULL,
  '[
    {"url":"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Beaded lace blouse with balloon sleeves","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1529634221870-f36f09b6a09e?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Bead embellishment on neckline and cuff detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Lace blouse full length showing relaxed silhouette","is_primary":false}
  ]'::jsonb,
  true
),

-- ── Children''s Wear ──────────────────────────────────────────
(
  'a5000000-0000-0000-0000-000000000001',
  'childrens-wear',
  'Children''s Traditional Outfit Set',
  'childrens-traditional-outfit-set',
  'A beautifully crafted children''s traditional outfit set including an Ankara top, matching trousers, and a cap for boys or matching headband for girls. Perfect for naming ceremonies, weddings, and cultural events. Available in sizes 2–10 years.',
  3800, 4500,
  '[
    {"url":"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Children''s Ankara traditional outfit set","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Traditional outfit fabric and embellishment detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=900&fit=crop&crop=center&q=85&auto=format","alt":"Matching cap and headband accessory close-up","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a5000000-0000-0000-0000-000000000002',
  'childrens-wear',
  'Girls Birthday Party Dress',
  'girls-birthday-party-dress',
  'A show-stopping birthday party dress for girls featuring a tulle skirt with glitter overlay, a fitted bodice with rosette detail, and a satin sash bow at the back. Available in sizes 2–10 years.',
  5500, 6500,
  '[
    {"url":"https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Girls birthday party dress with tulle skirt","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Tulle skirt layers and rosette bodice detail","is_primary":false}
  ]'::jsonb,
  true
),

-- ── Body Shapers ─────────────────────────────────────────────
(
  'a6000000-0000-0000-0000-000000000001',
  'body-shapers',
  'Premium Latex Waist Trainer',
  'premium-latex-waist-trainer',
  'A professional-grade latex waist trainer with triple-row hook-and-eye closure for a customisable fit. Features steel boning for posture support and a soft cotton lining for all-day comfort.',
  3500, 4200,
  '[
    {"url":"https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Premium latex waist trainer front view","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Waist trainer triple-row hook-and-eye closure detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=800&h=900&fit=crop&crop=center&q=85&auto=format","alt":"Steel boning and cotton lining interior detail","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a6000000-0000-0000-0000-000000000002',
  'body-shapers',
  'Full Body Shaper Bodysuit',
  'full-body-shaper-bodysuit',
  'A seamless full body shaper offering targeted compression across the abdomen, waist, hips, and thighs. Open-bust design, open-gusset crotch. Virtually invisible under clothing. Suitable for postpartum wear.',
  4800, 5800,
  '[
    {"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Full body shaper bodysuit open-bust design","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Seamless compression knit fabric detail","is_primary":false},
    {"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=900&fit=crop&crop=center&q=85&auto=format","alt":"Body shaper side profile showing compression zones","is_primary":false}
  ]'::jsonb,
  true
),
(
  'a6000000-0000-0000-0000-000000000003',
  'body-shapers',
  'High-Waist Thigh Slimmer Shorts',
  'high-waist-thigh-slimmer-shorts',
  'Mid-thigh shaper shorts with a high-rise waistband that smooths the tummy and sculpts the hips. Anti-roll silicone hem keeps the garment in place. Breathable, machine washable.',
  2800, NULL,
  '[
    {"url":"https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"High-waist thigh slimmer shorts front view","is_primary":true},
    {"url":"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=1067&fit=crop&crop=top&q=85&auto=format","alt":"Anti-roll silicone hem and high-rise waistband detail","is_primary":false}
  ]'::jsonb,
  true
);

-- ─────────────────────────────────────────────────────────────
-- Product Variants
-- ─────────────────────────────────────────────────────────────

-- ── Luxury Fabrics ───────────────────────────────────────────
INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a1000000-0000-0000-0000-000000000001', '1m', 'Navy & Gold',     25, 0),
('a1000000-0000-0000-0000-000000000001', '2m', 'Navy & Gold',     15, 3200),
('a1000000-0000-0000-0000-000000000001', '5m', 'Navy & Gold',      8, 12800),
('a1000000-0000-0000-0000-000000000001', '1m', 'Burgundy & Gold', 20, 0),
('a1000000-0000-0000-0000-000000000001', '2m', 'Burgundy & Gold', 12, 3200);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a1000000-0000-0000-0000-000000000002', '1m', 'Blue & Orange', 40, 0),
('a1000000-0000-0000-0000-000000000002', '2m', 'Blue & Orange', 25, 1800),
('a1000000-0000-0000-0000-000000000002', '5m', 'Blue & Orange', 15, 7200),
('a1000000-0000-0000-0000-000000000002', '1m', 'Red & Black',   35, 0),
('a1000000-0000-0000-0000-000000000002', '2m', 'Red & Black',   20, 1800);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a1000000-0000-0000-0000-000000000003', '1m', 'Ivory & Gold', 18, 0),
('a1000000-0000-0000-0000-000000000003', '2m', 'Ivory & Gold', 10, 4500),
('a1000000-0000-0000-0000-000000000003', '1m', 'Champagne',    15, 0),
('a1000000-0000-0000-0000-000000000003', '2m', 'Champagne',     8, 4500);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a1000000-0000-0000-0000-000000000004', '1m', 'Royal Blue & Gold', 20, 0),
('a1000000-0000-0000-0000-000000000004', '2m', 'Royal Blue & Gold', 12, 3800),
('a1000000-0000-0000-0000-000000000004', '5m', 'Royal Blue & Gold',  6, 15200),
('a1000000-0000-0000-0000-000000000004', '1m', 'Emerald & Gold',    18, 0),
('a1000000-0000-0000-0000-000000000004', '2m', 'Emerald & Gold',    10, 3800);

-- ── Bags & Shoes ─────────────────────────────────────────────
INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a2000000-0000-0000-0000-000000000001', 'One Size', 'Black',    12, 0),
('a2000000-0000-0000-0000-000000000001', 'One Size', 'Tan',      10, 0),
('a2000000-0000-0000-0000-000000000001', 'One Size', 'Burgundy',  7, 0),
('a2000000-0000-0000-0000-000000000001', 'One Size', 'Navy',      6, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a2000000-0000-0000-0000-000000000002', 'UK 3', 'Gold',  8, 0),
('a2000000-0000-0000-0000-000000000002', 'UK 4', 'Gold', 12, 0),
('a2000000-0000-0000-0000-000000000002', 'UK 5', 'Gold', 15, 0),
('a2000000-0000-0000-0000-000000000002', 'UK 6', 'Gold', 14, 0),
('a2000000-0000-0000-0000-000000000002', 'UK 7', 'Gold', 10, 0),
('a2000000-0000-0000-0000-000000000002', 'UK 8', 'Gold',  6, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a2000000-0000-0000-0000-000000000003', 'One Size', 'Gold & Ivory',  14, 0),
('a2000000-0000-0000-0000-000000000003', 'One Size', 'Black & Gold',  12, 0),
('a2000000-0000-0000-0000-000000000003', 'One Size', 'Rose & Silver',  8, 0);

-- ── Jewellery ────────────────────────────────────────────────
INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a3000000-0000-0000-0000-000000000001', '40cm', 'Yellow Gold', 20, 0),
('a3000000-0000-0000-0000-000000000001', '45cm', 'Yellow Gold', 18, 0),
('a3000000-0000-0000-0000-000000000001', '40cm', 'Rose Gold',   15, 0),
('a3000000-0000-0000-0000-000000000001', '45cm', 'Rose Gold',   12, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a3000000-0000-0000-0000-000000000002', 'One Size', 'Amber & Gold',   22, 0),
('a3000000-0000-0000-0000-000000000002', 'One Size', 'Emerald & Gold', 18, 0),
('a3000000-0000-0000-0000-000000000002', 'One Size', 'Black & Gold',   20, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a3000000-0000-0000-0000-000000000003', 'S',        'Yellow Gold', 16, 0),
('a3000000-0000-0000-0000-000000000003', 'M',        'Yellow Gold', 20, 0),
('a3000000-0000-0000-0000-000000000003', 'L',        'Yellow Gold', 14, 0),
('a3000000-0000-0000-0000-000000000003', 'One Size', 'Rose Gold',   18, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a3000000-0000-0000-0000-000000000004', 'J', 'Yellow Gold', 10, 0),
('a3000000-0000-0000-0000-000000000004', 'L', 'Yellow Gold', 12, 0),
('a3000000-0000-0000-0000-000000000004', 'N', 'Yellow Gold', 14, 0),
('a3000000-0000-0000-0000-000000000004', 'P', 'Yellow Gold', 10, 0);

-- ── Party & Dinner Wear ───────────────────────────────────────
INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a4000000-0000-0000-0000-000000000001', 'UK 6',  'Champagne Gold',  8, 0),
('a4000000-0000-0000-0000-000000000001', 'UK 8',  'Champagne Gold', 12, 0),
('a4000000-0000-0000-0000-000000000001', 'UK 10', 'Champagne Gold', 15, 0),
('a4000000-0000-0000-0000-000000000001', 'UK 12', 'Champagne Gold', 14, 0),
('a4000000-0000-0000-0000-000000000001', 'UK 14', 'Champagne Gold', 10, 0),
('a4000000-0000-0000-0000-000000000001', 'UK 16', 'Champagne Gold',  8, 0),
('a4000000-0000-0000-0000-000000000001', 'UK 18', 'Champagne Gold',  6, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a4000000-0000-0000-0000-000000000002', 'UK 8',  'Blue Floral', 10, 0),
('a4000000-0000-0000-0000-000000000002', 'UK 10', 'Blue Floral', 14, 0),
('a4000000-0000-0000-0000-000000000002', 'UK 12', 'Blue Floral', 16, 0),
('a4000000-0000-0000-0000-000000000002', 'UK 14', 'Blue Floral', 12, 0),
('a4000000-0000-0000-0000-000000000002', 'UK 16', 'Blue Floral',  8, 0),
('a4000000-0000-0000-0000-000000000002', 'UK 18', 'Blue Floral',  6, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a4000000-0000-0000-0000-000000000003', 'UK 8',  'Multicolour Ankara',  8, 0),
('a4000000-0000-0000-0000-000000000003', 'UK 10', 'Multicolour Ankara', 12, 0),
('a4000000-0000-0000-0000-000000000003', 'UK 12', 'Multicolour Ankara', 14, 0),
('a4000000-0000-0000-0000-000000000003', 'UK 14', 'Multicolour Ankara', 10, 0),
('a4000000-0000-0000-0000-000000000003', 'UK 16', 'Multicolour Ankara',  8, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a4000000-0000-0000-0000-000000000004', 'UK 8',  'Ivory',     10, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 10', 'Ivory',     14, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 12', 'Ivory',     16, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 14', 'Ivory',     12, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 16', 'Ivory',      8, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 10', 'Champagne', 12, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 12', 'Champagne', 14, 0),
('a4000000-0000-0000-0000-000000000004', 'UK 14', 'Champagne', 10, 0);

-- ── Children's Wear ───────────────────────────────────────────
INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a5000000-0000-0000-0000-000000000001', '2-3 Years', 'Blue & Gold', 10, 0),
('a5000000-0000-0000-0000-000000000001', '4-5 Years', 'Blue & Gold', 12, 0),
('a5000000-0000-0000-0000-000000000001', '6-7 Years', 'Blue & Gold', 10, 0),
('a5000000-0000-0000-0000-000000000001', '8-9 Years', 'Blue & Gold',  8, 0),
('a5000000-0000-0000-0000-000000000001', '2-3 Years', 'Red & Gold',   8, 0),
('a5000000-0000-0000-0000-000000000001', '4-5 Years', 'Red & Gold',  10, 0),
('a5000000-0000-0000-0000-000000000001', '6-7 Years', 'Red & Gold',   8, 0),
('a5000000-0000-0000-0000-000000000001', '8-9 Years', 'Red & Gold',   6, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a5000000-0000-0000-0000-000000000002', '2-3 Years', 'Pink',  12, 0),
('a5000000-0000-0000-0000-000000000002', '4-5 Years', 'Pink',  14, 0),
('a5000000-0000-0000-0000-000000000002', '6-7 Years', 'Pink',  12, 0),
('a5000000-0000-0000-0000-000000000002', '8-9 Years', 'Pink',  10, 0),
('a5000000-0000-0000-0000-000000000002', '2-3 Years', 'Lilac',  8, 0),
('a5000000-0000-0000-0000-000000000002', '4-5 Years', 'Lilac', 10, 0),
('a5000000-0000-0000-0000-000000000002', '6-7 Years', 'Lilac',  8, 0);

-- ── Body Shapers ─────────────────────────────────────────────
INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a6000000-0000-0000-0000-000000000001', 'XS',  'Black', 15, 0),
('a6000000-0000-0000-0000-000000000001', 'S',   'Black', 20, 0),
('a6000000-0000-0000-0000-000000000001', 'M',   'Black', 22, 0),
('a6000000-0000-0000-0000-000000000001', 'L',   'Black', 18, 0),
('a6000000-0000-0000-0000-000000000001', 'XL',  'Black', 12, 0),
('a6000000-0000-0000-0000-000000000001', 'XXL', 'Black',  8, 0),
('a6000000-0000-0000-0000-000000000001', 'S',   'Nude',  12, 0),
('a6000000-0000-0000-0000-000000000001', 'M',   'Nude',  15, 0),
('a6000000-0000-0000-0000-000000000001', 'L',   'Nude',  10, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a6000000-0000-0000-0000-000000000002', 'XS',  'Nude',  15, 0),
('a6000000-0000-0000-0000-000000000002', 'S',   'Nude',  20, 0),
('a6000000-0000-0000-0000-000000000002', 'M',   'Nude',  25, 0),
('a6000000-0000-0000-0000-000000000002', 'L',   'Nude',  20, 0),
('a6000000-0000-0000-0000-000000000002', 'XL',  'Nude',  14, 0),
('a6000000-0000-0000-0000-000000000002', 'XXL', 'Nude',   8, 0),
('a6000000-0000-0000-0000-000000000002', 'S',   'Black', 18, 0),
('a6000000-0000-0000-0000-000000000002', 'M',   'Black', 22, 0),
('a6000000-0000-0000-0000-000000000002', 'L',   'Black', 16, 0);

INSERT INTO product_variants (product_id, size, colour, stock_quantity, additional_price) VALUES
('a6000000-0000-0000-0000-000000000003', 'XS',  'Nude',  12, 0),
('a6000000-0000-0000-0000-000000000003', 'S',   'Nude',  18, 0),
('a6000000-0000-0000-0000-000000000003', 'M',   'Nude',  22, 0),
('a6000000-0000-0000-0000-000000000003', 'L',   'Nude',  18, 0),
('a6000000-0000-0000-0000-000000000003', 'XL',  'Nude',  12, 0),
('a6000000-0000-0000-0000-000000000003', 'S',   'Black', 15, 0),
('a6000000-0000-0000-0000-000000000003', 'M',   'Black', 20, 0),
('a6000000-0000-0000-0000-000000000003', 'L',   'Black', 15, 0);
