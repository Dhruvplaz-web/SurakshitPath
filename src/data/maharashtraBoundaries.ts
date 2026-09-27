/**
 * Maharashtra State, Pune District & Municipal Corporation Boundaries
 * Provides official administrative outlines and labeled city / district badges
 * for clear geospatial orientation on Google Maps / Leaflet views.
 */

export interface AdministrativeRegion {
  id: string;
  name: string;
  marathiName: string;
  level: 'state' | 'district' | 'municipal_corporation';
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
  dashArray?: string;
  coordinates: [number, number][]; // [lat, lng][] polygon ring
}

export interface CityDistrictLabel {
  id: string;
  name: string;
  marathiName: string;
  category: 'state_capital' | 'tier1_metro' | 'twin_city' | 'district_hq' | 'tier2_hub';
  coordinates: [number, number]; // [lat, lng]
  district: string;
  state: string;
}

// 1. Maharashtra State Boundary Polygon Ring (approximate boundary outline)
export const MAHARASHTRA_STATE_BOUNDARY: AdministrativeRegion = {
  id: 'state_maharashtra',
  name: 'Maharashtra State',
  marathiName: 'महाराष्ट्र राज्य',
  level: 'state',
  color: '#3b82f6',
  fillColor: 'rgba(59, 130, 246, 0.04)',
  fillOpacity: 0.05,
  weight: 2.5,
  dashArray: '6, 6',
  coordinates: [
    [22.0300, 72.6500],
    [21.6000, 74.2000],
    [21.5000, 75.8000],
    [21.7000, 77.3000],
    [21.5000, 79.2000],
    [21.3000, 80.3000],
    [20.5000, 80.8000],
    [19.0000, 80.4000],
    [18.7000, 79.8000],
    [19.0000, 78.5000],
    [18.5000, 77.8000],
    [17.8000, 77.2000],
    [17.3000, 76.8000],
    [16.8000, 75.9000],
    [15.8000, 74.5000],
    [15.6500, 73.7000],
    [16.5000, 73.3000],
    [17.8000, 73.1000],
    [18.8000, 72.8000],
    [19.5000, 72.7500],
    [20.2000, 72.7000],
    [21.0000, 72.6500],
    [22.0300, 72.6500]
  ]
};

// 2. Pune District Boundary Ring (encompassing Maval, Mulshi, Haveli, Khed, Pune City, PCMC)
export const PUNE_DISTRICT_BOUNDARY: AdministrativeRegion = {
  id: 'district_pune',
  name: 'Pune District Boundary',
  marathiName: 'पुणे जिल्हा सीमा',
  level: 'district',
  color: '#f59e0b',
  fillColor: 'rgba(245, 158, 11, 0.06)',
  fillOpacity: 0.08,
  weight: 2.2,
  dashArray: '5, 5',
  coordinates: [
    [19.3800, 73.6500],
    [19.2500, 74.0500],
    [19.0000, 74.3000],
    [18.7500, 74.6500],
    [18.4500, 75.1000],
    [18.1500, 74.9500],
    [17.9000, 74.6000],
    [18.0500, 74.0000],
    [18.2500, 73.5500],
    [18.5000, 73.3500],
    [18.7500, 73.4000],
    [19.1000, 73.5000],
    [19.3800, 73.6500]
  ]
};

// 3. PMC & PCMC Twin Metropolitan Urban Core Boundary
export const PMC_PCMC_URBAN_BOUNDARY: AdministrativeRegion = {
  id: 'metro_pmc_pcmc',
  name: 'Pune & Pimpri-Chinchwad Urban Limits (PMC / PCMC)',
  marathiName: 'पुणे व पिंपरी-चिंचवड मनपा क्षेत्र',
  level: 'municipal_corporation',
  color: '#10b981',
  fillColor: 'rgba(16, 185, 129, 0.08)',
  fillOpacity: 0.12,
  weight: 2.0,
  coordinates: [
    [18.6850, 73.7400], // PCMC Dehu / Nigdi North
    [18.6650, 73.8400], // PCMC Bhosari / Moshi
    [18.6050, 73.9100], // Dhanori / Lohegaon
    [18.5800, 73.9400], // Viman Nagar / Kharadi
    [18.5200, 73.9600], // Hadapsar / Manjri
    [18.4600, 73.9000], // Kondhwa / Undri
    [18.4350, 73.8500], // Katraj South
    [18.4700, 73.7900], // Warje / Sinhagad Rd
    [18.5050, 73.7700], // Kothrud / Chandani Chowk
    [18.5450, 73.7500], // Pashan / Baner West
    [18.5900, 73.7200], // Wakad / Hinjawadi Ph 1 & 2
    [18.6350, 73.7250], // Tathawade / Punawale
    [18.6850, 73.7400]  // PCMC Ravet / Nigdi
  ]
};

// 4. District & Major City Badges for Map Labeling
export const MAJOR_CITIES_AND_DISTRICTS: CityDistrictLabel[] = [
  {
    id: 'city_pune',
    name: 'Pune (पुणे)',
    marathiName: 'पुणे शहर',
    category: 'tier1_metro',
    coordinates: [18.5204, 73.8567],
    district: 'Pune',
    state: 'Maharashtra'
  },
  {
    id: 'city_pcmc',
    name: 'Pimpri-Chinchwad (पिंपरी-चिंचवड)',
    marathiName: 'पिंपरी-चिंचवड',
    category: 'twin_city',
    coordinates: [18.6279, 73.8131],
    district: 'Pune',
    state: 'Maharashtra'
  },
  {
    id: 'city_mumbai',
    name: 'Mumbai (मुंबई)',
    marathiName: 'मुंबई राजधानी',
    category: 'state_capital',
    coordinates: [19.0760, 72.8777],
    district: 'Mumbai City / Suburban',
    state: 'Maharashtra'
  },
  {
    id: 'city_thane',
    name: 'Thane (ठाणे)',
    marathiName: 'ठाणे जिल्हा',
    category: 'district_hq',
    coordinates: [19.2183, 72.9781],
    district: 'Thane',
    state: 'Maharashtra'
  },
  {
    id: 'city_navi_mumbai',
    name: 'Navi Mumbai (नवी मुंबई)',
    marathiName: 'नवी मुंबई',
    category: 'district_hq',
    coordinates: [19.0330, 73.0297],
    district: 'Thane / Raigad',
    state: 'Maharashtra'
  },
  {
    id: 'city_nashik',
    name: 'Nashik (नाशिक)',
    marathiName: 'नाशिक जिल्हा',
    category: 'tier2_hub',
    coordinates: [19.9975, 73.7898],
    district: 'Nashik',
    state: 'Maharashtra'
  },
  {
    id: 'city_satara',
    name: 'Satara (सातारा)',
    marathiName: 'सातारा जिल्हा',
    category: 'district_hq',
    coordinates: [17.6805, 73.9935],
    district: 'Satara',
    state: 'Maharashtra'
  },
  {
    id: 'city_solapur',
    name: 'Solapur (सोलापूर)',
    marathiName: 'सोलापूर जिल्हा',
    category: 'tier2_hub',
    coordinates: [17.6599, 75.9064],
    district: 'Solapur',
    state: 'Maharashtra'
  },
  {
    id: 'city_kolhapur',
    name: 'Kolhapur (कोल्हापूर)',
    marathiName: 'कोल्हापूर जिल्हा',
    category: 'district_hq',
    coordinates: [16.7050, 74.2433],
    district: 'Kolhapur',
    state: 'Maharashtra'
  },
  {
    id: 'city_aurangabad',
    name: 'Chhatrapati Sambhaji Nagar (छत्रपती संभाजीनगर)',
    marathiName: 'छत्रपती संभाजीनगर',
    category: 'tier2_hub',
    coordinates: [19.8762, 75.3433],
    district: 'Chhatrapati Sambhaji Nagar',
    state: 'Maharashtra'
  },
  {
    id: 'city_nagpur',
    name: 'Nagpur (नागपूर)',
    marathiName: 'नागपूर उपराजधानी',
    category: 'tier2_hub',
    coordinates: [21.1458, 79.0882],
    district: 'Nagpur',
    state: 'Maharashtra'
  }
];
