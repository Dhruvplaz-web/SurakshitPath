import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, SafeHaven, DynamicEvent, TelemetryState, UserRole, CitizenReport, TravelProfile, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { useLiveShelters } from '../../services/liveShelterService';
import { PUNE_DARK_SPOTS } from '../../data/civicAdminData';
import { PuneLocation } from '../../services/geocodingService';
import {
  MAHARASHTRA_STATE_BOUNDARY,
  PUNE_DISTRICT_BOUNDARY,
  PMC_PCMC_URBAN_BOUNDARY,
  MAJOR_CITIES_AND_DISTRICTS
} from '../../data/maharashtraBoundaries';
import { Layers, ChevronDown, Check, Compass, Navigation } from 'lucide-react';
import { NavigationCockpitHud } from '../Navigation/NavigationCockpitHud';

interface Props {
  userRole: UserRole;
  origin: PuneLocation;
  destination: PuneLocation;
  activeRoute: RouteOption;
  alternativeRoutes: RouteOption[];
  activeEvents: DynamicEvent[];
  telemetry: TelemetryState;
  selectedEdgeId: string | null;
  onSelectSegment: (edgeId: string) => void;
  isPickingOnMap: 'origin' | 'destination' | null;
  onMapPickLocation: (target: 'origin' | 'destination', coords: [number, number]) => void;
  citizenReports?: CitizenReport[];
  theme?: 'dark' | 'light';
  travelProfile?: TravelProfile;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
  isLiveNavigating?: boolean;
  onToggleLiveNavigation?: (nav: boolean) => void;
  onLockSafeHaven?: (haven: SafeHaven) => void;
  currentLanguage?: AppLanguage;
}

export type MapTileStyle = 'google_roads' | 'google_hybrid' | 'google_terrain' | 'osm';

export const MapCockpit: React.FC<Props> = ({
  userRole,
  origin,
  destination,
  activeRoute,
  alternativeRoutes,
  activeEvents,
  telemetry,
  selectedEdgeId,
  onSelectSegment,
  isPickingOnMap,
  onMapPickLocation,
  citizenReports = [],
  theme = 'dark',
  travelProfile = 'pedestrian',
  isSimulating = false,
  onToggleSimulation,
  isLiveNavigating = false,
  onToggleLiveNavigation,
  onLockSafeHaven,
  currentLanguage = 'en'
}) => {
  const t = getTranslation(currentLanguage);
  const [mapStyle, setMapStyle] = useState<MapTileStyle>('google_roads');
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [showCityLabels, setShowCityLabels] = useState<boolean>(true);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const { havens: liveHavens } = useLiveShelters(origin.coordinates);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const boundariesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const citiesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const havensLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const eventsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const maneuversLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const commuterMarkerRef = useRef<L.Marker | null>(null);

  const [isNavigating, setIsNavigating] = useState(isLiveNavigating);
  const [activeManeuverIndex, setActiveManeuverIndex] = useState(0);

  useEffect(() => {
    setIsNavigating(isLiveNavigating);
    if (isLiveNavigating && activeRoute.maneuvers && activeRoute.maneuvers.length > 0) {
      zoomToManeuver(0);
    }
  }, [isLiveNavigating]);

  const zoomToManeuver = (idx: number) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const maneuvers = activeRoute.maneuvers;
    if (maneuvers && maneuvers[idx]) {
      const coord = maneuvers[idx].coordinates;
      map.flyTo(coord, 17.5, { animate: true, duration: 1.0 });
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    setActiveManeuverIndex(0);
    zoomToManeuver(0);
    onToggleLiveNavigation?.(true);
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered at Pune metropolitan corridor
    const map = L.map(mapContainerRef.current, {
      center: [18.5500, 73.8100],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initialize layer groups in proper z-order
    boundariesLayerGroupRef.current = L.layerGroup().addTo(map);
    citiesLayerGroupRef.current = L.layerGroup().addTo(map);
    routesLayerGroupRef.current = L.layerGroup().addTo(map);
    havensLayerGroupRef.current = L.layerGroup().addTo(map);
    eventsLayerGroupRef.current = L.layerGroup().addTo(map);
    maneuversLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer dynamically based on user-selected Google Maps style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newLayer: L.TileLayer;
    if (mapStyle === 'google_roads') {
      // Google Maps Standard Roadmap (State/District boundaries, highways, full typography)
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps · High-Resolution Roadmap',
        maxZoom: 21
      });
    } else if (mapStyle === 'google_hybrid') {
      // Google Maps Satellite Imagery with Road & District Overlays
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps · Satellite Hybrid Cartography',
        maxZoom: 21
      });
    } else if (mapStyle === 'google_terrain') {
      // Google Maps Physical Terrain & Contours
      newLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps · Topographic Terrain',
        maxZoom: 20
      });
    } else {
      // OpenStreetMap Classic Daylight
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      });
    }

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

  // Render Administrative Boundaries & District / City Labels
  useEffect(() => {
    const boundGroup = boundariesLayerGroupRef.current;
    const cityGroup = citiesLayerGroupRef.current;
    if (!boundGroup || !cityGroup) return;

    boundGroup.clearLayers();
    cityGroup.clearLayers();

    if (showBoundaries) {
      // 1. Maharashtra State Boundary Outline
      const statePoly = L.polygon(MAHARASHTRA_STATE_BOUNDARY.coordinates, {
        color: '#2563eb',
        fillColor: 'rgba(37, 99, 235, 0.03)',
        fillOpacity: 0.05,
        weight: 3.0,
        dashArray: '8, 8'
      });
      boundGroup.addLayer(statePoly);

      // 2. Pune District Boundary (Official limits encompassing Mulshi, Haveli, Maval, Khed)
      const distPoly = L.polygon(PUNE_DISTRICT_BOUNDARY.coordinates, {
        color: '#d97706',
        fillColor: 'rgba(217, 119, 6, 0.05)',
        fillOpacity: 0.08,
        weight: 2.5,
        dashArray: '6, 6'
      });
      boundGroup.addLayer(distPoly);

      // 3. PMC & PCMC Municipal Corporation Urban Twin Core
      const metroPoly = L.polygon(PMC_PCMC_URBAN_BOUNDARY.coordinates, {
        color: '#059669',
        fillColor: 'rgba(5, 150, 105, 0.08)',
        fillOpacity: 0.10,
        weight: 2.2
      });
      boundGroup.addLayer(metroPoly);
    }

    if (showCityLabels) {
      // 4. City & District Badges
      MAJOR_CITIES_AND_DISTRICTS.forEach(city => {
        const isPuneOrPCMC = city.id === 'city_pune' || city.id === 'city_pcmc';
        const isCapital = city.category === 'state_capital';

        const labelHtml = `
          <div style="
            background: ${isCapital ? 'rgba(30, 27, 75, 0.92)' : isPuneOrPCMC ? 'rgba(6, 78, 59, 0.92)' : 'rgba(15, 23, 42, 0.90)'};
            color: #ffffff;
            border: 1.5px solid ${isCapital ? '#818cf8' : isPuneOrPCMC ? '#34d399' : '#94a3b8'};
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 3px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            gap: 5px;
            backdrop-filter: blur(4px);
            letter-spacing: 0.2px;
          ">
            <span>${isCapital ? '⭐' : isPuneOrPCMC ? '🎯' : '📍'}</span>
            <span>${city.name}</span>
          </div>
        `;

        const icon = L.divIcon({
          className: 'city-district-badge',
          html: labelHtml,
          iconSize: [120, 26],
          iconAnchor: [60, 13]
        });

        const marker = L.marker(city.coordinates, { icon });
        marker.bindPopup(`
          <div style="font-family:'Inter',sans-serif; font-size:12px;">
            <strong>${city.name}</strong><br/>
            <span>${city.marathiName}</span><br/>
            <span style="color:#64748b; font-size:11px;">District: ${city.district} · State: ${city.state}</span>
          </div>
        `);
        cityGroup.addLayer(marker);
      });
    }
  }, [showBoundaries, showCityLabels]);

  // Map Click Listener for picking origin/destination
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isPickingOnMap) {
        onMapPickLocation(isPickingOnMap, [e.latlng.lat, e.latlng.lng]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPickingOnMap, onMapPickLocation]);

  // Render Safe Havens with polished UI badges
  useEffect(() => {
    const layerGroup = havensLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    liveHavens.forEach((haven: SafeHaven) => {
      let iconSymbol = '🛡️';
      let iconBg = theme === 'dark' ? '#0f172a' : '#ffffff';
      let borderColor = '#3b82f6';
      let typeLabel = 'Safe Haven';

      if (haven.type === 'women_shelter' || haven.type === 'crisis_shelter') {
        borderColor = '#ec4899';
        iconSymbol = '🏠';
        typeLabel = haven.type === 'women_shelter' ? "Women's Safe Shelter" : 'Crisis Refuge';
      } else if (haven.type === 'helpline_centre') {
        borderColor = '#ec4899';
        iconSymbol = '📞';
        typeLabel = '24/7 Helpline Centre';
      } else if (haven.type === 'police') {
        borderColor = '#3b82f6';
        iconSymbol = '🛡️';
        typeLabel = 'Police Chowki';
      } else if (haven.type === 'pharmacy' || haven.type === 'pharmacy_247') {
        borderColor = '#10b981';
        iconSymbol = '💊';
        typeLabel = '24/7 Pharmacy';
      } else if (haven.type === 'hospital') {
        borderColor = '#ef4444';
        iconSymbol = '🏥';
        typeLabel = 'Emergency Hospital';
      } else if (haven.type === 'temple_sanctuary' || haven.type === 'community_sanctuary') {
        borderColor = '#f59e0b';
        iconSymbol = '🛕';
        typeLabel = '24/7 Temple / Sanctuary';
      } else if (haven.type === 'supermart_247') {
        borderColor = '#a855f7';
        iconSymbol = '🛒';
        typeLabel = '24/7 Staffed Supermart';
      } else {
        borderColor = '#3b82f6';
        iconSymbol = '🛟';
        typeLabel = 'Transit Haven';
      }

      const iconHtml = `
        <div style="background:${iconBg}; border:2px solid ${borderColor}; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:13px; box-shadow:0 3px 12px rgba(0,0,0,0.35); transition:transform 0.15s ease;">
          <span>${iconSymbol}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-haven-pin',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(haven.coordinates, { icon: customIcon });
      const popupHtml = `
        <div style="font-family:'Inter',system-ui,sans-serif; min-width:210px; max-width:260px; line-height:1.4; color:#0f172a; padding:2px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; gap:6px;">
            <span style="font-size:10px; font-weight:800; text-transform:uppercase; color:${borderColor}; background:rgba(0,0,0,0.06); padding:2px 6px; border-radius:4px;">
              ${iconSymbol} ${typeLabel}
            </span>
            ${haven.trustScore ? `<span style="font-size:10px; font-weight:800; color:#059669; background:#ecfdf5; border:1px solid #a7f3d0; padding:1px 5px; border-radius:4px;">⭐ ${haven.trustScore}% Trust</span>` : ''}
          </div>
          <div style="font-weight:700; font-size:13px; color:#0f172a; margin-bottom:2px;">${haven.name}</div>
          <div style="font-size:11px; color:#475569; margin-bottom:4px;">${haven.address}</div>
          ${haven.verifiedBy ? `<div style="font-size:10px; color:#64748b; margin-bottom:4px;">✓ Verified: ${haven.verifiedBy}</div>` : ''}
          <div style="display:flex; align-items:center; justify-content:space-between; font-size:11px; margin-top:4px; border-top:1px solid #e2e8f0; padding-top:4px;">
            <span style="color:#059669; font-weight:700;">🟢 ${haven.timing}</span>
            ${haven.contact ? `<a href="tel:${haven.contact}" style="color:#2563eb; font-weight:700; text-decoration:none;">📞 ${haven.contact}</a>` : ''}
          </div>
          ${onLockSafeHaven ? `
            <button
              id="haven-btn-${haven.id}"
              style="margin-top:8px; width:100%; display:flex; align-items:center; justify-content:center; gap:6px; background:#2563eb; color:#ffffff; border:none; padding:6px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; box-shadow:0 2px 6px rgba(37,99,235,0.3);"
            >
              🧭 Reroute to this Shelter
            </button>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onLockSafeHaven) {
        marker.on('popupopen', () => {
          const btn = document.getElementById(`haven-btn-${haven.id}`);
          if (btn) {
            btn.onclick = () => {
              onLockSafeHaven(haven);
              const map = mapInstanceRef.current;
              if (map) map.closePopup();
            };
          }
        });
      }

      layerGroup.addLayer(marker);
    });
  }, [theme, onLockSafeHaven, liveHavens]);

  // Render Routes and Custom Origin/Destination Markers
  useEffect(() => {
    const routesGroup = routesLayerGroupRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const map = mapInstanceRef.current;
    if (!routesGroup || !markersGroup || !map) return;

    routesGroup.clearLayers();
    markersGroup.clearLayers();

    // 1. Draw Inactive Alternative Routes with clear recommendations
    alternativeRoutes.forEach((alt) => {
      const isUnrec = alt.isRecommendedNightRoute === false;
      const altCasing = L.polyline(alt.coordinates, {
        color: '#ffffff',
        weight: 6,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(altCasing);

      const altPolyline = L.polyline(alt.coordinates, {
        color: isUnrec ? '#ef4444' : '#64748b',
        weight: 4,
        dashArray: isUnrec ? '6, 8' : '5, 8',
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      });
      altPolyline.bindTooltip(`
        <div style="font-family:'Inter',sans-serif; font-size:12px;">
          <strong>${alt.name}</strong><br/>
          ${isUnrec ? '<strong style="color:#ef4444;">⚠️ Not Recommended at Night</strong><br/>' : '<span style="color:#34d399;">⭐ Transit Alternative</span><br/>'}
          <span style="font-size:11px; opacity:0.8;">${alt.durationMinutes}m · Safety ${alt.safetyScore}/100</span>
        </div>
      `, { sticky: true });
      routesGroup.addLayer(altPolyline);
    });

    // 2. Active Route: High-Precision Smooth Curved Polyline
    if (activeRoute.coordinates.length > 1) {
      const isUnrecommended = activeRoute.isRecommendedNightRoute === false;
      const isHighSafety = activeRoute.safetyScore >= 70;
      
      let glowColor = '#10b981';
      let mainColor = '#10b981';
      if (isUnrecommended) {
        glowColor = '#ef4444';
        mainColor = '#ef4444';
      } else if (!isHighSafety) {
        glowColor = '#f59e0b';
        mainColor = '#3b82f6';
      }

      // Glow Polyline
      const glowPolyline = L.polyline(activeRoute.coordinates, {
        color: glowColor,
        weight: isUnrecommended ? 14 : 16,
        opacity: isUnrecommended ? 0.35 : 0.30,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(glowPolyline);

      // Contrast Casing Line
      const casingPolyline = L.polyline(activeRoute.coordinates, {
        color: '#0f172a',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(casingPolyline);

      // High-precision core polyline tracing all road curves
      const corePolyline = L.polyline(activeRoute.coordinates, {
        color: mainColor,
        weight: 6,
        opacity: 1.0,
        dashArray: isUnrecommended ? '8, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round'
      });

      corePolyline.bindTooltip(`
        <div style="font-family:'Inter',sans-serif; font-size:12px; line-height:1.4;">
          <strong>${activeRoute.name}</strong><br/>
          ${isUnrecommended ? '<strong style="color:#ef4444;">⚠️ NOT RECOMMENDED FOR NIGHT TRAVEL</strong><br/>' : '<strong style="color:#10b981;">⭐ SURAKSHIT RECOMMENDED SAFE CORRIDOR</strong><br/>'}
          <span>Duration: <strong>${activeRoute.durationMinutes} min</strong> (${(activeRoute.distanceMeters/1000).toFixed(1)} km)</span><br/>
          <span>Safety Score: <strong>${activeRoute.safetyScore}/100</strong></span>
        </div>
      `, { sticky: true });
      routesGroup.addLayer(corePolyline);
    }

    // Admin Role: Highlight Municipal Dark Spots
    if (userRole === 'admin') {
      PUNE_DARK_SPOTS.forEach((spot) => {
        const darkPolyline = L.polyline(spot.coordinates, {
          color: '#ef4444',
          weight: 7,
          opacity: 0.95,
          dashArray: '4, 6',
          lineCap: 'round',
          lineJoin: 'round'
        });
        darkPolyline.bindTooltip(`
          <strong style="color:#ef4444;">⚠️ Municipal Dark Spot</strong><br/>
          <strong>${spot.name}</strong><br/>
          Illumination: ${(spot.lightingFactor * 100).toFixed(0)}% · Priority: ${spot.priorityScore}/100<br/>
          Ward: ${spot.ward}
        `, { sticky: true });
        routesGroup.addLayer(darkPolyline);
      });
    }

    // Draw 50m safe corridor geofence buffer
    if ((isNavigating || isLiveNavigating || isSimulating) && activeRoute.coordinates.length > 0) {
      const bufferPolyline = L.polyline(activeRoute.coordinates, {
        color: '#10b981',
        weight: 26,
        opacity: 0.18,
        lineCap: 'round',
        lineJoin: 'round'
      });
      bufferPolyline.bindTooltip('50m Safe Geofence Corridor Buffer (Deviation Threshold)', { sticky: true });
      routesGroup.addLayer(bufferPolyline);
    }

    // Modern Origin Marker (A)
    const originIcon = L.divIcon({
      className: 'pro-marker-origin',
      html: `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(16,185,129,0.3); animation:proPulse 2.2s infinite;"></div>
          <div style="position:relative; background:#10b981; border:2.5px solid #ffffff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:11px; font-weight:800; box-shadow:0 3px 10px rgba(0,0,0,0.35);">
            A
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    const originMarker = L.marker(origin.coordinates, { icon: originIcon }).bindPopup(`
      <div style="font-family:'Inter',sans-serif;">
        <strong>Start Point:</strong> ${origin.name}<br/>
        <span style="font-size:11px; opacity:0.8;">${origin.subtitle}</span>
      </div>
    `);
    markersGroup.addLayer(originMarker);

    // Modern Destination Marker (B)
    const destIcon = L.divIcon({
      className: 'pro-marker-dest',
      html: `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(245,158,11,0.3); animation:proPulse 2.2s infinite;"></div>
          <div style="position:relative; background:#f59e0b; border:2.5px solid #ffffff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; color:#000000; font-size:11px; font-weight:800; box-shadow:0 3px 10px rgba(0,0,0,0.35);">
            B
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    const destMarker = L.marker(destination.coordinates, { icon: destIcon }).bindPopup(`
      <div style="font-family:'Inter',sans-serif;">
        <strong>Destination:</strong> ${destination.name}<br/>
        <span style="font-size:11px; opacity:0.8;">${destination.subtitle}</span>
      </div>
    `);
    markersGroup.addLayer(destMarker);

    // Fit map bounds cleanly to active route when NOT in close-up navigation mode
    if (activeRoute.coordinates.length > 0 && !isNavigating) {
      const bounds = L.latLngBounds([origin.coordinates, destination.coordinates, ...activeRoute.coordinates]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [userRole, origin, destination, activeRoute, alternativeRoutes, selectedEdgeId, onSelectSegment, theme, isNavigating]);

  // Clean maneuver layer (turn arrow markers removed per user preference for uncluttered route line)
  useEffect(() => {
    const layerGroup = maneuversLayerGroupRef.current;
    if (!layerGroup) return;
    layerGroup.clearLayers();
  }, [activeRoute]);

  // Render Dynamic Event Markers
  useEffect(() => {
    const layerGroup = eventsLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    activeEvents.forEach((ev) => {
      if (!ev.active) return;

      const isClosure = ev.type === 'road_closure';
      const eventIcon = L.divIcon({
        className: 'event-marker',
        html: `<div style="background:${isClosure ? '#ea580c' : '#ef4444'}; border:2px solid #fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); animation:pulse-ring 1.4s infinite;">${isClosure ? '🚧' : '⚠️'}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(ev.coordinates, { icon: eventIcon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; color:#111; font-size:12px; min-width:200px;">
          <strong style="color:${isClosure ? '#c2410c' : '#ef4444'}; font-size:13px;">${ev.title}</strong><br/>
          <span style="display:block; margin:4px 0;">${ev.description}</span>
          <span style="color:${isClosure ? '#9a3412' : '#b91c1c'}; font-weight:700; font-size:11px;">Status: ${isClosure ? 'Active Construction / Road Closure' : 'Active Hazard Alert'}</span>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // Render Citizen Community Reports
    citizenReports.forEach((rep) => {
      const reportIcon = L.divIcon({
        className: 'citizen-report-pin',
        html: `
          <div style="background:#f59e0b; border:2px solid #fff; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-size:13px; box-shadow:0 3px 8px rgba(0,0,0,0.4); animation:bounce 2s infinite;">
            📢
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(rep.coordinates, { icon: reportIcon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; min-width:200px; max-width:250px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:9px; font-weight:800; color:#b45309; text-transform:uppercase; background:rgba(245,158,11,0.15); padding:2px 5px; border-radius:4px;">Community Hazard</span>
            <span style="font-size:9px; font-weight:800; color:${rep.urgency === 'high' ? '#ef4444' : '#f59e0b'}; text-transform:uppercase;">${rep.urgency}</span>
          </div>
          <div style="font-weight:700; font-size:12px; margin:2px 0; color:#0f172a;">${rep.title}</div>
          <div style="font-size:11px; color:#475569; margin-bottom:6px;">${rep.description}</div>
          ${rep.aiRiskScore ? `<div style="font-size:10px; color:#b45309; font-weight:700; margin-bottom:4px;">🛡️ AI Risk: ${rep.aiRiskScore}/100</div>` : ''}
          ${rep.photoUrl ? `<div style="margin:4px 0;"><img src="${rep.photoUrl}" style="width:100%; height:90px; object-fit:cover; border-radius:4px;" alt="Evidence" /></div>` : ''}
          <div style="font-size:10px; color:#64748b; border-top:1px solid #e2e8f0; padding-top:4px;">
            Near: <strong>${rep.landmarkName}</strong>
          </div>
        </div>
      `);
      layerGroup.addLayer(marker);
    });
  }, [activeEvents, citizenReports]);

  // Update Commuter Animated Position Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!commuterMarkerRef.current) {
      const commuterIcon = L.divIcon({
        className: 'commuter-live-marker',
        html: `
          <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:28px; height:28px; border-radius:50%; background:rgba(59,130,246,0.35); animation:pulse-ring 1.8s infinite;"></div>
            <div style="width:16px; height:16px; border-radius:50%; background:#2563eb; border:2.5px solid #ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      commuterMarkerRef.current = L.marker(telemetry.currentPosition, { icon: commuterIcon }).addTo(map);
    } else {
      commuterMarkerRef.current.setLatLng(telemetry.currentPosition);
    }
  }, [telemetry.currentPosition]);

  // Synchronize active turn maneuver with commuter's live movement
  useEffect(() => {
    if (!activeRoute.maneuvers || activeRoute.maneuvers.length === 0) return;
    const curPos = telemetry.currentPosition;
    let closestIdx = 0;
    let minD = Infinity;

    for (let i = 0; i < activeRoute.maneuvers.length; i++) {
      const m = activeRoute.maneuvers[i];
      const dLat = (m.coordinates[0] - curPos[0]) * 111000;
      const dLng = (m.coordinates[1] - curPos[1]) * 105000;
      const distSq = dLat * dLat + dLng * dLng;

      if (distSq < minD) {
        minD = distSq;
        closestIdx = i;
      }
    }

    setActiveManeuverIndex(closestIdx);
  }, [telemetry.currentPosition, activeRoute.maneuvers]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (activeRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds([origin.coordinates, destination.coordinates, ...activeRoute.coordinates]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView([18.5500, 73.8100], 12);
    }
  };

  return (
    <div className="map-viewport" style={{ cursor: isPickingOnMap ? 'crosshair' : 'default' }}>
      {isPickingOnMap && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1500,
          backgroundColor: 'var(--accent-amber)',
          color: '#000',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>Click anywhere on the map to set {isPickingOnMap.toUpperCase()} location</span>
        </div>
      )}

      {/* Floating Google Maps Style Cartography & Layer Controller */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Layer Switcher Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="btn-civic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'var(--surface-elevated)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
            title="Switch Map Layers and Boundaries"
          >
            <Layers size={14} color="var(--accent-amber)" />
            <span>
              {mapStyle === 'google_roads' ? '🗺️ Google Maps' : mapStyle === 'google_hybrid' ? '🛰️ Google Hybrid' : mapStyle === 'google_terrain' ? '⛰️ Google Terrain' : '🌐 OpenStreetMap'}
            </span>
            <ChevronDown size={13} style={{ transform: isLayerMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
          </button>

          {isLayerMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '0',
              width: '230px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
              padding: '6px',
              zIndex: 2000,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              {/* Tile Provider Section */}
              <div style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '4px'
              }}>
                Google Maps Cartography
              </div>
              {[
                { id: 'google_roads', label: '🗺️ Google Maps Roadmap', desc: 'Standard streets, boundaries & names' },
                { id: 'google_hybrid', label: '🛰️ Google Satellite Hybrid', desc: 'Photographic imagery + road labels' },
                { id: 'google_terrain', label: '⛰️ Google Physical Terrain', desc: 'Topographic contours & elevations' },
                { id: 'osm', label: '🌐 OpenStreetMap Classic', desc: 'Open crowdsourced vector tiles' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setMapStyle(opt.id as MapTileStyle);
                    setIsLayerMenuOpen(false);
                  }}
                  style={{
                    padding: '7px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: mapStyle === opt.id ? 800 : 500,
                    color: mapStyle === opt.id ? 'var(--accent-amber)' : 'var(--text-primary)',
                    backgroundColor: mapStyle === opt.id ? 'var(--surface-hover)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={e => {
                    if (mapStyle !== opt.id) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={e => {
                    if (mapStyle !== opt.id) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{opt.label}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{opt.desc}</span>
                  </div>
                  {mapStyle === opt.id && <Check size={14} color="var(--accent-amber)" />}
                </div>
              ))}

              {/* Administrative Overlay Toggles */}
              <div style={{
                padding: '6px 8px 4px',
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '4px',
                marginBottom: '4px'
              }}>
                Administrative Overlays
              </div>

              {/* Toggle State & District Boundaries */}
              <div
                onClick={() => setShowBoundaries(!showBoundaries)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>State & District Outlines</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: showBoundaries ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: showBoundaries ? 'var(--safe-emerald)' : 'var(--text-muted)'
                }}>
                  {showBoundaries ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Toggle City & District Badges */}
              <div
                onClick={() => setShowCityLabels(!showCityLabels)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>City & District Badges</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: showCityLabels ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: showCityLabels ? 'var(--safe-emerald)' : 'var(--text-muted)'
                }}>
                  {showCityLabels ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Re-center Button */}
        <button
          onClick={handleRecenter}
          className="btn-civic"
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--surface-elevated)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer'
          }}
          title="Re-center map on Pune Safe Corridor"
        >
          <Compass size={13} color="var(--safe-emerald)" />
          <span>{currentLanguage === 'mr' ? 'पुणे कॉरिडॉर' : currentLanguage === 'hi' ? 'पुणे कॉरिडोर' : 'Pune Corridor'}</span>
        </button>
      </div>

      {/* Google Maps Floating "Start Navigation" Button */}
      {!isNavigating && activeRoute.coordinates.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button
            onClick={handleStartNavigation}
            className="btn-civic"
            style={{
              backgroundColor: activeRoute.isRecommendedNightRoute === false ? '#dc2626' : '#059669',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: activeRoute.isRecommendedNightRoute === false 
                ? '0 8px 30px rgba(220, 38, 38, 0.55), 0 4px 12px rgba(0,0,0,0.4)'
                : '0 8px 30px rgba(5, 150, 105, 0.55), 0 4px 12px rgba(0,0,0,0.4)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Navigation size={18} style={{ transform: 'rotate(45deg)' }} />
            <span>{t.startNavigation}</span>
            <span
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              {activeRoute.durationMinutes} {t.minutes}
            </span>
          </button>
        </div>
      )}

      {/* When in Navigation mode, render NavigationCockpitHud */}
      {isNavigating && (
        <NavigationCockpitHud
          route={activeRoute}
          activeManeuverIndex={activeManeuverIndex}
          onSelectManeuver={(idx) => {
            setActiveManeuverIndex(idx);
            zoomToManeuver(idx);
          }}
          onExitNavigation={() => {
            setIsNavigating(false);
            onToggleLiveNavigation?.(false);
            handleRecenter();
          }}
          isSimulating={isSimulating || false}
          onToggleSimulation={onToggleSimulation || (() => {})}
          onRecenterCloseUp={() => zoomToManeuver(activeManeuverIndex)}
          travelProfile={travelProfile || 'pedestrian'}
        />
      )}

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapCockpit;
