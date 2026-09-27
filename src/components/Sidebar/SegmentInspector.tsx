import React from 'react';
import { SegmentDetail, AppLanguage } from '../../types/routing';
import { Layers, ShieldCheck, AlertTriangle, Lightbulb, Camera, Bus } from 'lucide-react';
import { findNearestTransitNode } from '../../services/liveTransitService';

interface Props {
  segments: SegmentDetail[];
  selectedEdgeId: string | null;
  onSelectSegment: (edgeId: string) => void;
  onOpenStreetView?: (edgeId: string) => void;
  currentLanguage?: AppLanguage;
}

export const SegmentInspector: React.FC<Props> = ({
  segments,
  selectedEdgeId,
  onSelectSegment,
  onOpenStreetView,
  currentLanguage = 'en'
}) => {
  const selectedSegment = segments.find(s => s.edgeId === selectedEdgeId) || segments[0];

  const headerAuditLabel = currentLanguage === 'mr'
    ? `वळणानुसार रस्ता तपासणी (${segments.length} भाग)`
    : currentLanguage === 'hi'
      ? `मोड़-दर-मोड़ सड़क ऑडिट (${segments.length} खंड)`
      : `Turn-by-Turn Segment Audit (${segments.length} Edges)`;

  const typeLabel = currentLanguage === 'mr' ? 'प्रकार:' : currentLanguage === 'hi' ? 'प्रकार:' : 'Type:';
  const lengthLabel = currentLanguage === 'mr' ? 'लांबी:' : currentLanguage === 'hi' ? 'लंबाई:' : 'Length:';
  const illumLabel = currentLanguage === 'mr' ? 'प्रकाश स्रोत:' : currentLanguage === 'hi' ? 'प्रकाश स्रोत:' : 'Illumination Source:';
  const streetViewBtnLabel = currentLanguage === 'mr'
    ? '३६०° रस्त्याचे प्रत्यक्ष ऑडिट पहा'
    : currentLanguage === 'hi'
      ? '360° ज़मीनी सड़क ऑडिट देखें'
      : 'View Ground-Level Street Audit (360°)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <Layers size={13} color="var(--safe-emerald)" />
          <span>{headerAuditLabel}</span>
        </div>
      </div>

      {/* Segment Selector Horizontal Scroll Strip */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
        {segments.map((seg, idx) => {
          const isSelected = seg.edgeId === selectedSegment?.edgeId;
          const isSafe = seg.factors.compositeScore >= 70;
          return (
            <button
              key={seg.edgeId}
              onClick={() => onSelectSegment(seg.edgeId)}
              className="btn-civic"
              style={{
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: isSelected ? 800 : 600,
                flexShrink: 0,
                backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-card)',
                borderColor: isSelected ? (isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)') : 'var(--border-subtle)',
                color: isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
                boxShadow: isSelected ? (isSafe ? 'var(--shadow-glow-emerald)' : 'var(--shadow-glow-crimson)') : 'none'
              }}
            >
              #{idx + 1} {seg.name.length > 16 ? seg.name.slice(0, 16) + '...' : seg.name}
            </button>
          );
        })}
      </div>

      {selectedSegment && (
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedSegment.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {typeLabel} <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)', fontWeight: 600 }}>{selectedSegment.roadClass}</span> · {lengthLabel} <span className="mono-num" style={{ fontWeight: 700 }}>{selectedSegment.lengthMeters}m</span>
              </div>
            </div>

            <div style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: 800,
              backgroundColor: selectedSegment.factors.compositeScore >= 70 ? 'var(--safe-emerald-subtle)' : 'var(--danger-crimson-subtle)',
              color: selectedSegment.factors.compositeScore >= 70 ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
              border: `1px solid ${selectedSegment.factors.compositeScore >= 70 ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`
            }}>
              {selectedSegment.factors.compositeScore}/100
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', backgroundColor: 'var(--surface-elevated)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
            <Lightbulb size={13} color="var(--accent-amber)" />
            <span><strong>{illumLabel}</strong> {selectedSegment.illuminationSource}</span>
          </div>

          {/* Live Public Transit Feeder Proximity */}
          {(() => {
            const segCoords = selectedSegment.coordinates?.[0] || [18.5204, 73.8567];
            const nearestTransit = findNearestTransitNode(segCoords);
            if (!nearestTransit) return null;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px', backgroundColor: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.22)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                <Bus size={13} color="#60a5fa" style={{ flexShrink: 0 }} />
                <span>
                  <strong>{currentLanguage === 'mr' ? 'थेट सार्वजनिक वाहतूक:' : currentLanguage === 'hi' ? 'लाइव सार्वजनिक परिवहन:' : 'Live Transit Link:'}</strong> {nearestTransit.stop.name} ({nearestTransit.stop.operator} · <span className="mono-num">{nearestTransit.distanceMeters}m</span> {currentLanguage === 'mr' ? 'दूर' : currentLanguage === 'hi' ? 'दूर' : 'away'})
                </span>
              </div>
            );
          })()}

          {/* Micro safety cues */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedSegment.keySafetyNotes.map((note, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: selectedSegment.factors.compositeScore >= 70 ? 'var(--text-secondary)' : '#fca5a5' }}>
                {selectedSegment.factors.compositeScore >= 70 ? (
                  <ShieldCheck size={14} color="var(--safe-emerald)" style={{ flexShrink: 0 }} />
                ) : (
                  <AlertTriangle size={14} color="var(--danger-crimson)" style={{ flexShrink: 0 }} />
                )}
                <span>{note}</span>
              </div>
            ))}
          </div>

          {/* Ground-Level 360 Street Audit Action */}
          <button
            type="button"
            onClick={() => onOpenStreetView?.(selectedSegment.edgeId)}
            className="btn-civic btn-primary-amber"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '12px'
            }}
            title="Inspect SafetiPin ground photos and Google Street View 360°"
          >
            <Camera size={13} />
            <span>{streetViewBtnLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SegmentInspector;
