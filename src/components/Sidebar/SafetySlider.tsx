import React from 'react';
import { Sliders, Shield, Zap } from 'lucide-react';

interface Props {
  beta: number;
  onBetaChange: (newBeta: number) => void;
}

export const SafetySlider: React.FC<Props> = ({ beta, onBetaChange }) => {
  const presets = [
    { label: 'Fastest', val: 0.0, icon: Zap },
    { label: 'Balanced', val: 0.5, icon: Sliders },
    { label: 'High Visibility', val: 0.8, icon: Shield },
    { label: 'Max Safe', val: 1.2, icon: Shield }
  ];

  return (
    <div className="slider-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} color="var(--accent-amber)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Safety vs. Travel Time Parameter (β)
          </span>
        </div>
        <span className="mono-num" style={{
          fontSize: '14px',
          fontWeight: 700,
          color: beta >= 0.7 ? 'var(--safe-emerald)' : beta > 0.3 ? 'var(--accent-amber)' : 'var(--text-secondary)'
        }}>
          β = {beta.toFixed(2)}
        </span>
      </div>

      <div style={{ margin: '12px 0 8px' }}>
        <input
          type="range"
          min="0.0"
          max="1.5"
          step="0.05"
          value={beta}
          onChange={(e) => onBetaChange(parseFloat(e.target.value))}
          className="custom-range-slider"
          aria-label="Safety trade-off slider"
        />
      </div>

      <div className="slider-labels">
        <span>0.0 (Fastest Path)</span>
        <span>0.8 (Surakshit Balanced)</span>
        <span>1.5 (Max Visibility)</span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
        {presets.map((p) => {
          const isSelected = Math.abs(beta - p.val) < 0.05;
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              onClick={() => onBetaChange(p.val)}
              className="btn-civic"
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '11px',
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'var(--surface-elevated)',
                borderColor: isSelected ? 'var(--accent-amber)' : 'var(--border-subtle)',
                color: isSelected ? 'var(--accent-amber)' : 'var(--text-secondary)'
              }}
            >
              <Icon size={11} />
              {p.label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', lineHeight: 1.4 }}>
        {beta === 0
          ? '⚠️ Cost strictly equals physical distance. Routes through dark or isolated alleys if they save travel time.'
          : `✅ Traversal impedance C(e) = Length × (1 + ${beta.toFixed(2)} · (1 - S_e)). Unlit edges accrue virtual distance penalties.`}
      </p>
    </div>
  );
};
