import React, { useState } from 'react';
import { ShieldCheck, Zap, Sliders, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { AppLanguage } from '../../types/routing';

interface Props {
  beta: number;
  onBetaChange: (newBeta: number) => void;
  currentLanguage?: AppLanguage;
}

export const SafetySlider: React.FC<Props> = ({ beta, onBetaChange, currentLanguage = 'en' }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const getSafetyLevel = () => {
    if (beta >= 1.0) {
      return {
        title: currentLanguage === 'mr' ? 'कमाल सुरक्षित कॉरिडॉर' : currentLanguage === 'hi' ? 'अधिकतम सुरक्षित कॉरिडोर' : 'Maximum Safe Corridor',
        desc: currentLanguage === 'mr'
          ? 'केवळ १००% दिव्यांनी उजळलेले मुख्य रस्ते, सीसीटीव्ही-निरीक्षित मार्ग व पडताळणी केलेले २४/७ निवारा केंद्रांमधून मार्ग काढतो.'
          : currentLanguage === 'hi'
            ? 'पूरी तरह से 100% स्ट्रीटलाइट्स वाले मुख्य मार्गों, सीसीटीवी-निगरानी वाली सड़कों और सत्यापित 24/7 सुरक्षित आश्रयों से मार्ग तय करता है।'
            : 'Strictly routes through 100% streetlit arterial highways, CCTV-monitored roads, and verified 24/7 safe shelters.',
        color: 'var(--safe-emerald)',
        bg: 'var(--safe-emerald-subtle)',
        badge: currentLanguage === 'mr' ? '🛡️ कमाल संरक्षण' : currentLanguage === 'hi' ? '🛡️ अधिकतम सुरक्षा' : '🛡️ Maximum Protection',
        icon: Sparkles
      };
    }
    if (beta >= 0.6) {
      return {
        title: currentLanguage === 'mr' ? 'उच्च सुरक्षितता प्राधान्य (शिफारस)' : currentLanguage === 'hi' ? 'उच्च सुरक्षा प्राथमिकता (अनुशंसित)' : 'High Safety Priority (Recommended)',
        desc: currentLanguage === 'mr'
          ? 'प्रवासाचा वेळ कार्यक्षम ठेवत सतत पथदिवे व दुकानांच्या वर्दळीला प्राधान्य देतो.'
          : currentLanguage === 'hi'
            ? 'यात्रा के समय को कुशल रखते हुए निरंतर स्ट्रीट लाइटिंग और खुली दुकानों को प्राथमिकता देता है।'
            : 'Prioritizes continuous street lighting and active storefronts while keeping travel time efficient.',
        color: 'var(--accent-amber)',
        bg: 'var(--accent-amber-subtle)',
        badge: currentLanguage === 'mr' ? '✨ उच्च सुरक्षितता' : currentLanguage === 'hi' ? '✨ उच्च सुरक्षा' : '✨ High Safety',
        icon: ShieldCheck
      };
    }
    if (beta >= 0.2) {
      return {
        title: currentLanguage === 'mr' ? 'संतुलित प्रवास' : currentLanguage === 'hi' ? 'संतुलित यात्रा' : 'Balanced Travel',
        desc: currentLanguage === 'mr'
          ? 'नेहमीचे शहर मार्ग वापरतो, केवळ अतिशय गडद गल्ल्या टाळतो.'
          : currentLanguage === 'hi'
            ? 'सामान्य शहर मार्गों का उपयोग करता है, केवल अत्यधिक अंधेरी गलियों से बचता है।'
            : 'Takes standard city routes with average lighting, avoiding only the most hazardous dark alleys.',
        color: 'var(--haven-blue)',
        bg: 'var(--haven-blue-subtle)',
        badge: currentLanguage === 'mr' ? '⚖️ संतुलित' : currentLanguage === 'hi' ? '⚖️ संतुलित' : '⚖️ Balanced',
        icon: Sliders
      };
    }
    return {
      title: currentLanguage === 'mr' ? 'सर्वात जलद मार्ग (शॉर्टकट)' : currentLanguage === 'hi' ? 'सबसे तेज़ मार्ग (शॉर्टकट)' : 'Fastest Route (Shortcuts)',
      desc: currentLanguage === 'mr'
        ? 'सर्वात कमी अंतर निवडतो. चेतावणी: अंधाऱ्या गल्ल्या किंवा निर्मनुष्य रस्त्यांवरून नेऊ शकतो.'
        : currentLanguage === 'hi'
          ? 'सबसे कम दूरी का चयन करता है। चेतावनी: बिना रोशनी वाली गलियों या सुनसान रास्तों से ले जा सकता है।'
          : 'Takes the shortest physical distance. Warning: May guide you through unlit service alleys or isolated cuts.',
      color: 'var(--danger-crimson)',
      bg: 'var(--danger-crimson-subtle)',
      badge: currentLanguage === 'mr' ? '⚡ वेग प्रथम' : currentLanguage === 'hi' ? '⚡ गति पहले' : '⚡ Speed First',
      icon: Zap
    };
  };

  const currentLevel = getSafetyLevel();

  const presets = [
    {
      label: currentLanguage === 'mr' ? 'वेग' : currentLanguage === 'hi' ? 'गति' : 'Speed',
      val: 0.0,
      icon: Zap,
      subtitle: currentLanguage === 'mr' ? 'शॉर्टकट' : currentLanguage === 'hi' ? 'शॉर्टकट' : 'Shortcuts'
    },
    {
      label: currentLanguage === 'mr' ? 'संतुलित' : currentLanguage === 'hi' ? 'संतुलित' : 'Balanced',
      val: 0.5,
      icon: Sliders,
      subtitle: currentLanguage === 'mr' ? 'मानक' : currentLanguage === 'hi' ? 'मानक' : 'Standard'
    },
    {
      label: currentLanguage === 'mr' ? 'सुरक्षित' : currentLanguage === 'hi' ? 'सुरक्षित' : 'Safe',
      val: 0.8,
      icon: ShieldCheck,
      subtitle: currentLanguage === 'mr' ? 'शिफारस' : currentLanguage === 'hi' ? 'अनुशंसित' : 'Recommended'
    },
    {
      label: currentLanguage === 'mr' ? 'कमाल सुरक्षित' : currentLanguage === 'hi' ? 'अधिकतम' : 'Max Safe',
      val: 1.2,
      icon: Sparkles,
      subtitle: currentLanguage === 'mr' ? 'प्रकाशमान' : currentLanguage === 'hi' ? 'प्रकाशित' : 'Well-Lit'
    }
  ];

  const headerTitle = currentLanguage === 'mr'
    ? 'मार्ग सुरक्षितता प्राधान्य'
    : currentLanguage === 'hi'
      ? 'मार्ग सुरक्षा प्राथमिकता'
      : 'Route Safety Preference';

  const fastestScaleLabel = currentLanguage === 'mr'
    ? '⚡ सर्वात जलद (शॉर्टकट)'
    : currentLanguage === 'hi'
      ? '⚡ सबसे तेज़ (शॉर्टकट)'
      : '⚡ Fastest (Dark Alleys)';

  const balancedScaleLabel = currentLanguage === 'mr'
    ? '⚖️ संतुलित'
    : currentLanguage === 'hi'
      ? '⚖️ संतुलित'
      : '⚖️ Balanced';

  const maxSafeScaleLabel = currentLanguage === 'mr'
    ? '🛡️ १००% प्रकाशमान मुख्य रस्ते'
    : currentLanguage === 'hi'
      ? '🛡️ 100% रोशनी वाले मुख्य मार्ग'
      : '🛡️ 100% Well-Lit Arterials';

  const technicalHeaderLabel = currentLanguage === 'mr'
    ? `📐 तांत्रिक सूत्र व रूटिंग भार (β = ${beta.toFixed(2)})`
    : currentLanguage === 'hi'
      ? `📐 तकनीकी सूत्र व रूटिंग भार (β = ${beta.toFixed(2)})`
      : `📐 Technical Math & Routing Weight (β = ${beta.toFixed(2)})`;

  return (
    <div className="slider-container" style={{ borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
      {/* Header: User-Understandable Safety Preference */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--accent-amber)" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {headerTitle}
          </span>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: currentLevel.bg,
          color: currentLevel.color,
          border: `1px solid ${currentLevel.color}`,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {currentLevel.badge}
        </span>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
        {currentLevel.desc}
      </p>

      {/* Modern Gradient Slider */}
      <div style={{ position: 'relative', margin: '8px 0 10px' }}>
        <input
          type="range"
          min="0.0"
          max="1.5"
          step="0.05"
          value={beta}
          onChange={(e) => onBetaChange(parseFloat(e.target.value))}
          className="custom-range-slider"
          aria-label="Route safety preference slider"
        />
      </div>

      {/* Friendly Slider Scale Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
        <span style={{ color: beta === 0 ? 'var(--danger-crimson)' : 'inherit' }}>{fastestScaleLabel}</span>
        <span style={{ color: beta >= 0.4 && beta <= 0.9 ? 'var(--accent-amber)' : 'inherit' }}>{balancedScaleLabel}</span>
        <span style={{ color: beta >= 1.0 ? 'var(--safe-emerald)' : 'inherit' }}>{maxSafeScaleLabel}</span>
      </div>

      {/* 4 Easy 1-Click Preset Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '14px' }}>
        {presets.map((p) => {
          const isSelected = Math.abs(beta - p.val) < 0.15;
          const Icon = p.icon;
          return (
            <button
              key={p.val}
              type="button"
              onClick={() => onBetaChange(p.val)}
              className="btn-civic"
              style={{
                flexDirection: 'column',
                padding: '8px 4px',
                gap: '2px',
                backgroundColor: isSelected ? 'var(--accent-amber-subtle)' : 'var(--surface-elevated)',
                borderColor: isSelected ? 'var(--accent-amber)' : 'var(--border-subtle)',
                color: isSelected ? 'var(--accent-amber)' : 'var(--text-secondary)',
                boxShadow: isSelected ? '0 0 12px rgba(245, 158, 11, 0.2)' : 'none'
              }}
            >
              <Icon size={14} />
              <span style={{ fontSize: '11px', fontWeight: isSelected ? 800 : 600 }}>{p.label}</span>
              <span style={{ fontSize: '9px', opacity: 0.75 }}>{p.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Technical Algorithm Accordion for Evaluators / Engineers */}
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
          <span>{technicalHeaderLabel}</span>
          {showTechnicalDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>

        {showTechnicalDetails && (
          <div style={{
            marginTop: '6px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
            fontSize: '10px',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <div>
              <strong>Impedance Formula:</strong> <code style={{ color: 'var(--accent-amber)' }}>C(e) = Length × (1 + {beta.toFixed(2)} · (1 - S_e))</code>
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
