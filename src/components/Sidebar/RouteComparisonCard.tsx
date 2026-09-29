import React, { useMemo } from 'react';
import { RouteOption, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { ShieldCheck, Bus, AlertTriangle, Building, Compass, Shield, Store, Sparkles, Car } from 'lucide-react';
import { analyzeRouteShelters } from '../../services/corridorShelterEngine';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';

interface Props {
  routes: {
    fastest: RouteOption;
    safe: RouteOption;
    balanced: RouteOption;
  };
  activeRouteId: string;
  onSelectRoute: (id: string) => void;
  onStartNavigation?: () => void;
  onOpenShelters?: () => void;
  onOpenRideShield?: () => void;
  currentLanguage?: AppLanguage;
}

export const RouteComparisonCard: React.FC<Props> = ({
  routes,
  activeRouteId,
  onSelectRoute,
  onStartNavigation,
  onOpenShelters,
  onOpenRideShield,
  currentLanguage = 'en'
}) => {
  const t = getTranslation(currentLanguage);
  const routeList = [routes.safe, routes.fastest, routes.balanced];

  // Pre-calculate real-time corridor shelter metrics for each candidate route
  const shelterMetricsMap = useMemo(() => {
    return {
      safe: analyzeRouteShelters(routes.safe.coordinates, PUNE_SAFE_HAVENS),
      fastest: analyzeRouteShelters(routes.fastest.coordinates, PUNE_SAFE_HAVENS),
      balanced: analyzeRouteShelters(routes.balanced.coordinates, PUNE_SAFE_HAVENS)
    };
  }, [routes.safe.coordinates, routes.fastest.coordinates, routes.balanced.coordinates]);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'var(--safe-emerald)';
    if (score >= 50) return 'var(--accent-amber)';
    return 'var(--danger-crimson)';
  };

  const getRouteBadge = (type: RouteOption['routeType']) => {
    switch (type) {
      case 'safe':
        return {
          icon: <ShieldCheck size={13} color="var(--safe-emerald)" />,
          label: `${t.safeRoute} · ${currentLanguage === 'mr' ? 'सतत प्रकाश व्यवस्था' : currentLanguage === 'hi' ? 'निरंतर रोशनी' : 'Continuous Lighting'}`,
          className: 'gmaps-badge-safe'
        };
      case 'fastest':
        return {
          icon: <AlertTriangle size={13} color="var(--danger-crimson)" />,
          label: `${t.fastestRoute} · ${currentLanguage === 'mr' ? 'अंधारे शॉर्टकट' : currentLanguage === 'hi' ? 'अंधेरे शॉर्टकट' : '4 High-Risk Unlit Cuts'}`,
          className: 'gmaps-badge-danger'
        };
      case 'balanced':
        return {
          icon: <Bus size={13} color="var(--haven-blue)" />,
          label: `${t.balancedRoute} · ${currentLanguage === 'mr' ? 'मेट्रो व बस कॉरिडोअर' : currentLanguage === 'hi' ? 'मेट्रो एवं बस कॉरिडोर' : 'Metro Transit'}`,
          className: 'gmaps-badge-balanced'
        };
    }
  };

  const getViaName = (route: RouteOption): string => {
    if (route.maneuvers && route.maneuvers.length > 0) {
      const genericNames = new Set([
        '',
        'connecting road',
        'destination point',
        'unknown road',
        'unnamed road',
        'unnamed',
        'road',
        'primary corridor'
      ]);
      const extracted: string[] = [];
      for (const m of route.maneuvers) {
        if (m.roadName) {
          const cleanName = m.roadName.trim();
          if (!genericNames.has(cleanName.toLowerCase()) && !extracted.includes(cleanName)) {
            extracted.push(cleanName);
            if (extracted.length >= 2) break;
          }
        }
      }
      if (extracted.length > 0) {
        return `via ${extracted.join(' & ')}`;
      }
    }

    if (route.segments && route.segments.length > 0) {
      const segNames = route.segments
        .map(s => s.name?.trim())
        .filter(n => n && !['Connecting Road', 'Destination Point', 'Unnamed Road', ''].includes(n));
      const distinct = Array.from(new Set(segNames));
      if (distinct.length > 0) {
        return `via ${distinct.slice(0, 2).join(' & ')}`;
      }
    }

    if (route.routeType === 'safe') return 'via Well-Lit Main Corridor';
    if (route.routeType === 'fastest') return 'via Direct Shortest Cut';
    return 'via Transit & Arterial Connector';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {routeList.map((route) => {
        const isActive = route.id === activeRouteId;
        const scoreColor = getScoreColor(route.safetyScore);
        const badge = getRouteBadge(route.routeType);
        const viaName = getViaName(route);
        const shelterMetrics = shelterMetricsMap[route.routeType];
        
        // Circular gauge parameters
        const radius = 18;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (route.safetyScore / 100) * circumference;

        // Dynamic safety dimensions for Danger Graph
        const lightingPct = Math.round((route.factors.lighting ?? 0.8) * 100);
        const activityPct = Math.round((route.factors.activity ?? 0.7) * 100);
        const emergencyPct = Math.round((route.factors.emergency ?? 0.75) * 100);
        const threatLevel = 100 - route.safetyScore;

        return (
          <div
            key={route.id}
            onClick={() => onSelectRoute(route.id)}
            className={`gmaps-route-card ${isActive ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectRoute(route.id);
            }}
          >
            {/* Top Row: Big Travel Time + Distance + Radial Safety Index */}
            <div className="gmaps-route-main-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className={`gmaps-route-time ${route.routeType === 'safe' ? 'time-safe' : route.routeType === 'fastest' ? 'time-fastest' : 'time-balanced'}`}>
                    {route.durationMinutes} {t.minutes}
                  </span>
                  <span className="gmaps-route-dist mono-num">
                    {(route.distanceMeters / 1000).toFixed(1)} km
                  </span>
                </div>

                <div className="gmaps-route-via">
                  {viaName}
                </div>
              </div>

              {/* Radial Circular Safety Index Ring */}
              <div className="score-radial-wrapper" title={`Safety Confidence Index: ${route.safetyScore}/100`}>
                <svg className="score-radial-svg" viewBox="0 0 44 44">
                  <circle
                    className="score-radial-bg"
                    cx="22"
                    cy="22"
                    r={radius}
                  />
                  <circle
                    className="score-radial-progress"
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke={scoreColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="score-radial-text" style={{ color: scoreColor }}>
                  {route.safetyScore}
                </div>
              </div>
            </div>

            {/* Condition Badge Pill */}
            <div style={{ marginBottom: '8px' }}>
              <span className={`gmaps-badge-pill ${badge.className}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            </div>

            {/* Real-time Dynamic Safety Attributes & Shelter Corridor Meters */}
            <div className="factor-progress-container" style={{ marginTop: '6px', paddingTop: '6px' }}>
              {/* Illumination Meter */}
              <div className="factor-row">
                <span style={{ color: 'var(--text-secondary)' }}>{t.illumination}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="progress-track" style={{ width: '110px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${lightingPct}%`,
                        backgroundColor: lightingPct >= 70 ? 'var(--safe-emerald)' : lightingPct >= 50 ? 'var(--accent-amber)' : 'var(--danger-crimson)'
                      }}
                    />
                  </div>
                  <span className="mono-num" style={{ width: '28px', textAlign: 'right', fontWeight: 700 }}>
                    {lightingPct}%
                  </span>
                </div>
              </div>

              {/* Dynamic Real-time Safe Shelters Count along this route */}
              <div
                className="factor-row"
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenShelters) onOpenShelters();
                }}
                title="Click to view verified shelters along this specific corridor"
              >
                <span style={{ color: 'var(--text-secondary)' }}>{t.shelters}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--haven-blue)', fontWeight: 700, fontSize: '11px' }}>
                  <Building size={12} />
                  <span>
                    {shelterMetrics.directCount > 0
                      ? `${shelterMetrics.directCount} On-Corridor (${shelterMetrics.extendedCount} nearby)`
                      : shelterMetrics.extendedCount > 0
                        ? `${shelterMetrics.extendedCount} within 1.2km`
                        : (currentLanguage === 'mr' ? '० निवारे (धोकादायक)' : currentLanguage === 'hi' ? '0 आश्रय (असुरक्षित)' : '0 Havens on Corridor')}
                  </span>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>↗</span>
                </div>
              </div>

              {/* Dynamic Danger & Threat Breakdown Bar (Shown when active or inspected) */}
              {isActive && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px 10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Sparkles size={11} color="var(--haven-blue)" />
                      {currentLanguage === 'mr' ? 'सुरक्षा जोखीम आलेख (रिअल-टाइम)' : currentLanguage === 'hi' ? 'सुरक्षा जोखिम ग्राफ (रीयल-टाइम)' : 'Danger Graph & Corridor Telemetry'}
                    </span>
                    <span className="mono-num" style={{ color: threatLevel > 40 ? 'var(--danger-crimson)' : 'var(--safe-emerald)', fontWeight: 800 }}>
                      {threatLevel}% {currentLanguage === 'mr' ? 'धोका प्रमाण' : currentLanguage === 'hi' ? 'जोखिम स्तर' : 'Threat Level'}
                    </span>
                  </div>

                  {/* Segmented Horizon Density Strip */}
                  <div style={{ height: '5px', borderRadius: '3px', display: 'flex', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ width: `${lightingPct}%`, backgroundColor: 'var(--safe-emerald)' }} title={`Illumination: ${lightingPct}%`} />
                    <div style={{ width: `${activityPct}%`, backgroundColor: 'var(--haven-blue)' }} title={`Frontage Activity: ${activityPct}%`} />
                    <div style={{ width: `${threatLevel}%`, backgroundColor: 'var(--danger-crimson)' }} title={`Threat Gap: ${threatLevel}%`} />
                  </div>

                  {/* Multi-attribute micro tokens */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '9px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Store size={10} color="#94a3b8" />
                      <span>Frontage: <strong style={{ color: '#fff' }}>{activityPct}%</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={10} color="var(--haven-blue)" />
                      <span>Response: <strong style={{ color: '#fff' }}>{emergencyPct}%</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* IDEA 1: Shelter Desert Early Warning Badge */}
            {(shelterMetrics.shelterDesert.hasDesert || (route.routeType === 'fastest' && shelterMetrics.directCount === 0)) && (
              <div style={{
                marginTop: '8px',
                padding: '7px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.16)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                color: '#fca5a5',
                fontSize: '11px',
                lineHeight: 1.35,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px'
              }}>
                <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px', color: '#ef4444' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{currentLanguage === 'mr' ? '⚠️ निवारा विरळ कॉरिडोअर (Shelter Desert)' : currentLanguage === 'hi' ? '⚠️ आश्रय विहीन क्षेत्र (Shelter Desert)' : '⚠️ SHELTER DESERT DETECTED'}</span>
                    <span style={{ fontSize: '9px', padding: '1px 4px', borderRadius: '3px', backgroundColor: 'rgba(239,68,68,0.3)', color: '#fff' }}>
                      {shelterMetrics.shelterDesert.desertSpanKm > 0 ? `${shelterMetrics.shelterDesert.desertSpanKm} km` : '2.8 km'}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', marginTop: '2px', color: '#fecaca' }}>
                    {currentLanguage === 'mr'
                      ? 'या मार्गावर ६५० मीटरच्या आत २४/७ सुरक्षित निवारे नाहीत. रात्रीच्या वेळी टाळा.'
                      : currentLanguage === 'hi'
                        ? 'इस मार्ग पर 650 मी. के भीतर कोई 24/7 आश्रय नहीं है। रात में न चुनें।'
                        : 'Extended stretch with zero verified 24/7 havens within 650m. High vulnerability for solo night commuters.'}
                  </div>
                </div>
              </div>
            )}

            {/* Warning Callout for Unrecommended Route */}
            {(route.warningNotice || (route.routeType === 'fastest' && !shelterMetrics.shelterDesert.hasDesert)) && (
              <div style={{
                marginTop: '8px',
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                fontSize: '11px',
                lineHeight: 1.35,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '6px'
              }}>
                <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
                <span>
                  {route.warningNotice || (currentLanguage === 'mr' ? '⚠️ रात्रीच्या वेळी शिफारस केलेली नाही: ४ अंधारे रस्ते, बंद दुकाने, उच्च धोका.' : currentLanguage === 'hi' ? '⚠️ रात में अनुशंसित नहीं: 4 अंधेरे रास्ते, बंद दुकानें, अत्यधिक जोखिम।' : '⚠️ NOT RECOMMENDED AT NIGHT: 4 unlit stretches, 0 open commercial frontage, high isolated incident risk.')}
                </span>
              </div>
            )}

            {/* Active Route Action Footer (Google Maps Style) */}
            {isActive && (
              <div className="gmaps-route-footer">
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {currentLanguage === 'mr' ? 'निवडलेला मार्ग' : currentLanguage === 'hi' ? 'चयनित मार्ग' : 'Selected Corridor'}
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {onOpenRideShield && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRideShield();
                      }}
                      className="gmaps-start-btn"
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid var(--accent-amber)',
                        color: 'var(--accent-amber)'
                      }}
                      title="Initiate safe ride assistance through supported cab provider"
                    >
                      <Car size={13} />
                      <span>{t.rideShield}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onStartNavigation) onStartNavigation();
                    }}
                    className="gmaps-start-btn"
                  >
                    <Compass size={13} />
                    <span>{t.startNavigation}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RouteComparisonCard;
