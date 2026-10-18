import React, { useState } from 'react';
import { ShieldCheck, Zap, Sparkles, Bus, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { AppLanguage } from '../../types/routing';

interface Props {
  beta: number;
  onBetaChange: (newBeta: number) => void;
  currentLanguage?: AppLanguage;
  activeRouteId?: string;
  onSelectRouteId?: (routeId: string) => void;
}

export const SafetySlider: React.FC<Props> = ({
  beta,
  onBetaChange,
  currentLanguage = 'en',
  activeRouteId = 'route_safe',
  onSelectRouteId
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const presets = [
    {
      id: 'route_safe',
      val: 0.85,
      icon: Sparkles,
      color: 'var(--safe-emerald, #10b981)',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      badge: currentLanguage === 'mr' ? '🛡️ कमाल सुरक्षा' : currentLanguage === 'hi' ? '🛡️ अधिकतम सुरक्षा' : '🛡️ Max Shield',
      title: currentLanguage === 'mr' ? 'कमाल सुरक्षित कॉरिडॉर' : currentLanguage === 'hi' ? 'अधिकतम सुरक्षित मार्ग' : 'Maximum Shield',
      tagline: currentLanguage === 'mr' ? '१००% प्रकाशमान मुख्य रस्ते व निवारे' : currentLanguage === 'hi' ? '100% रोशनी वाले मुख्य मार्ग' : '100% Lit Arterials & Shelters'
    },
    {
      id: 'route_balanced',
      val: 0.50,
      icon: ShieldCheck,
      color: 'var(--accent-amber, #f59e0b)',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.35)',
      badge: currentLanguage === 'mr' ? '⚡ जलद व सुरक्षित' : currentLanguage === 'hi' ? '⚡ तेज़ व सुरक्षित' : '⚡ Swift & Safe',
      title: currentLanguage === 'mr' ? 'जलद व सुरक्षित (शिफारस)' : currentLanguage === 'hi' ? 'तेज़ व सुरक्षित (अनुशंसित)' : 'Swift & Safe',
      tagline: currentLanguage === 'mr' ? 'अंधाऱ्या गल्ल्या टाळून जलद प्रवास' : currentLanguage === 'hi' ? 'अंधेरी गलियां छोड़कर तेज़ रास्ता' : 'Fast with Zero Unlit Cuts'
    },
    {
      id: 'route_fastest',
      val: 0.00,
      icon: Zap,
      color: '#60a5fa',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.35)',
      badge: currentLanguage === 'mr' ? '⏱️ सर्वात जलद' : currentLanguage === 'hi' ? '⏱️ सबसे तेज़' : '⏱️ Fastest Direct',
      title: currentLanguage === 'mr' ? 'सर्वात जलद कट' : currentLanguage === 'hi' ? 'सबसे तेज़ सीधा मार्ग' : 'Direct Cut (Fastest)',
      tagline: currentLanguage === 'mr' ? 'कमी वेळेचा थेट महामार्ग' : currentLanguage === 'hi' ? 'कम समय वाला सीधा रास्ता' : 'Shortest Time via Direct Cuts'
    },
    {
      id: 'route_transit',
      val: 0.40,
      icon: Bus,
      color: '#c084fc',
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.35)',
      badge: currentLanguage === 'mr' ? '🚌 ट्रान्झिट मार्ग' : currentLanguage === 'hi' ? '🚌 ट्रांजिट मार्ग' : '🚌 Transit Corridor',
      title: currentLanguage === 'mr' ? 'मेट्रो व बीआरटीएस मार्ग' : currentLanguage === 'hi' ? 'मेट्रो व बस कॉरिडोर' : 'Transit Boulevard',
      tagline: currentLanguage === 'mr' ? 'गर्दी व नियमित बस थांबे' : currentLanguage === 'hi' ? 'भीड़भाड़ व सार्वजनिक बस स्टॉप' : 'High Footfall & Metro Stops'
    }
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    onBetaChange(preset.val);
    if (onSelectRouteId) {
      onSelectRouteId(preset.id);
    }
  };

  const headerTitle = currentLanguage === 'mr'
    ? 'मार्ग निवड (१-टॅप प्राधान्य)'
    : currentLanguage === 'hi'
      ? 'मार्ग चयन (1-टैप प्राथमिकता)'
      : 'Route Selection (1-Tap Preset)';

  return (
    <div className="slider-container" style={{ borderRadius: 'var(--radius-lg, 12px)', padding: '14px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--accent-amber, #f59e0b)" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {headerTitle}
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'var(--safe-emerald, #10b981)',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          No Sliders · Instant
        </span>
      </div>

      {/* 4 1-Tap Distinct Route Preset Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {presets.map((preset) => {
          const isSelected = activeRouteId === preset.id || Math.abs(beta - preset.val) < 0.12;
          const Icon = preset.icon;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: isSelected ? preset.bg : 'var(--surface-elevated, #1e293b)',
                border: isSelected ? `1.5px solid ${preset.color}` : '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? `0 4px 16px ${preset.bg}` : 'none',
                position: 'relative'
              }}
              aria-pressed={isSelected}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: preset.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={14} color={preset.color} />
                </div>
                {isSelected && (
                  <CheckCircle size={14} color={preset.color} />
                )}
              </div>

              <div style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: 1.2 }}>
                {preset.title}
              </div>

              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1.3 }}>
                {preset.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Technical Algorithm Accordion for Civic Evaluators & Engineers */}
      <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 0'
          }}
        >
          <span>📐 Technical Impedance Weight (β = {beta.toFixed(2)})</span>
          {showTechnicalDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>

        {showTechnicalDetails && (
          <div style={{
            marginTop: '6px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm, 6px)',
            backgroundColor: 'var(--surface-elevated, #1e293b)',
            border: '1px solid var(--border-subtle)',
            fontSize: '10px',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <div>
              <strong>Impedance Formula:</strong> <code style={{ color: 'var(--accent-amber, #f59e0b)' }}>C(e) = Length × (1 + {beta.toFixed(2)} · (1 - S_e))</code>
            </div>
            <div style={{ marginTop: '3px' }}>
              Where <strong>S_e</strong> is the composite edge safety score (0.0 to 1.0). Unlit road segments accrue virtual distance penalties based on β.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetySlider;