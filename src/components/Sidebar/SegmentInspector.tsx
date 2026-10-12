import React from 'react';
import { SegmentDetail } from '../../types/routing';
import { Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  segments: SegmentDetail[];
  selectedEdgeId: string | null;
  onSelectSegment: (edgeId: string) => void;
}

export const SegmentInspector: React.FC<Props> = ({
  segments,
  selectedEdgeId,
  onSelectSegment
}) => {
  const selectedSegment = segments.find(s => s.edgeId === selectedEdgeId) || segments[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          <Layers size={13} color="var(--accent-amber)" />
          <span>Micro-Segment Inspector ({segments.length} Edges)</span>
        </div>
      </div>

      {/* Segment Selector Pills */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
        {segments.map((seg, idx) => {
          const isSelected = seg.edgeId === selectedSegment?.edgeId;
          const isSafe = seg.factors.compositeScore >= 70;
          return (
            <button
              key={seg.edgeId}
              onClick={() => onSelectSegment(seg.edgeId)}
              className="btn-civic"
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                flexShrink: 0,
                backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-card)',
                borderColor: isSelected ? (isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)') : 'var(--border-subtle)',
                color: isSafe ? 'var(--safe-emerald)' : 'var(--danger-crimson)'
              }}
            >
              #{idx + 1} {seg.name.slice(0, 14)}...
            </button>
          );
        })}
      </div>

      {selectedSegment && (
        <div style={{
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '12px 14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedSegment.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Road Class: <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{selectedSegment.roadClass}</span> · Length: <span className="mono-num">{selectedSegment.lengthMeters}m</span>
              </div>
            </div>

            <div style={{
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: selectedSegment.factors.compositeScore >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: selectedSegment.factors.compositeScore >= 70 ? 'var(--safe-emerald)' : 'var(--danger-crimson)',
              border: `1px solid ${selectedSegment.factors.compositeScore >= 70 ? 'var(--safe-emerald)' : 'var(--danger-crimson)'}`
            }}>
              Score: {selectedSegment.factors.compositeScore}/100
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <strong>Illumination Source:</strong> {selectedSegment.illuminationSource}
          </div>

          {/* Micro notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {selectedSegment.keySafetyNotes.map((note, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: selectedSegment.factors.compositeScore >= 70 ? 'var(--text-secondary)' : '#fca5a5' }}>
                {selectedSegment.factors.compositeScore >= 70 ? (
                  <ShieldCheck size={12} color="var(--safe-emerald)" />
                ) : (
                  <AlertTriangle size={12} color="var(--danger-crimson)" />
                )}
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
