import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLiveShelters } from '../../services/liveShelterService';
import { SafeHaven, SafeHavenType } from '../../types/routing';
import {
  LifeBuoy,
  ChevronDown,
  HeartPulse,
  Shield,
  PhoneCall,
  ShoppingBag,
  Pill,
  Sparkles,
  Navigation,
  ArrowRight
} from 'lucide-react';

export type ShelterCategoryOption =
  | 'all'
  | 'hospital'
  | 'temple'
  | 'police'
  | 'helpline'
  | 'supermart'
  | 'pharmacy';

interface Props {
  currentCoordinates: [number, number];
  onOpenSheltersModal: (category?: ShelterCategoryOption) => void;
  onLockSafeHaven: (haven: SafeHaven) => void;
}

interface CategoryCardMeta {
  id: ShelterCategoryOption;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  filterTypes: SafeHavenType[];
}

export const SheltersDropdown: React.FC<Props> = ({
  currentCoordinates,
  onOpenSheltersModal,
  onLockSafeHaven
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const { havens: liveHavens, isLiveOverpass } = useLiveShelters(currentCoordinates);

  // Compute live Euclidean distance to every safe haven
  const havensWithDistance = useMemo(() => {
    return liveHavens.map(haven => {
      const dLat = (haven.coordinates[0] - currentCoordinates[0]) * 111000;
      const dLng = (haven.coordinates[1] - currentCoordinates[1]) * 105000;
      const distanceMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
      return {
        ...haven,
        distanceMeters
      };
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [liveHavens, currentCoordinates]);

  // Definitions for all 6 categories requested by user
  const categories: CategoryCardMeta[] = [
    {
      id: 'hospital',
      label: 'Emergency Hospitals',
      subtitle: '24/7 ER, trauma specialists & armed security',
      icon: <HeartPulse size={15} color="#ef4444" />,
      accentColor: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      filterTypes: ['hospital']
    },
    {
      id: 'temple',
      label: '24/7 Temples & Gurudwaras',
      subtitle: 'Guarded temple perimeters & Gurudwara sanctuaries',
      icon: <Sparkles size={15} color="#f59e0b" />,
      accentColor: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      filterTypes: ['temple_sanctuary', 'community_sanctuary']
    },
    {
      id: 'police',
      label: 'Police Stations & Pink Chowkis',
      subtitle: 'Active beat patrols, women helpdesk & 112 link',
      icon: <Shield size={15} color="#3b82f6" />,
      accentColor: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      filterTypes: ['police']
    },
    {
      id: 'helpline',
      label: 'Helpline & Crisis Centres',
      subtitle: 'Sakhi One-Stop & District 181/1091 refuges',
      icon: <PhoneCall size={15} color="#ec4899" />,
      accentColor: '#ec4899',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      filterTypes: ['helpline_centre', 'women_shelter', 'crisis_shelter']
    },
    {
      id: 'supermart',
      label: '24/7 Supermarts & Express Stores',
      subtitle: 'Staffed, continuous neon lighting & CCTV',
      icon: <ShoppingBag size={15} color="#a855f7" />,
      accentColor: '#a855f7',
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      filterTypes: ['supermart_247']
    },
    {
      id: 'pharmacy',
      label: '24/7 Guarded Pharmacies',
      subtitle: 'Apollo & Wellness Forever night outposts',
      icon: <Pill size={15} color="#10b981" />,
      accentColor: '#10b981',
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      filterTypes: ['pharmacy', 'pharmacy_247' as SafeHavenType]
    }
  ];

  // Helper to find closest haven in a category
  const getClosestForCategory = (filterTypes: SafeHavenType[]) => {
    return havensWithDistance.find(h => filterTypes.includes(h.type));
  };

  const handleSelectCategory = (catId: ShelterCategoryOption) => {
    setIsOpen(false);
    onOpenSheltersModal(catId);
  };

  const handleQuickReroute = (e: React.MouseEvent, haven: SafeHaven) => {
    e.stopPropagation();
    setIsOpen(false);
    onLockSafeHaven(haven);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Dropdown Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="btn-civic"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: isOpen ? 'rgba(59, 130, 246, 0.22)' : 'rgba(59, 130, 246, 0.12)',
          color: 'var(--haven-blue, #60a5fa)',
          border: '1px solid rgba(59, 130, 246, 0.45)',
          borderRadius: 'var(--radius-full, 9999px)',
          boxShadow: isOpen ? '0 0 14px rgba(59, 130, 246, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="24/7 Verified Safe Shelters (Hospitals, Temples, Police, Helplines, Supermarts)"
      >
        <LifeBuoy size={14} className={isOpen ? 'animate-spin' : ''} />
        <span style={{ fontWeight: 800 }}>Safe Shelters</span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            color: 'var(--safe-emerald, #34d399)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '1px 5px',
            borderRadius: '9999px'
          }}
        >
          24/7
        </span>
        <ChevronDown
          size={13}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)'
          }}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '380px',
            maxWidth: '92vw',
            backgroundColor: 'var(--surface-elevated, #161a22)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '14px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            zIndex: 2200,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeInSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Dropdown Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              backgroundColor: 'rgba(30, 58, 138, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LifeBuoy size={14} color="var(--haven-blue, #60a5fa)" />
                <span>Verified 24/7 Nearby Havens</span>
                {isLiveOverpass && (
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--safe-emerald, #34d399)', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    LIVE OSM
                  </span>
                )}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary, #94a3b8)', marginTop: '2px' }}>
                Select a trusted category for live directions & emergency shelter
              </div>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: 'var(--accent-amber, #f59e0b)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
            >
              {havensWithDistance.length} Havens
            </span>
          </div>

          {/* Categories List */}
          <div
            style={{
              padding: '8px',
              maxHeight: '380px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            {categories.map(cat => {
              const closest = getClosestForCategory(cat.filterTypes);
              const count = liveHavens.filter(h => cat.filterTypes.includes(h.type)).length;
              const distText = closest
                ? closest.distanceMeters < 1000
                  ? `${closest.distanceMeters}m`
                  : `${(closest.distanceMeters / 1000).toFixed(1)}km`
                : null;
              const walkingMin = closest ? Math.max(1, Math.ceil(closest.distanceMeters / 75)) : null;

              return (
                <div
                  key={cat.id}
                  role="menuitem"
                  onClick={() => handleSelectCategory(cat.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  title={`View all ${count} ${cat.label}`}
                >
                  {/* Left: Icon + Category Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: cat.badgeBg,
                        border: `1px solid ${cat.accentColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {cat.icon}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.label}
                        </span>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            color: 'var(--text-muted, #94a3b8)',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}
                        >
                          {count}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-muted, #94a3b8)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {closest ? (
                          <span>
                            Nearest: <strong style={{ color: '#e2e8f0' }}>{closest.name}</strong>
                          </span>
                        ) : (
                          cat.subtitle
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Distance & 1-Tap Quick Reroute */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {closest && (
                      <div style={{ textAlign: 'right' }}>
                        <div className="mono-num" style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-amber, #f59e0b)' }}>
                          {distText}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted, #64748b)' }}>
                          ~{walkingMin}m walk
                        </div>
                      </div>
                    )}

                    {closest && (
                      <button
                        type="button"
                        onClick={e => handleQuickReroute(e, closest)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.25)',
                          border: '1px solid rgba(59, 130, 246, 0.5)',
                          color: '#93c5fd',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = 'var(--haven-blue, #2563eb)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.25)';
                          e.currentTarget.style.color = '#93c5fd';
                        }}
                        title={`1-Tap Reroute to closest ${cat.label} (${closest.name})`}
                      >
                        <Navigation size={10} />
                        <span>Reroute</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dropdown Footer: Full Cockpit Trigger */}
          <div
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              backgroundColor: 'rgba(15, 23, 42, 0.6)'
            }}
          >
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: 'rgba(59, 130, 246, 0.18)',
                color: '#ffffff',
                border: '1px solid rgba(59, 130, 246, 0.45)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--haven-blue, #2563eb)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.18)';
              }}
            >
              <span>Explore All {liveHavens.length} Shelters &amp; Interactive Map</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheltersDropdown;
