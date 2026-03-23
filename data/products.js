// All monetary values are in CENTS (USD × 100).
// e.g. base_price: 2800 → $28.00
const U = "https://images.unsplash.com";
const img = (id, w = 800, h = 1067) =>
  `${U}/photo-${id}?w=${w}&h=${h}&fit=crop&crop=top&q=85&auto=format`;

export const products = [
  // ── LUXURY FABRICS ────────────────────────────────────────────────
  {
    id: "prod_1",
    slug: "duchess-ivory-silk",
    title: "Duchess Ivory Silk Charmeuse",
    description:
      "The finest duchess silk charmeuse in a warm ivory tone. Drapes beautifully for evening gowns, bridal wear and luxury blouses. Sold per metre — minimum order 2 metres.",
    materials: "100% Mulberry Silk",
    care_instructions: "Dry clean only. Store folded in a cool, dry place away from direct sunlight.",
    base_price: 2800,
    compare_price: null,
    category_slug: "luxury-fabrics",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1558769132-cb1aea458c5e"), alt: "Ivory silk charmeuse fabric draped elegantly", is_primary: true },
      { url: img("1558618666-fcd25c85cd64"), alt: "Close-up of silk charmeuse texture", is_primary: false },
    ],
    variants: [
      { id: "v1a", size: "1m", colour: "Ivory", sku: "DSC-IVY-1M", stock_count: 50, additional_price: 0 },
      { id: "v1b", size: "2m", colour: "Ivory", sku: "DSC-IVY-2M", stock_count: 30, additional_price: 2800 },
      { id: "v1c", size: "5m", colour: "Ivory", sku: "DSC-IVY-5M", stock_count: 15, additional_price: 11200 },
    ],
  },
  {
    id: "prod_2",
    slug: "royal-blue-guipure-lace",
    title: "Royal Blue Guipure Lace",
    description:
      "Intricate guipure lace in a deep royal blue. The open weave and floral motifs make it ideal for overlay skirts, sleeves and statement bodices. Sold per metre.",
    materials: "90% Cotton, 10% Nylon",
    care_instructions: "Hand wash cold. Do not wring. Lay flat to dry.",
    base_price: 4500,
    compare_price: 5800,
    category_slug: "luxury-fabrics",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1556905055-8f358a7a564f"), alt: "Royal blue guipure lace fabric detail", is_primary: true },
      { url: img("1558769132-cb1aea458c5e"), alt: "Lace fabric in full width", is_primary: false },
    ],
    variants: [
      { id: "v2a", size: "1m", colour: "Royal Blue", sku: "RBL-RYL-1M", stock_count: 20, additional_price: 0 },
      { id: "v2b", size: "2m", colour: "Royal Blue", sku: "RBL-RYL-2M", stock_count: 12, additional_price: 4500 },
      { id: "v2c", size: "1m", colour: "Ivory", sku: "RBL-IVY-1M", stock_count: 18, additional_price: 0 },
    ],
  },
  {
    id: "prod_3",
    slug: "premium-ankara-print-bundle",
    title: "Premium Ankara Print Bundle",
    description:
      "Six yards of premium Ankara in a bold geometric print. Made in Nigeria using traditional wax-resist dyeing. Vivid colours that do not fade with washing.",
    materials: "100% Cotton Wax Print",
    care_instructions: "Machine wash cold, gentle cycle. Hang to dry. Iron on reverse side.",
    base_price: 8500,
    compare_price: null,
    category_slug: "luxury-fabrics",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1539109136881-3be0616acf4b"), alt: "Bold geometric Ankara print fabric", is_primary: true },
      { url: img("1548839140-29a749e1cf4d"), alt: "Ankara fabric close-up detail", is_primary: false },
    ],
    variants: [
      { id: "v3a", size: "6 yards", colour: "Gold & Black", sku: "ANK-GBK-6Y", stock_count: 25, additional_price: 0 },
      { id: "v3b", size: "6 yards", colour: "Red & Navy", sku: "ANK-RNV-6Y", stock_count: 18, additional_price: 0 },
      { id: "v3c", size: "6 yards", colour: "Green & Gold", sku: "ANK-GGD-6Y", stock_count: 14, additional_price: 0 },
    ],
  },
  {
    id: "prod_4",
    slug: "double-faced-cashmere-coating",
    title: "Double-Faced Cashmere Coating",
    description:
      "A luxurious double-faced cashmere and wool blend coating in a rich camel tone. Perfectly weighted for structured coats and tailored jackets. Sold per metre.",
    materials: "70% Cashmere, 30% Wool",
    care_instructions: "Dry clean only. Do not press directly — use a pressing cloth.",
    base_price: 9500,
    compare_price: 12000,
    category_slug: "luxury-fabrics",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1491553895911-0055eca6402d"), alt: "Double-faced cashmere coating in camel", is_primary: true },
      { url: img("1558769132-cb1aea458c5e"), alt: "Cashmere fabric detail and texture", is_primary: false },
    ],
    variants: [
      { id: "v4a", size: "1m", colour: "Camel", sku: "DCC-CAM-1M", stock_count: 10, additional_price: 0 },
      { id: "v4b", size: "2m", colour: "Camel", sku: "DCC-CAM-2M", stock_count: 6, additional_price: 9500 },
      { id: "v4c", size: "1m", colour: "Charcoal", sku: "DCC-CHR-1M", stock_count: 8, additional_price: 0 },
    ],
  },

  // ── BAGS & SHOES ──────────────────────────────────────────────────
  {
    id: "prod_5",
    slug: "croc-champagne-evening-clutch",
    title: "Croc-Embossed Champagne Clutch",
    description:
      "An impeccably crafted evening clutch in champagne croc-embossed leather. Magnetic closure with a detachable gold chain strap. Fits a phone, cards and lipstick — everything you need for an evening.",
    materials: "Genuine croc-embossed leather exterior. Suede lining. Gold-tone hardware.",
    care_instructions: "Wipe clean with a dry cloth. Store in the dust bag provided. Keep away from moisture.",
    base_price: 19500,
    compare_price: null,
    category_slug: "bags-shoes",
    is_active: true,
    is_featured: true,
    images: [
      { url: img("1548036328-c9fa89d128fa"), alt: "Champagne croc-embossed evening clutch", is_primary: true },
      { url: img("1590874103328-eac38a683ce7"), alt: "Clutch opened showing interior", is_primary: false },
    ],
    variants: [
      { id: "v5a", size: "One Size", colour: "Champagne", sku: "CEC-CHP-OS", stock_count: 12, additional_price: 0 },
      { id: "v5b", size: "One Size", colour: "Black", sku: "CEC-BLK-OS", stock_count: 8, additional_price: 0 },
      { id: "v5c", size: "One Size", colour: "Ivory", sku: "CEC-IVY-OS", stock_count: 5, additional_price: 0 },
    ],
  },
  {
    id: "prod_6",
    slug: "structured-caramel-tote",
    title: "Structured Caramel Leather Tote",
    description:
      "A generously proportioned structured tote in caramel full-grain leather. Interior includes a zip pocket, two slip pockets and a key clip. Shoulder strap with a 30cm drop.",
    materials: "Full-grain leather. Canvas lining. Brass-tone hardware.",
    care_instructions: "Clean with a leather conditioner. Store stuffed with tissue paper when not in use.",
    base_price: 26500,
    compare_price: 32000,
    category_slug: "bags-shoes",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1590874103328-eac38a683ce7"), alt: "Structured caramel leather tote bag", is_primary: true },
      { url: img("1548036328-c9fa89d128fa"), alt: "Tote bag detail with hardware", is_primary: false },
    ],
    variants: [
      { id: "v6a", size: "Standard", colour: "Caramel", sku: "SCT-CAR-STD", stock_count: 9, additional_price: 0 },
      { id: "v6b", size: "Standard", colour: "Black", sku: "SCT-BLK-STD", stock_count: 7, additional_price: 0 },
    ],
  },
  {
    id: "prod_7",
    slug: "nude-patent-block-heel-mule",
    title: "Nude Patent Block Heel Mule",
    description:
      "A wardrobe essential — nude patent leather mule with a solid 9cm block heel. Square toe, slip-on fit. Equally polished with tailoring or a silk slip dress.",
    materials: "Patent leather upper. Leather-covered block heel. Padded leather insole.",
    care_instructions: "Wipe with a damp cloth. Store in the box to preserve shape.",
    base_price: 13500,
    compare_price: null,
    category_slug: "bags-shoes",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1543163521-1bf539c55dd2"), alt: "Nude patent block heel mule shoes", is_primary: true },
      { url: img("1542291026-7eec264c27ff"), alt: "Heel detail and sole of mule", is_primary: false },
    ],
    variants: [
      { id: "v7a", size: "UK 3", colour: "Nude", sku: "NPM-NDE-UK3", stock_count: 4, additional_price: 0 },
      { id: "v7b", size: "UK 4", colour: "Nude", sku: "NPM-NDE-UK4", stock_count: 6, additional_price: 0 },
      { id: "v7c", size: "UK 5", colour: "Nude", sku: "NPM-NDE-UK5", stock_count: 8, additional_price: 0 },
      { id: "v7d", size: "UK 6", colour: "Nude", sku: "NPM-NDE-UK6", stock_count: 5, additional_price: 0 },
      { id: "v7e", size: "UK 7", colour: "Nude", sku: "NPM-NDE-UK7", stock_count: 3, additional_price: 0 },
      { id: "v7f", size: "UK 5", colour: "Black", sku: "NPM-BLK-UK5", stock_count: 7, additional_price: 0 },
    ],
  },
  {
    id: "prod_8",
    slug: "gold-metallic-kitten-heel-sandal",
    title: "Gold Metallic Kitten Heel Sandal",
    description:
      "A delicate strappy sandal with a 5cm kitten heel in champagne gold metallic leather. Adjustable ankle strap with a gold buckle. Versatile enough for daytime events and evening occasions.",
    materials: "Metallic leather upper and heel. Suede insole for all-day comfort.",
    care_instructions: "Buff gently with a soft cloth. Avoid puddles — metallic finish can mark in water.",
    base_price: 9800,
    compare_price: 12500,
    category_slug: "bags-shoes",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1542291026-7eec264c27ff"), alt: "Gold metallic kitten heel sandal", is_primary: true },
      { url: img("1543163521-1bf539c55dd2"), alt: "Kitten heel sandal strap detail", is_primary: false },
    ],
    variants: [
      { id: "v8a", size: "UK 3", colour: "Gold", sku: "GKH-GLD-UK3", stock_count: 3, additional_price: 0 },
      { id: "v8b", size: "UK 4", colour: "Gold", sku: "GKH-GLD-UK4", stock_count: 5, additional_price: 0 },
      { id: "v8c", size: "UK 5", colour: "Gold", sku: "GKH-GLD-UK5", stock_count: 7, additional_price: 0 },
      { id: "v8d", size: "UK 6", colour: "Gold", sku: "GKH-GLD-UK6", stock_count: 4, additional_price: 0 },
    ],
  },

  // ── JEWELLERY ─────────────────────────────────────────────────────
  {
    id: "prod_9",
    slug: "statement-pearl-collar-necklace",
    title: "Statement Pearl Collar Necklace",
    description:
      "A show-stopping pearl collar necklace with hand-knotted freshwater pearls on a gold-plated base. Sits perfectly at the collarbone — stunning against off-shoulder and strapless necklines.",
    materials: "Freshwater pearls. 18ct gold-plated sterling silver base and clasp.",
    care_instructions: "Wipe with a dry lint-free cloth after wearing. Store in pouch away from other jewellery. Do not expose to perfume or water.",
    base_price: 8800,
    compare_price: null,
    category_slug: "jewellery",
    is_active: true,
    is_featured: true,
    images: [
      { url: img("1515562141207-7a88fb7ce338"), alt: "Statement pearl collar necklace worn", is_primary: true },
      { url: img("1629224316810-9d8805b95eb0"), alt: "Pearl collar necklace detail and clasp", is_primary: false },
    ],
    variants: [
      { id: "v9a", size: "One Size", colour: "Pearl & Gold", sku: "SPC-PGD-OS", stock_count: 15, additional_price: 0 },
    ],
  },
  {
    id: "prod_10",
    slug: "gold-chain-layering-set",
    title: "Gold Chain Layering Set",
    description:
      "Three chains designed to be worn together or separately. Includes an 18-inch delicate flat link, 20-inch herringbone, and 22-inch paperclip chain. All in 18ct gold vermeil on sterling silver.",
    materials: "18ct gold vermeil on sterling silver. Lobster claw clasps.",
    care_instructions: "Store individually in the pouches provided. Do not shower or swim wearing gold-plated jewellery.",
    base_price: 10500,
    compare_price: 13000,
    category_slug: "jewellery",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1601821765780-754fa98637c1"), alt: "Gold chain layering set arranged on marble", is_primary: true },
      { url: img("1515562141207-7a88fb7ce338"), alt: "Gold chains worn layered together", is_primary: false },
    ],
    variants: [
      { id: "v10a", size: "Set of 3", colour: "Gold", sku: "GCL-GLD-S3", stock_count: 22, additional_price: 0 },
      { id: "v10b", size: "Set of 3", colour: "Silver", sku: "GCL-SLV-S3", stock_count: 14, additional_price: 0 },
    ],
  },
  {
    id: "prod_11",
    slug: "crystal-drop-earrings",
    title: "Crystal Drop Earrings",
    description:
      "Elongated crystal drops suspended from a gold bar. Clear Swarovski crystals catch the light beautifully in candlelight. Lightweight despite their dramatic length — comfortable for all-evening wear.",
    materials: "Swarovski crystals. 18ct gold-plated brass drops and posts. Butterfly backs.",
    care_instructions: "Do not submerge in water. Clean with a soft dry cloth. Store flat.",
    base_price: 5800,
    compare_price: null,
    category_slug: "jewellery",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1630327989742-d4e71b6e6e42"), alt: "Crystal drop earrings dangling elegantly", is_primary: true },
      { url: img("1599643478518-a784e5dc4c8f"), alt: "Crystal earring detail and Swarovski sparkle", is_primary: false },
    ],
    variants: [
      { id: "v11a", size: "One Size", colour: "Crystal & Gold", sku: "CDE-CRG-OS", stock_count: 30, additional_price: 0 },
      { id: "v11b", size: "One Size", colour: "Smoke & Gold", sku: "CDE-SMG-OS", stock_count: 18, additional_price: 0 },
    ],
  },
  {
    id: "prod_12",
    slug: "bold-gold-cuff-bracelet",
    title: "Bold Gold Cuff Bracelet",
    description:
      "A wide sculptural cuff in polished 18ct gold-plated brass. The slight open-back design means it fits most wrists. Makes a statement as a standalone piece or stacked with fine bracelets.",
    materials: "18ct gold-plated brass. Hypoallergenic.",
    care_instructions: "Buff with a polishing cloth. Store in the provided pouch. Remove before swimming or exercising.",
    base_price: 7200,
    compare_price: null,
    category_slug: "jewellery",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1599643478518-a784e5dc4c8f"), alt: "Bold gold cuff bracelet on wrist", is_primary: true },
      { url: img("1601821765780-754fa98637c1"), alt: "Gold cuff bracelet detail", is_primary: false },
    ],
    variants: [
      { id: "v12a", size: "One Size", colour: "Gold", sku: "BGC-GLD-OS", stock_count: 20, additional_price: 0 },
    ],
  },

  // ── PARTY & DINNER WEAR ───────────────────────────────────────────
  {
    id: "prod_13",
    slug: "emerald-satin-evening-gown",
    title: "Emerald Satin Evening Gown",
    description:
      "A floor-length bias-cut gown in emerald duchess satin. Cowl neckline with a low open back and adjustable spaghetti straps. The bias cut moves with the body — completely effortless.",
    materials: "Shell: 100% Silk Satin. Lining: 100% Silk Habotai.",
    care_instructions: "Dry clean only. Steam to remove creases — do not iron directly.",
    base_price: 52500,
    compare_price: null,
    category_slug: "party-dinner-wear",
    is_active: true,
    is_featured: true,
    images: [
      { url: img("1566479179817-6de3af2b9a7f"), alt: "Emerald satin evening gown full length", is_primary: true },
      { url: img("1529634221870-f36f09b6a09e"), alt: "Emerald gown back detail and drape", is_primary: false },
    ],
    variants: [
      { id: "v13a", size: "XS", colour: "Emerald", sku: "ESG-EMR-XS", stock_count: 2, additional_price: 0 },
      { id: "v13b", size: "S", colour: "Emerald", sku: "ESG-EMR-S", stock_count: 4, additional_price: 0 },
      { id: "v13c", size: "M", colour: "Emerald", sku: "ESG-EMR-M", stock_count: 5, additional_price: 0 },
      { id: "v13d", size: "L", colour: "Emerald", sku: "ESG-EMR-L", stock_count: 3, additional_price: 0 },
      { id: "v13e", size: "XL", colour: "Emerald", sku: "ESG-EMR-XL", stock_count: 2, additional_price: 0 },
      { id: "v13f", size: "S", colour: "Black", sku: "ESG-BLK-S", stock_count: 3, additional_price: 0 },
      { id: "v13g", size: "M", colour: "Black", sku: "ESG-BLK-M", stock_count: 4, additional_price: 0 },
    ],
  },
  {
    id: "prod_14",
    slug: "ivory-ruched-halter-coord",
    title: "Ivory Ruched Halter Co-ord",
    description:
      "A two-piece set comprising a ruched halter top with a front-tie neckline and matching high-waist ruched skirt with a midi hem. In a luxurious stretch-crepe that holds its shape all evening.",
    materials: "92% Polyester, 8% Elastane stretch-crepe. Fully lined.",
    care_instructions: "Hand wash cold or machine wash on delicate cycle. Hang to dry. Steam gently.",
    base_price: 21500,
    compare_price: null,
    category_slug: "party-dinner-wear",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1490481651871-ab68de25d43d"), alt: "Ivory ruched halter co-ord set worn", is_primary: true },
      { url: img("1566479179817-6de3af2b9a7f"), alt: "Co-ord set detail and drape", is_primary: false },
    ],
    variants: [
      { id: "v14a", size: "XS", colour: "Ivory", sku: "IRH-IVY-XS", stock_count: 3, additional_price: 0 },
      { id: "v14b", size: "S", colour: "Ivory", sku: "IRH-IVY-S", stock_count: 5, additional_price: 0 },
      { id: "v14c", size: "M", colour: "Ivory", sku: "IRH-IVY-M", stock_count: 6, additional_price: 0 },
      { id: "v14d", size: "L", colour: "Ivory", sku: "IRH-IVY-L", stock_count: 4, additional_price: 0 },
      { id: "v14e", size: "S", colour: "Blush", sku: "IRH-BLS-S", stock_count: 3, additional_price: 0 },
      { id: "v14f", size: "M", colour: "Blush", sku: "IRH-BLS-M", stock_count: 4, additional_price: 0 },
    ],
  },
  {
    id: "prod_15",
    slug: "black-sequin-midi-dress",
    title: "Black Sequin Midi Dress",
    description:
      "Covered in fine black sequins from a square neck to a midi hem. Long sleeves with an invisible back zip. Fitted but not restrictive — the stretch base fabric ensures freedom of movement.",
    materials: "Shell: sequins on stretch mesh. Lining: 95% Polyester, 5% Elastane.",
    care_instructions: "Hand wash cold inside out. Do not tumble dry. Lay flat to dry. Do not iron sequins.",
    base_price: 29800,
    compare_price: 36500,
    category_slug: "party-dinner-wear",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1485968579580-b6d095142e6e"), alt: "Black sequin midi dress full length", is_primary: true },
      { url: img("1529634221870-f36f09b6a09e"), alt: "Sequin dress detail under light", is_primary: false },
    ],
    variants: [
      { id: "v15a", size: "XS", colour: "Black", sku: "BSD-BLK-XS", stock_count: 2, additional_price: 0 },
      { id: "v15b", size: "S", colour: "Black", sku: "BSD-BLK-S", stock_count: 4, additional_price: 0 },
      { id: "v15c", size: "M", colour: "Black", sku: "BSD-BLK-M", stock_count: 5, additional_price: 0 },
      { id: "v15d", size: "L", colour: "Black", sku: "BSD-BLK-L", stock_count: 3, additional_price: 0 },
      { id: "v15e", size: "XL", colour: "Black", sku: "BSD-BLK-XL", stock_count: 1, additional_price: 0 },
    ],
  },
  {
    id: "prod_16",
    slug: "champagne-blazer-dress",
    title: "Champagne Blazer Dress",
    description:
      "A sharp, oversized blazer silhouette recut as a mini dress. Double-breasted front with gold buttons, structured shoulders and a belted waist. Works as a dress or unbuttoned over trousers.",
    materials: "65% Wool, 35% Polyester. Fully lined in satin.",
    care_instructions: "Dry clean only. Store on a padded hanger to maintain shoulder shape.",
    base_price: 24800,
    compare_price: null,
    category_slug: "party-dinner-wear",
    is_active: true,
    is_featured: true,
    images: [
      { url: img("1496747611176-843222e1e57c"), alt: "Champagne blazer dress styled with belt", is_primary: true },
      { url: img("1490481651871-ab68de25d43d"), alt: "Blazer dress detail on gold buttons", is_primary: false },
    ],
    variants: [
      { id: "v16a", size: "XS", colour: "Champagne", sku: "CBD-CHP-XS", stock_count: 2, additional_price: 0 },
      { id: "v16b", size: "S", colour: "Champagne", sku: "CBD-CHP-S", stock_count: 4, additional_price: 0 },
      { id: "v16c", size: "M", colour: "Champagne", sku: "CBD-CHP-M", stock_count: 5, additional_price: 0 },
      { id: "v16d", size: "L", colour: "Champagne", sku: "CBD-CHP-L", stock_count: 3, additional_price: 0 },
      { id: "v16e", size: "S", colour: "Black", sku: "CBD-BLK-S", stock_count: 3, additional_price: 0 },
      { id: "v16f", size: "M", colour: "Black", sku: "CBD-BLK-M", stock_count: 4, additional_price: 0 },
    ],
  },

  // ── CHILDREN'S WEAR ───────────────────────────────────────────────
  {
    id: "prod_17",
    slug: "girls-rose-gold-tulle-dress",
    title: "Girls Rose Gold Tulle Party Dress",
    description:
      "A princess-style party dress with a satin bodice and layers of soft tulle skirt. Rose gold satin ribbon sash ties at the back. Fully lined, hidden zip. Machine washable — because things happen.",
    materials: "Bodice: 100% Satin. Skirt: Tulle over cotton lining. Sash: Satin.",
    care_instructions: "Machine wash cold, gentle cycle. Hang to dry. Reshape tulle while damp.",
    base_price: 7200,
    compare_price: null,
    category_slug: "childrens-wear",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1503454537195-1dcabb73ffb9"), alt: "Girls rose gold tulle party dress", is_primary: true },
      { url: img("1519238263530-99bdd11df2ea"), alt: "Tulle dress detail and skirt", is_primary: false },
    ],
    variants: [
      { id: "v17a", size: "Age 2-3", colour: "Rose Gold", sku: "GRT-RGD-23", stock_count: 8, additional_price: 0 },
      { id: "v17b", size: "Age 3-4", colour: "Rose Gold", sku: "GRT-RGD-34", stock_count: 8, additional_price: 0 },
      { id: "v17c", size: "Age 5-6", colour: "Rose Gold", sku: "GRT-RGD-56", stock_count: 6, additional_price: 0 },
      { id: "v17d", size: "Age 7-8", colour: "Rose Gold", sku: "GRT-RGD-78", stock_count: 5, additional_price: 0 },
      { id: "v17e", size: "Age 9-10", colour: "Rose Gold", sku: "GRT-RGD-910", stock_count: 4, additional_price: 0 },
      { id: "v17f", size: "Age 5-6", colour: "Ivory", sku: "GRT-IVY-56", stock_count: 5, additional_price: 0 },
    ],
  },
  {
    id: "prod_18",
    slug: "boys-ivory-linen-suit-set",
    title: "Boys Ivory Linen Suit Set",
    description:
      "A sharp three-piece linen suit set for boys — blazer, trousers and waistcoat. Ivory with gold buttons. Lightweight and breathable for summer occasions. Pairs perfectly with the girls tulle dress for coordinated looks.",
    materials: "100% Linen. Breathable cotton lining.",
    care_instructions: "Machine wash cool. Iron on medium heat while slightly damp to remove linen creases.",
    base_price: 9500,
    compare_price: 11500,
    category_slug: "childrens-wear",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1519238263530-99bdd11df2ea"), alt: "Boys ivory linen suit set", is_primary: true },
      { url: img("1503454537195-1dcabb73ffb9"), alt: "Linen suit blazer and trouser detail", is_primary: false },
    ],
    variants: [
      { id: "v18a", size: "Age 2-3", colour: "Ivory", sku: "BLS-IVY-23", stock_count: 6, additional_price: 0 },
      { id: "v18b", size: "Age 3-4", colour: "Ivory", sku: "BLS-IVY-34", stock_count: 6, additional_price: 0 },
      { id: "v18c", size: "Age 5-6", colour: "Ivory", sku: "BLS-IVY-56", stock_count: 5, additional_price: 0 },
      { id: "v18d", size: "Age 7-8", colour: "Ivory", sku: "BLS-IVY-78", stock_count: 4, additional_price: 0 },
      { id: "v18e", size: "Age 9-10", colour: "Ivory", sku: "BLS-IVY-910", stock_count: 3, additional_price: 0 },
    ],
  },

  // ── BODY SHAPERS ──────────────────────────────────────────────────
  {
    id: "prod_19",
    slug: "high-waist-smoothing-brief",
    title: "High-Waist Smoothing Brief",
    description:
      "Our best-selling smoothing brief. High-waisted cut that covers from upper thigh to just below the bra line. Seamless edges are invisible under fitted dresses. Firm compression without discomfort.",
    materials: "78% Nylon, 22% Elastane. Breathable gusset panel.",
    care_instructions: "Hand wash cold. Do not tumble dry. Keep away from heat sources.",
    base_price: 4200,
    compare_price: null,
    category_slug: "body-shapers",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1518611012118-696072aa579a"), alt: "High-waist smoothing brief shapewear", is_primary: true },
      { url: img("1593351415075-3bac9f45c877"), alt: "Smoothing brief side and back view", is_primary: false },
    ],
    variants: [
      { id: "v19a", size: "XS", colour: "Nude", sku: "HWB-NDE-XS", stock_count: 20, additional_price: 0 },
      { id: "v19b", size: "S", colour: "Nude", sku: "HWB-NDE-S", stock_count: 25, additional_price: 0 },
      { id: "v19c", size: "M", colour: "Nude", sku: "HWB-NDE-M", stock_count: 30, additional_price: 0 },
      { id: "v19d", size: "L", colour: "Nude", sku: "HWB-NDE-L", stock_count: 25, additional_price: 0 },
      { id: "v19e", size: "XL", colour: "Nude", sku: "HWB-NDE-XL", stock_count: 15, additional_price: 0 },
      { id: "v19f", size: "XXL", colour: "Nude", sku: "HWB-NDE-XXL", stock_count: 10, additional_price: 0 },
      { id: "v19g", size: "S", colour: "Black", sku: "HWB-BLK-S", stock_count: 20, additional_price: 0 },
      { id: "v19h", size: "M", colour: "Black", sku: "HWB-BLK-M", stock_count: 25, additional_price: 0 },
      { id: "v19i", size: "L", colour: "Black", sku: "HWB-BLK-L", stock_count: 18, additional_price: 0 },
    ],
  },
  {
    id: "prod_20",
    slug: "latex-waist-trainer",
    title: "Latex Waist Trainer",
    description:
      "A 3-row hook-and-eye waist trainer in medical-grade latex. Three graduated adjustments let you progress over time. Reduces waist by 3–5 inches when worn. Flexible boning for full comfort and posture support.",
    materials: "Outer: 100% Cotton. Middle layer: Latex. Inner lining: Satin.",
    care_instructions: "Hand wash only in cool water with mild soap. Air dry. Do not machine wash.",
    base_price: 5800,
    compare_price: 7200,
    category_slug: "body-shapers",
    is_active: true,
    is_featured: false,
    images: [
      { url: img("1593351415075-3bac9f45c877"), alt: "Latex waist trainer in black", is_primary: true },
      { url: img("1518611012118-696072aa579a"), alt: "Waist trainer worn showing adjustment hooks", is_primary: false },
    ],
    variants: [
      { id: "v20a", size: "XS (25-26″)", colour: "Black", sku: "LWT-BLK-XS", stock_count: 12, additional_price: 0 },
      { id: "v20b", size: "S (27-28″)", colour: "Black", sku: "LWT-BLK-S", stock_count: 15, additional_price: 0 },
      { id: "v20c", size: "M (29-31″)", colour: "Black", sku: "LWT-BLK-M", stock_count: 18, additional_price: 0 },
      { id: "v20d", size: "L (32-34″)", colour: "Black", sku: "LWT-BLK-L", stock_count: 14, additional_price: 0 },
      { id: "v20e", size: "XL (35-37″)", colour: "Black", sku: "LWT-BLK-XL", stock_count: 10, additional_price: 0 },
      { id: "v20f", size: "S (27-28″)", colour: "Nude", sku: "LWT-NDE-S", stock_count: 8, additional_price: 0 },
      { id: "v20g", size: "M (29-31″)", colour: "Nude", sku: "LWT-NDE-M", stock_count: 10, additional_price: 0 },
    ],
  },
];

export const featuredProducts = products.filter((p) => p.is_featured);
