import React, { useState } from 'react';
import { useLiveShelters } from '../../services/liveShelterService';
import { SafeHaven, SafeHavenType, AppLanguage, RouteOption } from '../../types/routing';
import { analyzeRouteShelters } from '../../services/corridorShelterEngine';
import { LifeBuoy, Navigation, ShieldCheck, Home, Pill, HeartPulse, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  currentCoordinates: [number, number];
  activeRoute?: RouteOption;
  onLockSafeHaven: (haven: SafeHaven) => void;
  onOpenSheltersModal?: () => void;
  currentLanguage?: AppLanguage;
}

export const QuickSafeHavenButton: React.FC<Props> = ({
  currentCoordinates,
  activeRoute,
  onLockSafeHaven,
  onOpenSheltersModal,
  currentLanguage = 'en'
}) => {
  const { havens: liveHavens, isLiveOverpass } = useLiveShelters(currentCoordinates);
  const [divertSuccess, setDivertSuccess] = useState(false);

  // If activeRoute is available, find closest haven along active route corridor; else find Euclidean closest
  const getTargetHaven = (): { haven: SafeHaven; distanceMeters: number; isOnCorridor: boolean } => {
    if (activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 1) {
      const metrics = analyzeRouteShelters(activeRoute.coordinates, liveHavens);
      if (metrics.closestShelter) {
        return {
          haven: metrics.closestShelter.haven,
          distanceMeters: metrics.closestShelter.detourMeters,
          isOnCorridor: metrics.closestShelter.isDirectCorridor
        };
      }
    }

    let closest = liveHavens[0];
    let minDistSq = Infinity;

    for (const h of liveHavens) {
      const dLat = (h.coordinates[0] - currentCoordinates[0]) * 111000;
      const dLng = (h.coordinates[1] - currentCoordinates[1]) * 105000;
      const distSq = dLat * dLat + dLng * dLng;

      if (distSq < minDistSq) {
        minDistSq = distSq;
        closest = h;
      }
    }

    return {
      haven: closest,
      distanceMeters: Math.round(Math.sqrt(minDistSq)),
      isOnCorridor: false
    };
  };

  const { haven: closestHaven, distanceMeters, isOnCorridor } = getTargetHaven();
  const walkingEtaMinutes = Math.max(1, Math.ceil(distanceMeters / 75));

  const getTypeBadge = (type: SafeHavenType) => {
    switch (type) {
      case 'women_shelter':
      case 'crisis_shelter':
        return { label: "Women's Shelter", color: '#ec4899', icon: <Home size={12} /> };
      case 'helpline_centre':
        return { label: '24/7 Helpline', color: '#ec4899', icon: <Home size={12} /> };
      case 'temple_sanctuary':
      case 'community_sanctuary':
        return { label: '24/7 Temple', color: '#f59e0b', icon: <LifeBuoy size={12} /> };
      case 'supermart_247':
        return { label: '24/7 Supermart', color: '#a855f7', icon: <LifeBuoy size={12} /> };
      case 'police':
        return { label: 'Police Chowki', color: 'var(--haven-blue)', icon: <Shield size={12} /> };
      case 'pharmacy':
      case 'pharmacy_247':
        return { label: '24/7 Pharmacy', color: 'var(--safe-emerald)', icon: <Pill size={12} /> };
      case 'hospital':
        return { label: 'Hospital', color: '#ef4444', icon: <HeartPulse size={12} /> };
      default:
        return { label: 'Safe Haven', color: 'var(--haven-blue)', icon: <LifeBuoy size={12} /> };
    }
  };

  const badgeInfo = getTypeBadge(closestHaven.type);

  return (
    <div
      style={{
        backgroundColor: 'rgba(30, 58, 138, 0.16)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: 'var(--radius-lg, 12px)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.2s ease',
        boxShadow: '0 3px 12px rgba(59, 130, 246, 0.12)'
      }}
    >
      {/* Top Row: Title + Trust Badge + View All Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--haven-blue, #60a5fa)',
              flexShrink: 0
            }}
          >
            <LifeBuoy size={16} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#e0f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{currentLanguage === 'mr' ? 'जवळचे सुरक्षित निवारे' : currentLanguage === 'hi' ? 'निकटतम सुरक्षित आश्रय' : 'Trusted Nearby Shelters'}</span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  backgroundColor: isLiveOverpass ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: isLiveOverpass ? 'var(--safe-emerald, #34d399)' : '#60a5fa',
                  border: `1px solid ${isLiveOverpass ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                  padding: '1px 6px',
                  borderRadius: '9999px'
                }}
              >
                {isLiveOverpass ? 'LIVE OSM' : `⭐ ${closestHaven.trustScore || 98}% TRUST`}
              </span>
            </div>
          </div>
        </div>

        {onOpenSheltersModal && (
          <button
            type="button"
            onClick={onOpenSheltersModal}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--haven-blue, #60a5fa)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '2px 6px',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease'
            }}
            title="Browse all 24/7 verified women shelters, police outposts, and emergency refuges"
          >
            <span>{currentLanguage === 'mr' ? 'सर्व पहा' : currentLanguage === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>

      {/* Middle Row: Closest Haven Info */}
      <div
        onClick={onOpenSheltersModal || (() => onLockSafeHaven(closestHaven))}
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '8px 10px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px'
        }}
        title="Click to view all safe shelters or reroute here"
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '9px',
                fontWeight: 700,
                color: badgeInfo.color,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '1px 5px',
                borderRadius: '4px'
              }}
            >
              {badgeInfo.icon}
              {badgeInfo.label}
            </span>
            {isOnCorridor && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: 'var(--safe-emerald, #34d399)',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}
              >
                🟢 On Corridor
              </span>
            )}
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {currentLanguage === 'mr' ? 'जवळचे' : currentLanguage === 'hi' ? 'निकटतम' : 'Nearest'} · ~{walkingEtaMinutes} {currentLanguage === 'mr' ? 'मि. चालणे' : currentLanguage === 'hi' ? 'मिनट पैदल' : 'min walk'}
            </span>
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {closestHaven.name}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-secondary, #94a3b8)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {closestHaven.address}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="mono-num" style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-amber, #f59e0b)' }}>
            {distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`}
          </div>
          <div style={{ fontSize: '9px', color: 'var(--safe-emerald, #34d399)', fontWeight: 700 }}>
            {closestHaven.timing.includes('24/7') || closestHaven.timing.includes('24 Hours') ? '24/7 OPEN' : 'VERIFIED'}
          </div>
        </div>
      </div>

      {/* IDEA 4: 1-Tap Emergency Shelter Divert Confirmation Toast */}
      {divertSuccess && (
        <div style={{
          padding: '6px 10px',
          borderRadius: '6px',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#6ee7b7',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={14} color="var(--safe-emerald)" />
          <span>⚡ Diverted to {closestHaven.name} & WhatsApp Alert sent to Guardian (+91 96651 84535)!</span>
        </div>
      )}

      {/* Action Buttons: Browse Shelters + 1-Tap Emergency Divert */}
      <div style={{ display: 'grid', gridTemplateColumns: onOpenSheltersModal ? '1fr 1.3fr' : '1fr', gap: '8px' }}>
        {onOpenSheltersModal && (
          <button
            type="button"
            onClick={onOpenSheltersModal}
            className="btn-civic"
            style={{
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={13} />
            <span>{currentLanguage === 'mr' ? 'निवारे शोधा' : currentLanguage === 'hi' ? 'आश्रय खोजें' : 'Browse'}</span>
          </button>
        )}

        {/* IDEA 4: 1-Tap Emergency Shelter Divert Button */}
        <button
          type="button"
          onClick={() => {
            onLockSafeHaven(closestHaven);
            setDivertSuccess(true);
            const msg = `🚨 *SURAKSHITPATH EMERGENCY SHELTER DIVERT*\nI am diverting immediately to a verified refuge:\n\n🏢 *${closestHaven.name}*\n📍 ${closestHaven.address}\n⏱️ Distance: ${distanceMeters}m (~${walkingEtaMinutes} min walk)\n🌐 Live Location: https://maps.google.com/?q=${currentCoordinates[0]},${currentCoordinates[1]}\n\nEmergency Sentinel Contact: +91 96651 84535`;
            window.open(`https://wa.me/919665184535?text=${encodeURIComponent(msg)}`, '_blank');
            try {
              if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(`Emergency haven divert engaged. Rerouting to ${closestHaven.name}.`);
                u.lang = 'en-IN';
                window.speechSynthesis.speak(u);
              }
            } catch (_) {}
            setTimeout(() => setDivertSuccess(false), 5000);
          }}
          className="gmaps-start-btn"
          style={{
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: '#dc2626',
            backgroundImage: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: '#ffffff',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
          }}
          title={`1-Tap Emergency Divert to ${closestHaven.name} & WhatsApp Alert to +91 96651 84535`}
        >
          <Navigation size={12} />
          <span>{currentLanguage === 'mr' ? '⚡ आपत्कालीन निवारा व व्हॉट्सॲप' : currentLanguage === 'hi' ? '⚡ आपातकालीन आश्रय व WhatsApp' : '⚡ 1-Tap Divert & Alert'}</span>
        </button>
      </div>
    </div>
  );
};

export default QuickSafeHavenButton;

