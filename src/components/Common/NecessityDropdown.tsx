import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Fuel, 
  Wrench, 
  Truck, 
  Zap, 
  PhoneCall, 
  Navigation, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  MapPin, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  PUNE_EMERGENCY_NECESSITIES, 
  EmergencyNecessity, 
  EmergencyServiceCategory, 
  calculateDistanceKm, 
  estimateDriveMinutes 
} from '../../data/necessitiesData';
import { PuneLocation } from '../../services/geocodingService';
import { AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';

interface Props {
  userCoordinates?: [number, number]; // [lat, lng] from live telemetry / GPS
  onSelectDestination?: (location: PuneLocation) => void;
  currentLanguage?: AppLanguage;
}

export const NecessityDropdown: React.FC<Props> = ({
  userCoordinates = [18.5204, 73.8567],
  onSelectDestination,
  currentLanguage = 'en'
}) => {
  const t = getTranslation(currentLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EmergencyServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoords, setCurrentCoords] = useState<[number, number]>(userCoordinates);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState<string>('Live Real-Time GPS Active');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync coords from props if changed
  useEffect(() => {
    if (userCoordinates && userCoordinates.length === 2) {
      setCurrentCoords(userCoordinates);
    }
  }, [userCoordinates]);

  // Handle outside click & escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Request fresh high-accuracy browser GPS location
  const refreshLiveLocation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!navigator.geolocation) {
      setGpsStatusText('Geolocation not supported by browser');
      return;
    }

    setIsLocating(true);
    setGpsStatusText('Acquiring live GPS satellite fix...');

    const applyCoords = (lat: number, lng: number, acc: number, isFallback = false) => {
      const liveCoords: [number, number] = [lat, lng];
      setCurrentCoords(liveCoords);
      setIsLocating(false);
      setGpsStatusText(`GPS Locked: ${lat.toFixed(4)}, ${lng.toFixed(4)} (±${Math.round(acc)}m)${isFallback ? ' · Network' : ''}`);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyCoords(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy || 10, false);
      },
      (err1) => {
        console.warn('Necessity GPS high-accuracy timed out, trying network positioning...', err1.message);
        navigator.geolocation.getCurrentPosition(
          (pos2) => {
            applyCoords(pos2.coords.latitude, pos2.coords.longitude, pos2.coords.accuracy || 25, true);
          },
          (err2) => {
            console.warn('Necessity GPS error:', err2);
            setIsLocating(false);
            setGpsStatusText('Using corridor coordinates');
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 }
        );
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Compute sorted items with real-time distance from user's current coordinates
  const sortedNecessities = useMemo(() => {
    const [userLat, userLng] = currentCoords;

    return PUNE_EMERGENCY_NECESSITIES
      .map(item => {
        const distKm = calculateDistanceKm(userLat, userLng, item.coordinates[0], item.coordinates[1]);
        const etaMins = estimateDriveMinutes(distKm);
        return {
          ...item,
          distanceKm: distKm,
          etaMinutes: etaMins
        };
      })
      .filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [currentCoords, selectedCategory, searchQuery]);

  const nearestCount = sortedNecessities.length;

  const handleNavigateHere = (item: EmergencyNecessity & { distanceKm: number; etaMinutes: number }) => {
    setIsOpen(false);
    if (onSelectDestination) {
      const targetLoc: PuneLocation = {
        id: `necessity_${item.id}`,
        name: item.name,
        subtitle: `${item.address} · 📞 ${item.contactNumber}`,
        coordinates: item.coordinates,
        category: 'landmark'
      };
      onSelectDestination(targetLoc);
    }
  };

  const getCategoryIcon = (category: EmergencyServiceCategory) => {
    switch (category) {
      case 'petrol_pump':
        return <Fuel size={14} color="#f59e0b" />;
      case 'garage':
        return <Wrench size={14} color="#60a5fa" />;
      case 'towing_puncture':
        return <Truck size={14} color="#ef4444" />;
      case 'ev_charging':
        return <Zap size={14} color="#10b981" />;
      default:
        return <Fuel size={14} color="#f59e0b" />;
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Top Bar Trigger Button: "Necessity" */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) refreshLiveLocation();
        }}
        className="btn-civic"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '11px',
          fontWeight: 800,
          backgroundColor: isOpen ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.12)',
          color: 'var(--accent-amber, #f59e0b)',
          border: '1px solid var(--accent-amber, #f59e0b)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 12px rgba(245, 158, 11, 0.35)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        title="Nearby 24x7 Petrol Pumps, Emergency Garages, Towing & Vehicle Breakdown Assistance"
        aria-expanded={isOpen}
        aria-label="Nearby Emergency Roadside Necessities"
      >
        <Wrench size={13} color="var(--accent-amber, #f59e0b)" />
        <span>{t.necessity}</span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: '9999px',
            backgroundColor: 'var(--accent-amber, #f59e0b)',
            color: '#12141a'
          }}
        >
          {nearestCount}
        </span>
        <ChevronDown 
          size={12} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            color: 'var(--accent-amber, #f59e0b)'
          }} 
        />
      </button>

      {/* Expanded Glassmorphic Dropdown Flyout */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '420px',
            maxWidth: '92vw',
            maxHeight: '82vh',
            backgroundColor: 'var(--surface-glass-heavy, rgba(15, 23, 42, 0.96))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.15))',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(245, 158, 11, 0.25)',
            zIndex: 3500,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            color: 'var(--text-primary, #ffffff)'
          }}
        >
          {/* Header & Live Real-Time GPS Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-amber)'
                  }}
                >
                  <Fuel size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'var(--text-primary, #fff)' }}>
                    {t.necessity}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '10px', color: 'var(--safe-emerald, #34d399)', fontWeight: 600 }}>
                    <span 
                      style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: isLocating ? '#f59e0b' : '#10b981',
                        boxShadow: '0 0 8px #10b981',
                        display: 'inline-block',
                        animation: isLocating ? 'pulse 1s infinite' : 'none'
                      }} 
                    />
                    <span>{gpsStatusText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Refresh Button */}
            <button
              type="button"
              onClick={refreshLiveLocation}
              disabled={isLocating}
              className="btn-civic"
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: 'var(--text-secondary, #cbd5e1)',
                cursor: 'pointer'
              }}
              title="Refresh high-accuracy real-time GPS location"
            >
              <RefreshCw size={11} className={isLocating ? 'animate-spin' : ''} />
              <span>GPS</span>
            </button>
          </div>

          {/* Quick Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { key: 'all', label: currentLanguage === 'mr' ? 'सर्व' : currentLanguage === 'hi' ? 'सभी' : 'All', icon: <ShieldCheck size={12} /> },
              { key: 'petrol_pump', label: t.petrolPumps, icon: null },
              { key: 'garage', label: t.garages, icon: null },
              { key: 'towing_puncture', label: t.towingPuncture, icon: null },
              { key: 'ev_charging', label: t.evChargers, icon: null }
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key as any)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: selectedCategory === tab.key ? 800 : 600,
                  whiteSpace: 'nowrap',
                  border: selectedCategory === tab.key ? '1px solid var(--accent-amber)' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: selectedCategory === tab.key ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedCategory === tab.key ? 'var(--accent-amber)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={13} 
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search garage, puncture, diesel, Baner, Wakad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 30px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-primary, #fff)',
                fontSize: '11px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* List of Closest Services */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px', 
              overflowY: 'auto', 
              maxHeight: '48vh',
              paddingRight: '4px'
            }}
          >
            {sortedNecessities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '12px' }}>
                No roadside necessities found matching your filters.
              </div>
            ) : (
              sortedNecessities.map(item => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  {/* Top Card Line: Icon + Name + Distance Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {item.area} · <span style={{ color: 'var(--safe-emerald)' }}>{item.isOpen24x7 ? '24x7 OPEN' : 'Open'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Distance & ETA Pill */}
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        textAlign: 'right',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--safe-emerald)' }}>
                        {item.distanceKm < 1 ? `${Math.round(item.distanceKm * 1000)}m` : `${item.distanceKm.toFixed(1)} km`}
                      </div>
                      <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)' }}>
                        ~{item.etaMinutes} min drive
                      </div>
                    </div>
                  </div>

                  {/* Address & Landmark */}
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                    <MapPin size={11} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-amber)' }} />
                    <span>{item.address}</span>
                  </div>

                  {/* Service Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {item.services.map((svc, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {svc}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons: Quick Call & Set Destination / Safe Route */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    {/* Emergency Call Button */}
                    <a
                      href={`tel:${item.contactNumber}`}
                      className="btn-civic"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        color: 'var(--danger-crimson, #ef4444)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                      title={`Call ${item.contactNumber}`}
                    >
                      <PhoneCall size={12} />
                      <span>{t.callNow} {item.contactNumber.split('/')[0]}</span>
                    </a>

                    {/* Safe Navigation Button */}
                    <button
                      type="button"
                      onClick={() => handleNavigateHere(item)}
                      className="btn-civic"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--safe-emerald, #34d399)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      title="Plot safe lit route to this facility on map"
                    >
                      <Navigation size={12} />
                      <span>{t.navigateHere}</span>
                    </button>

                    {/* Google Maps External Link */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.coordinates[0]},${item.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-civic"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 8px',
                        fontSize: '11px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-muted)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        textDecoration: 'none'
                      }}
                      title="Open in Google Maps"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NecessityDropdown;
