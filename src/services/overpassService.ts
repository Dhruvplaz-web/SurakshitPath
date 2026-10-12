import { getCachedSpatialData, setCachedSpatialData } from './spatialCache';

export interface OverpassAmenity {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  type: string;
  lit?: string;
  opening_hours?: string;
}

/**
 * Builds Overpass QL query for night travel safety in a specific bounding box
 */
export function buildSafetyOverpassQuery(
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): string {
  return `
    [out:json][timeout:20];
    (
      node["highway"="street_lamp"](${minLat},${minLon},${maxLat},${maxLon});
      node["amenity"~"police|hospital|pharmacy|fuel"](${minLat},${minLon},${maxLat},${maxLon});
      way["highway"~"primary|secondary|trunk|residential"]["lit"="yes"](${minLat},${minLon},${maxLat},${maxLon});
    );
    out body;
    >;
    out skel qt;
  `.trim();
}

/**
 * Fetches real OSM lighting and amenity data for a bounding box in Pune with local caching
 */
export async function fetchOverpassSafetyData(
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): Promise<OverpassAmenity[]> {
  const cacheKey = `overpass_${minLat.toFixed(3)}_${minLon.toFixed(3)}_${maxLat.toFixed(3)}_${maxLon.toFixed(3)}`;
  const cached = getCachedSpatialData<OverpassAmenity[]>(cacheKey);
  if (cached) return cached;

  const query = buildSafetyOverpassQuery(minLat, minLon, maxLat, maxLon);
  const endpoint = 'https://overpass-api.de/api/interpreter';

  let timeout: ReturnType<typeof setTimeout> | null = null;
  try {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal
    });

    if (res.ok) {
      const data = await res.json();
      const amenities: OverpassAmenity[] = (data.elements || [])
        .filter((el: { type: string; lat?: number; lon?: number }) => el.type === 'node' && el.lat && el.lon)
        .map((el: { id: number; lat: number; lon: number; tags?: { name?: string; amenity?: string; highway?: string; lit?: string; opening_hours?: string } }) => ({
          id: el.id,
          lat: el.lat,
          lon: el.lon,
          name: el.tags?.name,
          type: el.tags?.amenity || el.tags?.highway || 'amenity',
          lit: el.tags?.lit,
          opening_hours: el.tags?.opening_hours
        }));

      setCachedSpatialData(cacheKey, amenities);
      return amenities;
    }
  } catch {
    // Network or rate-limit error; gracefully fallback to bundled POIs
  } finally {
    if (timeout) clearTimeout(timeout);
  }

  return [];
}
