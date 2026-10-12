import React, { useState, useMemo } from 'react';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';
import { SafeHaven, SafeHavenType } from '../../types/routing';
import { 
  Phone, 
  MapPin, 
  BatteryCharging, 
  Users, 
  Clock, 
  X, 
  Sparkles,
  Building2,
  Navigation
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentCoordinates: [number, number];
  onLockSafeHaven: (haven: SafeHaven) => void;
  activeLockedHavenId?: string | null;
}

export const EmergencyRefugeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentCoordinates,
  onLockSafeHaven,
  activeLockedHavenId
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | SafeHavenType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Euclidean distance in meters from current position and sort
  const sortedHavens = useMemo(() => {
    return PUNE_SAFE_HAVENS.map(haven => {
      const dLat = (haven.coordinates[0] - currentCoordinates[0]) * 111000;
      const dLng = (haven.coordinates[1] - currentCoordinates[1]) * 105000;
      const distanceMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
      const walkingMinutes = Math.max(1, Math.round((distanceMeters / 1000) / 4.5 * 60)); // ~4.5 km/h walking speed

      return {
        ...haven,
        distanceMeters,
        walkingMinutes
      };
    })
    .filter(haven => {
      if (selectedFilter !== 'all' && haven.type !== selectedFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          haven.name.toLowerCase().includes(q) ||
          haven.address.toLowerCase().includes(q) ||
          (haven.accreditationBadge && haven.accreditationBadge.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [currentCoordinates, selectedFilter, searchQuery]);

  if (!isOpen) return null;

  const getTypeBadge = (type: SafeHavenType) => {
    switch (type) {
      case 'police':
        return { label: 'Police Chowki', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)', icon: '🛡️' };
      case 'pharmacy_247':
        return { label: '24/7 Pharmacy', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', icon: '💊' };
      case 'hospital':
        return { label: 'Emergency Hospital', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', icon: '🏥' };
      case 'commercial_refuge':
        return { label: '24/7 Fuel & Plaza', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)', icon: '⛽' };
      case 'transit_hub':
        return { label: 'Staffed Transit Node', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)', icon: '🚌' };
      default:
        return { label: 'Safe Refuge', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', icon: '📍' };
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface-primary, #0f172a)',
          border: '1px solid var(--border-subtle, #334155)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
          borderBottom: '1px solid var(--border-subtle, #334155)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary, #f8fafc)', margin: 0 }}>
                "Ask for Angela" Verified Safe Haven Network
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', margin: 0, lineHeight: 1.4 }}>
              If you feel followed or unsafe, enter any accredited partner location and discreetly ask staff: 
              <strong style={{ color: 'var(--accent-safety, #10b981)', marginLeft: '4px' }}>
                "Is Angela working today?"
              </strong> for immediate refuge, phone charging, and escorted assistance.
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #64748b)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills & Search */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle, #334155)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text"
            placeholder="Search refuge by name, street, or hospital..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '12px',
              backgroundColor: 'var(--surface-elevated, #1e293b)',
              border: '1px solid var(--border-subtle, #334155)',
              borderRadius: '8px',
              color: 'var(--text-primary, #f8fafc)',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', label: 'All Refuges (20)' },
              { id: 'police', label: '🛡️ Police & Chowkis' },
              { id: 'pharmacy_247', label: '💊 24/7 Pharmacies' },
              { id: 'hospital', label: '🏥 Hospitals' },
              { id: 'commercial_refuge', label: '⛽ 24/7 Fuel Plazas' },
              { id: 'transit_hub', label: '🚌 Transit Hubs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as 'all' | SafeHavenType)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: '1px solid',
                  backgroundColor: selectedFilter === tab.id ? 'var(--accent-safety, #10b981)' : 'var(--surface-elevated, #1e293b)',
                  color: selectedFilter === tab.id ? '#ffffff' : 'var(--text-secondary, #94a3b8)',
                  borderColor: selectedFilter === tab.id ? 'var(--accent-safety, #10b981)' : 'var(--border-subtle, #334155)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Haven List */}
        <div style={{
          padding: '14px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1
        }}>
          {sortedHavens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted, #64748b)' }}>
              No safe havens matched your search.
            </div>
          ) : (
            sortedHavens.map((haven, idx) => {
              const badge = getTypeBadge(haven.type);
              const isLocked = activeLockedHavenId === haven.id;

              return (
                <div 
                  key={haven.id}
                  style={{
                    backgroundColor: isLocked ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface-elevated, #1e293b)',
                    border: `1px solid ${isLocked ? 'var(--accent-safety, #10b981)' : 'var(--border-subtle, #334155)'}`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top Bar: Name + Distance */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: badge.bg,
                          color: badge.color
                        }}>
                          {badge.icon} {badge.label}
                        </span>

                        {haven.askForAngelaTrained && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <Sparkles size={10} /> Ask for Angela Certified
                          </span>
                        )}

                        {idx === 0 && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            color: '#34d399'
                          }}>
                            NEAREST HAVEN
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)', margin: '0 0 2px 0' }}>
                        {haven.name}
                      </h3>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} style={{ flexShrink: 0 }} />
                        <span>{haven.address}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-safety, #10b981)' }}>
                        {haven.distanceMeters >= 1000 ? `${(haven.distanceMeters / 1000).toFixed(1)} km` : `${haven.distanceMeters} m`}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)' }}>
                        ~{haven.walkingMinutes} min walk
                      </div>
                    </div>
                  </div>

                  {/* Facilities Badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '10.5px', color: 'var(--text-secondary, #94a3b8)' }}>
                    {haven.hasPhoneCharger && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <BatteryCharging size={12} color="#34d399" /> Free Phone Charging
                      </span>
                    )}
                    {haven.safeWaitingArea && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Building2 size={12} color="#60a5fa" /> Guarded Shelter Waiting
                      </span>
                    )}
                    {haven.securityStaffOnDuty && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Users size={12} color="#fbbf24" /> Staff On Duty
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={12} color="#94a3b8" /> {haven.timing}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <button
                      onClick={() => {
                        onLockSafeHaven(haven);
                        onClose();
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isLocked ? 'var(--accent-safety, #10b981)' : '#2563eb',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Navigation size={13} />
                      {isLocked ? 'Currently Locked as Refuge' : 'Divert Safe Route to Here'}
                    </button>

                    {haven.contact && (
                      <a
                        href={`tel:${haven.contact.split('/')[0].trim()}`}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle, #334155)',
                          backgroundColor: 'var(--surface-primary, #0f172a)',
                          color: '#60a5fa',
                          fontSize: '12px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Phone size={13} /> Call
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--border-subtle, #334155)',
          backgroundColor: 'var(--surface-elevated, #1e293b)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-muted, #64748b)'
        }}>
          <div>Accredited by Pune City Police & PMC Safety Cell</div>
          <button 
            onClick={onClose}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle, #334155)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary, #f8fafc)',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
