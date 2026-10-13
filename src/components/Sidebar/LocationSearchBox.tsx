import React, { useState, useEffect, useRef } from 'react';
import { PuneLocation, searchPuneLocations, getUserCurrentLocation, parseCoordinates, reverseGeocode } from '../../services/geocodingService';
import { TravelProfile, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { LocationFallbackModal } from '../Common/LocationFallbackModal';
import { MapPin, ArrowUpDown, Crosshair, Search, Building2, GraduationCap, Bus, Car, Bike, Footprints, X, Navigation, Loader2 } from 'lucide-react';

interface Props {
  origin: PuneLocation;
  destination: PuneLocation;
  onSelectOrigin: (loc: PuneLocation) => void;
  onSelectDestination: (loc: PuneLocation) => void;
  onSwapLocations: () => void;
  onPickOnMap: (target: 'origin' | 'destination') => void;
  isPickingOnMap: 'origin' | 'destination' | null;
  travelProfile?: TravelProfile;
  onSelectTravelProfile?: (profile: TravelProfile) => void;
  currentLanguage?: AppLanguage;
}

export const LocationSearchBox: React.FC<Props> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  onPickOnMap,
  isPickingOnMap,
  travelProfile = 'pedestrian',
  onSelectTravelProfile,
  currentLanguage = 'en'
}) => {
  const t = getTranslation(currentLanguage);
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<PuneLocation[]>([]);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isFallbackModalOpen, setIsFallbackModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUseCurrentLocation = async () => {
    setIsLocatingGps(true);
    setGpsError(null);
    try {
      const loc = await getUserCurrentLocation();
      if (activeField === 'origin') {
        onSelectOrigin(loc);
      } else {
        onSelectDestination(loc);
      }
      setActiveField(null);
    } catch {
      // Option B: Seamlessly open interactive location picker modal instead of showing an error
      setIsFallbackModalOpen(true);
    } finally {
      setIsLocatingGps(false);
    }
  };

  const handleSelectLocation = async (loc: PuneLocation) => {
    if (activeField === 'origin') {
      onSelectOrigin(loc);
    } else {
      onSelectDestination(loc);
    }
    setActiveField(null);
    setSearchQuery('');

    // If it's a coordinate, reverse geocode to give it a readable street name
    if (loc.id.startsWith('coord_')) {
      try {
        const enriched = await reverseGeocode(loc.coordinates);
        enriched.id = loc.id;
        if (activeField === 'origin') {
          onSelectOrigin(enriched);
        } else {
          onSelectDestination(enriched);
        }
      } catch {
        // Keep coordinate format
      }
    }
  };

  // Search effect with 200ms debounce
  useEffect(() => {
    if (!activeField) return;
    let isCancelled = false;

    const timer = setTimeout(() => {
      searchPuneLocations(searchQuery).then(res => {
        if (!isCancelled) setResults(res);
      });
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, activeField]);

  // Handle outside click & escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getCategoryIcon = (category: PuneLocation['category']) => {
    switch (category) {
      case 'college': return <GraduationCap size={14} color="var(--accent-amber)" />;
      case 'transit': return <Bus size={14} color="var(--haven-blue)" />;
      case 'it_hub': return <Building2 size={14} color="var(--safe-emerald)" />;
      default: return <MapPin size={14} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="gmaps-directions-box">
      {/* Google Maps Travel Profile Mode Tabs */}
      <div className="gmaps-travel-modes">
        <button
          type="button"
          onClick={() => onSelectTravelProfile?.('pedestrian')}
          className={`gmaps-mode-tab ${travelProfile === 'pedestrian' ? 'active' : ''}`}
          title="Walking Profile"
        >
          <Footprints size={14} />
          <span>{t.walkProfile}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTravelProfile?.('two_wheeler')}
          className={`gmaps-mode-tab ${travelProfile === 'two_wheeler' ? 'active' : ''}`}
          title="Two-Wheeler / Scooter Profile"
        >
          <Bike size={14} />
          <span>{t.twoWheelerProfile}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTravelProfile?.('four_wheeler')}
          className={`gmaps-mode-tab ${travelProfile === 'four_wheeler' ? 'active' : ''}`}
          title="Four-Wheeler / Car Profile"
        >
          <Car size={14} />
          <span>{t.fourWheelerProfile}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTravelProfile?.('transit')}
          className={`gmaps-mode-tab ${travelProfile === 'transit' ? 'active' : ''}`}
          title="Transit Profile (PMPML & Metro)"
        >
          <Bus size={14} />
          <span>{t.transitProfile}</span>
        </button>
      </div>

      {/* Map Picking Active Callout */}
      {isPickingOnMap && (
        <div style={{
          backgroundColor: 'var(--accent-amber-subtle)',
          border: '1px solid var(--accent-amber)',
          borderRadius: 'var(--radius-md)',
          padding: '7px 12px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--accent-amber)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Crosshair size={13} className="animate-spin-slow" />
          <span>Click on Pune map to pin {isPickingOnMap.toUpperCase()} point</span>
        </div>
      )}

      {/* Main Google Maps 3-Column Input Box (Dots + Inputs + Swap) */}
      <div className="gmaps-inputs-container">
        {/* Left Column: Route Connector Line */}
        <div className="gmaps-dots-col">
          <div className="gmaps-origin-dot" title="Starting point" />
          <div className="gmaps-connector-line" />
          <div className="gmaps-dest-pin" title="Destination">
            <MapPin size={15} color="var(--danger-crimson)" />
          </div>
        </div>

        {/* Middle Column: Origin & Destination Inputs */}
        <div className="gmaps-fields-col">
          {/* Origin Input Card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveField('origin');
              setSearchQuery('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveField('origin');
                setSearchQuery('');
              }
            }}
            aria-label={`Change Origin location: currently ${origin.name}`}
            className={`gmaps-input-card ${activeField === 'origin' ? 'focused' : ''}`}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--safe-emerald)', letterSpacing: '0.04em' }}>
                {currentLanguage === 'mr' ? 'सुरुवात' : currentLanguage === 'hi' ? 'शुरुआत' : 'Origin'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {origin.name}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsLocatingGps(true);
                  setGpsError(null);
                  try {
                    const loc = await getUserCurrentLocation();
                    onSelectOrigin(loc);
                  } catch (err: any) {
                    setGpsError(err.message || 'Could not acquire GPS position');
                  } finally {
                    setIsLocatingGps(false);
                  }
                }}
                disabled={isLocatingGps}
                className="btn-civic"
                style={{
                  padding: '4px 6px',
                  backgroundColor: origin.id.startsWith('gps') ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: origin.id.startsWith('gps') ? 'var(--safe-emerald)' : 'var(--text-muted)',
                  border: 'none'
                }}
                title="Use Live GPS Location as Origin"
              >
                {isLocatingGps ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickOnMap('origin');
                }}
                className="btn-civic"
                style={{
                  padding: '4px 6px',
                  backgroundColor: isPickingOnMap === 'origin' ? 'var(--safe-emerald)' : 'transparent',
                  color: isPickingOnMap === 'origin' ? '#fff' : 'var(--text-muted)',
                  border: 'none'
                }}
                title={t.pickOnMap}
              >
                <Crosshair size={13} />
              </button>
            </div>
          </div>

          {/* Destination Input Card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setActiveField('destination');
              setSearchQuery('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveField('destination');
                setSearchQuery('');
              }
            }}
            aria-label={`Change Destination location: currently ${destination.name}`}
            className={`gmaps-input-card ${activeField === 'destination' ? 'focused' : ''}`}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-amber)', letterSpacing: '0.04em' }}>
                {currentLanguage === 'mr' ? 'गंतव्य' : currentLanguage === 'hi' ? 'गंतव्य' : 'Destination'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {destination.name}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickOnMap('destination');
                }}
                className="btn-civic"
                style={{
                  padding: '4px 6px',
                  backgroundColor: isPickingOnMap === 'destination' ? 'var(--accent-amber)' : 'transparent',
                  color: isPickingOnMap === 'destination' ? '#000' : 'var(--text-muted)',
                  border: 'none'
                }}
                title={t.pickOnMap}
              >
                <Crosshair size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps Vertical Reverse/Swap Button */}
        <button
          type="button"
          onClick={onSwapLocations}
          className="gmaps-swap-btn"
          title="Reverse / Swap starting point and destination"
        >
          <ArrowUpDown size={15} />
        </button>
      </div>

      {/* Autocomplete Dropdown Search Box */}
      {activeField && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--accent-amber)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
            zIndex: 3500,
            padding: '12px',
            animation: 'slideUp 0.15s ease-out'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: activeField === 'origin' ? 'var(--safe-emerald)' : 'var(--danger-crimson)', letterSpacing: '0.04em' }}>
              Select {activeField === 'origin' ? 'Origin (Starting Point)' : 'Destination'}
            </span>
            <button
              type="button"
              onClick={() => setActiveField(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
              title="Close search"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick GPS & Map Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocatingGps}
              className="btn-civic"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid var(--safe-emerald)',
                color: 'var(--safe-emerald)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '7px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              {isLocatingGps ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
              <span>{isLocatingGps ? 'Locating GPS...' : 'My Location (GPS)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = activeField;
                setActiveField(null);
                if (target) onPickOnMap(target);
              }}
              className="btn-civic"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid var(--accent-amber)',
                color: 'var(--accent-amber)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '7px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Crosshair size={13} />
              <span>Pin on Map</span>
            </button>
          </div>

          {gpsError && (
            <div style={{ fontSize: '10px', color: 'var(--danger-crimson)', marginBottom: '8px', padding: '4px 8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
              {gpsError}
            </div>
          )}

          {/* Coordinates Quick Selector */}
          {(() => {
            const parsedCoords = parseCoordinates(searchQuery);
            if (!parsedCoords) return null;
            return (
              <button
                type="button"
                onClick={() => {
                  const coordLoc: PuneLocation = {
                    id: `coord_${parsedCoords[0]}_${parsedCoords[1]}`,
                    name: `📍 Coordinates (${parsedCoords[0].toFixed(4)}, ${parsedCoords[1].toFixed(4)})`,
                    subtitle: `Latitude: ${parsedCoords[0]}, Longitude: ${parsedCoords[1]}`,
                    coordinates: parsedCoords,
                    category: 'landmark'
                  };
                  handleSelectLocation(coordLoc);
                }}
                className="btn-civic"
                style={{
                  width: '100%',
                  marginBottom: '10px',
                  padding: '9px 12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1.5px solid var(--haven-blue)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Navigation size={15} color="var(--haven-blue)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--haven-blue)' }}>
                    📍 Go to Coordinates: {parsedCoords[0]}, {parsedCoords[1]}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Press Enter or click to navigate to this exact point
                  </div>
                </div>
              </button>
            );
          })()}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', backgroundColor: 'var(--surface-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', marginBottom: '10px' }}>
            <Search size={14} color="var(--accent-amber)" />
            <input
              type="text"
              autoFocus
              placeholder={activeField === 'origin' ? "Search start place or enter coordinates (lat,lng)..." : "Search destination or enter coordinates (lat,lng)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const parsedCoords = parseCoordinates(searchQuery);
                  if (parsedCoords) {
                    const coordLoc: PuneLocation = {
                      id: `coord_${parsedCoords[0]}_${parsedCoords[1]}`,
                      name: `📍 Coordinates (${parsedCoords[0].toFixed(4)}, ${parsedCoords[1].toFixed(4)})`,
                      subtitle: `Latitude: ${parsedCoords[0]}, Longitude: ${parsedCoords[1]}`,
                      coordinates: parsedCoords,
                      category: 'landmark'
                    };
                    handleSelectLocation(coordLoc);
                  } else if (results.length > 0) {
                    handleSelectLocation(results[0]);
                  }
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {results.length > 0 ? (
              results.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className="btn-civic"
                  style={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    padding: '8px 10px',
                    fontSize: '11px',
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ marginTop: '2px', marginRight: '8px' }}>
                    {getCategoryIcon(loc.category)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.subtitle}</div>
                  </div>
                </button>
              ))
            ) : (
              <div style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
                No landmarks matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
      {/* Option B: Resilient Fallback Location Modal when GPS is unavailable */}
      <LocationFallbackModal
        isOpen={isFallbackModalOpen}
        onClose={() => setIsFallbackModalOpen(false)}
        targetField={activeField || 'origin'}
        onSelectLocation={(loc) => {
          if (activeField === 'destination') {
            onSelectDestination(loc);
          } else {
            onSelectOrigin(loc);
          }
          setActiveField(null);
        }}
        onPickOnMap={() => {
          onPickOnMap(activeField || 'origin');
          setActiveField(null);
        }}
        onRetryGps={handleUseCurrentLocation}
      />
    </div>
  );
};

export default LocationSearchBox;
