import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, SafeHaven, DynamicEvent, TelemetryState, UserRole, CitizenReport } from '../../types/routing';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';
import { PUNE_DARK_SPOTS } from '../../data/civicAdminData';
import { PuneLocation } from '../../services/geocodingService';
import { Layers, ChevronDown } from 'lucide-react';

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
  onLockSafeHaven?: (haven: SafeHaven) => void;
  activeLockedHavenId?: string | null;
  onOpenRefugesModal?: () => void;
}

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
  onLockSafeHaven,
  activeLockedHavenId,
  onOpenRefugesModal
}) => {
  const [mapStyle, setMapStyle] = useState<'night' | 'streets' | 'satellite'>(theme === 'light' ? 'streets' : 'night');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isHavensVisible, setIsHavensVisible] = useState(true);
  const [havenCategoryFilter, setHavenCategoryFilter] = useState<'all' | 'police' | 'pharmacy_247' | 'hospital' | 'commercial_refuge' | 'transit_hub'>('all');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const havensLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const eventsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const commuterMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered between Tathawade and Kothrud
    const map = L.map(mapContainerRef.current, {
      center: [18.5600, 73.7850],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initialize layer groups
    routesLayerGroupRef.current = L.layerGroup().addTo(map);
    havensLayerGroupRef.current = L.layerGroup().addTo(map);
    eventsLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Automatically adapt map style when theme changes
  useEffect(() => {
    if (mapStyle !== 'satellite') {
      setMapStyle(theme === 'light' ? 'streets' : 'night');
    }
  }, [theme]);

  // Update Tile Layer dynamically based on user-selected style (100% Zero-Watermark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newLayer: L.TileLayer;
    if (mapStyle === 'night') {
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'night-mode-tile',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Night Vision Radar',
        maxZoom: 19
      });
    } else if (mapStyle === 'satellite') {
      newLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; High-Resolution Satellite',
        maxZoom: 19
      });
    } else {
      newLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Clean Daylight',
        maxZoom: 19
      });
    }

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

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

  // Render Safe Havens with polished UI badges & Ask for Angela markers
  useEffect(() => {
    const layerGroup = havensLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();
    if (!isHavensVisible) return;

    const filteredHavens = PUNE_SAFE_HAVENS.filter(h => 
      havenCategoryFilter === 'all' || h.type === havenCategoryFilter
    );

    filteredHavens.forEach((haven: SafeHaven) => {
      let iconSymbol = '🛡️';
      let iconBg = theme === 'dark' ? '#0f172a' : '#ffffff';
      let borderColor = '#3b82f6';
      let ringGlow = '';

      const isLocked = activeLockedHavenId === haven.id;
      if (isLocked) {
        borderColor = '#10b981';
        ringGlow = '0 0 0 4px rgba(16, 185, 129, 0.4), 0 4px 14px rgba(16, 185, 129, 0.6)';
      }

      if (haven.type === 'police') {
        borderColor = isLocked ? '#10b981' : '#3b82f6';
        iconSymbol = '🛡️';
      } else if (haven.type === 'pharmacy_247') {
        borderColor = isLocked ? '#10b981' : '#10b981';
        iconSymbol = '💊';
      } else if (haven.type === 'hospital') {
        borderColor = isLocked ? '#10b981' : '#ef4444';
        iconSymbol = '🏥';
      } else if (haven.type === 'commercial_refuge') {
        borderColor = isLocked ? '#10b981' : '#f59e0b';
        iconSymbol = '⛽';
      } else {
        borderColor = isLocked ? '#10b981' : '#8b5cf6';
        iconSymbol = '🚌';
      }

      const iconHtml = `
        <div style="background:${iconBg}; border:2.5px solid ${borderColor}; border-radius:50%; width:${isLocked ? '32px' : '28px'}; height:${isLocked ? '32px' : '28px'}; display:flex; align-items:center; justify-content:center; font-size:${isLocked ? '15px' : '13px'}; box-shadow:${ringGlow || '0 3px 10px rgba(0,0,0,0.35)'}; transition:all 0.2s ease;">
          <span>${iconSymbol}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: isLocked ? 'custom-haven-pin-locked' : 'custom-haven-pin',
        html: iconHtml,
        iconSize: isLocked ? [32, 32] : [28, 28],
        iconAnchor: isLocked ? [16, 16] : [14, 14]
      });

      const marker = L.marker(haven.coordinates, { icon: customIcon });

      // Create rich DOM-based popup with interactive diversion trigger
      const popupDiv = document.createElement('div');
      popupDiv.style.cssText = "font-family:'Inter',sans-serif; min-width:215px; line-height:1.45; padding:2px;";
      const titleColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
      const addressColor = theme === 'dark' ? '#94a3b8' : '#475569';
      const detailColor = theme === 'dark' ? '#cbd5e1' : '#64748b';
      const timingColor = theme === 'dark' ? '#34d399' : '#059669';
      const callColor = theme === 'dark' ? '#60a5fa' : '#2563eb';

      popupDiv.innerHTML = `
        <div style="display:flex; align-items:center; gap:5px; margin-bottom:5px; flex-wrap:wrap;">
          <span style="font-size:9.5px; font-weight:700; padding:2px 5px; border-radius:4px; background:${borderColor}20; color:${borderColor};">
            ${haven.type.replace('_', ' ').toUpperCase()}
          </span>
          ${haven.askForAngelaTrained ? '<span style="font-size:9.5px; font-weight:700; padding:2px 5px; border-radius:4px; background:rgba(245,158,11,0.2); color:#f59e0b;">Ask for Angela</span>' : ''}
          ${isLocked ? '<span style="font-size:9.5px; font-weight:700; padding:2px 5px; border-radius:4px; background:rgba(16,185,129,0.25); color:#34d399;">LOCKED REFUGE</span>' : ''}
        </div>
        <div style="font-weight:700; font-size:13px; color:${titleColor}; margin-bottom:3px;">${haven.name}</div>
        <div style="font-size:11px; color:${addressColor}; margin-bottom:4px;">${haven.address}</div>
        <div style="font-size:11px; color:${timingColor}; font-weight:600; margin-bottom:5px;">⏱️ ${haven.timing}</div>
        <div style="font-size:10.5px; color:${detailColor}; margin-bottom:8px; display:flex; flex-direction:column; gap:2.5px;">
          ${haven.hasPhoneCharger ? '<span>🔌 Free Phone Charging Available</span>' : ''}
          ${haven.safeWaitingArea ? '<span>🪑 Guarded Waiting Area</span>' : ''}
          ${haven.securityStaffOnDuty ? '<span>👮 Security Staff on Duty</span>' : ''}
        </div>
        ${haven.contact ? `<div style="font-size:11px; margin-bottom:8px;"><a href="tel:${haven.contact.split('/')[0].trim()}" style="color:${callColor}; text-decoration:none; font-weight:600;">📞 Call: ${haven.contact}</a></div>` : ''}
      `;

      if (onLockSafeHaven) {
        const divertBtn = document.createElement('button');
        divertBtn.style.cssText = `
          width: 100%;
          padding: 6px 10px;
          border-radius: 6px;
          border: none;
          background-color: ${isLocked ? '#059669' : '#2563eb'};
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        `;
        divertBtn.innerHTML = isLocked ? '✓ Currently Locked Refuge' : '🛡️ Divert Safe Route Here';
        divertBtn.onclick = () => {
          onLockSafeHaven(haven);
          marker.closePopup();
        };
        popupDiv.appendChild(divertBtn);
      }

      marker.bindPopup(popupDiv);
      layerGroup.addLayer(marker);
    });
  }, [theme, isHavensVisible, havenCategoryFilter, activeLockedHavenId, onLockSafeHaven]);

  // Render Routes and Custom Origin/Destination Markers (Enterprise Multi-Layer Navigation Architecture)
  useEffect(() => {
    const routesGroup = routesLayerGroupRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const map = mapInstanceRef.current;
    if (!routesGroup || !markersGroup || !map) return;

    routesGroup.clearLayers();
    markersGroup.clearLayers();

    // 1. Draw Inactive Alternative Routes with subtle casing and refined dashed styling
    alternativeRoutes.forEach((alt) => {
      // 1.1 Contrast Under-Casing
      const altCasing = L.polyline(alt.coordinates, {
        color: theme === 'dark' ? '#0f172a' : '#ffffff',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(altCasing);

      // 1.2 Muted Core Line
      const altPolyline = L.polyline(alt.coordinates, {
        color: theme === 'dark' ? '#475569' : '#94a3b8',
        weight: 3.5,
        dashArray: '5, 8',
        opacity: 0.75,
        lineCap: 'round',
        lineJoin: 'round'
      });
      altPolyline.bindTooltip(`
        <div style="font-family:'Inter',sans-serif; font-size:12px;">
          <strong>${alt.name}</strong><br/>
          <span style="font-size:11px; opacity:0.8;">${alt.durationMinutes}m · Safety ${alt.safetyScore}/100</span>
        </div>
      `, { sticky: true });
      routesGroup.addLayer(altPolyline);
    });

    // 2. Active Route: Multi-Layered Architecture
    if (activeRoute.coordinates.length > 1) {
      // Layer 2.1: Soft Ambient Glow (creates refined luminous depth)
      const isHighSafety = activeRoute.safetyScore >= 70;
      const glowColor = isHighSafety ? (theme === 'dark' ? '#10b981' : '#059669') : (theme === 'dark' ? '#f59e0b' : '#d97706');
      
      const glowPolyline = L.polyline(activeRoute.coordinates, {
        color: glowColor,
        weight: 14,
        opacity: theme === 'dark' ? 0.22 : 0.15,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(glowPolyline);

      // Layer 2.2: Continuous Precision Casing Line (eliminates raw segment gaps and provides razor-sharp boundary)
      const casingColor = theme === 'dark' ? '#020617' : '#ffffff';
      const casingPolyline = L.polyline(activeRoute.coordinates, {
        color: casingColor,
        weight: 8,
        opacity: 0.96,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(casingPolyline);
    }

    // Layer 2.3: Segmented Precision Core Heat-Lines
    activeRoute.segments.forEach((seg) => {
      const score = seg.factors.compositeScore;
      let color = theme === 'dark' ? '#10b981' : '#059669'; // safe emerald
      let isDashed = false;

      if (score < 45) {
        color = theme === 'dark' ? '#ef4444' : '#dc2626'; // danger crimson
        isDashed = true;
      } else if (score < 72) {
        color = theme === 'dark' ? '#f59e0b' : '#d97706'; // amber
      }

      const isSegmentSelected = selectedEdgeId === seg.edgeId;

      if (isSegmentSelected) {
        // Selected highlight aura
        const selGlow = L.polyline(seg.coordinates, {
          color: '#f59e0b',
          weight: 14,
          opacity: 0.6,
          lineCap: 'round',
          lineJoin: 'round'
        });
        routesGroup.addLayer(selGlow);
      }

      const polyline = L.polyline(seg.coordinates, {
        color,
        weight: isSegmentSelected ? 6 : 4.5,
        opacity: 1.0,
        dashArray: isDashed ? '8, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
        className: isSegmentSelected ? 'route-selected' : 'route-core-active'
      });

      polyline.on('click', () => {
        onSelectSegment(seg.edgeId);
      });

      polyline.bindTooltip(`
        <div style="font-family:'Inter',sans-serif; min-width:150px; line-height:1.4;">
          <strong style="font-size:12px; color:${color};">${seg.name}</strong><br/>
          <span style="font-size:11px;">Safety Score: <strong>${score}/100</strong></span><br/>
          <span style="font-size:11px; opacity:0.85;">Lighting: ${Math.round(seg.factors.lighting * 100)}% (${seg.illuminationSource})</span>
        </div>
      `, { sticky: true });

      routesGroup.addLayer(polyline);
    });

    // 2.4 Admin Role: Highlight Municipal Dark Spots in neon crimson with warning tags
    if (userRole === 'admin') {
      PUNE_DARK_SPOTS.forEach((spot) => {
        const darkPolyline = L.polyline(spot.coordinates, {
          color: theme === 'dark' ? '#ef4444' : '#dc2626',
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

    // 2.5 Guardian Role: Draw transparent 50m safe corridor geofence buffer around active path
    if (userRole === 'guardian' && activeRoute.coordinates.length > 0) {
      const bufferPolyline = L.polyline(activeRoute.coordinates, {
        color: '#10b981',
        weight: 26,
        opacity: 0.15,
        lineCap: 'round',
        lineJoin: 'round'
      });
      bufferPolyline.bindTooltip('50m Safe Geofence Corridor Buffer (Deviation Threshold)', { sticky: true });
      routesGroup.addLayer(bufferPolyline);
    }

    // 3. Modern Radar Origin Marker (A)
    const originIcon = L.divIcon({
      className: 'pro-marker-origin',
      html: `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(16,185,129,0.25); animation:proPulse 2.2s infinite;"></div>
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

    // 4. Modern Destination Beacon Marker (B)
    const destIcon = L.divIcon({
      className: 'pro-marker-dest',
      html: `
        <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:34px; height:34px; border-radius:50%; background:rgba(245,158,11,0.25); animation:proPulse 2.2s infinite;"></div>
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

    // Fit map bounds to active route or markers
    if (activeRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds([origin.coordinates, destination.coordinates, ...activeRoute.coordinates]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [userRole, origin, destination, activeRoute, alternativeRoutes, selectedEdgeId, onSelectSegment, theme]);

  // Render Dynamic Event Markers
  useEffect(() => {
    const layerGroup = eventsLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    activeEvents.forEach((ev) => {
      if (!ev.active) return;

      const eventIcon = L.divIcon({
        className: 'event-marker',
        html: `<div style="background:#ef4444; border:2px solid #fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:16px; animation:pulse-ring 1.2s infinite;">⚠️</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(ev.coordinates, { icon: eventIcon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; color:#111; font-size:12px;">
          <strong style="color:#ef4444; font-size:13px;">${ev.title}</strong><br/>
          <span>${ev.description}</span><br/>
          <span style="color:#b91c1c; font-weight:600;">Status: Active Hazard Injection</span>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // Render Citizen Community Reports
    citizenReports.forEach((rep) => {
      const repIcon = L.divIcon({
        className: 'citizen-report-marker',
        html: `<div style="background:#f59e0b; border:2px solid #fff; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; color:#000; font-size:13px; box-shadow:0 0 8px #f59e0b;">📢</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker(rep.coordinates, { icon: repIcon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; color:#111; font-size:12px;">
          <strong style="color:#b45309; font-size:13px;">[Citizen Audit] ${rep.title}</strong><br/>
          <span>${rep.description}</span><br/>
          <span style="color:#78350f; font-weight:600;">Urgency: ${rep.urgency.toUpperCase()} · Verified Community Post</span>
        </div>
      `);
      layerGroup.addLayer(marker);
    });
  }, [activeEvents, citizenReports]);

  // Render Live Commuter Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!commuterMarkerRef.current) {
      const commuterIcon = L.divIcon({
        className: 'commuter-marker',
        html: `
          <div style="position:relative; width:28px; height:28px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:28px; height:28px; border-radius:50%; background:rgba(245,158,11,0.35); animation:proPulse 1.8s infinite;"></div>
            <div style="position:relative; width:16px; height:16px; border-radius:50%; background:#f59e0b; border:2.5px solid #ffffff; box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>
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
      {/* Floating Zero-Watermark Tile Style Dropdown */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="btn-civic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'var(--surface-elevated)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              cursor: 'pointer'
            }}
            title="Switch Map Tile Cartography"
          >
            <Layers size={13} color="var(--accent-amber)" />
            <span>{mapStyle === 'night' ? '🌙 Night Radar' : mapStyle === 'satellite' ? '🛰️ Satellite' : '🏙️ Streets'}</span>
            <ChevronDown size={12} style={{ transform: isLayerMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
          </button>

          {isLayerMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              left: '0',
              width: '190px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              padding: '4px',
              zIndex: 2000,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '2px'
              }}>
                Map Style
              </div>
              {[
                { id: 'night', label: '🌙 Night Vision Radar', desc: 'Nocturnal contrast' },
                { id: 'streets', label: '🏙️ Daylight Streets', desc: 'Clean OpenStreetMap' },
                { id: 'satellite', label: '🛰️ Satellite Imagery', desc: 'High-res Esri World' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setMapStyle(opt.id as any);
                    setIsLayerMenuOpen(false);
                  }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: mapStyle === opt.id ? 700 : 500,
                    color: mapStyle === opt.id ? 'var(--accent-amber)' : 'var(--text-primary)',
                    backgroundColor: mapStyle === opt.id ? 'var(--surface-hover)' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={e => {
                    if (mapStyle !== opt.id) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={e => {
                    if (mapStyle !== opt.id) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{opt.label}</span>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{opt.desc}</span>
                </div>
              ))}

              <div style={{
                padding: '6px 8px 4px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Safe Havens</span>
                <input
                  type="checkbox"
                  checked={isHavensVisible}
                  onChange={(e) => setIsHavensVisible(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-safety, #10b981)' }}
                />
              </div>

              {isHavensVisible && (
                <div style={{ padding: '2px 4px 4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {[
                    { id: 'all', label: 'All 20 Havens' },
                    { id: 'police', label: 'Pink Chowkis & Police' },
                    { id: 'pharmacy_247', label: '24/7 Pharmacies' },
                    { id: 'hospital', label: 'Emergency Hospitals' },
                    { id: 'commercial_refuge', label: 'Commercial Refuges' },
                    { id: 'transit_hub', label: 'Transit Depots & Metro' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setHavenCategoryFilter(cat.id as any)}
                      style={{
                        padding: '3px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '9.5px',
                        fontWeight: havenCategoryFilter === cat.id ? 700 : 500,
                        backgroundColor: havenCategoryFilter === cat.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: havenCategoryFilter === cat.id ? '#60a5fa' : 'var(--text-secondary, #94a3b8)',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}

              {onOpenRefugesModal && (
                <button
                  onClick={() => {
                    setIsLayerMenuOpen(false);
                    onOpenRefugesModal();
                  }}
                  style={{
                    width: '100%',
                    padding: '5px 8px',
                    marginTop: '4px',
                    borderRadius: '6px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#93c5fd',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  🏢 Haven Directory
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
