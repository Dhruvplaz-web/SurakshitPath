/**
 * SurakshitPath - Pune Nocturnal Weather & Night Visibility Floating HUD
 * 
 * Elegant Windows Fluent Acrylic floating weather chip designed for maps:
 * - Ultra-compact resting pill (Temperature, Sky, Visibility, Road Grip)
 * - Click-to-expand acrylic telemetry card (Humidity, Wind, Lunar Phase, Advisory)
 * - Auto-close on click-outside & ESC key
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CloudMoon,
  Droplets,
  Wind,
  Gauge,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
  X,
  CloudRain,
  CloudFog,
  Sun
} from 'lucide-react';

import { fetchLivePuneWeather, WeatherTelemetry } from '../../services/weatherService';

export type WeatherMode = 'clear' | 'rain' | 'fog';

export interface WeatherRiskProfile {
  mode: WeatherMode;
  lightingMultiplier: number;
  scorePenalty: number;
  description: string;
}

export const WEATHER_PROFILES: Record<WeatherMode, WeatherRiskProfile> = {
  clear: {
    mode: 'clear',
    lightingMultiplier: 1.0,
    scorePenalty: 0,
    description: 'Optimal visibility & starlight illumination.'
  },
  rain: {
    mode: 'rain',
    lightingMultiplier: 0.75,
    scorePenalty: 12,
    description: 'Monsoon Downpour: Wet asphalt puddle glare reduces illumination by 25%.'
  },
  fog: {
    mode: 'fog',
    lightingMultiplier: 0.65,
    scorePenalty: 18,
    description: 'Dense Winter Fog: Streetlamp penetration drops by 35%.'
  }
};

export interface NocturnalWeatherCardProps {
  compact?: boolean;
  activeWeatherMode?: WeatherMode;
  onWeatherModeChange?: (mode: WeatherMode, profile: WeatherRiskProfile) => void;
}

export const NocturnalWeatherCard: React.FC<NocturnalWeatherCardProps> = ({
  compact = false,
  activeWeatherMode = 'clear',
  onWeatherModeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentMode, setCurrentMode] = useState<WeatherMode>(activeWeatherMode);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live');
  const containerRef = useRef<HTMLDivElement>(null);

  const [weather, setWeather] = useState<WeatherTelemetry>({
    tempCelsius: 22,
    feelsLikeCelsius: 21,
    conditionText: 'Clear Sky · Optimal Visibility',
    visibilityKm: 8.5,
    roadGripPercent: 96,
    precipitationRiskPercent: 5,
    humidityPercent: 58,
    windSpeedKmh: 8,
    lunarPhase: 'Waxing Crescent (शुक्ल पक्ष)',
    lunarIlluminationPercent: 38,
    advisoryText: 'High ambient clarity along Baner, FC Road & Kothrud. No fog or waterlogging obstructions.',
    lastUpdated: 'Loading live data...',
    isLive: true
  });

  // Load real-time live Pune weather on mount
  useEffect(() => {
    let isMounted = true;
    fetchLivePuneWeather().then(data => {
      if (isMounted) {
        setWeather(data);
        setLastRefreshed(data.lastUpdated || 'Just now');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle ESC key and outside click to dismiss popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      const data = await fetchLivePuneWeather();
      setWeather(data);
      setLastRefreshed(data.lastUpdated || 'Just now');
      setCurrentMode('clear');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSetWeatherMode = (mode: WeatherMode) => {
    setCurrentMode(mode);
    const profile = WEATHER_PROFILES[mode];

    if (mode === 'rain') {
      setWeather(prev => ({
        ...prev,
        conditionText: 'Monsoon Downpour · Wet Asphalt',
        tempCelsius: 20,
        feelsLikeCelsius: 19,
        visibilityKm: 2.2,
        roadGripPercent: 62,
        precipitationRiskPercent: 88,
        advisoryText: 'Monsoon downpour: Illumination reduced by 25%. Road grip drops to 62%. Prioritize well-lit arterial corridors.',
        lastUpdated: 'Monsoon Active'
      }));
    } else if (mode === 'fog') {
      setWeather(prev => ({
        ...prev,
        conditionText: 'Dense Winter Fog · Low Visibility',
        tempCelsius: 17,
        feelsLikeCelsius: 16,
        visibilityKm: 1.2,
        roadGripPercent: 82,
        precipitationRiskPercent: 20,
        advisoryText: 'Dense fog along riverbanks and underpasses: Streetlight visibility degraded by 35%. Use balanced transit corridor.',
        lastUpdated: 'Fog Active'
      }));
    } else {
      setWeather(prev => ({
        ...prev,
        conditionText: 'Clear Sky · Optimal Visibility',
        tempCelsius: 22,
        feelsLikeCelsius: 21,
        visibilityKm: 8.5,
        roadGripPercent: 96,
        precipitationRiskPercent: 5,
        advisoryText: 'High ambient clarity along Baner, FC Road & Kothrud. No fog or waterlogging obstructions.',
        lastUpdated: 'Live Sensors Active'
      }));
    }

    onWeatherModeChange?.(mode, profile);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Resting Weather Button: Header Compact Cloud Button OR Map Pill */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-civic"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: isExpanded ? 'rgba(96, 165, 250, 0.16)' : 'rgba(255, 255, 255, 0.06)',
            border: isExpanded ? '1px solid var(--haven-blue, #60a5fa)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Pune Nocturnal Weather: 22°C Clear, 8.5km Visibility, 98% Road Grip"
          aria-expanded={isExpanded}
          aria-label="Pune Nocturnal Weather Telemetry"
        >
          <CloudMoon size={14} color="var(--haven-blue, #60a5fa)" />
          <span>{weather.tempCelsius}°C</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            outline: 'none'
          }}
          title="Click to view Pune Nocturnal Weather & Road Grip Details"
          aria-expanded={isExpanded}
          aria-label="Pune Nocturnal Weather Telemetry"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CloudMoon size={16} color="var(--haven-blue, #60a5fa)" />
            <span style={{ fontWeight: 800, fontSize: '13px', color: '#ffffff' }}>
              {weather.tempCelsius}°C
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
              Clear
            </span>
          </div>

          <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

          <span style={{ fontSize: '11px', color: 'var(--safe-emerald, #34d399)', fontWeight: 700 }}>
            {weather.visibilityKm}km Vis
          </span>

          <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

          <span style={{ fontSize: '11px', color: 'var(--accent-amber, #fbbf24)', fontWeight: 700 }}>
            {weather.roadGripPercent}% Grip
          </span>

          <ChevronDown
            size={13}
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          />
        </button>
      )}

      {/* Expanded Acrylic Flyout Telemetry Card */}
      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '320px',
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '14px',
            padding: '14px 16px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
            zIndex: 2000,
            animation: 'slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            color: '#ffffff'
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(96, 165, 250, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--haven-blue, #60a5fa)'
                }}
              >
                <CloudMoon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                  Pune Nocturnal Weather
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {lastRefreshed}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                style={{
                  padding: '4px 6px',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer'
                }}
                title="Refresh live sensors"
                aria-label="Refresh weather sensors"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                style={{
                  padding: '4px',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer'
                }}
                aria-label="Close weather flyout"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* IDEA 2: Weather & Monsoon Night Risk Simulation Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '3px',
            borderRadius: '8px',
            marginBottom: '12px',
            gap: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              type="button"
              onClick={() => handleSetWeatherMode('clear')}
              style={{
                flex: 1,
                padding: '5px 4px',
                fontSize: '10px',
                fontWeight: 800,
                borderRadius: '6px',
                border: currentMode === 'clear' ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid transparent',
                cursor: 'pointer',
                backgroundColor: currentMode === 'clear' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                color: currentMode === 'clear' ? '#93c5fd' : 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              title="Standard Clear Night: Normal illumination & dry road surface"
            >
              <Sun size={11} />
              <span>Clear Sky</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetWeatherMode('rain')}
              style={{
                flex: 1,
                padding: '5px 4px',
                fontSize: '10px',
                fontWeight: 800,
                borderRadius: '6px',
                border: currentMode === 'rain' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
                cursor: 'pointer',
                backgroundColor: currentMode === 'rain' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: currentMode === 'rain' ? '#6ee7b7' : 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              title="Monsoon Downpour: -25% street lighting, slick asphalt risk multiplier"
            >
              <CloudRain size={11} />
              <span>Monsoon</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetWeatherMode('fog')}
              style={{
                flex: 1,
                padding: '5px 4px',
                fontSize: '10px',
                fontWeight: 800,
                borderRadius: '6px',
                border: currentMode === 'fog' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
                cursor: 'pointer',
                backgroundColor: currentMode === 'fog' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                color: currentMode === 'fog' ? '#fcd34d' : 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
              title="Dense Winter Fog: -35% streetlight penetration, increased threat penalty"
            >
              <CloudFog size={11} />
              <span>Winter Fog</span>
            </button>
          </div>

          {/* Key Metric Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                NIGHT TEMP
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {weather.tempCelsius}°C
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Feels {weather.feelsLikeCelsius}°C
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                VISIBILITY
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--safe-emerald, #34d399)', marginTop: '2px' }}>
                {weather.visibilityKm} km
              </div>
              <div style={{ fontSize: '9px', color: 'var(--safe-emerald, #34d399)' }}>
                High Clarity
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>
                ROAD GRIP
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-amber, #fbbf24)', marginTop: '2px' }}>
                {weather.roadGripPercent}%
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.5)' }}>
                Dry Surface
              </div>
            </div>
          </div>

          {/* Meteorological Attributes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <Droplets size={13} color="var(--haven-blue, #60a5fa)" />
              <span>Humidity: <strong>{weather.humidityPercent}%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <Wind size={13} color="var(--safe-emerald, #34d399)" />
              <span>Wind: <strong>{weather.windSpeedKmh} km/h</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <Sparkles size={13} color="var(--accent-amber, #fbbf24)" />
              <span>Moonlight: <strong>{weather.lunarIlluminationPercent}%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <Gauge size={13} color="var(--safe-emerald, #34d399)" />
              <span>Precip: <strong>{weather.precipitationRiskPercent}% (Dry)</strong></span>
            </div>
          </div>

          {/* Safe Travel Advisory */}
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              padding: '8px 10px',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} color="var(--safe-emerald, #34d399)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Night Advisory:</strong> {weather.advisoryText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NocturnalWeatherCard;
