import React from 'react';
import { RouteOption } from '../../types/routing';
import { Lightbulb, Users, Bus, Cross, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

interface Props {
  activeRoute: RouteOption;
}

export const ExplainabilityRadar: React.FC<Props> = ({ activeRoute }) => {
  const { factors, reasons } = activeRoute;

  const factorItems = [
    {
      label: 'Illumination (L_e)',
      value: Math.round(factors.lighting * 100),
      icon: Lightbulb,
      desc: 'OSM lamps + Arterial Baseline + Commercial Radiance',
      color: factors.lighting >= 0.7 ? 'var(--safe-emerald)' : 'var(--danger-crimson)'
    },
    {
      label: 'Public Presence (A_e)',
      value: Math.round(factors.activity * 100),
      icon: Users,
      desc: 'Log-saturated count of operational 24/7 night POIs',
      color: 'var(--accent-amber)'
    },
    {
      label: 'Transit Access (T_e)',
      value: Math.round(factors.transit * 100),
      icon: Bus,
      desc: 'Exponential proximity to PMPML & Metro nodes (d = 300m)',
      color: 'var(--haven-blue)'
    },
    {
      label: 'Emergency Access (E_e)',
      value: Math.round(factors.emergency * 100),
      icon: Cross,
      desc: 'Proximity to Police Stations & 24/7 Casualty (d = 1000m)',
      color: 'var(--safe-emerald)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 4 Core Factor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {factorItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <Icon size={12} color={item.color} />
                  <span>{item.label}</span>
                </div>
                <span className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>
                  {item.value}%
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Hazard Penalty if present */}
      {factors.incidentPenalty > 0 && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} color="var(--danger-crimson)" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--danger-crimson)' }}>
                Active Transient Hazard Penalty (R_e)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Decaying with τ = 14-day half-life
              </div>
            </div>
          </div>
          <span className="mono-num" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--danger-crimson)' }}>
            -{Math.round(factors.incidentPenalty * 100)}%
          </span>
        </div>
      )}

      {/* Transparent Factor Justifications (XAI) */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 16px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Explainable AI (XAI) Route Decision
        </div>
        <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {reasons.map((reason, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={13} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Anti-Redlining Ethical Notice */}
      <div style={{
        backgroundColor: 'rgba(59, 130, 246, 0.06)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontSize: '11px',
        color: '#93c5fd',
        lineHeight: 1.4
      }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Anti-Redlining Guarantee:</strong> Scores are computed strictly from verifiable physical infrastructure (lighting, active commercial storefronts, transit) and time-decayed reports. Neighborhoods are never statically blacklisted.
        </span>
      </div>
    </div>
  );
};
