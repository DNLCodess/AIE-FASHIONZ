-- ============================================================
-- Phase 5: Admin Role + Products + Categories Schema
-- ============================================================

-- ── categories ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed the 6 default categories
INSERT INTO categories (name, slug) VALUES
  ('Luxury Fabrics',     'luxury-fabrics'),
  ('Bags & Shoes',       'bags-shoes'),
  ('Jewellery',          'jewellery'),
  ('Party & Dinner Wear','party-dinner-wear'),
  ('Children''s Wear',   'childrens-wear'),
  ('Body Shapers',       'body-shapers')
ON CONFLICT (slug) DO NOTHING;

-- ── products ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  slug          text UNIQUE NOT NULL,
  description   text,
  category_slug text REFERENCES categories(slug) ON UPDATE CASCADE,
  base_price    integer NOT NULL,         -- pence
  compare_price integer,                  -- pence
  images        jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{url, alt, is_primary}]
  is_active     boolean NOT NULL DEFAULT true,
  is_featured   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

-- ── product_variants ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size             text,
  colour           text,
  additional_price integer NOT NULL DEFAULT 0,  -- pence
  stock_quantity   integer NOT NULL DEFAULT 0,
  sku              text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON product_variants(product_id);

-- Auto-update products.updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants  ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read active products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read variants"
  ON product_variants FOR SELECT USING (true);

-- Admins can do everything (service role bypasses RLS entirely)

-- ── Admin role helper ─────────────────────────────────────────
-- Run this from Supabase SQL editor or admin API to promote a user:
--
--   SELECT set_admin_role('<user-uuid>');
--
CREATE OR REPLACE FUNCTION set_admin_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET    raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE  id = p_user_id;
END;
$$;
