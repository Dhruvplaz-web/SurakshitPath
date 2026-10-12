import React from 'react';
import { PUNE_SAFE_HAVENS } from '../../data/safeHavens';
import { SafeHaven } from '../../types/routing';
import { Shield, LifeBuoy, Building2 } from 'lucide-react';

interface Props {
  currentCoordinates: [number, number];
  onLockSafeHaven: (haven: SafeHaven) => void;
  onOpenRefugesModal?: () => void;
  activeLockedHavenId?: string | null;
}

export const QuickSafeHavenButton: React.FC<Props> = ({
  currentCoordinates,
  onLockSafeHaven,
  onOpenRefugesModal,
  activeLockedHavenId
}) => {
  // Find closest haven by Euclidean distance
  const getClosestHaven = (): { haven: SafeHaven; distanceMeters: number; walkingMinutes: number } => {
    let closest = PUNE_SAFE_HAVENS[0];
    let minDistSq = Infinity;

    for (const h of PUNE_SAFE_HAVENS) {
      const dLat = (h.coordinates[0] - currentCoordinates[0]) * 111000;
      const dLng = (h.coordinates[1] - currentCoordinates[1]) * 105000;
      const distSq = dLat * dLat + dLng * dLng;

      if (distSq < minDistSq) {
        minDistSq = distSq;
        closest = h;
      }
    }

    const distanceMeters = Math.round(Math.sqrt(minDistSq));
    const walkingMinutes = Math.max(1, Math.round((distanceMeters / 1000) / 4.5 * 60));

    return {
      haven: closest,
      distanceMeters,
      walkingMinutes
    };
  };

  const { haven: closestHaven, distanceMeters, walkingMinutes } = getClosestHaven();
  const isClosestLocked = activeLockedHavenId === closestHaven.id;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {/* Primary Emergency Lock Button */}
      <button
        onClick={() => onLockSafeHaven(closestHaven)}
        className="btn-civic"
        style={{
          width: '100%',
          padding: '10px 14px',
          backgroundColor: isClosestLocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.12)',
          borderColor: isClosestLocked ? 'var(--accent-safety, #10b981)' : 'rgba(59, 130, 246, 0.4)',
          color: isClosestLocked ? '#6ee7b7' : '#93c5fd',
          justifyContent: 'space-between',
          borderRadius: '8px'
        }}
        title="Instantly calculate high-visibility safe route to nearest verified emergency shelter or 24/7 pharmacy"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', minWidth: 0, flex: 1 }}>
          <LifeBuoy size={16} color={isClosestLocked ? "var(--accent-safety, #10b981)" : "var(--haven-blue, #60a5fa)"} className="animate-spin-slow" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: isClosestLocked ? '#6ee7b7' : '#bfdbfe', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{isClosestLocked ? 'Refuge Locked' : 'Emergency Shelter Lock'}</span>
              <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                Ask for Angela
              </span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary, #94a3b8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Nearest: {closestHaven.name} (<span className="mono-num">{distanceMeters}m · ~{walkingMinutes}m</span>)
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: isClosestLocked ? 'var(--accent-safety, #10b981)' : 'rgba(59, 130, 246, 0.25)',
          color: '#ffffff',
          padding: '4px 8px',
          borderRadius: '4px',
          flexShrink: 0
        }}>
          <Shield size={11} /> {isClosestLocked ? 'Active' : 'Divert'}
        </div>
      </button>

      {/* Directory Modal Trigger */}
      {onOpenRefugesModal && (
        <button
          onClick={onOpenRefugesModal}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary, #94a3b8)',
            fontSize: '10.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '3px 0',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#38bdf8')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary, #94a3b8)')}
        >
          <Building2 size={11} />
          <span>View All 20 Verified Safe Havens & Accreditations ➔</span>
        </button>
      )}
    </div>
  );
};
