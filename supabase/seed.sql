-- ─────────────────────────────────────────────────────────────
-- AIE Fashionz — Seed Data
-- 20 products, 6 categories
-- Prices in pence (GBP). Images: Cloudinary.
-- Generated: 2026-03-23
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
  'Premium African and international fabrics including Aso-oke, Ankara, lace, and George fabric, hand-selected for quality and craftsmanship.',
  'https://res.cloudinary.com/aiefashionz/image/upload/v1/categories/luxury-fabrics/cover.jpg'
),
(
  'c2000000-0000-0000-0000-000000000002',
  'Bags & Shoes',
  'bags-shoes',
  'Curated luxury handbags, heeled sandals, and clutch bags for the modern woman who demands style and quality.',
  'https://res.cloudinary.com/aiefashionz/image/upload/v1/categories/bags-shoes/cover.jpg'
),
(
  'c3000000-0000-0000-0000-000000000003',
  'Jewellery',
  'jewellery',
  'Exquisite gold and statement jewellery including necklaces, earrings, bracelets, and rings crafted for luxury occasions.',
  'https://res.cloudinary.com/aiefashionz/image/upload/v1/categories/jewellery/cover.jpg'
),
(
  'c4000000-0000-0000-0000-000000000004',
  'Party & Dinner Wear',
  'party-dinner-wear',
  'Show-stopping occasion wear including sequin dresses, maxi gowns, two-piece sets, and beaded blouses for every celebration.',
  'https://res.cloudinary.com/aiefashionz/image/upload/v1/categories/party-dinner-wear/cover.jpg'
),
(
  'c5000000-0000-0000-0000-000000000005',
  'Children''s Wear',
  'childrens-wear',
  'Beautiful traditional and occasion wear for children, crafted with care for comfort and elegance.',
  'https://res.cloudinary.com/aiefashionz/image/upload/v1/categories/childrens-wear/cover.jpg'
),
(
  'c6000000-0000-0000-0000-000000000006',
  'Body Shapers',
  'body-shapers',
  'Premium shapewear including waist trainers, full body shapers, and thigh slimmers designed for comfort and confidence.',
  'https://res.cloudinary.com/aiefashionz/image/upload/v1/categories/body-shapers/cover.jpg'
);

-- ─────────────────────────────────────────────────────────────
-- Products
-- ─────────────────────────────────────────────────────────────

-- ── Luxury Fabrics (4 products) ──────────────────────────────
INSERT INTO products (id, category_id, title, slug, description, materials, base_price, compare_price, images, is_published) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'Premium Aso-Oke Woven Fabric',
  'premium-aso-oke-woven-fabric',
  'Handwoven Aso-oke fabric from Yoruba artisans in South-West Nigeria. Features intricate geometric patterns with gold-threaded accents. Perfect for Agbada, Iro and Buba, or traditional head-ties. Each metre is individually inspected for quality. Priced per metre.',
  'Handwoven cotton and silk blend with metallic gold thread',
  3200,
  3800,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/premium-aso-oke-woven-fabric/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/premium-aso-oke-woven-fabric/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/premium-aso-oke-woven-fabric/detail-2.jpg'
  ],
  true
),
(
  'p1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000001',
  'Vibrant Ankara Print Fabric',
  'vibrant-ankara-print-fabric',
  'High-quality Dutch wax Ankara print fabric with rich, fade-resistant colours. Ideal for dresses, skirts, head-wraps, and statement blouses. Bold African motifs that celebrate heritage and style. Sold per metre.',
  '100% cotton Dutch wax print',
  1800,
  2200,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/vibrant-ankara-print-fabric/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/vibrant-ankara-print-fabric/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/vibrant-ankara-print-fabric/detail-2.jpg'
  ],
  true
),
(
  'p1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000001',
  'Embroidered Swiss Lace Fabric',
  'embroidered-swiss-lace-fabric',
  'Exquisite Swiss voile lace with delicate floral embroidery and stone detailing. A favourite for Nigerian owambe parties, weddings, and high-society events. Lightweight yet luxurious, this fabric drapes beautifully. Priced per metre.',
  'Swiss voile lace with polyester embroidery and rhinestone detailing',
  4500,
  5200,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/embroidered-swiss-lace-fabric/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/embroidered-swiss-lace-fabric/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/embroidered-swiss-lace-fabric/detail-2.jpg'
  ],
  true
),
(
  'p1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000001',
  'Royal George Fabric',
  'royal-george-fabric',
  'Authentic George fabric from India, renowned across West Africa for its lustrous texture and vibrant print. A staple for Igbo traditional ceremonies and Delta State occasions. Typically sold in 5-yard wrappers. Priced per metre.',
  'Pure silk-cotton George with hand-applied metallic border print',
  3800,
  NULL,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/royal-george-fabric/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/luxury-fabrics/royal-george-fabric/detail-1.jpg'
  ],
  true
),

-- ── Bags & Shoes (3 products) ────────────────────────────────
(
  'p2000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000002',
  'Structured Leather Tote Bag',
  'structured-leather-tote-bag',
  'A timeless luxury tote crafted from full-grain leather with gold-tone hardware. Features a spacious interior with suede lining, interior zip pocket, and magnetic snap closure. The ideal everyday luxury piece that transitions seamlessly from work to evening.',
  'Full-grain calf leather, suede lining, brass hardware',
  16500,
  19500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/structured-leather-tote-bag/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/structured-leather-tote-bag/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/structured-leather-tote-bag/detail-2.jpg'
  ],
  true
),
(
  'p2000000-0000-0000-0000-000000000002',
  'c2000000-0000-0000-0000-000000000002',
  'Gold Block Heeled Sandals',
  'gold-block-heeled-sandals',
  'Elegant block-heeled sandals with an ankle strap and cushioned footbed. The chunky gold heel adds height without sacrificing comfort, making these perfect for long celebrations and events. Pairs beautifully with lace and Ankara outfits.',
  'Faux suede upper, synthetic lining, 8cm block heel',
  8500,
  10500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/gold-block-heeled-sandals/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/gold-block-heeled-sandals/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/gold-block-heeled-sandals/detail-2.jpg'
  ],
  true
),
(
  'p2000000-0000-0000-0000-000000000003',
  'c2000000-0000-0000-0000-000000000002',
  'Beaded Evening Clutch Bag',
  'beaded-evening-clutch-bag',
  'A handcrafted evening clutch adorned with intricate beadwork and a metallic chain strap. Large enough for your essentials, beautiful enough to be an accessory in itself. Perfect for weddings, dinners, and special occasions.',
  'Velvet base with hand-stitched glass beads, gold chain strap',
  7500,
  9000,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/beaded-evening-clutch-bag/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/bags-shoes/beaded-evening-clutch-bag/detail-1.jpg'
  ],
  true
),

-- ── Jewellery (4 products) ───────────────────────────────────
(
  'p3000000-0000-0000-0000-000000000001',
  'c3000000-0000-0000-0000-000000000003',
  '18ct Gold Layered Necklace',
  '18ct-gold-layered-necklace',
  'A stunning three-layer gold necklace featuring a delicate herringbone chain, a dainty ball chain, and a pearl-drop pendant chain. Finished in 18ct gold plating for lasting lustre. Adjustable length 40–45cm. Includes a luxury gift pouch.',
  '18ct gold-plated brass, freshwater pearl pendant',
  6500,
  8000,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/18ct-gold-layered-necklace/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/18ct-gold-layered-necklace/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/18ct-gold-layered-necklace/detail-2.jpg'
  ],
  true
),
(
  'p3000000-0000-0000-0000-000000000002',
  'c3000000-0000-0000-0000-000000000003',
  'Oversized Statement Earrings',
  'oversized-statement-earrings',
  'Bold, oversized drop earrings featuring geometric resin panels in warm tones with a gold-tone hardware frame. Lightweight despite their impressive size, these are designed for all-day wear. A statement piece that elevates any outfit instantly.',
  'Acetate resin panels, gold-tone zinc alloy hardware',
  3500,
  NULL,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/oversized-statement-earrings/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/oversized-statement-earrings/detail-1.jpg'
  ],
  true
),
(
  'p3000000-0000-0000-0000-000000000003',
  'c3000000-0000-0000-0000-000000000003',
  'Gold Bangle Bracelet Set',
  'gold-bangle-bracelet-set',
  'A set of five stackable gold bangles in varying widths — from a slim midi ring to a bold cuff style. Individually or stacked, they create an effortlessly curated look. Presented in a signature AIE Fashionz gift box. Fits most wrist sizes.',
  '18ct gold-plated brass, hypoallergenic',
  4800,
  5800,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/gold-bangle-bracelet-set/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/gold-bangle-bracelet-set/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/gold-bangle-bracelet-set/detail-2.jpg'
  ],
  true
),
(
  'p3000000-0000-0000-0000-000000000004',
  'c3000000-0000-0000-0000-000000000003',
  'Cubic Zirconia Cocktail Ring',
  'cubic-zirconia-cocktail-ring',
  'A glamorous cocktail ring featuring a large oval-cut cubic zirconia stone surrounded by a halo of micro-pavé stones. Set in 18ct gold-plated silver, this ring catches the light beautifully. Available in UK ring sizes J through P. Comes in a gift box.',
  '18ct gold-plated 925 sterling silver, cubic zirconia',
  5500,
  6500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/cubic-zirconia-cocktail-ring/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/jewellery/cubic-zirconia-cocktail-ring/detail-1.jpg'
  ],
  true
),

-- ── Party & Dinner Wear (4 products) ────────────────────────
(
  'p4000000-0000-0000-0000-000000000001',
  'c4000000-0000-0000-0000-000000000004',
  'Gold Sequin Midi Dress',
  'gold-sequin-midi-dress',
  'An eye-catching all-over sequin midi dress with a flattering V-neckline, adjustable spaghetti straps, and a subtle side split. The champagne-gold sequins catch and reflect light for maximum impact. Fully lined with a concealed back zip. Perfect for New Year, birthdays, and gala dinners.',
  'Sequin embellishment over polyester lining, concealed zip',
  13500,
  16500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/gold-sequin-midi-dress/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/gold-sequin-midi-dress/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/gold-sequin-midi-dress/detail-2.jpg'
  ],
  true
),
(
  'p4000000-0000-0000-0000-000000000002',
  'c4000000-0000-0000-0000-000000000004',
  'Floral Chiffon Maxi Gown',
  'floral-chiffon-maxi-gown',
  'A sweeping floor-length maxi gown in fluid chiffon with a bold floral print. Features a wrap-style bodice with long flutter sleeves and a self-tie belt at the waist. Effortlessly elegant for weddings, outdoor events, and dinner occasions. Fully lined.',
  'Printed chiffon with satin lining, self-tie belt',
  11500,
  14000,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/floral-chiffon-maxi-gown/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/floral-chiffon-maxi-gown/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/floral-chiffon-maxi-gown/detail-2.jpg'
  ],
  true
),
(
  'p4000000-0000-0000-0000-000000000003',
  'c4000000-0000-0000-0000-000000000004',
  'Ankara Two-Piece Co-ord Set',
  'ankara-two-piece-co-ord-set',
  'A bold and vibrant Ankara print two-piece set consisting of a cropped fitted blazer and wide-leg palazzo trousers. Crafted from premium cotton Ankara fabric. Statement-making at any owambe, birthday party, or cultural event. Available in select prints — please contact us for current print availability.',
  '100% cotton Ankara wax print, fully lined blazer',
  9500,
  11500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/ankara-two-piece-co-ord-set/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/ankara-two-piece-co-ord-set/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/ankara-two-piece-co-ord-set/detail-2.jpg'
  ],
  true
),
(
  'p4000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000004',
  'Beaded Lace Blouse',
  'beaded-lace-blouse',
  'A luxurious lace blouse featuring hand-applied bead embellishment across the neckline and cuffs. Balloon sleeves add drama while the relaxed silhouette ensures comfort. Pairs beautifully with George fabric wrapper or tailored trousers. A timeless piece for owambe occasions.',
  'Swiss lace with hand-applied glass beads and sequin trim',
  8500,
  NULL,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/beaded-lace-blouse/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/beaded-lace-blouse/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/party-dinner-wear/beaded-lace-blouse/detail-2.jpg'
  ],
  true
),

-- ── Children's Wear (2 products) ─────────────────────────────
(
  'p5000000-0000-0000-0000-000000000001',
  'c5000000-0000-0000-0000-000000000005',
  'Children''s Traditional Outfit Set',
  'childrens-traditional-outfit-set',
  'A beautifully crafted children''s traditional outfit set including an Ankara top, matching trousers, and a cap for boys or matching headband for girls. Made from high-quality Ankara cotton for comfort and durability. Perfect for naming ceremonies, weddings, and cultural events. Available in sizes 2–10 years.',
  '100% cotton Ankara wax print, breathable lining',
  3800,
  4500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/childrens-wear/childrens-traditional-outfit-set/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/childrens-wear/childrens-traditional-outfit-set/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/childrens-wear/childrens-traditional-outfit-set/detail-2.jpg'
  ],
  true
),
(
  'p5000000-0000-0000-0000-000000000002',
  'c5000000-0000-0000-0000-000000000005',
  'Girls Birthday Party Dress',
  'girls-birthday-party-dress',
  'A show-stopping birthday party dress for girls featuring a tulle skirt with glitter overlay, a fitted bodice with rosette detail, and a satin sash bow at the back. Machine washable tulle for easy care. Makes the birthday girl feel truly special. Available in sizes 2–10 years.',
  'Tulle over satin underskirt, polyester bodice, satin sash',
  5500,
  6500,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/childrens-wear/girls-birthday-party-dress/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/childrens-wear/girls-birthday-party-dress/detail-1.jpg'
  ],
  true
),

-- ── Body Shapers (3 products) ────────────────────────────────
(
  'p6000000-0000-0000-0000-000000000001',
  'c6000000-0000-0000-0000-000000000006',
  'Premium Latex Waist Trainer',
  'premium-latex-waist-trainer',
  'A professional-grade latex waist trainer with triple-row hook-and-eye closure for a customisable, snug fit. Features steel boning for posture support and a soft cotton lining for all-day comfort. Suitable for everyday wear and light workouts. Provides an instant 3–4 inch reduction.',
  'Natural latex exterior, steel boning, cotton lining',
  3500,
  4200,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/premium-latex-waist-trainer/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/premium-latex-waist-trainer/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/premium-latex-waist-trainer/detail-2.jpg'
  ],
  true
),
(
  'p6000000-0000-0000-0000-000000000002',
  'c6000000-0000-0000-0000-000000000006',
  'Full Body Shaper Bodysuit',
  'full-body-shaper-bodysuit',
  'A seamless full body shaper offering targeted compression across the abdomen, waist, hips, and thighs. The open-bust design is compatible with any bra, and the open-gusset crotch allows for easy bathroom use. Virtually invisible under clothing. Suitable for postpartum wear.',
  '80% nylon, 20% spandex — seamless compression knit',
  4800,
  5800,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/full-body-shaper-bodysuit/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/full-body-shaper-bodysuit/detail-1.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/full-body-shaper-bodysuit/detail-2.jpg'
  ],
  true
),
(
  'p6000000-0000-0000-0000-000000000003',
  'c6000000-0000-0000-0000-000000000006',
  'High-Waist Thigh Slimmer Shorts',
  'high-waist-thigh-slimmer-shorts',
  'Mid-thigh shaper shorts with a high-rise waistband that smooths the tummy and sculpts the hips. The anti-roll silicone hem keeps the garment securely in place throughout the day. Breathable fabric prevents overheating. Machine washable.',
  '75% nylon, 25% spandex, silicone hem grip',
  2800,
  NULL,
  ARRAY[
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/high-waist-thigh-slimmer-shorts/main.jpg',
    'https://res.cloudinary.com/aiefashionz/image/upload/v1/products/body-shapers/high-waist-thigh-slimmer-shorts/detail-1.jpg'
  ],
  true
);

-- ─────────────────────────────────────────────────────────────
-- Product Variants
-- ─────────────────────────────────────────────────────────────

-- ── Luxury Fabrics Variants ──────────────────────────────────

-- Premium Aso-Oke Woven Fabric (p1000000-...-001) — sold per metre/yardage
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p1000000-0000-0000-0000-000000000001', '1m',  'Navy & Gold',    25, 0),
('p1000000-0000-0000-0000-000000000001', '2m',  'Navy & Gold',    15, 3200),
('p1000000-0000-0000-0000-000000000001', '5m',  'Navy & Gold',     8, 12800),
('p1000000-0000-0000-0000-000000000001', '1m',  'Burgundy & Gold', 20, 0),
('p1000000-0000-0000-0000-000000000001', '2m',  'Burgundy & Gold', 12, 3200);

-- Vibrant Ankara Print Fabric (p1000000-...-002)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p1000000-0000-0000-0000-000000000002', '1m',  'Blue & Orange',   40, 0),
('p1000000-0000-0000-0000-000000000002', '2m',  'Blue & Orange',   25, 1800),
('p1000000-0000-0000-0000-000000000002', '5m',  'Blue & Orange',   15, 7200),
('p1000000-0000-0000-0000-000000000002', '1m',  'Red & Black',     35, 0),
('p1000000-0000-0000-0000-000000000002', '2m',  'Red & Black',     20, 1800);

-- Embroidered Swiss Lace Fabric (p1000000-...-003)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p1000000-0000-0000-0000-000000000003', '1m',  'Ivory & Gold',   18, 0),
('p1000000-0000-0000-0000-000000000003', '2m',  'Ivory & Gold',   10, 4500),
('p1000000-0000-0000-0000-000000000003', '1m',  'Champagne',      15, 0),
('p1000000-0000-0000-0000-000000000003', '2m',  'Champagne',       8, 4500);

-- Royal George Fabric (p1000000-...-004)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p1000000-0000-0000-0000-000000000004', '1m',  'Royal Blue & Gold', 20, 0),
('p1000000-0000-0000-0000-000000000004', '2m',  'Royal Blue & Gold', 12, 3800),
('p1000000-0000-0000-0000-000000000004', '5m',  'Royal Blue & Gold',  6, 15200),
('p1000000-0000-0000-0000-000000000004', '1m',  'Emerald & Gold',   18, 0),
('p1000000-0000-0000-0000-000000000004', '2m',  'Emerald & Gold',   10, 3800);

-- ── Bags & Shoes Variants ────────────────────────────────────

-- Structured Leather Tote Bag (p2000000-...-001)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p2000000-0000-0000-0000-000000000001', 'One Size', 'Black',       12, 0),
('p2000000-0000-0000-0000-000000000001', 'One Size', 'Tan',         10, 0),
('p2000000-0000-0000-0000-000000000001', 'One Size', 'Burgundy',     7, 0),
('p2000000-0000-0000-0000-000000000001', 'One Size', 'Navy',         6, 0);

-- Gold Block Heeled Sandals (p2000000-...-002) — UK shoe sizes
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p2000000-0000-0000-0000-000000000002', 'UK 3', 'Gold', 8,  0),
('p2000000-0000-0000-0000-000000000002', 'UK 4', 'Gold', 12, 0),
('p2000000-0000-0000-0000-000000000002', 'UK 5', 'Gold', 15, 0),
('p2000000-0000-0000-0000-000000000002', 'UK 6', 'Gold', 14, 0),
('p2000000-0000-0000-0000-000000000002', 'UK 7', 'Gold', 10, 0),
('p2000000-0000-0000-0000-000000000002', 'UK 8', 'Gold',  6, 0);

-- Beaded Evening Clutch Bag (p2000000-...-003)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p2000000-0000-0000-0000-000000000003', 'One Size', 'Gold & Ivory',  14, 0),
('p2000000-0000-0000-0000-000000000003', 'One Size', 'Black & Gold',  12, 0),
('p2000000-0000-0000-0000-000000000003', 'One Size', 'Rose & Silver',  8, 0);

-- ── Jewellery Variants ───────────────────────────────────────

-- 18ct Gold Layered Necklace (p3000000-...-001)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p3000000-0000-0000-0000-000000000001', '40cm', 'Yellow Gold', 20, 0),
('p3000000-0000-0000-0000-000000000001', '45cm', 'Yellow Gold', 18, 0),
('p3000000-0000-0000-0000-000000000001', '40cm', 'Rose Gold',   15, 0),
('p3000000-0000-0000-0000-000000000001', '45cm', 'Rose Gold',   12, 0);

-- Oversized Statement Earrings (p3000000-...-002)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p3000000-0000-0000-0000-000000000002', 'One Size', 'Amber & Gold',  22, 0),
('p3000000-0000-0000-0000-000000000002', 'One Size', 'Emerald & Gold', 18, 0),
('p3000000-0000-0000-0000-000000000002', 'One Size', 'Black & Gold',  20, 0);

-- Gold Bangle Bracelet Set (p3000000-...-003)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p3000000-0000-0000-0000-000000000003', 'S',        'Yellow Gold', 16, 0),
('p3000000-0000-0000-0000-000000000003', 'M',        'Yellow Gold', 20, 0),
('p3000000-0000-0000-0000-000000000003', 'L',        'Yellow Gold', 14, 0),
('p3000000-0000-0000-0000-000000000003', 'One Size', 'Rose Gold',   18, 0);

-- Cubic Zirconia Cocktail Ring (p3000000-...-004)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p3000000-0000-0000-0000-000000000004', 'J', 'Yellow Gold', 10, 0),
('p3000000-0000-0000-0000-000000000004', 'L', 'Yellow Gold', 12, 0),
('p3000000-0000-0000-0000-000000000004', 'N', 'Yellow Gold', 14, 0),
('p3000000-0000-0000-0000-000000000004', 'P', 'Yellow Gold', 10, 0);

-- ── Party & Dinner Wear Variants ─────────────────────────────

-- Gold Sequin Midi Dress (p4000000-...-001) — UK clothing sizes
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p4000000-0000-0000-0000-000000000001', 'UK 6',  'Champagne Gold', 8,  0),
('p4000000-0000-0000-0000-000000000001', 'UK 8',  'Champagne Gold', 12, 0),
('p4000000-0000-0000-0000-000000000001', 'UK 10', 'Champagne Gold', 15, 0),
('p4000000-0000-0000-0000-000000000001', 'UK 12', 'Champagne Gold', 14, 0),
('p4000000-0000-0000-0000-000000000001', 'UK 14', 'Champagne Gold', 10, 0),
('p4000000-0000-0000-0000-000000000001', 'UK 16', 'Champagne Gold',  8, 0),
('p4000000-0000-0000-0000-000000000001', 'UK 18', 'Champagne Gold',  6, 0);

-- Floral Chiffon Maxi Gown (p4000000-...-002)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p4000000-0000-0000-0000-000000000002', 'UK 8',  'Blue Floral',  10, 0),
('p4000000-0000-0000-0000-000000000002', 'UK 10', 'Blue Floral',  14, 0),
('p4000000-0000-0000-0000-000000000002', 'UK 12', 'Blue Floral',  16, 0),
('p4000000-0000-0000-0000-000000000002', 'UK 14', 'Blue Floral',  12, 0),
('p4000000-0000-0000-0000-000000000002', 'UK 16', 'Blue Floral',   8, 0),
('p4000000-0000-0000-0000-000000000002', 'UK 18', 'Blue Floral',   6, 0);

-- Ankara Two-Piece Co-ord Set (p4000000-...-003)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p4000000-0000-0000-0000-000000000003', 'UK 8',  'Multicolour Ankara', 8,  0),
('p4000000-0000-0000-0000-000000000003', 'UK 10', 'Multicolour Ankara', 12, 0),
('p4000000-0000-0000-0000-000000000003', 'UK 12', 'Multicolour Ankara', 14, 0),
('p4000000-0000-0000-0000-000000000003', 'UK 14', 'Multicolour Ankara', 10, 0),
('p4000000-0000-0000-0000-000000000003', 'UK 16', 'Multicolour Ankara',  8, 0);

-- Beaded Lace Blouse (p4000000-...-004)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p4000000-0000-0000-0000-000000000004', 'UK 8',  'Ivory',    10, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 10', 'Ivory',    14, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 12', 'Ivory',    16, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 14', 'Ivory',    12, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 16', 'Ivory',     8, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 10', 'Champagne', 12, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 12', 'Champagne', 14, 0),
('p4000000-0000-0000-0000-000000000004', 'UK 14', 'Champagne', 10, 0);

-- ── Children's Wear Variants ─────────────────────────────────

-- Children's Traditional Outfit Set (p5000000-...-001)
-- Sizes represent age ranges
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p5000000-0000-0000-0000-000000000001', '2-3 Years', 'Blue & Gold',  10, 0),
('p5000000-0000-0000-0000-000000000001', '4-5 Years', 'Blue & Gold',  12, 0),
('p5000000-0000-0000-0000-000000000001', '6-7 Years', 'Blue & Gold',  10, 0),
('p5000000-0000-0000-0000-000000000001', '8-9 Years', 'Blue & Gold',   8, 0),
('p5000000-0000-0000-0000-000000000001', '2-3 Years', 'Red & Gold',    8, 0),
('p5000000-0000-0000-0000-000000000001', '4-5 Years', 'Red & Gold',   10, 0),
('p5000000-0000-0000-0000-000000000001', '6-7 Years', 'Red & Gold',    8, 0),
('p5000000-0000-0000-0000-000000000001', '8-9 Years', 'Red & Gold',    6, 0);

-- Girls Birthday Party Dress (p5000000-...-002)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p5000000-0000-0000-0000-000000000002', '2-3 Years', 'Pink',   12, 0),
('p5000000-0000-0000-0000-000000000002', '4-5 Years', 'Pink',   14, 0),
('p5000000-0000-0000-0000-000000000002', '6-7 Years', 'Pink',   12, 0),
('p5000000-0000-0000-0000-000000000002', '8-9 Years', 'Pink',   10, 0),
('p5000000-0000-0000-0000-000000000002', '2-3 Years', 'Lilac',   8, 0),
('p5000000-0000-0000-0000-000000000002', '4-5 Years', 'Lilac',  10, 0),
('p5000000-0000-0000-0000-000000000002', '6-7 Years', 'Lilac',   8, 0);

-- ── Body Shapers Variants ────────────────────────────────────

-- Premium Latex Waist Trainer (p6000000-...-001)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p6000000-0000-0000-0000-000000000001', 'XS',  'Black', 15, 0),
('p6000000-0000-0000-0000-000000000001', 'S',   'Black', 20, 0),
('p6000000-0000-0000-0000-000000000001', 'M',   'Black', 22, 0),
('p6000000-0000-0000-0000-000000000001', 'L',   'Black', 18, 0),
('p6000000-0000-0000-0000-000000000001', 'XL',  'Black', 14, 0),
('p6000000-0000-0000-0000-000000000001', 'XXL', 'Black', 10, 0),
('p6000000-0000-0000-0000-000000000001', 'S',   'Nude',  15, 0),
('p6000000-0000-0000-0000-000000000001', 'M',   'Nude',  18, 0),
('p6000000-0000-0000-0000-000000000001', 'L',   'Nude',  14, 0);

-- Full Body Shaper Bodysuit (p6000000-...-002)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p6000000-0000-0000-0000-000000000002', 'XS',  'Black', 12, 0),
('p6000000-0000-0000-0000-000000000002', 'S',   'Black', 16, 0),
('p6000000-0000-0000-0000-000000000002', 'M',   'Black', 20, 0),
('p6000000-0000-0000-0000-000000000002', 'L',   'Black', 18, 0),
('p6000000-0000-0000-0000-000000000002', 'XL',  'Black', 14, 0),
('p6000000-0000-0000-0000-000000000002', 'XXL', 'Black', 10, 0),
('p6000000-0000-0000-0000-000000000002', 'S',   'Nude',  14, 0),
('p6000000-0000-0000-0000-000000000002', 'M',   'Nude',  16, 0),
('p6000000-0000-0000-0000-000000000002', 'L',   'Nude',  12, 0);

-- High-Waist Thigh Slimmer Shorts (p6000000-...-003)
INSERT INTO product_variants (product_id, size, colour, stock, additional_price) VALUES
('p6000000-0000-0000-0000-000000000003', 'XS',  'Black', 14, 0),
('p6000000-0000-0000-0000-000000000003', 'S',   'Black', 18, 0),
('p6000000-0000-0000-0000-000000000003', 'M',   'Black', 22, 0),
('p6000000-0000-0000-0000-000000000003', 'L',   'Black', 18, 0),
('p6000000-0000-0000-0000-000000000003', 'XL',  'Black', 14, 0),
('p6000000-0000-0000-0000-000000000003', 'XXL', 'Black', 10, 0),
('p6000000-0000-0000-0000-000000000003', 'S',   'Nude',  12, 0),
('p6000000-0000-0000-0000-000000000003', 'M',   'Nude',  16, 0),
('p6000000-0000-0000-0000-000000000003', 'L',   'Nude',  12, 0);
