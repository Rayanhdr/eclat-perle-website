-- =============================================
-- Eclat Perlé — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'Keychains',
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  image       TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Settings table
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 3. Disable RLS (all product data is public, auth handled by the app)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 4. Seed default settings
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '96170000000'),
  ('admin_password',  'EclatAdmin2024!')
ON CONFLICT (key) DO NOTHING;

-- 5. Seed default products
INSERT INTO products (name, category, price, description) VALUES
  ('Pink Resin Heart Keychain',    'Keychains', 5.00,  'Handcrafted pink resin heart keychain with gold flakes. Perfect as a gift.'),
  ('Pressed Flower Resin Keychain','Keychains', 6.00,  'Beautiful circular resin keychain with real pressed flowers preserved inside.'),
  ('Pearl Beaded Necklace',         'Jewelry',  12.00, 'Elegant handmade pearl beaded necklace, perfect for everyday wear.'),
  ('Colorful Beaded Bracelet',      'Jewelry',   7.00, 'Vibrant colorful beaded bracelet, handmade with love.'),
  ('Blue Crystal Bracelet',         'Jewelry',   8.00, 'Stunning blue and black crystal beaded bracelet.'),
  ('Kids Rainbow Bracelet Set',     'Kids',      4.00, 'Fun rainbow beaded bracelet set for kids. Safe and colorful.'),
  ('Resin Art Pendant',             'Resin Art', 9.00, 'Unique handcrafted resin art pendant with swirling colors.'),
  ('Gift Box Set',                  'Gifts',    22.00, 'Beautiful gift box set including a keychain, bracelet, and necklace.')
ON CONFLICT DO NOTHING;
