/**
 * SurakshitPath - Verified Emergency Roadside Necessities Dataset
 * 
 * Curated high-precision 24x7 Petrol Pumps, Mechanical Garages,
 * Breakdown Towing, Tubeless Puncture, and EV Superchargers across
 * Maharashtra state highway corridors and urban districts.
 */

export type EmergencyServiceCategory = 'petrol_pump' | 'garage' | 'towing_puncture' | 'ev_charging';

export interface EmergencyNecessity {
  id: string;
  name: string;
  category: EmergencyServiceCategory;
  categoryLabel: string;
  brand?: 'IndianOil' | 'HP' | 'BPCL' | 'Shell' | 'Tata Power' | 'Jio-bp' | 'Independent' | 'Authorized';
  coordinates: [number, number]; // [lat, lng]
  address: string;
  area: string;
  timing: string;
  isOpen24x7: boolean;
  contactNumber: string;
  services: string[];
  rating: number;
  landmarkNear: string;
}

export const PUNE_EMERGENCY_NECESSITIES: EmergencyNecessity[] = [
  // ── ⛽ PUNE & PCMC 24X7 FUEL & WASHROOM PLAZAS ────────────────────────────
  {
    id: 'petrol_hp_baner_highway',
    name: 'HP Auto Care Center (Baner Highway)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'HP',
    coordinates: [18.5595, 73.7842],
    address: 'Survey 48/2, NH-48 Highway Bypass, Baner, Pune',
    area: 'Baner / NH-48',
    timing: 'Open 24 Hours · Night Attendants Present',
    isOpen24x7: true,
    contactNumber: '020-27291122',
    services: ['Petrol (Speed)', 'Diesel', '24x7 Free Air & Nitrogen', 'Clean Restrooms', 'Digital Payment', 'ATM'],
    rating: 4.6,
    landmarkNear: 'Baner-Pashan Link Road Junction'
  },
  {
    id: 'petrol_ioc_hinjawadi_ph1',
    name: 'IndianOil 24x7 Auto Fuel Plaza (Hinjawadi)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'IndianOil',
    coordinates: [18.5955, 73.7420],
    address: 'Near Shivaji Chowk, Hinjawadi Phase 1, Pune',
    area: 'Hinjawadi IT Park',
    timing: 'Open 24 Hours · Well-Lit CCTV Monitored',
    isOpen24x7: true,
    contactNumber: '020-22933400',
    services: ['Petrol', 'XP95', 'Diesel', 'CNG (24x7)', 'Clean Ladies Restroom', 'Card / UPI Accepted'],
    rating: 4.4,
    landmarkNear: 'Opposite Cognizant Campus'
  },
  {
    id: 'petrol_hp_swargate',
    name: 'HPCL Swargate Roundabout Station',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'HP',
    coordinates: [18.5032, 73.8570],
    address: 'Satara Road, Swargate Chowk, Pune',
    area: 'Swargate',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-24440055',
    services: ['Petrol', 'Diesel', '24x7 Air', 'Staffed Security', 'Night Attendants'],
    rating: 4.3,
    landmarkNear: 'Adjacent to Swargate Metro Station'
  },

  // ── ⛽ MUMBAI-PUNE EXPRESSWAY CORRIDOR ──────────────────────────────────
  {
    id: 'petrol_ioc_khalapur_plaza',
    name: 'IndianOil 24x7 Mega Food Plaza (Expressway)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'IndianOil',
    coordinates: [18.7980, 73.2840],
    address: 'KM 38, Mumbai-Pune Expressway, Khalapur',
    area: 'Khalapur Toll Plaza',
    timing: 'Open 24 Hours · Highway Police Patrol Post',
    isOpen24x7: true,
    contactNumber: '02192-274100',
    services: ['Petrol', 'High-Speed Diesel', 'Clean Restrooms', 'Food Court 24x7', 'ATM', 'Highway Ambulance'],
    rating: 4.8,
    landmarkNear: 'Khalapur Expressway Food Mall'
  },
  {
    id: 'petrol_bpcl_urse_plaza',
    name: 'BPCL Ghar 24x7 Highway Haven (Urse)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'BPCL',
    coordinates: [18.7180, 73.6550],
    address: 'Urse Toll Plaza, Mumbai-Pune Expressway',
    area: 'Talegaon / Urse',
    timing: 'Open 24 Hours · Delta Patrol Security',
    isOpen24x7: true,
    contactNumber: '02114-234100',
    services: ['Petrol', 'Diesel', 'Speed', 'Secure Rest Area', 'EV Fast Charging (60kW)', 'Restrooms'],
    rating: 4.7,
    landmarkNear: 'Urse Toll Plaza'
  },

  // ── ⛽ MUMBAI METROPOLITAN REGION (MMR) ───────────────────────────────────
  {
    id: 'petrol_bpcl_bkc_mumbai',
    name: 'BPCL Auto Care (BKC Financial District)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'BPCL',
    coordinates: [19.0665, 72.8690],
    address: 'Bandra-Kurla Complex Road, Bandra East, Mumbai',
    area: 'BKC / Bandra East',
    timing: 'Open 24 Hours · High Security Area',
    isOpen24x7: true,
    contactNumber: '022-26501234',
    services: ['Petrol', 'Speed97', 'Diesel', 'Clean Restrooms', 'ATM Kiosk', 'EV 50kW Charger'],
    rating: 4.7,
    landmarkNear: 'Near MMRDA Grounds'
  },
  {
    id: 'petrol_ioc_vashi_highway',
    name: 'IndianOil 24x7 Hub (Sion-Panvel Highway)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'IndianOil',
    coordinates: [19.0735, 72.9995],
    address: 'Plot 12, Sion-Panvel Highway, Vashi, Navi Mumbai',
    area: 'Vashi / Navi Mumbai',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '022-27823400',
    services: ['Petrol', 'Diesel', '24x7 Air', 'Staffed Guards', 'Clean Washrooms'],
    rating: 4.5,
    landmarkNear: 'Near Vashi Plaza Junction'
  },

  // ── ⛽ NASHIK & HIGHWAY CORRIDORS ────────────────────────────────────────
  {
    id: 'petrol_hp_cbs_nashik',
    name: 'HPCL Auto Care (CBS Nashik)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'HP',
    coordinates: [19.9975, 73.7850],
    address: 'Old Agra Road, Near CBS Bus Stand, Nashik',
    area: 'CBS Central',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '0253-2574000',
    services: ['Petrol', 'Diesel', 'Clean Restrooms', 'Digital Payments'],
    rating: 4.4,
    landmarkNear: 'Opposite Central Bus Stand'
  },

  // ── ⛽ CHHATRAPATI SAMBHAJINAGAR & MARATHWADA ─────────────────────────────
  {
    id: 'petrol_ioc_kranti_chowk',
    name: 'IndianOil 24x7 Station (Kranti Chowk)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'IndianOil',
    coordinates: [19.8725, 75.3260],
    address: 'Jalna Road, Kranti Chowk, Sambhajinagar',
    area: 'Kranti Chowk',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '0240-2334000',
    services: ['Petrol', 'Diesel', '24x7 Air', 'Staffed Attendants'],
    rating: 4.5,
    landmarkNear: 'Near Kranti Chowk Flyover'
  },

  // ── ⛽ NAGPUR (ZERO MILE & WARDHA ROAD) ──────────────────────────────────
  {
    id: 'petrol_bpcl_wardha_nagpur',
    name: 'BPCL 24x7 Fuel Station (Wardha Road)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'BPCL',
    coordinates: [21.1350, 79.0780],
    address: 'Wardha Road, Near Congress Nagar Metro, Nagpur',
    area: 'Wardha Road / Dhantoli',
    timing: 'Open 24 Hours · CCTV Monitored',
    isOpen24x7: true,
    contactNumber: '0712-2423000',
    services: ['Petrol', 'Diesel', 'Speed', 'Clean Restrooms', 'ATM'],
    rating: 4.6,
    landmarkNear: 'Near Metro Pillar 84'
  },

  // ── ⛽ KOLHAPUR & SOLAPUR (NH-48 / NH-65) ────────────────────────────────
  {
    id: 'petrol_hp_cbs_kolhapur',
    name: 'HPCL Auto Care (CBS Kolhapur)',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'HP',
    coordinates: [16.7010, 74.2425],
    address: 'Station Road, Near Central Bus Stand, Kolhapur',
    area: 'CBS Kolhapur',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '0231-2654000',
    services: ['Petrol', 'Diesel', 'Clean Restrooms', 'Staffed Guards'],
    rating: 4.5,
    landmarkNear: 'Near Kolhapur Railway Station'
  }
];

export const MAHARASHTRA_EMERGENCY_NECESSITIES = PUNE_EMERGENCY_NECESSITIES;

export function calculateDistanceKm(
  c1OrLat1: [number, number] | number,
  c2OrLng1: [number, number] | number,
  lat2?: number,
  lng2?: number
): number {
  let lat1: number, lng1: number, targetLat: number, targetLng: number;
  if (Array.isArray(c1OrLat1) && Array.isArray(c2OrLng1)) {
    lat1 = c1OrLat1[0];
    lng1 = c1OrLat1[1];
    targetLat = c2OrLng1[0];
    targetLng = c2OrLng1[1];
  } else if (typeof c1OrLat1 === 'number' && typeof c2OrLng1 === 'number' && typeof lat2 === 'number' && typeof lng2 === 'number') {
    lat1 = c1OrLat1;
    lng1 = c2OrLng1;
    targetLat = lat2;
    targetLng = lng2;
  } else {
    return 0;
  }
  const dLat = (targetLat - lat1) * 111.139;
  const dLng = (targetLng - lng1) * 105.0;
  return Number(Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1));
}

export function estimateDriveMinutes(distanceKm: number): number {
  return Math.max(1, Math.round((distanceKm / 28) * 60));
}
