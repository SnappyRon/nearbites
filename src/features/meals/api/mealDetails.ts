import { SEED_MEALS } from '@/services/mockData/seedMeals';
import { MealDetail, OtherMealItem } from '../types';
import { calculateDistanceMeters } from '@/features/map/utils/distance';

interface RestaurantInfo {
  address: string;
  openingHours: string;
  isOpenNow: boolean;
  isVerified: boolean;
  coverPhotoUrl: string;
}

export const RESTAURANT_METADATA: Record<string, RestaurantInfo> = {
  'a0000001-0000-0000-0000-000000000001': {
    address: '1248 Concepcion St, Ermita, Manila',
    openingHours: '7:00 AM – 8:30 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000002': {
    address: '924 P. Noval St, Sampaloc, Manila',
    openingHours: '3:00 PM – 11:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000003': {
    address: '1402 Dapitan St, Sampaloc, Manila',
    openingHours: '24 Hours Open',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000004': {
    address: '710 España Blvd, Sampaloc, Manila',
    openingHours: '8:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000005': {
    address: '520 Mayhaligue St, Santa Cruz, Manila',
    openingHours: '24 Hours Open',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000006': {
    address: '84 East Capitol Dr, Kapitolyo, Pasig',
    openingHours: '24 Hours Open',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000007': {
    address: '12 West Capitol Dr, Kapitolyo, Pasig',
    openingHours: '6:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000008': {
    address: '45 San Rafael St, Kapitolyo, Pasig',
    openingHours: '6:00 AM – 10:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000009': {
    address: '101 Pioneer St, Pasig',
    openingHours: '10:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
  },
  'a0000001-0000-0000-0000-000000000010': {
    address: '32 United St, Kapitolyo, Pasig',
    openingHours: '8:00 AM – 8:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&q=80',
  },

  // Davao City Establishments
  'd0000001-0000-0000-0000-000000000001': {
    address: '8 J. Luna St Ext cor Bangoy St, Poblacion, Davao City',
    openingHours: '6:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000002': {
    address: '18 General Luna St, Poblacion, Davao City',
    openingHours: '24 Hours Open',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000003': {
    address: 'Ruby St, Marfori Heights Subdivision, Davao City',
    openingHours: '10:00 AM – 8:00 PM (Closed Mondays)',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000004': {
    address: 'Lupo Diaz St, Barrio Obrero, Davao City',
    openingHours: '10:00 AM – 10:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000005': {
    address: 'Bolton St cor Rizal St, Poblacion, Davao City',
    openingHours: '24 Hours Open',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000006': {
    address: 'Salmonan, Quezon Blvd, Davao City',
    openingHours: '8:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000007': {
    address: 'Magallanes St (A. Pichon St), Poblacion, Davao City',
    openingHours: '4:00 PM – 12:00 MN',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000008': {
    address: 'Ilustre St, Poblacion, Davao City',
    openingHours: '10:00 AM – 9:30 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000009': {
    address: 'Roxas Ave, Poblacion, Davao City',
    openingHours: '5:30 PM – 11:30 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000010': {
    address: 'Stalls 12-14, Bankerohan Public Market, Marfori St, Davao City',
    openingHours: '4:00 AM – 12:00 NN',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000011': {
    address: 'General Luna St, Poblacion, Davao City',
    openingHours: '7:00 AM – 8:30 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000012': {
    address: '198 F. Iñigo St (formerly Anda St), Poblacion, Davao City',
    openingHours: '8:00 AM – 7:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000013': {
    address: '401 Ramon Magsaysay Ave (Chinatown), Davao City',
    openingHours: '9:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000014': {
    address: 'Tulip Drive, Matina, Davao City',
    openingHours: '7:00 AM – 10:00 PM',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80',
  },
  'd0000001-0000-0000-0000-000000000015': {
    address: 'Oboza Heritage Compound, 143 J. Rizal St cor Inigo St, Davao City',
    openingHours: '11:00 AM – 12:00 MN',
    isOpenNow: true,
    isVerified: true,
    coverPhotoUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
  },
};

const MEAL_DESCRIPTIONS: Record<string, { desc: string; daysAgo: number; extraPhotos: string[] }> = {
  'seed-meal-01': {
    desc: 'Sizzling diced pork belly with seasoned calamansi onions, egg, and warm garlic sinangag.',
    daysAgo: 3,
    extraPhotos: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    ],
  },
  'seed-meal-02': {
    desc: 'Crispy fried tofu and savory pork belly bits tossed in a sweet spicy soy-vinegar dressing with rice.',
    daysAgo: 12,
    extraPhotos: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    ],
  },
  'seed-meal-03': {
    desc: 'Tamarind-infused pork rib soup cooked with crisp kangkong, radish, and finger chili peppers.',
    daysAgo: 40,
    extraPhotos: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    ],
  },
  'seed-meal-04': {
    desc: 'Freshly grilled chicken intestine skewers marinated in a secret brown sugar and garlic sauce.',
    daysAgo: 2,
    extraPhotos: [
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80',
    ],
  },
  'seed-meal-05': {
    desc: 'Three skewers of caramelized pork BBQ basted in sweet banana ketchup glaze, served with cup of rice.',
    daysAgo: 5,
    extraPhotos: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    ],
  },
  'seed-meal-06': {
    desc: 'Grilled skewered blood cubes and tender pig ears paired with homemade chili-spiced native vinegar.',
    daysAgo: 95,
    extraPhotos: [],
  },
  'seed-meal-07': {
    desc: 'Tender marinated beef tapa flakes with fried sunny-side egg, sinangag rice, and house atchara.',
    daysAgo: 8,
    extraPhotos: [
      'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80',
    ],
  },
  'seed-meal-08': {
    desc: 'Caramelized sweet cured pork slices pan-fried until sticky, served with garlic rice and egg.',
    daysAgo: 15,
    extraPhotos: [],
  },
  'seed-meal-09': {
    desc: 'Crispy fried marinated boneless milkfish with golden garlic fried rice and sunny egg.',
    daysAgo: 60,
    extraPhotos: [],
  },
  'seed-meal-10': {
    desc: '4 pieces of crispy fried pork siomai served over hot rice with calamansi and spicy chili-garlic oil.',
    daysAgo: 1,
    extraPhotos: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&q=80',
    ],
  },
  'seed-meal-11': {
    desc: 'Five golden crispy lumpiang shanghai rolls loaded with seasoned minced pork and sweet-sour dip.',
    daysAgo: 18,
    extraPhotos: [],
  },
  'seed-meal-12': {
    desc: 'Classic slow-braised sweet anise beef brisket with fried garlic rice and a piping hot bowl of beef broth.',
    daysAgo: 4,
    extraPhotos: [
      'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80',
    ],
  },
  'seed-meal-13': {
    desc: 'Fresh egg noodles in rich 12-hour bone broth garnished with sliced tender beef, hard-boiled egg, and fried garlic.',
    daysAgo: 10,
    extraPhotos: [],
  },
  'seed-meal-14': {
    desc: 'Deep-fried crispy pork bagnet strips served with fried egg, sinangag, and spiced Ilocos vinegar.',
    daysAgo: 7,
    extraPhotos: [],
  },
  'seed-meal-15': {
    desc: 'Savory Lucban oregano longganisa patties pan-fried crispy with salted duck egg and sinangag.',
    daysAgo: 22,
    extraPhotos: [],
  },
  'seed-meal-16': {
    desc: 'Golden oven-baked toasted bun filled with sweet and savory braised pork asado filling.',
    daysAgo: 6,
    extraPhotos: [],
  },
  'seed-meal-17': {
    desc: 'Rice bihon noodles smothered in savory shrimp annatto sauce, crushed chicharon, hard egg, and scallions.',
    daysAgo: 14,
    extraPhotos: [],
  },
  'seed-meal-18': {
    desc: 'Comforting ginger-infused rice porridge topped with sliced hard-boiled egg and golden toasted garlic.',
    daysAgo: 2,
    extraPhotos: [],
  },
  'seed-meal-19': {
    desc: 'Deep-fried golden tofu cubes and seasoned pork cuts drizzled with pungent native vinegar and shallots.',
    daysAgo: 8,
    extraPhotos: [],
  },
  'seed-meal-20': {
    desc: 'Hand-rolled orange rice flour shell stuffed with crushed Vigan longganisa, green papaya, and farm egg.',
    daysAgo: 3,
    extraPhotos: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
    ],
  },
  'seed-meal-21': {
    desc: 'Crispy crackling pork belly chunks over fragrant rice with a generous side of tangy pickled papaya.',
    daysAgo: 5,
    extraPhotos: [],
  },
  'seed-meal-22': {
    desc: 'Authentic fiery pork belly stewed in thick coconut cream with abundant green finger chilies and shrimp paste.',
    daysAgo: 4,
    extraPhotos: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
    ],
  },
  'seed-meal-23': {
    desc: 'Shredded taro leaves slowly simmered in rich coconut cream with chili spices and savory smoked tinapa flakes.',
    daysAgo: 6,
    extraPhotos: [],
  },
  'seed-meal-24': {
    desc: 'Tender chicken thighs and potatoes cooked in aromatic curry powder and creamy coconut milk.',
    daysAgo: 92,
    extraPhotos: [],
  },
  'seed-meal-25': {
    desc: 'Traditional comforting stew of green mung beans sauteed with tomatoes, pork cracklings, and fresh malunggay leaves.',
    daysAgo: 35,
    extraPhotos: [],
  },

  // Davao City Meals
  'seed-davao-01': {
    desc: 'Legendary Davao cured carabao beef tapa, quick-fried until crispy on the edges with garlic rice and fried egg.',
    daysAgo: 2,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-02': {
    desc: 'Fiery and aromatic spiced carabeef soup stewed with ginger, native labuyo chilies, and scallions.',
    daysAgo: 4,
    extraPhotos: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'],
  },
  'seed-davao-03': {
    desc: 'Simmering slow-cooked bone-in beef shank with rich marrow and fresh local greens.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80'],
  },
  'seed-davao-04': {
    desc: 'Famous orange-tinted ginger-infused carabao bone marrow stew cooked with spices until gelatinous and tender.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'],
  },
  'seed-davao-05': {
    desc: 'Fresh Gulf yellowfin tuna cubes cured in coconut tuba vinegar, cucumber, ginger, and native Davao labuyo.',
    daysAgo: 3,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-06': {
    desc: "Lachi's celebrated fall-off-the-bone tender grilled ribs basted in a secret sweet savory glaze.",
    daysAgo: 5,
    extraPhotos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'],
  },
  'seed-davao-07': {
    desc: 'Creamy taro leaves simmered in rich coconut milk, topped with generous crispy roasted pork lechon.',
    daysAgo: 7,
    extraPhotos: [],
  },
  'seed-davao-08': {
    desc: 'Award-winning five-layer cashew meringue cake with rich French buttercream.',
    daysAgo: 2,
    extraPhotos: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80'],
  },
  'seed-davao-09': {
    desc: 'Decadent chilled cashew meringue layered with real fresh Davao Puyat durian pulp buttercream.',
    daysAgo: 6,
    extraPhotos: [],
  },
  'seed-davao-10': {
    desc: 'Signature Davao Barrio Obrero sizzling minced pork face and jowl with calamansi and green chilies.',
    daysAgo: 3,
    extraPhotos: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80'],
  },
  'seed-davao-11': {
    desc: 'Sizzling pork sisig heaped with fresh egg, crushed chicharon, and creamy house dressing with sinangag.',
    daysAgo: 2,
    extraPhotos: [],
  },
  'seed-davao-12': {
    desc: 'Deep, rich pork blood stew simmered with vinegar and green long chilies, served with steamed rice.',
    daysAgo: 18,
    extraPhotos: [],
  },
  'seed-davao-13': {
    desc: 'Iconic Davao 24/7 tapsihan tender marinated sweet-savory beef tapa with garlic fried rice and sunny egg.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-14': {
    desc: 'Super crunchy deep-fried pork belly slices paired with garlic sinangag and sunny fried egg.',
    daysAgo: 4,
    extraPhotos: [],
  },
  'seed-davao-15': {
    desc: 'Marinated pork chop pan-seared to golden perfection with garlic rice and egg.',
    daysAgo: 10,
    extraPhotos: [],
  },
  'seed-davao-16': {
    desc: 'The original Davao ceviche made from sashimi-grade yellowfin tuna cured in calamansi, sinamak vinegar, and ginger.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-17': {
    desc: 'Thick yellowfin tuna jaw grilled over open mangrove charcoal, basted with native sweet soy garlic glaze.',
    daysAgo: 2,
    extraPhotos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'],
  },
  'seed-davao-18': {
    desc: 'Legendary street grill pork skewer glazed in Davao sweet banana ketchup and calamansi barbecue sauce.',
    daysAgo: 3,
    extraPhotos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'],
  },
  'seed-davao-19': {
    desc: 'Tender chicken leg quarter steeped in lemongrass, sinamak, and annatto oil, grilled over red-hot coals.',
    daysAgo: 5,
    extraPhotos: [],
  },
  'seed-davao-20': {
    desc: 'Signature Davao skewered chicken inasal leg served with unlimited garlic fried rice and chicken oil.',
    daysAgo: 2,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-21': {
    desc: 'Fresh river spinach flash-cooked with garlic, native soy vinegar, and crispy garlic crunchies.',
    daysAgo: 8,
    extraPhotos: [],
  },
  'seed-davao-22': {
    desc: 'Freshly grilled yellowfin tuna collar from the Davao Gulf, basted over charcoal with soy calamansi glaze.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'],
  },
  'seed-davao-23': {
    desc: 'Charred chicken intestine skewers basted in savory sweet sauce, served hot off the Roxas street grills.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'],
  },
  'seed-davao-24': {
    desc: 'Whole green chili pepper stuffed with creamy cheddar cheese, wrapped in crisp spring roll wrapper.',
    daysAgo: 2,
    extraPhotos: [],
  },
  'seed-davao-25': {
    desc: 'Thick refreshing smoothie blended with authentic creamy Davao durian fruit and condensed milk.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80'],
  },
  'seed-davao-26': {
    desc: 'Traditional purple tapol glutinous rice steamed with ginger and coconut milk in banana leaves.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-27': {
    desc: 'Rich, frothy hot chocolate hand-whisked using 100% pure fermented Davao single-origin cacao tablea.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80'],
  },
  'seed-davao-28': {
    desc: 'Warm purple puto maya served alongside slices of sweet golden Mindanao mango and hot sikwate.',
    daysAgo: 1,
    extraPhotos: [],
  },
  'seed-davao-29': {
    desc: 'Bankerohan morning market egg noodle soup in a rich bone broth with braised pork and spring onions.',
    daysAgo: 2,
    extraPhotos: [],
  },
  'seed-davao-30': {
    desc: "Dencia's time-honored fried firm tofu cubes and tender pork ears tossed in spiced native vinegar and sweet soy.",
    daysAgo: 3,
    extraPhotos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'],
  },
  'seed-davao-31': {
    desc: 'Hearty comforting rice porridge simmered with tender ox tripe, crispy garlic bits, ginger, and scallions.',
    daysAgo: 4,
    extraPhotos: [],
  },
  'seed-davao-32': {
    desc: 'Homemade egg crepe filled with tender hearts of palm (ubod), ground pork, and thick brown garlic peanut sauce.',
    daysAgo: 5,
    extraPhotos: [],
  },
  'seed-davao-33': {
    desc: "Cecil's legendary thick rice noodles generously covered in savory shrimp sauce, crushed chicharon, and egg.",
    daysAgo: 2,
    extraPhotos: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80'],
  },
  'seed-davao-34': {
    desc: 'Piping hot egg noodles in flavorful broth with pork chicharon, liver, crispy garlic, and fresh egg.',
    daysAgo: 6,
    extraPhotos: [],
  },
  'seed-davao-35': {
    desc: 'Custard pie with flaky crust filled with aromatic roasted Davao durian cream.',
    daysAgo: 3,
    extraPhotos: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'],
  },
  'seed-davao-36': {
    desc: 'Light choux pastry filled with sweet vanilla custard and coated with rich dark chocolate fudge.',
    daysAgo: 7,
    extraPhotos: [],
  },
  'seed-davao-37': {
    desc: 'Giant fluffy steamed bun filled with seasoned ground pork, Chinese chorizo, and salted duck egg yolk.',
    daysAgo: 2,
    extraPhotos: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80'],
  },
  'seed-davao-38': {
    desc: 'Thick egg noodles in piping-hot starchy broth with sliced pork, liver, meatballs, and scallions.',
    daysAgo: 5,
    extraPhotos: [],
  },
  'seed-davao-39': {
    desc: 'Crispy fried chicken tail nuggets seasoned with Chinese five-spice, served with spiced vinegar dip.',
    daysAgo: 14,
    extraPhotos: [],
  },
  'seed-davao-40': {
    desc: 'Hand-brewed single-origin specialty coffee cultivated on the volcanic slopes of Mt. Apo, Davao.',
    daysAgo: 1,
    extraPhotos: ['https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&q=80'],
  },
  'seed-davao-41': {
    desc: 'Artisan espresso blended with rich Malagos Davao dark chocolate and silky textured steamed milk.',
    daysAgo: 2,
    extraPhotos: [],
  },
  'seed-davao-42': {
    desc: 'Buttermilk-brined crispy Southern fried chicken paired with golden waffles and house honey-bourbon syrup.',
    daysAgo: 3,
    extraPhotos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'],
  },
  'seed-davao-43': {
    desc: 'Golden crisp New Orleans style fried yeast pastries dusted with powdered sugar, served with warm chocolate dip.',
    daysAgo: 4,
    extraPhotos: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80'],
  },
};

export function getMealDetailById(
  id: string,
  userLocation?: { latitude: number; longitude: number } | null
): MealDetail | null {
  const seedMeal = SEED_MEALS.find((m) => m.id === id || m.mealId === id);
  if (!seedMeal) {
    return null;
  }

  const restaurantMeta = RESTAURANT_METADATA[seedMeal.restaurantId] || {
    address: 'University Belt, Manila',
    openingHours: '8:00 AM – 9:00 PM',
    isOpenNow: true,
    isVerified: true,
  };

  const mealMeta = MEAL_DESCRIPTIONS[seedMeal.id] || {
    desc: 'Delicious and affordable student meal made fresh daily.',
    daysAgo: seedMeal.freshnessTier === 'fresh' ? 3 : seedMeal.freshnessTier === 'aging' ? 45 : 95,
    extraPhotos: [],
  };

  // Calculate distance if user coords available
  let distanceMeters: number | null = null;
  if (userLocation) {
    distanceMeters = calculateDistanceMeters(userLocation, {
      latitude: seedMeal.latitude,
      longitude: seedMeal.longitude,
    });
  } else {
    // Default walking distance ~180m for demonstration
    distanceMeters = 180;
  }

  // Find other meals at this eatery
  const otherMeals: OtherMealItem[] = SEED_MEALS.filter(
    (m) => m.restaurantId === seedMeal.restaurantId && m.id !== seedMeal.id
  ).map((m) => ({
    id: m.id,
    mealId: m.mealId,
    title: m.title,
    price: m.price,
    thumbnailUrl: m.thumbnailUrl,
  }));

  const allPhotos = [seedMeal.thumbnailUrl, ...mealMeta.extraPhotos];

  return {
    id: seedMeal.id,
    mealId: seedMeal.mealId,
    restaurantId: seedMeal.restaurantId,
    restaurantName: seedMeal.restaurantName,
    restaurantAddress: restaurantMeta.address,
    restaurantCoverPhotoUrl: restaurantMeta.coverPhotoUrl,
    title: seedMeal.title,
    description: mealMeta.desc,
    price: seedMeal.price,
    category: seedMeal.category,
    heroPhotoUrl: seedMeal.thumbnailUrl,
    additionalPhotos: allPhotos,
    freshnessTier: seedMeal.freshnessTier,
    lastConfirmedAt: `${mealMeta.daysAgo} days ago`,
    daysAgo: mealMeta.daysAgo,
    confirmedBy: 'Community Scout',
    openingHours: restaurantMeta.openingHours,
    isOpenNow: restaurantMeta.isOpenNow,
    isVerifiedVenue: restaurantMeta.isVerified,
    latitude: seedMeal.latitude,
    longitude: seedMeal.longitude,
    distanceMeters,
    otherMeals,
  };
}
