/**
 * SurakshitPath - Verified Emergency Roadside Necessities Dataset
 * 
 * Curated high-precision 24x7 Petrol Pumps, Mechanical Garages,
 * Breakdown Towing, Tubeless Puncture, and EV Superchargers across
 * Pune Metropolitan Region (PMC, PCMC & Highway corridors).
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
  // ── ⛽ PETROL PUMPS & FUEL STATIONS ──────────────────────────────────────
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
    name: 'Indian Oil Petrol Pump - Infotech Fuel Center',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'IndianOil',
    coordinates: [18.5935, 73.7420],
    address: 'Phase 1 Main Road, Near Infosys Circle, Hinjawadi, Pune',
    area: 'Hinjawadi',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-22933455',
    services: ['Petrol (XP95)', 'Diesel', 'EV Fast Charger 60kW', 'Air Refill', 'PUC Center'],
    rating: 4.5,
    landmarkNear: 'Infosys Circle, Phase 1'
  },
  {
    id: 'petrol_bpcl_wakad_chowk',
    name: 'Bharat Petroleum - Wakad Highway Station',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'BPCL',
    coordinates: [18.5998, 73.7632],
    address: 'Bhujbal Chowk, Mumbai-Bangalore Highway, Wakad, Pune',
    area: 'Wakad',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-27284411',
    services: ['Speed Petrol', 'Hi-Speed Diesel', '24x7 Nitrogen Air', 'Puncture Shop Attached', 'Drinking Water'],
    rating: 4.4,
    landmarkNear: 'Bhujbal Chowk Wakad Flyover'
  },
  {
    id: 'petrol_shell_aundh',
    name: 'Shell Fuel Station - Aundh DP Road',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'Shell',
    coordinates: [18.5610, 73.8080],
    address: 'DP Road, Near Medipoint Hospital, Aundh, Pune',
    area: 'Aundh',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-25887690',
    services: ['V-Power Petrol', 'V-Power Diesel', 'Shell Select 24x7 Mart', 'Tyre Pressure Check', 'Washrooms'],
    rating: 4.8,
    landmarkNear: 'Medipoint Hospital, Aundh'
  },
  {
    id: 'petrol_hp_fc_road',
    name: 'HP Petrol Pump - Deccan Gymkhana',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'HP',
    coordinates: [18.5185, 73.8415],
    address: 'Fergusson College Road, Deccan Gymkhana, Pune',
    area: 'FC Road / Deccan',
    timing: '6:00 AM - 12:00 AM (Midnight)',
    isOpen24x7: false,
    contactNumber: '020-25678901',
    services: ['Power Petrol', 'Diesel', 'Air Check', 'Safe Well-lit Forecourt'],
    rating: 4.3,
    landmarkNear: 'Goodluck Cafe, FC Road'
  },
  {
    id: 'petrol_ioc_kothrud_paud',
    name: 'Indian Oil Fuel Station - Paud Road',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'IndianOil',
    coordinates: [18.5070, 73.8065],
    address: 'Paud Road, Near Vanaz Metro Station, Kothrud, Pune',
    area: 'Kothrud',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-25381244',
    services: ['XP95 Petrol', 'Diesel', 'Air Refill', 'PUC Center', 'Battery Water Refill'],
    rating: 4.5,
    landmarkNear: 'Vanaz Metro Station'
  },
  {
    id: 'petrol_jiobp_bavdhan',
    name: 'Jio-bp Mobility Station - Bavdhan Chandani Chowk',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'Jio-bp',
    coordinates: [18.5120, 73.7780],
    address: 'Paud Bypass Road, Near Chandani Chowk, Bavdhan, Pune',
    area: 'Bavdhan / Chandani Chowk',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '1800-891-9023',
    services: ['Active Technology Petrol', 'Diesel', 'Wild Bean Cafe 24x7', 'EV Fast Charging', 'Express Air'],
    rating: 4.7,
    landmarkNear: 'Chandani Chowk Interchange'
  },
  {
    id: 'petrol_bpcl_viman_nagar',
    name: 'BPCL Fuel Station - Pune Airport Road',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'BPCL',
    coordinates: [18.5670, 73.9140],
    address: 'Symbiosis Road, Near Phoenix Marketcity, Viman Nagar, Pune',
    area: 'Viman Nagar',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-26634512',
    services: ['Speed Petrol', 'Diesel', '24x7 Puncture & Air', 'EV Charger', 'Clean Restrooms'],
    rating: 4.6,
    landmarkNear: 'Phoenix Marketcity Mall'
  },
  {
    id: 'petrol_hp_swargate',
    name: 'HP Fuel Oasis - Swargate Junction',
    category: 'petrol_pump',
    categoryLabel: 'Petrol Pump',
    brand: 'HP',
    coordinates: [18.5015, 73.8580],
    address: 'Satara Road, Swargate, Pune',
    area: 'Swargate / Satara Road',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '020-24441090',
    services: ['Petrol', 'Diesel', 'Free Air Station', '24x7 Mechanical Assistance On-Call'],
    rating: 4.2,
    landmarkNear: 'Swargate ST Bus Stand'
  },

  // ── 🔧 24x7 EMERGENCY GARAGES & MECHANICS ────────────────────────────────
  {
    id: 'garage_pune_247_express',
    name: 'Pune 24x7 Highway Auto Garage & Breakdown Van',
    category: 'garage',
    categoryLabel: '24x7 Auto Garage',
    brand: 'Independent',
    coordinates: [18.5720, 73.7710],
    address: 'Baner-Balewadi Link Road, Near Highway Underpass, Baner, Pune',
    area: 'Baner / Balewadi',
    timing: '24/7 Mobile Breakdown & Garage Available',
    isOpen24x7: true,
    contactNumber: '+91-98220-11234',
    services: ['24x7 Mobile Mechanic Van', 'Car & Bike Breakdown Support', 'Engine Overheating Help', 'Alternator/Battery Jumpstart', 'Brake Fluid/Coolant'],
    rating: 4.8,
    landmarkNear: 'Balewadi Stadium Road'
  },
  {
    id: 'garage_hinjawadi_quick_fix',
    name: 'Hinjawadi 24/7 Multi-Brand Car & Two-Wheeler Care',
    category: 'garage',
    categoryLabel: 'Emergency Garage',
    brand: 'Independent',
    coordinates: [18.5880, 73.7310],
    address: 'Hinjawadi-Marunji Road, Near Phase 2 T-Junction, Pune',
    area: 'Hinjawadi Phase 1 & 2',
    timing: 'Open 24 Hours (On-Call Dispatch)',
    isOpen24x7: true,
    contactNumber: '+91-98500-44911',
    services: ['Bike Clutch Wire Replacement', 'Car Fan Belt & Battery', 'Emergency Fuel Delivery (5L)', 'Headlight & Electrical Fix'],
    rating: 4.7,
    landmarkNear: 'Phase 2 Wipro Circle'
  },
  {
    id: 'garage_maruti_authorized_wakad',
    name: 'MyTVS / Multibrand Express Workshop (Wakad)',
    category: 'garage',
    categoryLabel: 'Car Repair Workshop',
    brand: 'Authorized',
    coordinates: [18.6045, 73.7715],
    address: 'Datta Mandir Road, Shankar Kalat Nagar, Wakad, Pune',
    area: 'Wakad',
    timing: '8:00 AM - 10:30 PM (Night Helpline Active)',
    isOpen24x7: false,
    contactNumber: '+91-97660-88221',
    services: ['Complete Mechanical Repair', 'OBD Scanning', 'Brake Pad Replacement', 'Emergency Engine Diagnostics', 'Oil Top-Up'],
    rating: 4.6,
    landmarkNear: 'Datta Mandir Wakad'
  },
  {
    id: 'garage_kothrud_speed_care',
    name: 'Kothrud 24x7 Two-Wheeler & Four-Wheeler Garage',
    category: 'garage',
    categoryLabel: '24x7 Garage',
    brand: 'Independent',
    coordinates: [18.5030, 73.8120],
    address: 'Karve Road, Near Cummins College Phata, Kothrud, Pune',
    area: 'Kothrud / Karve Nagar',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '+91-99220-33887',
    services: ['Night Breakdown Assistance', 'Scooter & Motorcycle Repair', 'Battery Replacement', 'Radiator Leak Fix'],
    rating: 4.5,
    landmarkNear: 'Cummins College Phata'
  },
  {
    id: 'garage_shivaji_nagar_central',
    name: 'Apex Auto Emergency Mechanics',
    category: 'garage',
    categoryLabel: 'Emergency Garage',
    brand: 'Independent',
    coordinates: [18.5305, 73.8480],
    address: 'Old Mumbai-Pune Highway, Near Sancheti Hospital, Shivajinagar, Pune',
    area: 'Shivajinagar',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '+91-98900-55112',
    services: ['Emergency Towing', 'Brake Overhaul', 'Starter Motor Repair', 'Fuse & Relay Replacement'],
    rating: 4.6,
    landmarkNear: 'Sancheti Hospital / COEP Flyover'
  },
  {
    id: 'garage_hadapsar_magarpatta',
    name: 'Magarpatta 24x7 Auto Breakdown Service',
    category: 'garage',
    categoryLabel: '24x7 Auto Garage',
    brand: 'Independent',
    coordinates: [18.5150, 73.9280],
    address: 'Mundhwa-Hadapsar Road, Near Magarpatta South Gate, Pune',
    area: 'Hadapsar / Magarpatta',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '+91-98600-77443',
    services: ['24x7 Mobile Mechanic', 'Hydraulic Jack & Wheel Support', 'Fuel Drainage & Refill', 'Battery Jumpstart'],
    rating: 4.7,
    landmarkNear: 'Magarpatta Cybercity'
  },

  // ── 🛞 24x7 TOWING & TUBELESS PUNCTURE REPAIRS ────────────────────────────
  {
    id: 'towing_pune_highway_recovery',
    name: 'Pune Highway 24/7 Flatbed Towing & Crane Recovery',
    category: 'towing_puncture',
    categoryLabel: '24x7 Towing Service',
    brand: 'Independent',
    coordinates: [18.5650, 73.7620],
    address: 'Near NH-48 Toll Plaza / Pashan Exit, Pune',
    area: 'NH-48 Corridor / Pashan',
    timing: 'Open 24 Hours · Immediate Response Under 20 Mins',
    isOpen24x7: true,
    contactNumber: '+91-98230-99112',
    services: ['Hydraulic Flatbed Towing', 'Accident Vehicle Recovery', 'Safe Drop to Nearest Service Center', 'Highway SOS Escort'],
    rating: 4.9,
    landmarkNear: 'Pashan-Sus Highway Exit'
  },
  {
    id: 'puncture_baner_247_tubeless',
    name: 'Baner 24x7 Tubeless Puncture & Nitrogen Hub',
    category: 'towing_puncture',
    categoryLabel: '24x7 Puncture Repair',
    brand: 'Independent',
    coordinates: [18.5520, 73.7910],
    address: 'Baner Main Road, Opposite FabIndia, Baner, Pune',
    area: 'Baner',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '+91-97640-11229',
    services: ['Tubeless Tyre Puncture', 'Mushroom Plug Repair', 'Mobile On-Spot Puncture Van', 'Digital Tyre Inflator'],
    rating: 4.7,
    landmarkNear: 'FabIndia, Baner Road'
  },
  {
    id: 'puncture_hinjawadi_circle_247',
    name: 'Hinjawadi Phase 1 Night Puncture & Wheel Care',
    category: 'towing_puncture',
    categoryLabel: '24x7 Puncture Repair',
    brand: 'Independent',
    coordinates: [18.5950, 73.7380],
    address: 'Hinjawadi Flyover Chowk, Phase 1, Pune',
    area: 'Hinjawadi',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '+91-99210-44882',
    services: ['Car & Bike Puncture', 'Tube Replacement', 'Tyre Valve Change', 'Wheel Alignment Check'],
    rating: 4.5,
    landmarkNear: 'Hinjawadi Flyover Underpass'
  },
  {
    id: 'towing_swargate_camp_express',
    name: 'Central Pune 24x7 Tow Truck Services',
    category: 'towing_puncture',
    categoryLabel: '24x7 Towing',
    brand: 'Independent',
    coordinates: [18.5080, 73.8650],
    address: 'Shankarsheth Road, Near Seven Loves Chowk, Swargate, Pune',
    area: 'Swargate / Camp',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '+91-98220-77331',
    services: ['24x7 Wheel-Lift Towing', 'Underground Parking Towout', 'Heavy Vehicle Recovery', 'Zero-Damage Tow Hitch'],
    rating: 4.8,
    landmarkNear: 'Seven Loves Chowk'
  },

  // ── ⚡ EV FAST CHARGING STATIONS ────────────────────────────────────────
  {
    id: 'ev_tata_power_balewadi',
    name: 'Tata Power EV Supercharger (60kW DC Fast)',
    category: 'ev_charging',
    categoryLabel: 'EV Fast Charger',
    brand: 'Tata Power',
    coordinates: [18.5790, 73.7710],
    address: 'Balewadi High Street, Near Courtyard by Marriott, Pune',
    area: 'Balewadi / Baner',
    timing: 'Open 24 Hours · CCS2 & Type-2 Dual Gun',
    isOpen24x7: true,
    contactNumber: '1800-209-5161',
    services: ['60kW DC Fast Charging', 'Type 2 AC Charging', 'Tata EZ Charge App', 'Lit & Guarded 24x7 Area'],
    rating: 4.8,
    landmarkNear: 'Courtyard by Marriott, Balewadi'
  },
  {
    id: 'ev_jiobp_kothrud',
    name: 'Jio-bp pulse EV Fast Charging Hub',
    category: 'ev_charging',
    categoryLabel: 'EV Fast Charger',
    brand: 'Jio-bp',
    coordinates: [18.5050, 73.8010],
    address: 'Paud Road, Near Chandani Chowk, Kothrud, Pune',
    area: 'Kothrud / Chandani Chowk',
    timing: 'Open 24 Hours',
    isOpen24x7: true,
    contactNumber: '1800-891-9023',
    services: ['120kW Ultra-Fast DC Gun', 'Two-Wheeler Fast Plug', 'Jio-bp pulse App Compatible'],
    rating: 4.7,
    landmarkNear: 'Near Chandani Chowk Flyover'
  }
];

/**
 * Calculate Great-Circle Distance (Haversine formula in kilometers)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate road driving time based on distance (urban average 28 km/h + signals)
 */
export function estimateDriveMinutes(distanceKm: number): number {
  const avgSpeedKmh = 28;
  const rawMinutes = (distanceKm / avgSpeedKmh) * 60;
  return Math.max(1, Math.round(rawMinutes + 1));
}
