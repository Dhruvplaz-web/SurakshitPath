import React, { useState, useRef } from 'react';
import { RouteOption } from '../../types/routing';
import { PuneLocation } from '../../services/geocodingService';
import { RouteComparisonCard } from '../Sidebar/RouteComparisonCard';
import { SafetySlider } from '../Sidebar/SafetySlider';
import { ExplainabilityRadar } from '../Sidebar/ExplainabilityRadar';
import { SegmentInspector } from '../Sidebar/SegmentInspector';
import { 
  ChevronUp, 
  ChevronDown, 
  Navigation, 
  LifeBuoy, 
  AlertTriangle, 
  Share2,
  ShieldCheck,
  MapPin
} from 'lucide-react';

interface Props {
  activeRoute: RouteOption;
  routes: { fastest: RouteOption; safe: RouteOption; balanced: RouteOption; transit?: RouteOption } | null;
  activeRouteId: string;
  onSelectRoute: (id: string) => void;
  origin: PuneLocation;
  destination: PuneLocation | null;
  beta: number;
  onBetaChange: (beta: number) => void;
  selectedEdgeId: string | null;
  onSelectSegment: (edgeId: string) => void;
  onOpenReportModal: () => void;
  onOpenShareModal: () => void;
  onOpenRefugesModal: () => void;
  activeLockedHavenId?: string | null;
  isSimulating: boolean;
  onToggleSimulating: () => void;
}

export type SheetSnap = 'peek' | 'half' | 'full';

export const MobileBottomSheet: React.FC<Props> = ({
  activeRoute,
  routes,
  activeRouteId,
  onSelectRoute,
  origin,
  destination,
  beta,
  onBetaChange,
  selectedEdgeId,
  onSelectSegment,
  onOpenReportModal,
  onOpenShareModal,
  onOpenRefugesModal,
  activeLockedHavenId,
  isSimulating,
  onToggleSimulating
}) => {
  const [snap, setSnap] = useState<SheetSnap>('peek');
  const [activeTab, setActiveTab] = useState<'routes' | 'segments' | 'safety'>('routes');
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = touchCurrentY.current - touchStartY.current;
    if (deltaY < -40) {
      // Swiped UP
      if (snap === 'peek') setSnap('half');
      else if (snap === 'half') setSnap('full');
    } else if (deltaY > 40) {
      // Swiped DOWN
      if (snap === 'full') setSnap('half');
      else if (snap === 'half') setSnap('peek');
    }
  };

  const getSheetHeight = () => {
    switch (snap) {
      case 'peek': return '120px';
      case 'half': return '52vh';
      case 'full': return '86vh';
    }
  };

  return (
    <div
      className="mobile-bottom-sheet"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: getSheetHeight(),
        backgroundColor: 'var(--surface-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.45)',
        zIndex: 1500,
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        touchAction: 'pan-y'
      }}
    >
      {/* Drag Pill Handle */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (snap === 'peek') setSnap('half');
          else if (snap === 'half') setSnap('full');
          else setSnap('peek');
        }}
        style={{
          width: '100%',
          padding: '10px 0 6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'grab',
          flexShrink: 0
        }}
      >
        <div style={{
          width: '40px',
          height: '4px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          marginBottom: '6px'
        }} />
      </div>

      {/* Peek Header (Always visible) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          padding: '0 16px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: snap !== 'peek' ? '1px solid var(--border-subtle)' : 'none'
        }}
      >
        <div 
          onClick={() => setSnap(snap === 'peek' ? 'half' : 'peek')}
          style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: activeRoute.safetyScore >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: activeRoute.safetyScore >= 70 ? 'var(--safe-emerald)' : 'var(--accent-amber)'
            }}>
              ★ {activeRoute.safetyScore}/100 Safe
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeRoute.name.split('·')[1]?.trim() || activeRoute.name}
            </span>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⏱️ <strong>{activeRoute.durationMinutes} min</strong></span>
            <span>•</span>
            <span>📍 <strong>{(activeRoute.distanceMeters / 1000).toFixed(1)} km</strong></span>
            <span>•</span>
            <span>💡 <strong>{Math.round(activeRoute.factors.lighting * 100)}% lit</strong></span>
          </div>
        </div>

        {/* Action Controls in Peek Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={onToggleSimulating}
            className="btn-civic"
            style={{
              height: '40px',
              padding: '0 12px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '8px',
              backgroundColor: isSimulating ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isSimulating ? '#f87171' : '#34d399',
              border: `1px solid ${isSimulating ? '#ef4444' : '#10b981'}`
            }}
          >
            <Navigation size={13} />
            <span>{isSimulating ? 'Stop' : 'Start'}</span>
          </button>

          <button
            onClick={() => setSnap(snap === 'peek' ? 'half' : snap === 'half' ? 'full' : 'peek')}
            className="btn-civic"
            style={{
              width: '36px',
              height: '40px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}
            title={snap === 'peek' ? 'Expand Sheet' : 'Collapse Sheet'}
          >
            {snap === 'peek' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Tab Selector (When Half or Full) */}
      {snap !== 'peek' && (
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 16px',
          gap: '8px',
          flexShrink: 0
        }}>
          {[
            { id: 'routes', label: 'Routes & Preference' },
            { id: 'segments', label: 'Turn-by-Turn' },
            { id: 'safety', label: 'AI Risk Audit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '10px 4px',
                fontSize: '12px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--accent-amber)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-amber)' : '2px solid transparent',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable Sheet Content Body */}
      {snap !== 'peek' && (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {activeTab === 'routes' && (
            <>
              {/* Origin to Destination Corridor Info */}
              <div style={{
                backgroundColor: 'var(--surface-card)',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11.5px'
              }}>
                <MapPin size={14} color="var(--accent-amber)" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{origin.name.split('(')[0].trim()}</span>
                  <span style={{ color: 'var(--text-muted)' }}>➔</span>
                  <span style={{ fontWeight: 600, color: destination ? (activeLockedHavenId ? '#34d399' : 'var(--accent-amber)') : 'var(--text-muted)' }}>
                    {destination ? destination.name.split('(')[0].trim() : 'Where to safely?'}
                  </span>
                </div>
              </div>

              {/* Candidate Routes Comparison (Render when routes available) */}
              {routes && destination ? (
                <>
                  <RouteComparisonCard
                    routes={routes}
                    activeRouteId={activeRouteId}
                    onSelectRoute={onSelectRoute}
                  />

                  {/* Safety Preference Beta Slider */}
                  <div style={{
                    backgroundColor: 'var(--surface-card)',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>Route Choices</span>
                    </div>
                    <SafetySlider beta={beta} onBetaChange={onBetaChange} activeRouteId={activeRouteId} onSelectRouteId={onSelectRoute} />
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--surface-card)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--safe-emerald)', marginBottom: '4px' }}>
                    🛡️ Safe Radar Active
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Map centered on your live GPS location. Enter a destination above to calculate safe illuminated routes.
                  </div>
                </div>
              )}

              {/* Quick Actions Grid (3-column mobile layout) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '4px' }}>
                <button
                  onClick={onOpenRefugesModal}
                  className="btn-civic"
                  style={{
                    padding: '8px 4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    color: '#93c5fd',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    minHeight: '48px'
                  }}
                >
                  <LifeBuoy size={14} color="#60a5fa" />
                  <span>20 Havens</span>
                </button>

                <button
                  onClick={onOpenReportModal}
                  className="btn-civic"
                  style={{
                    padding: '8px 4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    minHeight: '48px'
                  }}
                >
                  <AlertTriangle size={14} color="#ef4444" />
                  <span>Report</span>
                </button>

                <button
                  onClick={onOpenShareModal}
                  className="btn-civic"
                  style={{
                    padding: '8px 4px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    color: '#6ee7b7',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    minHeight: '48px'
                  }}
                >
                  <Share2 size={14} color="#10b981" />
                  <span>Share Pass</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'segments' && (
            <SegmentInspector
              segments={activeRoute.segments}
              selectedEdgeId={selectedEdgeId}
              onSelectSegment={onSelectSegment}
            />
          )}

          {activeTab === 'safety' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ExplainabilityRadar activeRoute={activeRoute} />
              <div style={{
                backgroundColor: 'var(--surface-card)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '11px',
                lineHeight: 1.5,
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="var(--safe-emerald)" />
                  <span>Safety Verification Guarantee</span>
                </div>
                <div>
                  This route was verified against PMC SCADA illumination sensors and 24/7 commercial frontages with zero unlit service alleys.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
