export interface PunePoi {
  id: string;
  name: string;
  category: 'hospital' | 'pharmacy' | 'police' | 'cafe' | 'transit' | 'fuel';
  coordinates: [number, number];
  address: string;
  rating: number;
  reviewsCount: number;
  openHours: string;
  phone?: string;
  photoUrl: string;
  safetyScore: number;
}

export const PUNE_CATEGORIZED_POIS: PunePoi[] = [
  // 🏥 24/7 Hospitals & Casualty
  {
    id: 'poi_ruby_hall_hinjawadi',
    name: 'Ruby Hall Clinic Hinjawadi (24/7 Emergency)',
    category: 'hospital',
    coordinates: [18.5912, 73.7389],
    address: 'Rajiv Gandhi Infotech Park, Phase 1, Hinjawadi',
    rating: 4.6,
    reviewsCount: 2840,
    openHours: 'Open 24 hours · Emergency Casualty Active',
    phone: '020 6645 5555',
    photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    safetyScore: 98
  },
  {
    id: 'poi_jupiter_baner',
    name: 'Jupiter Hospital Pune',
    category: 'hospital',
    coordinates: [18.5574, 73.7842],
    address: 'Near Balewadi Stadium, Baner-Mahalunge Road',
    rating: 4.7,
    reviewsCount: 3950,
    openHours: 'Open 24 hours · ICU & Trauma Care',
    phone: '020 2799 2222',
    photoUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    safetyScore: 97
  },
  {
    id: 'poi_sahyadri_kothrud',
    name: 'Sahyadri Super Speciality Hospital',
    category: 'hospital',
    coordinates: [18.5034, 73.8078],
    address: 'Plot No. 30 C, Erandwane, Karve Road, Kothrud',
    rating: 4.5,
    reviewsCount: 3210,
    openHours: 'Open 24 hours · 24/7 Pharmacy on-site',
    phone: '020 6721 3000',
    photoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    safetyScore: 96
  },

  // 💊 24/7 Medicals & Pharmacies
  {
    id: 'poi_wellness_forever_wakad',
    name: 'Wellness Forever 24/7 Day & Night Chemist',
    category: 'pharmacy',
    coordinates: [18.5985, 73.7628],
    address: 'Datta Mandir Road, Wakad, Pimpri-Chinchwad',
    rating: 4.4,
    reviewsCount: 920,
    openHours: 'Open 24 hours · Well-lit storefront',
    phone: '020 2770 1122',
    photoUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&auto=format&fit=crop&q=80',
    safetyScore: 94
  },
  {
    id: 'poi_apollo_baner',
    name: 'Apollo 24/7 Pharmacy & Night Care',
    category: 'pharmacy',
    coordinates: [18.5592, 73.7915],
    address: 'Baner High Street, opp. Balewadi Phata',
    rating: 4.5,
    reviewsCount: 680,
    openHours: 'Open 24 hours · CCTV Monitored',
    phone: '020 6682 9900',
    photoUrl: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600&auto=format&fit=crop&q=80',
    safetyScore: 95
  },

  // 👮 Police Stations & Safe Chowkis
  {
    id: 'poi_hinjawadi_police',
    name: 'Hinjawadi Police Station (Senior Inspector)',
    category: 'police',
    coordinates: [18.5954, 73.7431],
    address: 'Near Shivaji Chowk, Hinjawadi Phase 1',
    rating: 4.8,
    reviewsCount: 890,
    openHours: 'Open 24 hours · Women Help Desk Active',
    phone: '020 2293 3100',
    photoUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    safetyScore: 99
  },
  {
    id: 'poi_kothrud_police',
    name: 'Kothrud Police Station & Damini Squad Chowki',
    category: 'police',
    coordinates: [18.5078, 73.8052],
    address: 'Mayur Colony, Karve Road, Kothrud',
    rating: 4.7,
    reviewsCount: 1120,
    openHours: 'Open 24 hours · Patrol Van 112 Standby',
    phone: '020 2538 0100',
    photoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    safetyScore: 99
  },
  {
    id: 'poi_chatushrungi_police',
    name: 'Chatushrungi Police Station',
    category: 'police',
    coordinates: [18.5412, 73.8295],
    address: 'Senapati Bapat Road, Ganeshkhind',
    rating: 4.6,
    reviewsCount: 780,
    openHours: 'Open 24 hours · Highway Patrol Link',
    phone: '020 2565 5335',
    photoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    safetyScore: 98
  },

  // ☕ 24/7 Cafes, Food Plazas & Active Frontage
  {
    id: 'poi_starbucks_baner',
    name: 'Starbucks Baner High Street (Active Frontage)',
    category: 'cafe',
    coordinates: [18.5585, 73.7932],
    address: 'Baner High Street, near Veritas IT Park',
    rating: 4.6,
    reviewsCount: 4200,
    openHours: 'Open until 2:00 AM · High Security & Illumination',
    phone: '020 6712 4455',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    safetyScore: 92
  },
  {
    id: 'poi_mcdonalds_wakad',
    name: "McDonald's 24/7 Drive-Thru & Highway Plaza",
    category: 'cafe',
    coordinates: [18.5998, 73.7582],
    address: 'Mumbai-Pune Expressway Highway Exit, Wakad',
    rating: 4.4,
    reviewsCount: 5120,
    openHours: 'Open 24 hours · Bright LED parking area',
    phone: '020 4015 6700',
    photoUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80',
    safetyScore: 91
  },

  // 🚇 Pune Metro & Major Transit Hubs
  {
    id: 'poi_vanaz_metro',
    name: 'Vanaz Metro Station (Aqua Line)',
    category: 'transit',
    coordinates: [18.5074, 73.7925],
    address: 'Paud Road, Kothrud Industrial Area',
    rating: 4.8,
    reviewsCount: 3100,
    openHours: '6:00 AM – 11:30 PM · CISF Security & CCTV',
    phone: '1800 270 5555',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    safetyScore: 96
  },
  {
    id: 'poi_shivajinagar_metro',
    name: 'Shivajinagar Underground Metro & PMPML Terminus',
    category: 'transit',
    coordinates: [18.5314, 73.8446],
    address: 'Old Mumbai-Pune Highway, Shivajinagar',
    rating: 4.7,
    reviewsCount: 6540,
    openHours: 'Open 24 hours transit hub · Police Booth',
    phone: '1800 270 5555',
    photoUrl: 'https://images.unsplash.com/photo-1558441719-7566160352ff?w=600&auto=format&fit=crop&q=80',
    safetyScore: 95
  },

  // ⛽ 24/7 Petrol Pumps & EV Superchargers
  {
    id: 'poi_indian_oil_wakad',
    name: 'Indian Oil 24/7 Fuel Station & Tata EV Fast Charger',
    category: 'fuel',
    coordinates: [18.6015, 73.7654],
    address: 'Bhumkar Chowk, NH-48 Bypass, Wakad',
    rating: 4.3,
    reviewsCount: 1840,
    openHours: 'Open 24 hours · Well-lit canopy & Air check',
    photoUrl: 'https://images.unsplash.com/photo-1527018607616-a656a381cbbe?w=600&auto=format&fit=crop&q=80',
    safetyScore: 90
  },
  {
    id: 'poi_hp_chandani_chowk',
    name: 'HP Petrol Pump Chandani Chowk Junction',
    category: 'fuel',
    coordinates: [18.5085, 73.7758],
    address: 'NDA Road, Chandani Chowk Interchange, Bavdhan',
    rating: 4.5,
    reviewsCount: 2450,
    openHours: 'Open 24 hours · High Visibility Junction',
    photoUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=600&auto=format&fit=crop&q=80',
    safetyScore: 93
  }
];
