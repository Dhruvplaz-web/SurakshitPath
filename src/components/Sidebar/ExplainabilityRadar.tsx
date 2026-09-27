import React from 'react';
import { RouteOption } from '../../types/routing';
import { Lightbulb, Users, Bus, Cross, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface Props {
  activeRoute: RouteOption;
}

export const ExplainabilityRadar: React.FC<Props> = ({ activeRoute }) => {
  const { factors, reasons } = activeRoute;

  const factorItems = [
    {
      key: 'lighting',
      label: 'Illumination (L_e)',
      value: Math.round(factors.lighting * 100),
      icon: Lightbulb,
      desc: 'OSM streetlights + commercial arterial radiance',
      color: factors.lighting >= 0.7 ? 'var(--safe-emerald)' : 'var(--danger-crimson)'
    },
    {
      key: 'activity',
      label: 'Public Frontage (A_e)',
      value: Math.round(factors.activity * 100),
      icon: Users,
      desc: '24/7 open shops, pharmacies & active transit hubs',
      color: 'var(--accent-amber)'
    },
    {
      key: 'transit',
      label: 'Transit Access (T_e)',
      value: Math.round(factors.transit * 100),
      icon: Bus,
      desc: 'Proximity to PMPML bus stops & Pune Metro stations',
      color: 'var(--haven-blue)'
    },
    {
      key: 'emergency',
      label: 'Emergency Reach (E_e)',
      value: Math.round(factors.emergency * 100),
      icon: Cross,
      desc: 'Proximity to police chowkis & 24/7 emergency care',
      color: 'var(--safe-emerald)'
    }
  ];

  // SVG Radar Chart Math for 4 axes (Angles: Top, Right, Bottom, Left)
  const size = 200;
  const center = size / 2;
  const maxRadius = 70;

  // Angles: 0 (Top - Lighting), PI/2 (Right - Activity), PI (Bottom - Transit), 3PI/2 (Left - Emergency)
  const lVal = (factors.lighting || 0.1) * maxRadius;
  const aVal = (factors.activity || 0.1) * maxRadius;
  const tVal = (factors.transit || 0.1) * maxRadius;
  const eVal = (factors.emergency || 0.1) * maxRadius;

  const ptTop = [center, center - lVal];
  const ptRight = [center + aVal, center];
  const ptBottom = [center, center + tVal];
  const ptLeft = [center - eVal, center];

  const polygonPoints = `${ptTop[0]},${ptTop[1]} ${ptRight[0]},${ptRight[1]} ${ptBottom[0]},${ptBottom[1]} ${ptLeft[0]},${ptLeft[1]}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* SVG 4-Factor Radar Visual */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', alignSelf: 'flex-start' }}>
          4-Factor Safety Dimension Radar
        </div>

        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Concentric Grid Rings */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => {
            const r = maxRadius * level;
            return (
              <polygon
                key={level}
                points={`${center},${center - r} ${center + r},${center} ${center},${center + r} ${center - r},${center}`}
                fill="none"
                stroke="var(--border-medium)"
                strokeWidth={level === 1.0 ? "1.5" : "0.75"}
                strokeDasharray={level === 1.0 ? "none" : "3,3"}
              />
            );
          })}

          {/* Axes Cross */}
          <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="var(--border-medium)" strokeWidth="1" />
          <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="var(--border-medium)" strokeWidth="1" />

          {/* Animated Filled Data Area */}
          <polygon
            points={polygonPoints}
            fill="rgba(245, 158, 11, 0.25)"
            stroke="var(--accent-amber)"
            strokeWidth="2"
            style={{ transition: 'all 0.5s ease' }}
          />

          {/* Vertex Points */}
          <circle cx={ptTop[0]} cy={ptTop[1]} r="4" fill="var(--safe-emerald)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={ptRight[0]} cy={ptRight[1]} r="4" fill="var(--accent-amber)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={ptBottom[0]} cy={ptBottom[1]} r="4" fill="var(--haven-blue)" stroke="#fff" strokeWidth="1.5" />
          <circle cx={ptLeft[0]} cy={ptLeft[1]} r="4" fill="var(--safe-emerald)" stroke="#fff" strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x={center} y="16" textAnchor="middle" fill="var(--safe-emerald)" fontSize="10" fontWeight="700">Illumination</text>
          <text x={size - 8} y={center + 4} textAnchor="end" fill="var(--accent-amber)" fontSize="10" fontWeight="700">Activity</text>
          <text x={center} y={size - 6} textAnchor="middle" fill="var(--haven-blue)" fontSize="10" fontWeight="700">Transit</text>
          <text x="8" y={center + 4} textAnchor="start" fill="var(--safe-emerald)" fontSize="10" fontWeight="700">Emergency</text>
        </svg>
      </div>

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
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <Icon size={13} color={item.color} />
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                </div>
                <span className="mono-num" style={{ fontSize: '13px', fontWeight: 800, color: item.color }}>
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
          backgroundColor: 'var(--danger-crimson-subtle)',
          border: '1px solid var(--danger-crimson)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} color="var(--danger-crimson)" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger-crimson)' }}>
                Active Real-Time Hazard Penalty
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                Applied based on citizen report or dynamic street disruption
              </div>
            </div>
          </div>
          <span className="mono-num" style={{ fontSize: '14px', fontWeight: 800, color: 'var(--danger-crimson)' }}>
            -{Math.round(factors.incidentPenalty * 100)}%
          </span>
        </div>
      )}

      {/* Audit Explanations */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Corridor Safety Audit Rationale
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {reasons.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <CheckCircle2 size={13} color="var(--safe-emerald)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityRadar;
