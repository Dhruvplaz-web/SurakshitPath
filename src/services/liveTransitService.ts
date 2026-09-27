import { useState, useEffect } from 'react';

export interface LiveTransitNode {
  id: string;
  name: string;
  type: 'bus_stop' | 'bus_station' | 'metro_station';
  coordinates: [number, number]; // [lat, lng]
  operator: 'PMPML' | 'Maha Metro' | 'PMRDA Metro';
  lineInfo?: string;
  isLit?: boolean;
  hasShelter?: boolean;
  distanceMeters?: number;
}

// Curated verified backbone of Pune Metro (Purple & Aqua Lines) and primary PMPML depots
export const PUNE_KEY_TRANSIT_STATIONS: LiveTransitNode[] = [
  // Pune Metro Aqua Line (Line 2: Vanaz to Ramwadi)
  {
    id: 'metro_vanaz',
    name: 'Vanaz Metro Station',
    type: 'metro_station',
    coordinates: [18.5074, 73.8052],
    operator: 'Maha Metro',
    lineInfo: 'Aqua Line (Line 2)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_ideal_colony',
    name: 'Ideal Colony Metro Station',
    type: 'metro_station',
    coordinates: [18.5065, 73.8152],
    operator: 'Maha Metro',
    lineInfo: 'Aqua Line (Line 2)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_nal_stop',
    name: 'Nal Stop Metro Station',
    type: 'metro_station',
    coordinates: [18.5085, 73.8260],
    operator: 'Maha Metro',
    lineInfo: 'Aqua Line (Line 2)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_garware_college',
    name: 'Garware College Metro Station',
    type: 'metro_station',
    coordinates: [18.5132, 73.8340],
    operator: 'Maha Metro',
    lineInfo: 'Aqua Line (Line 2)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_deccan',
    name: 'Deccan Gymkhana Metro Station',
    type: 'metro_station',
    coordinates: [18.5178, 73.8430],
    operator: 'Maha Metro',
    lineInfo: 'Aqua Line (Line 2)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_civil_court',
    name: 'Civil Court Multi-Modal Metro Interchange',
    type: 'metro_station',
    coordinates: [18.5290, 73.8560],
    operator: 'Maha Metro',
    lineInfo: 'Purple Line ⇄ Aqua Line Interchange',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_shivajinagar',
    name: 'Shivajinagar Underground Metro Station',
    type: 'metro_station',
    coordinates: [18.5315, 73.8520],
    operator: 'Maha Metro',
    lineInfo: 'Purple Line (Line 1)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_swargate',
    name: 'Swargate Underground Metro Station',
    type: 'metro_station',
    coordinates: [18.5015, 73.8580],
    operator: 'Maha Metro',
    lineInfo: 'Purple Line (Line 1)',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'metro_pune_station',
    name: 'Pune Railway Station Metro',
    type: 'metro_station',
    coordinates: [18.5284, 73.8740],
    operator: 'Maha Metro',
    lineInfo: 'Aqua Line (Line 2)',
    isLit: true,
    hasShelter: true
  },

  // Major PMPML Bus Depots & Multi-Modal Hubs
  {
    id: 'pmpml_kothrud_stand',
    name: 'Kothrud Stand PMPML Bus Depot',
    type: 'bus_station',
    coordinates: [18.5028, 73.8122],
    operator: 'PMPML',
    lineInfo: 'Feeder Routes 100, 102, 103, 105',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'pmpml_deccan_gymkhana',
    name: 'Deccan Gymkhana PMPML Central Bus Terminus',
    type: 'bus_station',
    coordinates: [18.5175, 73.8415],
    operator: 'PMPML',
    lineInfo: 'Feeder Routes 9, 11, 24, 86, 174',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'pmpml_swargate_bus_stand',
    name: 'Swargate PMPML Central Bus Station',
    type: 'bus_station',
    coordinates: [18.5005, 73.8570],
    operator: 'PMPML',
    lineInfo: 'BRTS Hub · 24/7 Night Feeder Express',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'pmpml_hinjawadi_chowk',
    name: 'Hinjawadi Shivaji Chowk PMPML Depot',
    type: 'bus_station',
    coordinates: [18.5912, 73.7389],
    operator: 'PMPML',
    lineInfo: 'IT Park Metro Feeder & Airport Shuttle',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'pmpml_wakad_phata',
    name: 'Wakad Bridge PMPML Transit Stop',
    type: 'bus_stop',
    coordinates: [18.5990, 73.7650],
    operator: 'PMPML',
    lineInfo: 'Highway Expressway Feeder',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'pmpml_baner_phata',
    name: 'Baner Phata PMPML Bus Stop',
    type: 'bus_stop',
    coordinates: [18.5580, 73.7940],
    operator: 'PMPML',
    lineInfo: 'Baner High Street Feeder',
    isLit: true,
    hasShelter: true
  },
  {
    id: 'pmpml_katraj_depot',
    name: 'Katraj Snake Park PMPML Bus Depot',
    type: 'bus_station',
    coordinates: [18.4550, 73.8640],
    operator: 'PMPML',
    lineInfo: 'BRTS South Corridor',
    isLit: true,
    hasShelter: true
  }
];

// Memory cache
const transitCache = new Map<string, { timestamp: number; stops: LiveTransitNode[] }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function calculateDistanceMeters(c1: [number, number], c2: [number, number]): number {
  const dLat = (c2[0] - c1[0]) * 111000;
  const dLng = (c2[1] - c1[1]) * 105000;
  return Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
}

/**
 * Fetches real-time bus stops and metro stations from Overpass API around the center coordinates
 */
export async function fetchLiveTransitNodes(
  center: [number, number] = [18.5204, 73.8567],
  radiusMeters: number = 4000
): Promise<LiveTransitNode[]> {
  const cacheKey = `${center[0].toFixed(2)}_${center[1].toFixed(2)}_${radiusMeters}`;
  const now = Date.now();

  const cached = transitCache.get(cacheKey);
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.stops;
  }

  const query = `
    [out:json][timeout:15];
    (
      node["highway"="bus_stop"](around:${radiusMeters},${center[0]},${center[1]});
      node["amenity"="bus_station"](around:${radiusMeters},${center[0]},${center[1]});
      node["railway"="station"](around:${radiusMeters * 1.5},${center[0]},${center[1]});
    );
    out body 60;
  `.trim();

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter'
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const elements = data.elements || [];

        const liveFetched: LiveTransitNode[] = [];
        for (const el of elements) {
          const name = el.tags?.name || el.tags?.['name:en'];
          if (!name) continue;

          const isMetro = el.tags?.railway === 'station' || el.tags?.station === 'subway';
          const isBusStation = el.tags?.amenity === 'bus_station';
          const type: LiveTransitNode['type'] = isMetro ? 'metro_station' : isBusStation ? 'bus_station' : 'bus_stop';
          const operator: LiveTransitNode['operator'] = isMetro ? 'Maha Metro' : 'PMPML';

          liveFetched.push({
            id: `osm_transit_${el.id}`,
            name,
            type,
            coordinates: [el.lat, el.lon],
            operator,
            lineInfo: el.tags?.route_ref ? `Routes: ${el.tags.route_ref}` : isMetro ? 'Metro Transit' : 'PMPML Urban Feeder',
            isLit: el.tags?.lit === 'yes',
            hasShelter: el.tags?.shelter === 'yes'
          });
        }

        // Deduplicate and merge with key backbone
        const consolidated = [...PUNE_KEY_TRANSIT_STATIONS];
        for (const live of liveFetched) {
          const isDup = consolidated.some(existing => 
            calculateDistanceMeters(existing.coordinates, live.coordinates) < 50
          );
          if (!isDup) {
            consolidated.push(live);
          }
        }

        transitCache.set(cacheKey, { timestamp: now, stops: consolidated });
        return consolidated;
      }
    } catch {
      continue;
    }
  }

  return PUNE_KEY_TRANSIT_STATIONS;
}

/**
 * Returns nearest transit stop from given coordinates
 */
export function findNearestTransitNode(
  coords: [number, number],
  stops: LiveTransitNode[] = PUNE_KEY_TRANSIT_STATIONS
): { stop: LiveTransitNode; distanceMeters: number } | null {
  if (!coords || stops.length === 0) return null;

  let nearest = stops[0];
  let minDist = Infinity;

  for (const stop of stops) {
    const dist = calculateDistanceMeters(coords, stop.coordinates);
    if (dist < minDist) {
      minDist = dist;
      nearest = stop;
    }
  }

  return {
    stop: nearest,
    distanceMeters: minDist
  };
}

/**
 * React hook for live transit nodes around coordinates
 */
export function useLiveTransit(centerCoords?: [number, number], radiusMeters: number = 4000) {
  const [transitNodes, setTransitNodes] = useState<LiveTransitNode[]>(PUNE_KEY_TRANSIT_STATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const center: [number, number] = centerCoords || [18.5204, 73.8567];

    setIsLoading(true);
    fetchLiveTransitNodes(center, radiusMeters)
      .then(nodes => {
        if (isMounted) {
          setTransitNodes(nodes);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [centerCoords?.[0], centerCoords?.[1], radiusMeters]);

  return { transitNodes, isLoading };
}
