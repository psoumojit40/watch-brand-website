-- Watch Brand Website Schema
-- PostgreSQL

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  hero_image TEXT DEFAULT '',
  background_color VARCHAR(7) DEFAULT '#0a0a0a',
  accent_color VARCHAR(7) DEFAULT '#c9a96e',
  year_introduced INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  collection VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CHF',
  description TEXT,
  short_description TEXT,
  images TEXT[] DEFAULT '{}',
  movement VARCHAR(255),
  case_material VARCHAR(255),
  case_diameter VARCHAR(50),
  water_resistance VARCHAR(50),
  power_reserve VARCHAR(50),
  features TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  is_limited BOOLEAN DEFAULT FALSE,
  limited_edition INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_specifications_product ON specifications(product_id);
CREATE INDEX idx_timeline_year ON timeline_events(year);
