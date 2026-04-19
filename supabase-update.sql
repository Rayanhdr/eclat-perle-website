-- =============================================
-- Eclat Perlé — Supabase UPDATE Script
-- Run this in your Supabase SQL Editor
-- (Run this AFTER the initial supabase-setup.sql)
-- =============================================

-- 1. Add max_quantity column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_quantity INTEGER DEFAULT NULL;

-- 2. Add delivery_charge to settings
INSERT INTO settings (key, value) VALUES ('delivery_charge', '0') ON CONFLICT (key) DO NOTHING;

-- 3. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city    TEXT DEFAULT '',
  customer_notes   TEXT DEFAULT '',
  items            JSONB NOT NULL,
  subtotal         NUMERIC(10, 2) NOT NULL,
  delivery_charge  NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total            NUMERIC(10, 2) NOT NULL,
  status           TEXT DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
