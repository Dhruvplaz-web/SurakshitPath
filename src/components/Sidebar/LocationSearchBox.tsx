import React, { useState, useEffect, useRef } from 'react';
import { PuneLocation, searchPuneLocations, getUserCurrentLocation, parseCoordinates, reverseGeocode } from '../../services/geocodingService';
import { TravelProfile, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { LocationFallbackModal } from '../Common/LocationFallbackModal';
import { MapPin, ArrowUpDown, Crosshair, Search, Building2, GraduationCap, Bus, Car, Bike, Footprints, X, Navigation, Loader2, Clock, Home, Briefcase, ShieldCheck } from 'lucide-react';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';

interface Props {
  origin: PuneLocation;
  destination: PuneLocation | null;
  onSelectOrigin: (loc: PuneLocation) => void;
  onSelectDestination: (loc: PuneLocation | null) => void;
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
  // Recent Searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState<Array<{ id: string; name: string; subtitle: string; coordinates: [number, number]; category?: PuneLocation['category']; timestamp: number }>>(() => {
    try {
      const raw = localStorage.getItem('surakshit_recent_searches');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Saved Home and Work places
  const [savedHome, setSavedHome] = useState<PuneLocation | null>(() => {
    try {
      const raw = localStorage.getItem('surakshit_saved_home');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const [savedWork, setSavedWork] = useState<PuneLocation | null>(() => {
    try {
      const raw = localStorage.getItem('surakshit_saved_work');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const saveToRecent = (loc: PuneLocation) => {
    try {
      const item = {
        id: loc.id,
        name: loc.name,
        subtitle: loc.subtitle,
        coordinates: loc.coordinates,
        category: loc.category,
        timestamp: Date.now()
      };
      const filtered = recentSearches.filter(r => r.name !== loc.name && r.id !== loc.id);
      const updated = [item, ...filtered].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem('surakshit_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const removeRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r.id !== id);
    setRecentSearches(updated);
    try {
      localStorage.setItem('surakshit_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectNearestHaven = (type: 'police' | 'hospital') => {
    const userCoords = origin.coordinates;
    let closestHaven = PUNE_SAFE_HAVENS[0];
    let minD = Infinity;

    PUNE_SAFE_HAVENS.forEach(haven => {
      if (type === 'police' && haven.type !== 'police') return;
      if (type === 'hospital' && haven.type !== 'hospital') return;
      const dLat = (haven.coordinates[0] - userCoords[0]) * 111139;
      const dLng = (haven.coordinates[1] - userCoords[1]) * 105000;
      const d = dLat * dLat + dLng * dLng;
      if (d < minD) {
        minD = d;
        closestHaven = haven;
      }
    });

    const havenLoc: PuneLocation = {
      id: closestHaven.id,
      name: closestHaven.name,
      subtitle: `${closestHaven.address} (${closestHaven.timing})`,
      coordinates: closestHaven.coordinates,
      category: 'landmark'
    };
    onSelectDestination(havenLoc);
    saveToRecent(havenLoc);
    setActiveField(null);
  };


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
      saveToRecent(loc);
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
            aria-label={destination ? `Destination: ${destination.name}` : 'Set safe destination'}
            className={`gmaps-input-card ${activeField === 'destination' ? 'focused' : ''}`}
            style={{
              backgroundColor: destination ? undefined : 'rgba(245, 158, 11, 0.05)',
              borderStyle: destination ? 'solid' : 'dashed'
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: destination ? 'var(--accent-amber)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>
                {currentLanguage === 'mr' ? 'गंतव्य' : currentLanguage === 'hi' ? 'गंतव्य' : 'Destination'}
              </div>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: destination ? 700 : 500, 
                color: destination ? 'var(--text-primary)' : 'var(--text-muted)', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {destination ? destination.name : (currentLanguage === 'mr' ? 'सुरक्षित गंतव्य निवडा (उदा. घर, कॉलेज)...' : currentLanguage === 'hi' ? 'सुरक्षित गंतव्य चुनें (उदा. घर, कॉलेज)...' : 'Where to safely? (Search destination)...')}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {destination && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDestination(null);
                  }}
                  className="btn-civic"
                  style={{
                    padding: '4px 6px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Clear Destination (Return to Radar View)"
                >
                  <X size={14} />
                </button>
              )}

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

          {/* If Search Query is Empty: Show 1-Tap Saved Places & Recent Searches */}
          {!searchQuery.trim() ? (
            <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Saved Places (Home & Work) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (savedHome) {
                      handleSelectLocation(savedHome);
                    } else if (destination) {
                      setSavedHome(destination);
                      localStorage.setItem('surakshit_saved_home', JSON.stringify(destination));
                    } else {
                      setSearchQuery('Home');
                    }
                  }}
                  className="btn-civic"
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <Home size={15} color="#3b82f6" />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6' }}>Home</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {savedHome ? savedHome.name : 'Tap to set'}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (savedWork) {
                      handleSelectLocation(savedWork);
                    } else if (destination) {
                      setSavedWork(destination);
                      localStorage.setItem('surakshit_saved_work', JSON.stringify(destination));
                    } else {
                      setSearchQuery('Work');
                    }
                  }}
                  className="btn-civic"
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <Briefcase size={15} color="#a855f7" />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7' }}>Work / College</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {savedWork ? savedWork.name : 'Tap to set'}
                    </div>
                  </div>
                </button>
              </div>

              {/* 1-Tap Quick Safe Havens */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleSelectNearestHaven('police')}
                  className="btn-civic"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--safe-emerald)',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Nearest Police Chowki</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectNearestHaven('hospital')}
                  className="btn-civic"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <span>🏥</span>
                  <span>Nearest 24/7 Hospital</span>
                </button>
              </div>

              {/* Recent Searches Section */}
              {recentSearches.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSearches([]);
                        try { localStorage.removeItem('surakshit_recent_searches'); } catch {}
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '10px', cursor: 'pointer', padding: 0 }}
                    >
                      Clear
                    </button>
                  </div>

                  {recentSearches.map(item => (
                    <div
                      key={item.id + '_' + item.timestamp}
                      onClick={() => handleSelectLocation({
                        id: item.id,
                        name: item.name,
                        subtitle: item.subtitle,
                        coordinates: item.coordinates,
                        category: item.category || 'landmark'
                      })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginBottom: '2px',
                        backgroundColor: 'var(--surface-card)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--surface-card)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <Clock size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => removeRecent(item.id, e)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        title="Remove from history"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
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
          )}
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
