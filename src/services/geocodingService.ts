export type MaharashtraRegion = 
  | 'all'
  | 'pune' 
  | 'mumbai' 
  | 'western' 
  | 'north' 
  | 'marathwada' 
  | 'vidarbha' 
  | 'statewide';

export interface PuneLocation {
  id: string;
  name: string;
  subtitle: string;
  coordinates: [number, number]; // [lat, lng]
  category: 'college' | 'transit' | 'it_hub' | 'landmark' | 'residential' | 'statewide' | 'district_hq';
  region?: MaharashtraRegion;
}

export type StatewideLocation = PuneLocation;

export interface StrategicCorridor {
  id: string;
  name: string;
  badge: string;
  highway: string;
  originId: string;
  destId: string;
}

// Comprehensive landmark and 36-district administrative headquarters database across Maharashtra
export const MAHARASHTRA_LANDMARKS: PuneLocation[] = [
  // ==============================================================================
  // 1. PUNE METROPOLITAN REGION (PMRDA)
  // ==============================================================================
  {
    id: 'loc_jspm_tathawade',
    name: 'JSPM RSCOE Tathawade',
    subtitle: 'Mumbai-Bangalore Highway, Tathawade, Pimpri-Chinchwad, Pune',
    coordinates: [18.6186, 73.7483],
    category: 'college',
    region: 'pune'
  },
  {
    id: 'loc_bhumkar_chowk',
    name: 'Bhumkar Chowk Junction',
    subtitle: 'Wakad-Tathawade Bypass, NH-48 Corridor, Pune',
    coordinates: [18.6085, 73.7540],
    category: 'landmark',
    region: 'pune'
  },
  {
    id: 'loc_hinjawadi_phase1',
    name: 'Hinjawadi Phase 1 (Infosys Circle)',
    subtitle: 'Rajiv Gandhi Infotech Park, Hinjawadi, Pune',
    coordinates: [18.5912, 73.7389],
    category: 'it_hub',
    region: 'pune'
  },
  {
    id: 'loc_balewadi_highstreet',
    name: 'Balewadi High Street',
    subtitle: 'Near Balewadi Sports Complex, Baner, Pune',
    coordinates: [18.5775, 73.7695],
    category: 'landmark',
    region: 'pune'
  },
  {
    id: 'loc_baner_phata',
    name: 'Baner Phata Commercial Hub',
    subtitle: 'Baner Road, Near Wellness Forever & Apollo, Pune',
    coordinates: [18.5590, 73.7860],
    category: 'landmark',
    region: 'pune'
  },
  {
    id: 'loc_pune_university',
    name: 'Savitribai Phule Pune University (SPPU)',
    subtitle: 'Ganeshkhind Road, University Circle, Pune',
    coordinates: [18.5308, 73.8288],
    category: 'college',
    region: 'pune'
  },
  {
    id: 'loc_shivajinagar_station',
    name: 'Shivajinagar Railway & Metro Station',
    subtitle: 'Old Mumbai-Pune Highway, Shivajinagar, Pune',
    coordinates: [18.5320, 73.8520],
    category: 'transit',
    region: 'pune'
  },
  {
    id: 'loc_kothrud_stand',
    name: 'Kothrud Bus Stand & Depot',
    subtitle: 'Karve Road / Paud Road Junction, Kothrud, Pune',
    coordinates: [18.5074, 73.8077],
    category: 'transit',
    region: 'pune'
  },
  {
    id: 'loc_viman_nagar',
    name: 'Viman Nagar (Phoenix Marketcity / Symbiosis)',
    subtitle: 'Ahmednagar Road, Viman Nagar, Pune',
    coordinates: [18.5679, 73.9143],
    category: 'landmark',
    region: 'pune'
  },
  {
    id: 'loc_pune_airport',
    name: 'Pune International Airport (Lohegaon)',
    subtitle: 'New Airport Road, Lohegaon, Pune',
    coordinates: [18.5822, 73.9197],
    category: 'transit',
    region: 'pune'
  },
  {
    id: 'loc_swargate',
    name: 'Swargate MSRTC Bus Terminal & Metro',
    subtitle: 'Shivaji Road, Swargate, Pune',
    coordinates: [18.5018, 73.8586],
    category: 'transit',
    region: 'pune'
  },
  {
    id: 'loc_hadapsar_magarpatta',
    name: 'Magarpatta Cybercity (Hadapsar)',
    subtitle: 'Magarpatta Road, Hadapsar, Pune',
    coordinates: [18.5158, 73.9272],
    category: 'it_hub',
    region: 'pune'
  },

  // ==============================================================================
  // 2. MUMBAI METROPOLITAN REGION (MMR & KONKAN)
  // ==============================================================================
  {
    id: 'loc_mumbai_csmt',
    name: 'Mumbai CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    subtitle: 'Fort, South Mumbai, Maharashtra',
    coordinates: [18.9400, 72.8353],
    category: 'transit',
    region: 'mumbai'
  },
  {
    id: 'loc_mumbai_bkc',
    name: 'Bandra Kurla Complex (BKC)',
    subtitle: 'Bandra East, Mumbai Financial District, MMR',
    coordinates: [19.0657, 72.8687],
    category: 'it_hub',
    region: 'mumbai'
  },
  {
    id: 'loc_mumbai_marine_drive',
    name: 'Marine Drive & Churchgate',
    subtitle: 'Netaji Subhash Chandra Bose Road, South Mumbai',
    coordinates: [18.9322, 72.8234],
    category: 'landmark',
    region: 'mumbai'
  },
  {
    id: 'loc_mumbai_dadar',
    name: 'Dadar Central & Western Junction',
    subtitle: 'Dadar TT Circle, Mumbai Central',
    coordinates: [19.0178, 72.8478],
    category: 'transit',
    region: 'mumbai'
  },
  {
    id: 'loc_mumbai_andheri',
    name: 'Andheri West (Infiniti / Metro Hub)',
    subtitle: 'Link Road, Andheri West, Mumbai',
    coordinates: [19.1197, 72.8464],
    category: 'transit',
    region: 'mumbai'
  },
  {
    id: 'loc_mumbai_borivali',
    name: 'Borivali National Park Junction',
    subtitle: 'Western Express Highway, Borivali East, Mumbai',
    coordinates: [19.2288, 72.8541],
    category: 'landmark',
    region: 'mumbai'
  },
  {
    id: 'loc_navi_mumbai_vashi',
    name: 'Navi Mumbai (Vashi Plaza / Highway)',
    subtitle: 'Sion-Panvel Expressway, Navi Mumbai',
    coordinates: [19.0771, 72.9986],
    category: 'transit',
    region: 'mumbai'
  },
  {
    id: 'loc_navi_mumbai_panvel',
    name: 'Panvel (Mumbai-Pune Expressway Start Point)',
    subtitle: 'NH-48 / Palaspe Phata, Raigad-MMR',
    coordinates: [18.9894, 73.1175],
    category: 'transit',
    region: 'mumbai'
  },
  {
    id: 'loc_thane_station',
    name: 'Thane Central Railway Junction',
    subtitle: 'Gokhale Road, Thane West, Maharashtra',
    coordinates: [19.1860, 72.9759],
    category: 'transit',
    region: 'mumbai'
  },
  {
    id: 'loc_palghar_hq',
    name: 'Palghar District Headquarters',
    subtitle: 'Boisar-Palghar Road, Palghar District',
    coordinates: [19.6967, 72.7655],
    category: 'district_hq',
    region: 'mumbai'
  },
  {
    id: 'loc_alibaug_raigad',
    name: 'Alibaug (Raigad District HQ)',
    subtitle: 'Coastal Highway, Alibaug, Raigad District',
    coordinates: [18.6414, 72.8722],
    category: 'district_hq',
    region: 'mumbai'
  },
  {
    id: 'loc_ratnagiri_hq',
    name: 'Ratnagiri CBS Bus Stand',
    subtitle: 'NH-66 Mumbai-Goa Highway, Ratnagiri District',
    coordinates: [16.9902, 73.3120],
    category: 'district_hq',
    region: 'mumbai'
  },
  {
    id: 'loc_sindhudurg_oros',
    name: 'Sindhudurg (Oros District HQ)',
    subtitle: 'NH-66 Konkan Highway, Sindhudurg District',
    coordinates: [16.1158, 73.6967],
    category: 'district_hq',
    region: 'mumbai'
  },
  {
    id: 'loc_lonavala_expressway',
    name: 'Lonavala (Mumbai-Pune Expressway Toll Plaza)',
    subtitle: 'Western Ghats Corridor, Pune-Raigad Border',
    coordinates: [18.7557, 73.4091],
    category: 'statewide',
    region: 'pune'
  },

  // ==============================================================================
  // 3. WESTERN MAHARASHTRA (PUNE DIVISION)
  // ==============================================================================
  {
    id: 'loc_satara_hq',
    name: 'Satara (Powai Naka / Bombay Restaurant Chowk)',
    subtitle: 'NH-48 Pune-Bengaluru Highway, Satara District',
    coordinates: [17.6805, 73.9933],
    category: 'district_hq',
    region: 'western'
  },
  {
    id: 'loc_kolhapur_mahalaxmi',
    name: 'Kolhapur (Mahalaxmi / CBS Bus Terminal)',
    subtitle: 'NH-48 Mumbai-Bengaluru Highway, Kolhapur District',
    coordinates: [16.6944, 74.2223],
    category: 'district_hq',
    region: 'western'
  },
  {
    id: 'loc_sangli_hq',
    name: 'Sangli (Miraj Junction / CBS)',
    subtitle: 'Sangli-Miraj Twin City, Sangli District',
    coordinates: [16.8524, 74.5815],
    category: 'district_hq',
    region: 'western'
  },
  {
    id: 'loc_solapur_siddheshwar',
    name: 'Solapur (Siddheshwar / Old Pune Naka)',
    subtitle: 'NH-65 Pune-Hyderabad Highway, Solapur District',
    coordinates: [17.6599, 75.9064],
    category: 'district_hq',
    region: 'western'
  },

  // ==============================================================================
  // 4. NORTH MAHARASHTRA (NASHIK DIVISION)
  // ==============================================================================
  {
    id: 'loc_nashik_panchavati',
    name: 'Nashik (Panchavati / Dwarka Circle)',
    subtitle: 'NH-60 Pune-Nashik Highway & Mumbai Naka, Nashik',
    coordinates: [19.9975, 73.7898],
    category: 'district_hq',
    region: 'north'
  },
  {
    id: 'loc_ahmednagar_hq',
    name: 'Ahilyanagar / Ahmednagar (Swastik Chowk)',
    subtitle: 'Pune-Ahmednagar Highway SH-27, Ahilyanagar District',
    coordinates: [19.0952, 74.7496],
    category: 'district_hq',
    region: 'north'
  },
  {
    id: 'loc_jalgaon_hq',
    name: 'Jalgaon (Tower Chowk / Railway Junction)',
    subtitle: 'NH-53 Surat-Kolkata Highway, Jalgaon District',
    coordinates: [21.0077, 75.5626],
    category: 'district_hq',
    region: 'north'
  },
  {
    id: 'loc_dhule_hq',
    name: 'Dhule (Agra Highway / CBS)',
    subtitle: 'NH-52 / NH-53 Junction, Dhule District',
    coordinates: [20.9042, 74.7749],
    category: 'district_hq',
    region: 'north'
  },
  {
    id: 'loc_nandurbar_hq',
    name: 'Nandurbar District Headquarters',
    subtitle: 'Station Road, Nandurbar District, North Maharashtra',
    coordinates: [21.3700, 74.2400],
    category: 'district_hq',
    region: 'north'
  },

  // ==============================================================================
  // 5. MARATHWADA (CHHATRAPATI SAMBHAJI NAGAR DIVISION)
  // ==============================================================================
  {
    id: 'loc_aurangabad_sambhaji',
    name: 'Chhatrapati Sambhaji Nagar (Kranti Chowk / CIDCO)',
    subtitle: 'Jalna Road / Samruddhi Mahamarg Link, Marathwada',
    coordinates: [19.8762, 75.3433],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_jalna_hq',
    name: 'Jalna (Steel Hub / Devalgaon Road)',
    subtitle: 'Samruddhi Mahamarg Corridor, Jalna District',
    coordinates: [19.8347, 75.8816],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_nanded_gurudwara',
    name: 'Nanded (Sachkhand Gurudwara / CBS)',
    subtitle: 'Godavari Riverbank, Nanded District',
    coordinates: [19.1528, 77.3194],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_latur_hq',
    name: 'Latur (Gandhi Chowk / Dayanand Road)',
    subtitle: 'Barshi-Latur Highway, Latur District',
    coordinates: [18.4088, 76.5604],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_dharashiv_hq',
    name: 'Dharashiv / Osmanabad (Tuljapur Gate)',
    subtitle: 'Solapur-Dharashiv Highway, Dharashiv District',
    coordinates: [18.1856, 76.0419],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_beed_hq',
    name: 'Beed (Central Bus Stand / Jalna Road)',
    subtitle: 'NH-52 Corridor, Beed District, Marathwada',
    coordinates: [18.9891, 75.7601],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_parbhani_hq',
    name: 'Parbhani (Railway Station / Subhash Chowk)',
    subtitle: 'Parbhani-Nanded Road, Parbhani District',
    coordinates: [19.2686, 76.7708],
    category: 'district_hq',
    region: 'marathwada'
  },
  {
    id: 'loc_hingoli_hq',
    name: 'Hingoli District Headquarters',
    subtitle: 'Nanded-Akola Highway, Hingoli District',
    coordinates: [19.7189, 77.1472],
    category: 'district_hq',
    region: 'marathwada'
  },

  // ==============================================================================
  // 6. VIDARBHA (NAGPUR & AMRAVATI DIVISIONS)
  // ==============================================================================
  {
    id: 'loc_nagpur_zeromile',
    name: 'Nagpur (Zero Mile Freedom Park / Sitabuldi)',
    subtitle: 'Wardha Road / Samruddhi Mahamarg Terminus, Nagpur',
    coordinates: [21.1458, 79.0882],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_nagpur_mihan',
    name: 'MIHAN SEZ & AIIMS Nagpur',
    subtitle: 'South Nagpur, Outer Ring Road, Maharashtra',
    coordinates: [21.0500, 79.0300],
    category: 'it_hub',
    region: 'vidarbha'
  },
  {
    id: 'loc_amravati_hq',
    name: 'Amravati (Rajkamal Chowk / Badnera)',
    subtitle: 'NH-53 National Highway, Amravati District',
    coordinates: [20.9374, 77.7796],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_akola_hq',
    name: 'Akola (Tower Chowk / Central Railway Station)',
    subtitle: 'NH-53 Highway, Akola District, West Vidarbha',
    coordinates: [20.7002, 77.0082],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_chandrapur_hq',
    name: 'Chandrapur (Thermal Power Hub / Gandhi Chowk)',
    subtitle: 'Nagpur-Chandrapur Highway, Chandrapur District',
    coordinates: [19.9615, 79.2961],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_wardha_hq',
    name: 'Wardha (Sevagram Ashram / Bachelor Road)',
    subtitle: 'Wardha-Nagpur Corridor, Wardha District',
    coordinates: [20.7453, 78.6022],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_yavatmal_hq',
    name: 'Yavatmal (Dhamangaon Road CBS)',
    subtitle: 'Yavatmal District HQ, Vidarbha',
    coordinates: [20.3888, 78.1204],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_buldhana_lonar',
    name: 'Buldhana (Lonar Heritage / Khamgaon)',
    subtitle: 'Buldhana District, West Vidarbha',
    coordinates: [20.5283, 76.1833],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_washim_hq',
    name: 'Washim (Balaji Mandir / CBS)',
    subtitle: 'Hingoli-Washim Road, Washim District',
    coordinates: [20.1111, 77.1350],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_bhandara_hq',
    name: 'Bhandara District Headquarters',
    subtitle: 'NH-53 Mumbai-Kolkata Highway, Bhandara District',
    coordinates: [21.1667, 79.6500],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_gondia_hq',
    name: 'Gondia (Nehru Chowk / Railway Junction)',
    subtitle: 'Gondia District, Eastern Vidarbha',
    coordinates: [21.4597, 80.1961],
    category: 'district_hq',
    region: 'vidarbha'
  },
  {
    id: 'loc_gadchiroli_hq',
    name: 'Gadchiroli District Headquarters',
    subtitle: 'Chamorshi Road, Gadchiroli District',
    coordinates: [20.1800, 80.0000],
    category: 'district_hq',
    region: 'vidarbha'
  }
];

// Backward-compatible alias for existing imports
export const PUNE_LANDMARKS = MAHARASHTRA_LANDMARKS;

// Quick Strategic Highway Corridors across Maharashtra
export const STRATEGIC_CORRIDORS: StrategicCorridor[] = [
  {
    id: 'corr_pune_local',
    name: 'Pune Metro Testbed',
    badge: 'City Core',
    highway: 'NH-48 / Baner Rd',
    originId: 'loc_jspm_tathawade',
    destId: 'loc_kothrud_stand'
  },
  {
    id: 'corr_mumbai_mmr',
    name: 'Mumbai MMR Coastal',
    badge: 'Metro Corridor',
    highway: 'Bandra-Worli Sea Link / WEH',
    originId: 'loc_mumbai_bkc',
    destId: 'loc_mumbai_csmt'
  },
  {
    id: 'corr_pune_mumbai',
    name: 'Pune ⇄ Mumbai Expressway',
    badge: 'State Arterial',
    highway: 'Yashwantrao Chavan Expressway (NH-48)',
    originId: 'loc_jspm_tathawade',
    destId: 'loc_mumbai_bkc'
  },
  {
    id: 'corr_pune_nashik',
    name: 'Pune ⇄ Nashik Corridor',
    badge: 'North Link',
    highway: 'NH-60 (Pune-Nashik Highway)',
    originId: 'loc_bhumkar_chowk',
    destId: 'loc_nashik_panchavati'
  },
  {
    id: 'corr_pune_sambhaji',
    name: 'Pune ⇄ Chhatrapati Sambhaji Nagar',
    badge: 'Marathwada Link',
    highway: 'SH-27 / Samruddhi Connector',
    originId: 'loc_viman_nagar',
    destId: 'loc_aurangabad_sambhaji'
  },
  {
    id: 'corr_pune_nagpur',
    name: 'Pune ⇄ Nagpur Samruddhi',
    badge: 'Super Expressway',
    highway: 'Hindu Hrudaysamrat Samruddhi Mahamarg',
    originId: 'loc_jspm_tathawade',
    destId: 'loc_nagpur_zeromile'
  },
  {
    id: 'corr_pune_kolhapur',
    name: 'Pune ⇄ Kolhapur Highway',
    badge: 'South Corridor',
    highway: 'NH-48 Golden Quadrilateral',
    originId: 'loc_swargate',
    destId: 'loc_kolhapur_mahalaxmi'
  }
];

/**
 * Searches locations across all 36 Maharashtra districts + live OpenStreetMap Nominatim
 */
export async function searchPuneLocations(
  query: string, 
  regionFilter: MaharashtraRegion = 'all'
): Promise<PuneLocation[]> {
  const sanitized = query.replace(/[<>'";&]/g, '').trim().slice(0, 100);
  const trimmed = sanitized.toLowerCase();

  // If query is empty, provide balanced, high-priority recommendations across Maharashtra
  if (!trimmed) {
    if (regionFilter === 'all') {
      const curatedPickIds = [
        'loc_jspm_tathawade',
        'loc_mumbai_bkc',
        'loc_mumbai_csmt',
        'loc_nashik_panchavati',
        'loc_aurangabad_sambhaji',
        'loc_nagpur_zeromile',
        'loc_kolhapur_mahalaxmi',
        'loc_solapur_siddheshwar',
        'loc_kothrud_stand'
      ];
      return MAHARASHTRA_LANDMARKS.filter(l => curatedPickIds.includes(l.id));
    }
    return MAHARASHTRA_LANDMARKS.filter(l => l.region === regionFilter).slice(0, 8);
  }

  // 1. Instant local search across curated landmarks
  const localMatches = MAHARASHTRA_LANDMARKS.filter(loc => {
    const matchesRegion = regionFilter === 'all' || loc.region === regionFilter;
    const matchesText = loc.name.toLowerCase().includes(trimmed) || 
                        loc.subtitle.toLowerCase().includes(trimmed);
    return matchesRegion && matchesText;
  });

  if (localMatches.length >= 4 && (trimmed.length <= 4 || localMatches[0].name.toLowerCase().startsWith(trimmed))) {
    return localMatches.slice(0, 8);
  }

  // 2. Pan-India Live Search via Photon API (Fast, Free, No State Bias)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lang=en`;
    const res = await fetch(photonUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const photonLocations: PuneLocation[] = data.features.map((f: any, idx: number) => {
          const props = f.properties || {};
          const coords: [number, number] = [
            Number(f.geometry.coordinates[1].toFixed(5)),
            Number(f.geometry.coordinates[0].toFixed(5))
          ];
          const name = props.name || props.street || query;
          const subtitleParts = [props.street, props.district, props.city, props.state, props.postcode].filter(Boolean);
          const subtitle = subtitleParts.length > 0 ? subtitleParts.join(', ') : 'India';

          return {
            id: `photon_${coords[0]}_${coords[1]}_${idx}`,
            name,
            subtitle,
            coordinates: coords,
            category: 'landmark',
            region: 'all'
          };
        });

        // Prepend any strong local matches
        return [...localMatches.slice(0, 2), ...photonLocations].slice(0, 8);
      }
    }
  } catch {
    // Photon timeout, fallback to Nominatim
  }

  // 3. Fallback: OpenStreetMap Nominatim Pan-India Geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=8`;
    const res = await fetch(nominatimUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const nomLocations: PuneLocation[] = data.map((item: any, idx: number) => ({
          id: `nom_${item.place_id || idx}`,
          name: item.display_name.split(',')[0].trim(),
          subtitle: item.display_name.split(',').slice(1, 4).join(',').trim(),
          coordinates: [
            Number(parseFloat(item.lat).toFixed(5)),
            Number(parseFloat(item.lon).toFixed(5))
          ],
          category: 'landmark',
          region: 'all'
        }));
        return nomLocations;
      }
    }
  } catch {
    // Return local matches if network fails
  }

  return localMatches.slice(0, 8);
}

export function parseCoordinates(query: string): [number, number] | null {
  if (!query) return null;
  let cleaned = query.trim().replace(/[\[\]\(\)\{\}°]/g, '');
  
  let isSouth = false;
  let isWest = false;
  if (/s/i.test(cleaned)) isSouth = true;
  if (/w/i.test(cleaned)) isWest = true;
  cleaned = cleaned.replace(/[nsewNSEW]/g, '').trim();

  const match = cleaned.match(/^([-+]?\d{1,2}(?:\.\d+)?)[,\s;/]+([-+]?\d{1,3}(?:\.\d+)?)$/);
  if (match) {
    let lat = parseFloat(match[1]);
    let lng = parseFloat(match[2]);

    if (isSouth && lat > 0) lat = -lat;
    if (isWest && lng > 0) lng = -lng;

    if (lat > 50 && lat < 90 && lng > 10 && lng < 40) {
      const temp = lat;
      lat = lng;
      lng = temp;
    }

    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return [Number(lat.toFixed(5)), Number(lng.toFixed(5))];
    }
  }
  return null;
}

export async function reverseGeocode(coords: [number, number]): Promise<PuneLocation> {
  const [lat, lng] = coords;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      const road = data.address?.road || data.address?.neighbourhood || data.address?.suburb;
      const city = data.address?.city || data.address?.town || data.address?.county || 'Pune';
      const name = data.name || road || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      const subtitle = [data.address?.suburb || road, city, data.address?.state].filter(Boolean).join(', ');
      return {
        id: `custom_${lat.toFixed(5)}_${lng.toFixed(5)}`,
        name,
        subtitle: subtitle || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
        coordinates: coords,
        category: 'landmark'
      };
    }
  } catch {
    // fallback
  }

  return {
    id: `custom_${lat.toFixed(5)}_${lng.toFixed(5)}`,
    name: `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    subtitle: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    coordinates: coords,
    category: 'landmark'
  };
}

export function getUserCurrentLocation(): Promise<PuneLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const processCoords = async (latitude: number, longitude: number, isFallback = false): Promise<PuneLocation> => {
      const coords: [number, number] = [
        Number(latitude.toFixed(5)),
        Number(longitude.toFixed(5))
      ];

      try {
        localStorage.setItem('surakshit_last_gps', JSON.stringify(coords));
      } catch {
        // ignore
      }

      const freshId = `gps_${Date.now()}`;

      try {
        const loc = await reverseGeocode(coords);
        loc.id = freshId;
        loc.name = '📍 Your Current Location';
        loc.subtitle = `${loc.subtitle} (GPS Live)`;
        loc.coordinates = coords;
        return loc;
      } catch {
        return {
          id: freshId,
          name: '📍 Your Current Location',
          subtitle: `GPS: ${coords[0].toFixed(4)}°N, ${coords[1].toFixed(4)}°E${isFallback ? ' (Network)' : ''}`,
          coordinates: coords,
          category: 'landmark'
        };
      }
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await processCoords(pos.coords.latitude, pos.coords.longitude, false);
          resolve(loc);
        } catch (e) {
          reject(e);
        }
      },
      async (err1) => {
        console.warn('Fast GPS attempt timed out or failed, checking cached coordinates...', err1.message);

        try {
          const cached = localStorage.getItem('surakshit_last_gps');
          if (cached) {
            const parsed: [number, number] = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length === 2) {
              resolve({
                id: `gps_cached_${Date.now()}`,
                name: '📍 Last Known Location',
                subtitle: `GPS: ${parsed[0].toFixed(4)}°N, ${parsed[1].toFixed(4)}°E (Saved)`,
                coordinates: parsed,
                category: 'landmark'
              });
              return;
            }
          }
        } catch {
          // ignore
        }

        // Stage 3: Low accuracy fallback
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const loc = await processCoords(pos.coords.latitude, pos.coords.longitude, true);
              resolve(loc);
            } catch (e) {
              reject(e);
            }
          },
          (err2) => {
            reject(err2);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 120000,
            timeout: 10000
          }
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 4000
      }
    );
  });
}

export function watchUserLiveLocation(
  onUpdate: (coords: [number, number], accuracy: number) => void,
  onError?: (error: GeolocationPositionError) => void
): () => void {
  if (!navigator.geolocation) return () => {};

  let consecutiveErrors = 0;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      consecutiveErrors = 0;
      const coords: [number, number] = [
        Number(pos.coords.latitude.toFixed(5)),
        Number(pos.coords.longitude.toFixed(5))
      ];
      try {
        localStorage.setItem('surakshit_last_gps', JSON.stringify(coords));
      } catch {
        // ignore
      }
      onUpdate(coords, pos.coords.accuracy || 10);
    },
    (err) => {
      if (err.code === 3) {
        consecutiveErrors++;
        if (consecutiveErrors <= 1) {
          console.warn('Live GPS watchPosition timeout, keeping last valid location.');
        }
        return;
      }
      if (onError) onError(err);
    },
    {
      enableHighAccuracy: true, // Use real GPS satellite/chip positioning
      maximumAge: 2000,
      timeout: 10000
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

