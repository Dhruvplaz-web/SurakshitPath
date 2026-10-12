export interface PuneLocation {
  id: string;
  name: string;
  subtitle: string;
  coordinates: [number, number]; // [lat, lng]
  category: 'college' | 'transit' | 'it_hub' | 'landmark' | 'residential' | 'statewide';
}

export type StatewideLocation = PuneLocation;

// Curated high-precision landmark database across Pune Metropolitan Region and major Maharashtra hubs
export const PUNE_LANDMARKS: PuneLocation[] = [
  // West & North-West Pune (IT Hub & Colleges)
  {
    id: 'loc_jspm_tathawade',
    name: 'JSPM RSCOE Tathawade',
    subtitle: 'Mumbai-Bangalore Highway, Tathawade, Pimpri-Chinchwad',
    coordinates: [18.6186, 73.7483],
    category: 'college'
  },
  {
    id: 'loc_indira_college',
    name: 'Indira College of Commerce & Science',
    subtitle: 'Tathawade, Near Wakad Bridge, Pune',
    coordinates: [18.6135, 73.7525],
    category: 'college'
  },
  {
    id: 'loc_bhumkar_chowk',
    name: 'Bhumkar Chowk Junction',
    subtitle: 'Wakad-Tathawade Bypass, Pune',
    coordinates: [18.6085, 73.7540],
    category: 'landmark'
  },
  {
    id: 'loc_dange_chowk',
    name: 'Dange Chowk BRTS Stand',
    subtitle: 'Thergaon, Pimpri-Chinchwad, Pune',
    coordinates: [18.6112, 73.7745],
    category: 'transit'
  },
  {
    id: 'loc_hinjawadi_phase1',
    name: 'Hinjawadi Phase 1 (Infosys Circle)',
    subtitle: 'Rajiv Gandhi Infotech Park, Hinjawadi, Pune',
    coordinates: [18.5912, 73.7389],
    category: 'it_hub'
  },
  {
    id: 'loc_hinjawadi_phase3',
    name: 'Hinjawadi Phase 3 (Megapolis Circle)',
    subtitle: 'Techzone 4, Hinjawadi Phase 3, Pune',
    coordinates: [18.5790, 73.6880],
    category: 'it_hub'
  },
  {
    id: 'loc_balewadi_highstreet',
    name: 'Balewadi High Street',
    subtitle: 'Near Balewadi Sports Complex, Baner, Pune',
    coordinates: [18.5775, 73.7695],
    category: 'landmark'
  },
  {
    id: 'loc_baner_phata',
    name: 'Baner Phata Commercial Junction',
    subtitle: 'Baner Road, Near Wellness Forever, Pune',
    coordinates: [18.5590, 73.7860],
    category: 'landmark'
  },
  {
    id: 'loc_aundh_medipoint',
    name: 'Aundh (Medipoint Hospital / Westend Mall)',
    subtitle: 'DP Road, Harmony Society, Aundh, Pune',
    coordinates: [18.5480, 73.8110],
    category: 'landmark'
  },

  // Central & University Corridors
  {
    id: 'loc_pune_university',
    name: 'Savitribai Phule Pune University (SPPU)',
    subtitle: 'Ganeshkhind Road, University Circle, Pune',
    coordinates: [18.5308, 73.8288],
    category: 'college'
  },
  {
    id: 'loc_fc_road',
    name: 'Fergusson College Road (FC Road)',
    subtitle: 'Deccan Gymkhana / Shivajinagar, Pune',
    coordinates: [18.5204, 73.8402],
    category: 'college'
  },
  {
    id: 'loc_coep_tech',
    name: 'COEP Technological University',
    subtitle: 'Wellesley Road, Shivajinagar, Pune',
    coordinates: [18.5293, 73.8565],
    category: 'college'
  },
  {
    id: 'loc_sb_road',
    name: 'Senapati Bapat Road (Symbiosis / JW Marriott)',
    subtitle: 'Near Chatushrungi Temple, Pune',
    coordinates: [18.5250, 73.8320],
    category: 'landmark'
  },
  {
    id: 'loc_shivajinagar_station',
    name: 'Shivajinagar Railway & Metro Station',
    subtitle: 'Old Mumbai-Pune Highway, Shivajinagar, Pune',
    coordinates: [18.5320, 73.8520],
    category: 'transit'
  },

  // Kothrud & Paud Road
  {
    id: 'loc_kothrud_stand',
    name: 'Kothrud Bus Stand & Depot',
    subtitle: 'Karve Road / Paud Road Junction, Kothrud, Pune',
    coordinates: [18.5074, 73.8077],
    category: 'transit'
  },
  {
    id: 'loc_mit_wpu',
    name: 'MIT World Peace University',
    subtitle: 'Paud Road, Rambaug Colony, Kothrud, Pune',
    coordinates: [18.5178, 73.8152],
    category: 'college'
  },
  {
    id: 'loc_chandani_chowk',
    name: 'Chandani Chowk Multilevel Flyover',
    subtitle: 'Bavdhan / Kothrud Junction, Pune',
    coordinates: [18.5080, 73.7920],
    category: 'landmark'
  },

  // East & South Pune
  {
    id: 'loc_viman_nagar',
    name: 'Viman Nagar (Phoenix Marketcity / Symbiosis)',
    subtitle: 'Ahmednagar Road, Viman Nagar, Pune',
    coordinates: [18.5679, 73.9143],
    category: 'landmark'
  },
  {
    id: 'loc_swargate',
    name: 'Swargate MSRTC Bus Terminal & Metro',
    subtitle: 'Shivaji Road, Swargate, Pune',
    coordinates: [18.5018, 73.8586],
    category: 'transit'
  },

  // ==============================================================================
  // Statewide Maharashtra Metropolitan Hubs & Key Corridors (Master Plan Phase 1)
  // ==============================================================================
  {
    id: 'loc_mumbai_csmt',
    name: 'Mumbai CSMT (Chhatrapati Shivaji Maharaj Terminus)',
    subtitle: 'Fort, South Mumbai, Maharashtra',
    coordinates: [18.9400, 72.8353],
    category: 'statewide'
  },
  {
    id: 'loc_mumbai_bkc',
    name: 'Bandra Kurla Complex (BKC)',
    subtitle: 'Bandra East, Mumbai Metropolitan Region',
    coordinates: [19.0657, 72.8687],
    category: 'statewide'
  },
  {
    id: 'loc_navi_mumbai_vashi',
    name: 'Navi Mumbai (Vashi Plaza / Highway)',
    subtitle: 'Sion-Panvel Expressway, Navi Mumbai, Maharashtra',
    coordinates: [19.0771, 72.9986],
    category: 'statewide'
  },
  {
    id: 'loc_thane_station',
    name: 'Thane Central Railway Junction',
    subtitle: 'Gokhale Road, Thane West, Maharashtra',
    coordinates: [19.1860, 72.9759],
    category: 'statewide'
  },
  {
    id: 'loc_lonavala_expressway',
    name: 'Lonavala (Mumbai-Pune Expressway Toll plaza)',
    subtitle: 'Western Ghats Corridor, Maharashtra',
    coordinates: [18.7557, 73.4091],
    category: 'statewide'
  },
  {
    id: 'loc_nashik_panchavati',
    name: 'Nashik (Panchavati / Dwarka Circle)',
    subtitle: 'Nashik-Pune Highway NH-60, Nashik, Maharashtra',
    coordinates: [19.9975, 73.7898],
    category: 'statewide'
  },
  {
    id: 'loc_aurangabad_sambhaji',
    name: 'Chhatrapati Sambhaji Nagar (Aurangabad Central)',
    subtitle: 'Jalna Road / Station Road, Marathwada, Maharashtra',
    coordinates: [19.8762, 75.3433],
    category: 'statewide'
  },
  {
    id: 'loc_nagpur_zeromile',
    name: 'Nagpur (Zero Mile Freedom Park)',
    subtitle: 'Wardha Road / Sitabuldi, Nagpur, Maharashtra',
    coordinates: [21.1458, 79.0882],
    category: 'statewide'
  },
  {
    id: 'loc_kolhapur_mahalaxmi',
    name: 'Kolhapur (Mahalaxmi / CBS Bus Terminal)',
    subtitle: 'NH-48 Mumbai-Bengaluru Corridor, Kolhapur, Maharashtra',
    coordinates: [16.6944, 74.2223],
    category: 'statewide'
  },
  {
    id: 'loc_solapur_siddheshwar',
    name: 'Solapur (Siddheshwar / Pune-Solapur NH-65)',
    subtitle: 'Solapur Metropolitan, Maharashtra',
    coordinates: [17.6599, 75.9064],
    category: 'statewide'
  }
];

/**
 * Searches locations across Pune and the entire state of Maharashtra
 * via curated high-precision database + live OpenStreetMap Nominatim
 */
export async function searchPuneLocations(query: string): Promise<PuneLocation[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return PUNE_LANDMARKS.slice(0, 6);

  // 1. Fast instant match from local high-precision Maharashtra database
  const localMatches = PUNE_LANDMARKS.filter(
    loc => loc.name.toLowerCase().includes(trimmed) || loc.subtitle.toLowerCase().includes(trimmed)
  );

  if (localMatches.length >= 4) {
    return localMatches;
  }

  // 2. Fetch live results from Nominatim with statewide Maharashtra Bounding Box
  let timeout: ReturnType<typeof setTimeout> | null = null;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 2200);

    // Bounding box for Maharashtra: [min_lon, max_lat, max_lon, min_lat] -> [72.6, 22.1, 80.9, 15.6]
    const searchQuery = trimmed.includes('pune') || trimmed.includes('mumbai') || trimmed.includes('maharashtra')
      ? `${query}, India`
      : `${query}, Maharashtra, India`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchQuery
    )}&viewbox=72.6,22.1,80.9,15.6&bounded=0&limit=6`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const nominatimLocations: PuneLocation[] = (data || []).map((item: { place_id: number; display_name: string; lat: string; lon: string }) => {
        const parts = item.display_name.split(',');
        const primary = parts[0];
        const rest = parts.slice(1, 4).join(',').trim();
        return {
          id: `nom_${item.place_id}`,
          name: primary,
          subtitle: rest || 'Maharashtra, India',
          coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
          category: 'statewide'
        };
      });

      // Merge and deduplicate
      const combined = [...localMatches];
      for (const nom of nominatimLocations) {
        if (!combined.some(c => Math.abs(c.coordinates[0] - nom.coordinates[0]) < 0.005 && Math.abs(c.coordinates[1] - nom.coordinates[1]) < 0.005)) {
          combined.push(nom);
        }
      }
      return combined.slice(0, 8);
    }
  } catch {
    // Network error or timeout: return local matches safely
  } finally {
    if (timeout) clearTimeout(timeout);
  }

  return localMatches;
}
