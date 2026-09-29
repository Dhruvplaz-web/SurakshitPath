import React, { useState, useEffect } from 'react';
import { RouteOption, RouteManeuver, TravelProfile } from '../../types/routing';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Crosshair,
  AlertTriangle,
  ShieldCheck,
  Footprints,
  Bike,
  Car,
  Bus,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  RotateCcw
} from 'lucide-react';

interface Props {
  route: RouteOption;
  activeManeuverIndex: number;
  onSelectManeuver: (index: number) => void;
  onExitNavigation: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onRecenterCloseUp: () => void;
  travelProfile: TravelProfile;
}

export const NavigationCockpitHud: React.FC<Props> = ({
  route,
  activeManeuverIndex,
  onSelectManeuver,
  onExitNavigation,
  isSimulating,
  onToggleSimulation,
  onRecenterCloseUp,
  travelProfile
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const maneuvers = route.maneuvers && route.maneuvers.length > 0
    ? route.maneuvers
    : [
        {
          id: 'default_m',
          type: 'depart' as const,
          instruction: 'Proceed along safe lit arterial boulevard',
          roadName: route.name,
          coordinates: route.coordinates[0] || [18.6186, 73.7483],
          distanceMeters: route.distanceMeters,
          durationSeconds: route.durationMinutes * 60,
          safetyScore: route.safetyScore,
          lightingLux: 40,
          isRecommended: route.isRecommendedNightRoute !== false
        }
      ];

  const currentManeuver: RouteManeuver = maneuvers[Math.min(activeManeuverIndex, maneuvers.length - 1)];
  const nextManeuver: RouteManeuver | undefined = maneuvers[activeManeuverIndex + 1];

  // Voice guidance announcement on turn change
  useEffect(() => {
    if (!isVoiceEnabled || !window.speechSynthesis || !currentManeuver) return;

    window.speechSynthesis.cancel();
    const textToSpeak = `In ${currentManeuver.distanceMeters} meters, ${currentManeuver.instruction}. ${
      currentManeuver.warningAlert ? 'Caution: ' + currentManeuver.warningAlert : 'Safe lit corridor.'
    }`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [activeManeuverIndex, isVoiceEnabled, currentManeuver]);

  const getManeuverIcon = (maneuver: RouteManeuver) => {
    const mod = maneuver.modifier || 'straight';
    const type = maneuver.type;

    if (type === 'roundabout') return <RotateCcw size={28} className="text-white" />;
    if (mod.includes('left')) return <CornerUpLeft size={28} className="text-white" />;
    if (mod.includes('right')) return <CornerUpRight size={28} className="text-white" />;
    return <ArrowUp size={28} className="text-white" />;
  };

  const getProfileIcon = () => {
    switch (travelProfile) {
      case 'pedestrian': return <Footprints size={15} />;
      case 'two_wheeler': return <Bike size={15} />;
      case 'four_wheeler': return <Car size={15} />;
      case 'transit': return <Bus size={15} />;
    }
  };

  // Calculate ETA time string
  const arrivalTime = new Date(Date.now() + route.durationMinutes * 60000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="gmaps-nav-overlay" style={{ pointerEvents: 'none' }}>
      {/* Top Navigation HUD Card (Google Maps Style Green Header) */}
      <div
        className="gmaps-nav-top-banner"
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '94%',
          maxWidth: '560px',
          backgroundColor: '#064e3b',
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65)',
          border: '1.5px solid #10b981',
          color: '#ffffff',
          overflow: 'hidden',
          zIndex: 3000,
          animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Left: Big Maneuver Icon */}
          <div
            style={{
              backgroundColor: currentManeuver.isRecommended ? '#059669' : '#dc2626',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '78px',
              borderRight: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            {getManeuverIcon(currentManeuver)}
            <span style={{ fontSize: '11px', fontWeight: 800, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentManeuver.distanceMeters > 0 ? `${currentManeuver.distanceMeters}m` : 'Arrived'}
            </span>
          </div>

          {/* Center: Turn Instructions & Road Name */}
          <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              {currentManeuver.instruction}
            </div>
            <div style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{currentManeuver.roadName}</span>
              {currentManeuver.lightingLux && (
                <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  💡 {currentManeuver.lightingLux} lx
                </span>
              )}
            </div>

            {/* Next step teaser */}
            {nextManeuver && (
              <div style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '4px', opacity: 0.85 }}>
                Then: {nextManeuver.instruction}
              </div>
            )}
          </div>

          {/* Right: Close Navigation Button */}
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
            <button
              onClick={onExitNavigation}
              className="btn-civic"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Exit Turn-by-Turn Navigation"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Night Safety Status Banner */}
        <div
          style={{
            backgroundColor: currentManeuver.isRecommended ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.85)',
            padding: '5px 14px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {currentManeuver.isRecommended ? (
              <>
                <ShieldCheck size={14} color="#34d399" />
                <span style={{ color: '#d1fae5' }}>Verified Lit Corridor • High Natural Surveillance</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} color="#fef08a" />
                <span style={{ color: '#ffffff' }}>{currentManeuver.warningAlert || '⚠️ Not Recommended at Night (Unlit Cut)'}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ opacity: 0.8 }}>Turn {activeManeuverIndex + 1} of {maneuvers.length}</span>
          </div>
        </div>
      </div>

      {/* Floating Action Controls on Right Side (Recenter & Voice) */}
      <div
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          right: '16px',
          top: '140px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 3000
        }}
      >
        <button
          onClick={onRecenterCloseUp}
          className="btn-civic"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #10b981',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            cursor: 'pointer'
          }}
          title="Recenter Close-Up Navigation View (Zoom 17.5)"
        >
          <Crosshair size={20} />
        </button>

        <button
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className="btn-civic"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: isVoiceEnabled ? '#10b981' : 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #10b981',
            color: isVoiceEnabled ? '#ffffff' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            cursor: 'pointer'
          }}
          title={isVoiceEnabled ? "Mute Voice Guidance" : "Enable Voice Guidance"}
        >
          {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Bottom Navigation Control Bar (Google Maps Style) */}
      <div
        className="gmaps-nav-bottom-bar"
        style={{
          pointerEvents: 'auto',
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '94%',
          maxWidth: '560px',
          backgroundColor: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.75)',
          padding: '14px 20px',
          zIndex: 3000,
          color: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* ETA & Distance */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em' }}>
                {route.durationMinutes} min
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>
                {(route.distanceMeters / 1000).toFixed(1)} km
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span>ETA {arrivalTime}</span>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize' }}>
                {getProfileIcon()} {travelProfile.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Step through & Simulation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onSelectManeuver(Math.max(0, activeManeuverIndex - 1))}
              disabled={activeManeuverIndex === 0}
              className="btn-civic"
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: activeManeuverIndex === 0 ? '#475569' : '#ffffff',
                border: 'none',
                cursor: activeManeuverIndex === 0 ? 'not-allowed' : 'pointer'
              }}
              title="Previous Turn"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={onToggleSimulation}
              className="btn-civic"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: isSimulating ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
              title={isSimulating ? "Pause Navigation Simulation" : "Start Live Turn Simulation"}
            >
              {isSimulating ? <Pause size={14} /> : <Play size={14} />}
              <span>{isSimulating ? 'Pause' : 'Drive'}</span>
            </button>

            <button
              onClick={() => onSelectManeuver(Math.min(maneuvers.length - 1, activeManeuverIndex + 1))}
              disabled={activeManeuverIndex >= maneuvers.length - 1}
              className="btn-civic"
              style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: activeManeuverIndex >= maneuvers.length - 1 ? '#475569' : '#ffffff',
                border: 'none',
                cursor: activeManeuverIndex >= maneuvers.length - 1 ? 'not-allowed' : 'pointer'
              }}
              title="Next Turn"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar through turns */}
        <div style={{ marginTop: '10px', height: '4px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: currentManeuver.isRecommended ? '#10b981' : '#ef4444',
              width: `${((activeManeuverIndex + 1) / maneuvers.length) * 100}%`,
              transition: 'width 0.25s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
};
