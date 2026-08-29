-- QuickBite Seed Data — Ethiopian Traditional Foods
-- Run this file after 01_schema.sql.
-- Uses INSERT ... ON CONFLICT DO NOTHING so it is safe to re-run.

INSERT INTO foods (id, name, description, price, available, image) VALUES
  (1,  'Doro Wat',  'Spicy chicken stew cooked with berbere, onions, garlic, and Ethiopian spices, served with injera.',          250.00, true, 'img/dorowot.jpg'),
  (2,  'Shiro Wat', 'Smooth chickpea stew seasoned with berbere, garlic, and traditional Ethiopian spices, served with injera.',  180.00, true, 'img/shiro.jpg'),
  (3,  'Tibs',      'Sautéed beef cooked with onions, peppers, rosemary, and Ethiopian spices.',                                  280.00, true, 'img/tibs.jpg'),
  (4,  'Kitfo',     'Minced beef seasoned with mitmita and Ethiopian spiced butter, traditionally served with ayib and greens.',  300.00, true, 'img/kitfo.jpg'),
  (5,  'Firfir',    'Pieces of injera mixed with spicy berbere sauce and seasoned butter.',                                       160.00, true, 'img/firfir.jpg'),
  (6,  'Misir Wat', 'Spicy red lentil stew cooked with berbere, onions, garlic, and traditional Ethiopian spices.',               150.00, true, 'img/misirwot.jpg'),
  (7,  'Gomen',     'Slow-cooked collard greens seasoned with garlic, ginger, and Ethiopian spices.',                             140.00, true, 'img/gomen.jpg'),
  (8,  'Beyaynetu', 'A colorful combination of Ethiopian vegetarian dishes served together with injera.',                         220.00, true, 'img/beyaynetu.jpg'),
  (9,  'Dulet',     'Traditional Ethiopian dish made with finely chopped meat, liver, and spices.',                               270.00, true, 'img/dulet.jpg'),
  (10, 'Chechebsa', 'Torn pieces of flatbread mixed with spiced butter and berbere, commonly served for breakfast.',              150.00, true, 'img/chechebsa.jpg')
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence so the next auto-generated ID starts after the seeded rows.
SELECT setval('foods_id_seq', (SELECT MAX(id) FROM foods));
