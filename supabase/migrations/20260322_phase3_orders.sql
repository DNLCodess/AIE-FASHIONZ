-- ============================================================
-- Phase 3: Orders, Order Items, and Stock Management
-- ============================================================

-- ── orders ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference         text UNIQUE NOT NULL,
  status            text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_provider  text CHECK (payment_provider IN ('stripe', 'paystack')),

  -- Customer
  email             text NOT NULL,
  first_name        text NOT NULL,
  last_name         text NOT NULL,
  phone             text,

  -- Delivery address
  address_line1     text NOT NULL,
  address_line2     text,
  city              text NOT NULL,
  state             text,
  postcode          text NOT NULL,
  country           text NOT NULL DEFAULT 'GB',

  -- Financials (all in smallest currency unit: pence / kobo)
  currency          text NOT NULL DEFAULT 'GBP',
  subtotal          integer NOT NULL,
  shipping          integer NOT NULL DEFAULT 0,
  vat               integer NOT NULL DEFAULT 0,
  total             integer NOT NULL,

  -- Auth link (nullable — guest orders allowed)
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  fulfilled_at      timestamptz
);

-- ── order_items ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  text,               -- Supabase product UUID or mock ID
  variant_id  text,               -- Variant UUID
  title       text NOT NULL,
  size        text,
  colour      text,
  price       integer NOT NULL,   -- Unit price in pence/kobo at time of purchase
  quantity    integer NOT NULL CHECK (quantity > 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast order lookup
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_email         ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id       ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── decrement_stock RPC ──────────────────────────────────────
-- Called after payment confirmation to decrement variant stock.
-- Uses SECURITY DEFINER so it bypasses RLS (called from service role context).
CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id text, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE product_variants
  SET    stock_quantity = GREATEST(stock_quantity - p_quantity, 0)
  WHERE  id = p_variant_id;
END;
$$;

-- ── RLS Policies ─────────────────────────────────────────────
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can read their own order items
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- No direct insert/update from client — all mutations via service role in API routes
-- (The service role bypasses RLS entirely)
