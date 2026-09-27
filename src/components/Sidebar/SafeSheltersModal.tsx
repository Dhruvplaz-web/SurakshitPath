import React, { useState, useEffect, useMemo } from 'react';
import { useLiveShelters } from '../../services/liveShelterService';
import { SafeHaven, SafeHavenType, RouteOption } from '../../types/routing';
import { getMinDistanceToRoute } from '../../services/corridorShelterEngine';
import {
  ShieldCheck,
  LifeBuoy,
  X,
  Phone,
  Navigation,
  Search,
  Building,
  HeartPulse,
  Pill,
  Shield,
  Home,
  MapPin,
  Sparkles
} from 'lucide-react';

export type FilterCategory =
  | 'on_route'
  | 'all'
  | 'hospital'
  | 'temple'
  | 'police'
  | 'helpline'
  | 'supermart'
  | 'pharmacy';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentCoordinates: [number, number];
  activeRoute?: RouteOption;
  onLockSafeHaven: (haven: SafeHaven) => void;
  onViewOnMap?: (coordinates: [number, number]) => void;
  initialCategory?: FilterCategory;
}

export const SafeSheltersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentCoordinates,
  activeRoute,
  onLockSafeHaven,
  onViewOnMap,
  initialCategory = 'all'
}) => {
  const defaultCategory = activeRoute ? 'on_route' : initialCategory;
  const [activeFilter, setActiveFilter] = useState<FilterCategory>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync activeFilter when initialCategory changes or modal opens
  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setActiveFilter(initialCategory);
    } else if (activeRoute) {
      setActiveFilter('on_route');
    }
  }, [initialCategory, isOpen, activeRoute]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const { havens: liveHavens, isLoading, isLiveOverpass } = useLiveShelters(currentCoordinates);

  // Compute live Euclidean/Geodesic distance for every safe haven from user position AND from route corridor
  const havensWithDistance = useMemo(() => {
    return liveHavens.map(haven => {
      const dLat = (haven.coordinates[0] - currentCoordinates[0]) * 111000;
      const dLng = (haven.coordinates[1] - currentCoordinates[1]) * 105000;
      const distanceMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));

      const routeDetourMeters = activeRoute && activeRoute.coordinates.length > 0
        ? getMinDistanceToRoute(haven.coordinates, activeRoute.coordinates)
        : undefined;

      const isOnRoute = routeDetourMeters !== undefined && routeDetourMeters <= 500;
      const isNearbyRoute = routeDetourMeters !== undefined && routeDetourMeters <= 1200;

      return {
        ...haven,
        distanceMeters,
        routeDetourMeters,
        isOnRoute,
        isNearbyRoute
      };
    }).sort((a, b) => {
      if (activeFilter === 'on_route' && a.routeDetourMeters !== undefined && b.routeDetourMeters !== undefined) {
        return a.routeDetourMeters - b.routeDetourMeters;
      }
      return a.distanceMeters - b.distanceMeters;
    });
  }, [liveHavens, currentCoordinates, activeRoute, activeFilter]);

  // Closest shelter for quick 1-click hero action
  const closestHaven = havensWithDistance[0];

  // Filtered havens based on active tab and search query
  const filteredHavens = useMemo(() => {
    return havensWithDistance.filter(haven => {
      // Category filter
      let matchesCategory = true;
      if (activeFilter === 'on_route') {
        matchesCategory = Boolean(haven.isNearbyRoute || haven.isOnRoute);
      } else if (activeFilter === 'hospital') {
        matchesCategory = haven.type === 'hospital';
      } else if (activeFilter === 'temple') {
        matchesCategory = haven.type === 'temple_sanctuary' || haven.type === 'community_sanctuary';
      } else if (activeFilter === 'police') {
        matchesCategory = haven.type === 'police';
      } else if (activeFilter === 'helpline') {
        matchesCategory = haven.type === 'helpline_centre' || haven.type === 'women_shelter' || haven.type === 'crisis_shelter';
      } else if (activeFilter === 'supermart') {
        matchesCategory = haven.type === 'supermart_247';
      } else if (activeFilter === 'pharmacy') {
        matchesCategory = haven.type === 'pharmacy' || (haven.type as string) === 'pharmacy_247';
      }

      // Search query filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        haven.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        haven.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (haven.verifiedBy && haven.verifiedBy.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [havensWithDistance, activeFilter, searchQuery]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SafeHavenType) => {
    switch (type) {
      case 'women_shelter':
      case 'crisis_shelter':
        return <Home size={16} color="#ec4899" />;
      case 'helpline_centre':
        return <Phone size={16} color="#ec4899" />;
      case 'police':
        return <Shield size={16} color="var(--haven-blue)" />;
      case 'pharmacy_247':
        return <Pill size={16} color="var(--safe-emerald)" />;
      case 'hospital':
        return <HeartPulse size={16} color="#ef4444" />;
      case 'temple_sanctuary':
      case 'community_sanctuary':
        return <Sparkles size={16} color="var(--accent-amber)" />;
      case 'supermart_247':
        return <Building size={16} color="#a855f7" />;
      case 'transit_hub':
        return <Building size={16} color="var(--haven-blue)" />;
      default:
        return <LifeBuoy size={16} color="var(--haven-blue)" />;
    }
  };

  const getTypeName = (type: SafeHavenType) => {
    switch (type) {
      case 'women_shelter':
        return "Women's Safe Shelter";
      case 'crisis_shelter':
        return 'Crisis Transit Refuge';
      case 'helpline_centre':
        return '24/7 Helpline Centre';
      case 'police':
        return '24/7 Police Chowki';
      case 'pharmacy_247':
        return '24/7 Guarded Pharmacy';
      case 'hospital':
        return 'Emergency Hospital';
      case 'temple_sanctuary':
        return '24/7 Temple / Sanctuary';
      case 'community_sanctuary':
        return 'Community Sanctuary';
      case 'supermart_247':
        return '24/7 Staffed Supermart';
      case 'transit_hub':
        return 'Guarded Transit Hub';
      default:
        return 'Safe Haven';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Verified Safe Shelters and Emergency Havens in Pune"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface-elevated, #161a22)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(30, 58, 138, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--haven-blue, #60a5fa)'
              }}
            >
              <LifeBuoy size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  Safest &amp; Trusted Nearby Shelters
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: isLiveOverpass ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: isLiveOverpass ? 'var(--safe-emerald, #34d399)' : '#60a5fa',
                    border: `1px solid ${isLiveOverpass ? 'var(--safe-emerald, #34d399)' : 'rgba(59, 130, 246, 0.5)'}`,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isLiveOverpass ? '#10b981' : '#3b82f6', display: 'inline-block' }} />
                  {isLiveOverpass ? 'LIVE OVERPASS & VERIFIED' : '24/7 VERIFIED'}
                  {isLoading && ' (SYNCING...)'}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                {liveHavens.length} real-time verified facilities &amp; crisis shelters available across Pune
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close Shelters Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Quick 1-Click Nearest Hero Lock */}
          {closestHaven && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--safe-emerald, #34d399)',
                    flexShrink: 0
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--safe-emerald, #34d399)', textTransform: 'uppercase' }}>
                      ⚡ Nearest Absolute Refuge ({closestHaven.distanceMeters}m)
                    </span>
                    <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>· ~{Math.ceil(closestHaven.distanceMeters / 80)} min walk</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                    {closestHaven.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                    {closestHaven.address}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLockSafeHaven(closestHaven);
                  onClose();
                }}
                className="btn-civic btn-primary-amber"
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
                }}
              >
                <Navigation size={13} />
                <span>Instant Route Lock</span>
              </button>
            </div>
          )}

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted, #94a3b8)'
              }}
            />
            <input
              type="text"
              placeholder="Search shelters by name, landmark, or ward (e.g. Sakhi, Wakad, Kothrud, Apollo)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.15))',
                borderRadius: '8px',
                padding: '10px 12px 10px 36px',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              ...(activeRoute ? [{
                id: 'on_route',
                label: `⭐ Along Active Route (${havensWithDistance.filter(h => h.isNearbyRoute).length})`
              }] : []),
              { id: 'all', label: `All Shelters (${havensWithDistance.length})` },
              { id: 'hospital', label: '🏥 Hospitals & ER' },
              { id: 'temple', label: '🛕 24/7 Temples & Gurudwaras' },
              { id: 'police', label: '🛡️ Police Stations' },
              { id: 'helpline', label: '📞 Helpline & Crisis Refuges' },
              { id: 'supermart', label: '🛒 24/7 Supermarts' },
              { id: 'pharmacy', label: '💊 24/7 Pharmacies' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id as FilterCategory)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  border: activeFilter === cat.id ? '1px solid var(--accent-amber, #fbbf24)' : '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                  backgroundColor: activeFilter === cat.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeFilter === cat.id ? 'var(--accent-amber, #fbbf24)' : 'var(--text-secondary, #cbd5e1)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Shelter Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredHavens.length === 0 ? (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted, #94a3b8)',
                  fontSize: '12px'
                }}
              >
                No verified safe shelters found matching your search. Try changing the category filter.
              </div>
            ) : (
              filteredHavens.map(haven => {
                const rawPhone = (haven.contact || '112').split('/')[0].replace(/[^0-9]/g, '');

                return (
                  <div
                    key={haven.id}
                    style={{
                      backgroundColor: 'var(--surface-card, rgba(255, 255, 255, 0.03))',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getTypeIcon(haven.type)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                              {haven.name}
                            </span>
                            {haven.trustScore && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                  color: 'var(--safe-emerald, #34d399)',
                                  padding: '1px 6px',
                                  borderRadius: '4px'
                                }}
                              >
                                ⭐ {haven.trustScore}% Trust
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                            {getTypeName(haven.type)} · {haven.address}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                        {haven.routeDetourMeters !== undefined && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: haven.isOnRoute ? 'rgba(16, 185, 129, 0.18)' : haven.isNearbyRoute ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                              color: haven.isOnRoute ? 'var(--safe-emerald, #34d399)' : haven.isNearbyRoute ? 'var(--accent-amber, #fbbf24)' : 'var(--text-muted, #94a3b8)',
                              border: `1px solid ${haven.isOnRoute ? 'var(--safe-emerald, #34d399)' : haven.isNearbyRoute ? 'var(--accent-amber, #fbbf24)' : 'rgba(255, 255, 255, 0.1)'}`,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {haven.isOnRoute ? `🟢 On Route (${haven.routeDetourMeters}m)` : haven.isNearbyRoute ? `🟡 +${Math.ceil(haven.routeDetourMeters / 75)}m Detour` : `⚪ Off Route`}
                          </span>
                        )}
                        <span
                          className="mono-num"
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: haven.distanceMeters < 1000 ? 'var(--safe-emerald, #34d399)' : 'var(--accent-amber, #fbbf24)',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))'
                          }}
                        >
                          {haven.distanceMeters < 1000 ? `${haven.distanceMeters}m from origin` : `${(haven.distanceMeters / 1000).toFixed(1)}km`}
                        </span>
                      </div>
                    </div>

                    {/* Verification and Facilities */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      {haven.verifiedBy && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--haven-blue, #60a5fa)' }}>
                          <ShieldCheck size={12} />
                          <span>{haven.verifiedBy}</span>
                        </div>
                      )}

                      {haven.facilities && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {haven.facilities.map((fac, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '9px',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                color: 'var(--text-secondary, #cbd5e1)'
                              }}
                            >
                              ✓ {fac}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timing & Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        marginTop: '2px'
                      }}
                    >
                      <div style={{ fontSize: '10px', color: 'var(--safe-emerald, #34d399)', fontWeight: 600 }}>
                        ● {haven.timing}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {haven.contact && (
                          <a
                            href={`tel:${rawPhone}`}
                            className="btn-civic"
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa',
                              borderColor: 'rgba(59, 130, 246, 0.4)'
                            }}
                            title={`Call ${haven.name} at ${haven.contact}`}
                          >
                            <Phone size={11} /> Call
                          </a>
                        )}

                        {onViewOnMap && (
                          <button
                            type="button"
                            onClick={() => {
                              onViewOnMap(haven.coordinates);
                              onClose();
                            }}
                            className="btn-civic"
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="View location on map"
                          >
                            <MapPin size={11} /> Map
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onLockSafeHaven(haven);
                            onClose();
                          }}
                          className="btn-civic btn-primary-amber"
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={`Calculate safest illuminated route to ${haven.name}`}
                        >
                          <Navigation size={11} /> Reroute Here
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeSheltersModal;
