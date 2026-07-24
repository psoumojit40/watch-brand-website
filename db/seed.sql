-- Seed data for Audemars Piguet watch brand

INSERT INTO collections (name, slug, tagline, description, year_introduced, background_color, accent_color) VALUES
('Royal Oak', 'royal-oak', 'The Icon That Defied Convention', 'Launched in 1972, the Royal Oak was the world''s first luxury sports watch in steel. Its iconic octagonal bezel, integrated bracelet, and Tapisserie dial challenged every horological convention.', 1972, '#0a0a0a', '#c9a96e'),
('Royal Oak Offshore', 'royal-oak-offshore', 'Bold. Brutal. Unapologetic.', 'Born in 1993, the Royal Oak Offshore pushed the boundaries of design with its larger case, exposed pushers, and rubber strap.', 1993, '#1a1a2e', '#4a7c59'),
('Code 11.59', 'code-1159', 'A New Architecture of Time', 'The Code 11.59 collection represents a bold new design language with its complex multi-layered case and curved sapphire crystal.', 2019, '#1a1a1a', '#d4a853');

INSERT INTO products (name, slug, collection, price, currency, description, movement, case_material, case_diameter, water_resistance, power_reserve, features, is_new) VALUES
('Royal Oak Jumbo Extra-Thin', 'royal-oak-jumbo', 'Royal Oak', 38500, 'CHF', 'The Royal Oak Jumbo Extra-Thin in platinum. A masterpiece of ultra-thin watchmaking.', 'Calibre 7121 (Automatic, Extra-Thin)', 'Platinum 950', '39mm', '50m', '55 hours', ARRAY['Ultra-thin', 'Platinum case', 'Tapisserie dial', 'Integrated bracelet'], TRUE),
('Royal Oak Chronograph', 'royal-oak-chronograph', 'Royal Oak', 29500, 'CHF', 'Stainless steel chronograph with column-wheel Calibre 4401 movement.', 'Calibre 4401 (Automatic, Column-wheel Chronograph)', 'Stainless Steel', '41mm', '50m', '70 hours', ARRAY['Chronograph', 'Column-wheel', 'Flyback function', 'Sapphire caseback'], FALSE),
('Royal Oak Offshore Diver', 'offshore-diver', 'Royal Oak Offshore', 24500, 'CHF', 'Professional diver with 300m water resistance and Offshore DNA.', 'Calibre 4308 (Automatic, Diver)', 'Stainless Steel', '42mm', '300m', '60 hours', ARRAY['Diver certified', 'Internal rotating bezel', 'Rubber strap'], FALSE),
('Code 11.59 Selfwinding', 'code-1159-selfwinding', 'Code 11.59', 28500, 'CHF', 'Pink gold selfwinding with double-curved crystal and openworked dial.', 'Calibre 4302 (Automatic)', 'Pink Gold 18k', '41mm', '30m', '70 hours', ARRAY['Openworked dial', 'Double-curved crystal', 'Alligator strap'], FALSE);

INSERT INTO timeline_events (year, title, description, category) VALUES
(1875, 'The Founding', 'Jules Louis Audemars and Edward Auguste Piguet establish their workshop in Le Brassus.', 'founding'),
(1889, 'First Grande Complication', 'First grande complication pocket watch with minute repeater, perpetual calendar, and chronograph.', 'milestone'),
(1972, 'Royal Oak Launched', 'The world''s first luxury sports watch in steel is unveiled at Basel Fair.', 'icon'),
(2019, 'Code 11.59 Collection', 'A completely new design language debuts with the Code 11.59 collection.', 'icon');
