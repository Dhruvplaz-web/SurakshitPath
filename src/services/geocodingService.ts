export interface PuneLocation {
  id: string;
  name: string;
  subtitle: string;
  coordinates: [number, number]; // [lat, lng]
  category: 'college' | 'transit' | 'it_hub' | 'landmark' | 'residential';
}

// Curated high-precision landmark database across all zones of Pune Metropolitan Region
export const PUNE_LANDMARKS: PuneLocation[] = [
  // West & North-West (IT Hub & Colleges)
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
  }
];

/**
 * Parses user input to check if it's a coordinate string
 * Supports formats: "18.5204, 73.8567", "[18.5204, 73.8567]", "18.5204 N, 73.8567 E", "73.8567, 18.5204"
 */
export function parseCoordinates(query: string): [number, number] | null {
  if (!query) return null;
  // Strip brackets, parentheses, degree symbols
  let cleaned = query.trim().replace(/[\[\]\(\)\{\}°]/g, '');
  
  // Check for N/S and E/W indicators
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

    // Detect if user pasted in lng,lat order (e.g. 73.8567, 18.5204 for Pune / India)
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

/**
 * Reverse geocodes coordinates to a readable human location using Nominatim
 */
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

/**
 * Retrieves the user's real-time live GPS location from the browser
 * with resilient multi-stage fallback (High-Accuracy -> Network/Low-Accuracy -> Last Known Cache).
 */
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

      // Save to localStorage for instant recovery
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

    // Stage 1: Fast fix with 3.5s timeout and 2-min cache allowance (rapid on laptops/phones)
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

        // Stage 2: Check cached last-known coordinates
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

        // Stage 3: Try lightweight IP location fallback (2.5s)
        try {
          const ipController = new AbortController();
          const ipTimeout = setTimeout(() => ipController.signal, 2500);
          const ipRes = await fetch('https://ipapi.co/json/', { signal: ipController.signal });
          clearTimeout(ipTimeout);
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData.latitude && ipData.longitude) {
              const loc = await processCoords(ipData.latitude, ipData.longitude, true);
              resolve(loc);
              return;
            }
          }
        } catch {
          // IP fallback unavailable or offline
        }

        // If all automated attempts failed, reject cleanly with code so UI can open Option B modal
        const customErr = new Error(
          err1.code === 1
            ? 'Location permission denied. Please pick a starting point or grant location access.'
            : 'GPS acquisition timed out. Please choose your starting location.'
        );
        (customErr as any).code = 'GPS_FALLBACK_REQUIRED';
        reject(customErr);
      },
      {
        enableHighAccuracy: false, // Prevents cold satellite hardware lock hang on laptops
        timeout: 3500,
        maximumAge: 120000
      }
    );
  });
}

/**
 * Live continuous GPS tracker for mobile navigation
 */
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
      // Don't crash or spam UI on recurring laptop timeout errors
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
      enableHighAccuracy: false, // Low power prevents laptop battery drain and timeout errors
      maximumAge: 5000,
      timeout: 8000
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

/**
 * Searches real-time locations across Pune and Maharashtra via live Photon Komoot API,
 * Nominatim OpenStreetMap fallback, direct GPS coordinate detection, and local shortcuts.
 */
export async function searchPuneLocations(query: string): Promise<PuneLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) return PUNE_LANDMARKS.slice(0, 6);

  // 1. Direct Coordinate Detection (e.g., "18.5204, 73.8567")
  const parsedCoords = parseCoordinates(trimmed);
  if (parsedCoords) {
    const coordLoc: PuneLocation = {
      id: `coord_${parsedCoords[0]}_${parsedCoords[1]}`,
      name: `📍 Custom Coordinates: ${parsedCoords[0]}, ${parsedCoords[1]}`,
      subtitle: `Exact GPS location input (${parsedCoords[0].toFixed(4)}°N, ${parsedCoords[1].toFixed(4)}°E)`,
      coordinates: parsedCoords,
      category: 'landmark'
    };
    return [coordLoc];
  }

  const queryLower = trimmed.toLowerCase();
  const localMatches = PUNE_LANDMARKS.filter(
    loc => loc.name.toLowerCase().includes(queryLower) || loc.subtitle.toLowerCase().includes(queryLower)
  );

  const results: PuneLocation[] = [];

  // 2. Query Live Photon Geocoding Engine (Fast, unthrottled, biased to Pune metropolitan area)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&lat=18.5204&lon=73.8567&limit=10`;
    const res = await fetch(photonUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        for (const feat of data.features) {
          const props = feat.properties || {};
          const geom = feat.geometry || {};
          if (geom.coordinates && geom.coordinates.length >= 2) {
            const lng = Number(geom.coordinates[0]);
            const lat = Number(geom.coordinates[1]);
            const name = props.name || props.street || props.district || trimmed;
            const subtitleParts = [
              props.street,
              props.suburb || props.district,
              props.city || props.county || 'Pune',
              props.state
            ].filter(Boolean);
            const subtitle = Array.from(new Set(subtitleParts)).join(', ');

            results.push({
              id: `photon_${props.osm_id || Math.random().toString(36).substr(2, 9)}`,
              name,
              subtitle: subtitle || 'Pune Metropolitan Region',
              coordinates: [lat, lng],
              category: props.osm_value === 'college' || props.osm_value === 'university'
                ? 'college'
                : (props.osm_value === 'bus_stop' || props.osm_value === 'station' ? 'transit' : 'landmark')
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Photon geocoding fallback to Nominatim:', err);
  }

  // 3. Fallback to Nominatim if Photon returned fewer than 2 results
  if (results.length < 2) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        trimmed + ', Pune'
      )}&limit=6`;

      const res = await fetch(nomUrl, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeout);

      if (res.ok) {
        const nomData = await res.json();
        for (const item of (nomData || [])) {
          const parts = item.display_name.split(',');
          const primary = parts[0];
          const rest = parts.slice(1, 4).join(',').trim();
          results.push({
            id: `nom_${item.place_id}`,
            name: primary,
            subtitle: rest,
            coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
            category: 'landmark'
          });
        }
      }
    } catch {
      // Network error
    }
  }

  // 4. Merge local shortcuts and deduplicate by spatial proximity (<300m)
  const merged = [...results];
  for (const local of localMatches) {
    if (!merged.some(m => Math.abs(m.coordinates[0] - local.coordinates[0]) < 0.003 && Math.abs(m.coordinates[1] - local.coordinates[1]) < 0.003)) {
      merged.push(local);
    }
  }

  return merged.length > 0 ? merged.slice(0, 10) : localMatches.slice(0, 6);
}
