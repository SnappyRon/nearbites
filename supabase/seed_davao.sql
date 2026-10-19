-- ==============================================================================
-- NearBites Davao City Pilot Seed Script
-- Populates 15 Verified Authentic Davao Food Establishments and 43 Local Dishes
-- Coordinates centered on Davao City Poblacion (7.0707° N, 125.6087° E)
-- ==============================================================================

-- 1. INSERT DAVAO RESTAURANTS
INSERT INTO public.restaurants (id, name, address, location, is_verified) VALUES
('d0000001-0000-0000-0000-000000000001', 'Sana''s Original Kabawan & Bulaloan', '8 J. Luna St Ext cor Bangoy St, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6143, 7.0742), 4326), true),
('d0000001-0000-0000-0000-000000000002', 'Bulcachong', '18 General Luna St, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6074, 7.0689), 4326), true),
('d0000001-0000-0000-0000-000000000003', 'Lachi''s Sans Rival Atbp.', 'Ruby St, Marfori Heights Subdivision, Davao City', ST_SetSRID(ST_MakePoint(125.6042, 7.0768), 4326), true),
('d0000001-0000-0000-0000-000000000004', 'Romeo''s Sisigan sa Dakbayan', 'Lupo Diaz St, Barrio Obrero, Davao City', ST_SetSRID(ST_MakePoint(125.6186, 7.0818), 4326), true),
('d0000001-0000-0000-0000-000000000005', 'TAPS Davao', 'Bolton St cor Rizal St, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6062, 7.0674), 4326), true),
('d0000001-0000-0000-0000-000000000006', 'Luz Kinilaw Place', 'Salmonan, Quezon Blvd, Davao City', ST_SetSRID(ST_MakePoint(125.6158, 7.0632), 4326), true),
('d0000001-0000-0000-0000-000000000007', 'Colasa''s Bar-B-Que', 'Magallanes St (A. Pichon St), Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6070, 7.0658), 4326), true),
('d0000001-0000-0000-0000-000000000008', 'Penong''s Barbecue Seafood & Grill', 'Ilustre St, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6082, 7.0688), 4326), true),
('d0000001-0000-0000-0000-000000000009', 'Roxas Night Market Stalls', 'Roxas Ave, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6125, 7.0722), 4326), true),
('d0000001-0000-0000-0000-000000000010', 'Del Mar Painitan Bankerohan', 'Stalls 12-14, Bankerohan Public Market, Marfori St, Davao City', ST_SetSRID(ST_MakePoint(125.6033, 7.0645), 4326), true),
('d0000001-0000-0000-0000-000000000011', 'Dencia''s Restaurant', 'General Luna St, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6088, 7.0694), 4326), true),
('d0000001-0000-0000-0000-000000000012', 'Cecil''s Snack Inn & Bakeshop', '198 F. Iñigo St, Poblacion, Davao City', ST_SetSRID(ST_MakePoint(125.6095, 7.0682), 4326), true),
('d0000001-0000-0000-0000-000000000013', 'New Davao Famous Restaurant', '401 Ramon Magsaysay Ave (Chinatown), Davao City', ST_SetSRID(ST_MakePoint(125.6190, 7.0765), 4326), true),
('d0000001-0000-0000-0000-000000000014', 'Purge Coffee Roasters', 'Tulip Drive, Matina, Davao City', ST_SetSRID(ST_MakePoint(125.5892, 7.0543), 4326), true),
('d0000001-0000-0000-0000-000000000015', 'Huckleberry Southern Kitchen & Bar', 'Oboza Heritage Compound, 143 J. Rizal St cor Inigo St, Davao City', ST_SetSRID(ST_MakePoint(125.6067, 7.0678), 4326), true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  location = EXCLUDED.location,
  is_verified = EXCLUDED.is_verified;

-- 2. INSERT DAVAO DISHES
INSERT INTO public.meals (id, restaurant_id, title, description, current_price, category, hero_photo_url, moderation_status, last_confirmed_at) VALUES
-- 1. Sana's Kabawan & Bulaloan
('d0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Crispy Kalabaw Tapa', 'Legendary Davao cured carabao beef tapa, quick-fried until crispy on the edges with garlic rice and fried egg.', 80.00, 'Rice Meals', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000001', 'Spicy Kalabaw Hinalang Stew', 'Fiery and aromatic spiced carabeef soup stewed with ginger, native labuyo chilies, and scallions.', 90.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', 'approved', NOW() - INTERVAL '4 days'),
('d0000002-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000001', 'Sana''s Special Bulalo Pot', 'Simmering slow-cooked bone-in beef shank with rich marrow and fresh local greens.', 165.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),

-- 2. Bulcachong
('d0000002-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000002', 'Bulcachong Carabao Bulalo', 'Famous orange-tinted ginger-infused carabao bone marrow stew cooked with spices until gelatinous and tender.', 165.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000002', 'Davao Yellowfin Tuna Kinilaw', 'Fresh Gulf yellowfin tuna cubes cured in coconut tuba vinegar, cucumber, ginger, and native Davao labuyo.', 150.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '3 days'),

-- 3. Lachi's Sans Rival Atbp.
('d0000002-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000003', 'Unforgettable Grilled Pork Ribs', 'Lachi''s celebrated fall-off-the-bone tender grilled ribs basted in a secret sweet savory glaze.', 240.00, 'Rice Meals', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', 'approved', NOW() - INTERVAL '5 days'),
('d0000002-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000003', 'Spicy Laing with Lechon', 'Creamy taro leaves simmered in rich coconut milk, topped with generous crispy roasted pork lechon.', 145.00, 'Rice Meals', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '7 days'),
('d0000002-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000003', 'Classic Cashew Sans Rival (Slice)', 'Award-winning five-layer cashew meringue cake with rich French buttercream.', 85.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000009', 'd0000001-0000-0000-0000-000000000003', 'Fresh Durian Sans Rival (Slice)', 'Decadent chilled cashew meringue layered with real fresh Davao Puyat durian pulp buttercream.', 95.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'approved', NOW() - INTERVAL '6 days'),

-- 4. Romeo's Sisigan sa Dakbayan
('d0000002-0000-0000-0000-000000000010', 'd0000001-0000-0000-0000-000000000004', 'Sizzling Pork Sisig w/ Rice', 'Signature Davao Barrio Obrero sizzling minced pork face and jowl with calamansi and green chilies.', 95.00, 'Silog', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80', 'approved', NOW() - INTERVAL '3 days'),
('d0000002-0000-0000-0000-000000000011', 'd0000001-0000-0000-0000-000000000004', 'Sisig Overload w/ Egg & Chicharon', 'Sizzling pork sisig heaped with fresh egg, crushed chicharon, and creamy house dressing with sinangag.', 125.00, 'Silog', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000012', 'd0000001-0000-0000-0000-000000000004', 'Meaty Dinuguan w/ Rice', 'Deep, rich pork blood stew simmered with vinegar and green long chilies, served with steamed rice.', 80.00, 'Rice Meals', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '18 days'),

-- 5. TAPS Davao
('d0000002-0000-0000-0000-000000000013', 'd0000001-0000-0000-0000-000000000005', 'Original Tapsilog', 'Iconic Davao 24/7 tapsihan tender marinated sweet-savory beef tapa with garlic fried rice and sunny egg.', 95.00, 'Silog', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000014', 'd0000001-0000-0000-0000-000000000005', 'Crispy Lekasilog (Lechon Kawali)', 'Super crunchy deep-fried pork belly slices paired with garlic sinangag and sunny fried egg.', 110.00, 'Silog', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', 'approved', NOW() - INTERVAL '4 days'),
('d0000002-0000-0000-0000-000000000015', 'd0000001-0000-0000-0000-000000000005', 'Savory Porksilog Plate', 'Marinated pork chop pan-seared to golden perfection with garlic rice and egg.', 85.00, 'Silog', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '10 days'),

-- 6. Luz Kinilaw Place
('d0000002-0000-0000-0000-000000000016', 'd0000001-0000-0000-0000-000000000006', 'Original Davao Tuna Kinilaw', 'The original Davao ceviche made from sashimi-grade yellowfin tuna cured in calamansi, sinamak vinegar, and ginger.', 200.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000017', 'd0000001-0000-0000-0000-000000000006', 'Charcoal Grilled Tuna Panga', 'Thick yellowfin tuna jaw grilled over open mangrove charcoal, basted with native sweet soy garlic glaze.', 250.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),

-- 7. Colasa's Bar-B-Que
('d0000002-0000-0000-0000-000000000018', 'd0000001-0000-0000-0000-000000000007', 'Classic Davao Pork BBQ (Stick)', 'Legendary street grill pork skewer glazed in Davao sweet banana ketchup and calamansi barbecue sauce.', 45.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', 'approved', NOW() - INTERVAL '3 days'),
('d0000002-0000-0000-0000-000000000019', 'd0000001-0000-0000-0000-000000000007', 'Grilled Chicken Inasal Paa', 'Tender chicken leg quarter steeped in lemongrass, sinamak, and annatto oil, grilled over red-hot coals.', 175.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', 'approved', NOW() - INTERVAL '5 days'),

-- 8. Penong's Barbecue Seafood & Grill
('d0000002-0000-0000-0000-000000000020', 'd0000001-0000-0000-0000-000000000008', 'Inato 1 Chicken Inasal w/ Unli Rice', 'Signature Davao skewered chicken inasal leg served with unlimited garlic fried rice and chicken oil.', 168.00, 'Rice Meals', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000021', 'd0000001-0000-0000-0000-000000000008', 'Crispy Adobong Kangkong', 'Fresh river spinach flash-cooked with garlic, native soy vinegar, and crispy garlic crunchies.', 99.00, 'Rice Meals', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '8 days'),

-- 9. Roxas Night Market Food Stalls
('d0000002-0000-0000-0000-000000000022', 'd0000001-0000-0000-0000-000000000009', 'Night Market Grilled Tuna Panga', 'Freshly grilled yellowfin tuna collar from the Davao Gulf, basted over charcoal with soy calamansi glaze.', 150.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000023', 'd0000001-0000-0000-0000-000000000009', 'Charcoal Grilled Isaw Skewer', 'Charred chicken intestine skewers basted in savory sweet sauce, served hot off the Roxas street grills.', 20.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000024', 'd0000001-0000-0000-0000-000000000009', 'Crispy Dynamite Cheese Lumpiya', 'Whole green chili pepper stuffed with creamy cheddar cheese, wrapped in crisp spring roll wrapper.', 25.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000025', 'd0000001-0000-0000-0000-000000000009', 'Fresh Davao Durian Shake', 'Thick refreshing smoothie blended with authentic creamy Davao durian fruit and condensed milk.', 50.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),

-- 10. Del Mar Painitan Bankerohan
('d0000002-0000-0000-0000-000000000026', 'd0000001-0000-0000-0000-000000000010', 'Puto Maya Tapol (Purple Sticky Rice)', 'Traditional purple tapol glutinous rice steamed with ginger and coconut milk in banana leaves.', 20.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000027', 'd0000001-0000-0000-0000-000000000010', 'Pure Native Davao Sikwate (Hot Tablea)', 'Rich, frothy hot chocolate hand-whisked using 100% pure fermented Davao single-origin cacao tablea.', 25.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000028', 'd0000001-0000-0000-0000-000000000010', 'Puto Maya & Sweet Ripe Mango Combo', 'Warm purple puto maya served alongside slices of sweet golden Mindanao mango and hot sikwate.', 55.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000029', 'd0000001-0000-0000-0000-000000000010', 'Pork Bone Broth Mami Bowl', 'Bankerohan morning market egg noodle soup in a rich bone broth with braised pork and spring onions.', 75.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),

-- 11. Dencia's Restaurant
('d0000002-0000-0000-0000-000000000030', 'd0000001-0000-0000-0000-000000000011', 'Historic Tokwa''t Baboy Platter', 'Dencia''s time-honored fried firm tofu cubes and tender pork ears tossed in spiced native vinegar and sweet soy.', 65.00, 'Rice Meals', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '3 days'),
('d0000002-0000-0000-0000-000000000031', 'd0000001-0000-0000-0000-000000000011', 'Special Congee Lugaw w/ Goto', 'Hearty comforting rice porridge simmered with tender ox tripe, crispy garlic bits, ginger, and scallions.', 85.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', 'approved', NOW() - INTERVAL '4 days'),
('d0000002-0000-0000-0000-000000000032', 'd0000001-0000-0000-0000-000000000011', 'Fresh Lumpia Sariwa with Peanut Sauce', 'Homemade egg crepe filled with tender hearts of palm (ubod), ground pork, and thick brown garlic peanut sauce.', 25.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', 'approved', NOW() - INTERVAL '5 days'),

-- 12. Cecil's Snack Inn & Bakeshop
('d0000002-0000-0000-0000-000000000033', 'd0000001-0000-0000-0000-000000000012', 'Iconic Pancit Luglug (Palabok)', 'Cecil''s legendary thick rice noodles generously covered in savory shrimp sauce, crushed chicharon, and egg.', 75.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000034', 'd0000001-0000-0000-0000-000000000012', 'Comforting Special Batchoy', 'Piping hot egg noodles in flavorful broth with pork chicharon, liver, crispy garlic, and fresh egg.', 85.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', 'approved', NOW() - INTERVAL '6 days'),
('d0000002-0000-0000-0000-000000000035', 'd0000001-0000-0000-0000-000000000012', 'Fresh Baked Durian Pie (Slice)', 'Custard pie with flaky crust filled with aromatic roasted Davao durian cream.', 75.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'approved', NOW() - INTERVAL '3 days'),
('d0000002-0000-0000-0000-000000000036', 'd0000001-0000-0000-0000-000000000012', 'Classic Chocolate Eclair', 'Light choux pastry filled with sweet vanilla custard and coated with rich dark chocolate fudge.', 32.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', 'approved', NOW() - INTERVAL '7 days'),

-- 13. New Davao Famous Restaurant
('d0000002-0000-0000-0000-000000000037', 'd0000001-0000-0000-0000-000000000013', 'Special Famous Siopao Bola-Bola', 'Giant fluffy steamed bun filled with seasoned ground pork, Chinese chorizo, and salted duck egg yolk.', 55.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),
('d0000002-0000-0000-0000-000000000038', 'd0000001-0000-0000-0000-000000000013', 'Savory Pork Lomi Bowl', 'Thick egg noodles in piping-hot starchy broth with sliced pork, liver, meatballs, and scallions.', 120.00, 'Noodles & Soup', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80', 'approved', NOW() - INTERVAL '5 days'),
('d0000002-0000-0000-0000-000000000039', 'd0000001-0000-0000-0000-000000000013', 'Crispy Battered Chicken Butt', 'Crispy fried chicken tail nuggets seasoned with Chinese five-spice, served with spiced vinegar dip.', 90.00, 'Street Food & BBQ', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', 'approved', NOW() - INTERVAL '14 days'),

-- 14. Purge Coffee Roasters
('d0000002-0000-0000-0000-000000000040', 'd0000001-0000-0000-0000-000000000014', 'Mt. Apo Single-Origin V60 Pour-Over', 'Hand-brewed single-origin specialty coffee cultivated on the volcanic slopes of Mt. Apo, Davao.', 140.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&q=80', 'approved', NOW() - INTERVAL '1 day'),
('d0000002-0000-0000-0000-000000000041', 'd0000001-0000-0000-0000-000000000014', 'Davao Artisan Mocha Lava', 'Artisan espresso blended with rich Malagos Davao dark chocolate and silky textured steamed milk.', 165.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 'approved', NOW() - INTERVAL '2 days'),

-- 15. Huckleberry Southern Kitchen & Bar
('d0000002-0000-0000-0000-000000000042', 'd0000001-0000-0000-0000-000000000015', 'Southern Fried Chicken & Buttermilk Waffles', 'Buttermilk-brined crispy Southern fried chicken paired with golden waffles and house honey-bourbon syrup.', 365.00, 'Rice Meals', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', 'approved', NOW() - INTERVAL '3 days'),
('d0000002-0000-0000-0000-000000000043', 'd0000001-0000-0000-0000-000000000015', 'French Market Beignets w/ Chocolate Dip', 'Golden crisp New Orleans style fried yeast pastries dusted with powdered sugar, served with warm chocolate dip.', 185.00, 'Snacks & Merienda', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80', 'approved', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE SET
  restaurant_id = EXCLUDED.restaurant_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  current_price = EXCLUDED.current_price,
  category = EXCLUDED.category,
  hero_photo_url = EXCLUDED.hero_photo_url,
  moderation_status = EXCLUDED.moderation_status,
  last_confirmed_at = EXCLUDED.last_confirmed_at;
