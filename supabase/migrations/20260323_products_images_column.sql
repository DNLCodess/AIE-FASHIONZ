-- ============================================================
-- Migrate product images from separate table → JSONB column
-- Run this once if phase5_admin.sql has already been applied.
-- ============================================================

-- 1. Add images column to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. Drop the separate product_images table (cascades RLS policies + index)
DROP TABLE IF EXISTS product_images CASCADE;
