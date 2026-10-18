import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ChevronDown,
  AlertTriangle,
  Share2,
  PhoneCall,
  Car,
  Bluetooth,
  ShieldAlert
} from 'lucide-react';
import { AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';

interface Props {
  onOpenReportModal?: () => void;
  onOpenShareModal?: () => void;
  onOpenFakeCall?: () => void;
  onOpenCabShield?: () => void;
  onOpenKavachCockpit?: () => void;
  currentLanguage?: AppLanguage;
}

export const SafetyToolsDropdown: React.FC<Props> = ({
  onOpenReportModal,
  onOpenShareModal,
  onOpenFakeCall,
  onOpenCabShield,
  onOpenKavachCockpit,
  currentLanguage = 'en'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(currentLanguage);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as Node) || (e instanceof TouchEvent && e.touches && e.touches[0] ? (e.touches[0].target as Node) : null);
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const tools = [
    {
      id: 'report_hazard',
      title: t.reportHazard || 'Report Road Hazard',
      subtitle: currentLanguage === 'mr' ? 'अंधारे रस्ते, बंद दिवे नोंदवा' : currentLanguage === 'hi' ? 'अंधेरे रास्ते, बंद लाइट रिपोर्ट करें' : 'Dark spots, broken streetlights & road hazards',
      icon: <AlertTriangle size={15} color="var(--danger-crimson, #ef4444)" />,
      badgeBg: 'rgba(239, 68, 68, 0.12)',
      badgeBorder: 'rgba(239, 68, 68, 0.35)',
      onClick: onOpenReportModal,
      isAvailable: Boolean(onOpenReportModal)
    },
    {
      id: 'share_pass',
      title: t.sharePass || 'Share Safe Pass',
      subtitle: currentLanguage === 'mr' ? 'कुटुंबासह थेट स्थान शेअर करा' : currentLanguage === 'hi' ? 'परिवार संग लाइव लोकेशन शेयर करें' : 'Live route tracking pass for guardians',
      icon: <Share2 size={15} color="var(--accent-amber, #f59e0b)" />,
      badgeBg: 'rgba(245, 158, 11, 0.12)',
      badgeBorder: 'rgba(245, 158, 11, 0.35)',
      onClick: onOpenShareModal,
      isAvailable: Boolean(onOpenShareModal)
    },
    {
      id: 'fake_call',
      title: currentLanguage === 'mr' ? 'बनावट कॉल (डिकॉय)' : currentLanguage === 'hi' ? 'फेक कॉल (डिकॉय)' : 'Decoy Fake Call',
      subtitle: currentLanguage === 'mr' ? 'पाठलाग करणाऱ्यांना रोखण्यासाठी कॉल' : currentLanguage === 'hi' ? 'पीछा करने वालों को रोकने हेतु कॉल' : 'Simulate incoming call to deter followers',
      icon: <PhoneCall size={15} color="#60a5fa" />,
      badgeBg: 'rgba(59, 130, 246, 0.12)',
      badgeBorder: 'rgba(59, 130, 246, 0.35)',
      onClick: onOpenFakeCall,
      isAvailable: Boolean(onOpenFakeCall)
    },
    {
      id: 'ride_shield',
      title: currentLanguage === 'mr' ? 'कॅब राइड शील्ड' : currentLanguage === 'hi' ? 'कैब राइड शील्ड' : 'Cab Ride Shield',
      subtitle: currentLanguage === 'mr' ? 'मार्ग विचलन आणि सुरक्षित प्रवास मॉनिटर' : currentLanguage === 'hi' ? 'मार्ग भटकाव एवं सुरक्षित यात्रा निगरानी' : 'Live journey monitoring & route deviation alarm',
      icon: <Car size={15} color="var(--safe-emerald, #10b981)" />,
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeBorder: 'rgba(16, 185, 129, 0.35)',
      onClick: onOpenCabShield,
      isAvailable: Boolean(onOpenCabShield)
    },
    {
      id: 'kavach_iot',
      title: 'Surakshit Kavach IoT',
      subtitle: currentLanguage === 'mr' ? 'स्मार्ट चार्म ब्लूटूथ पेअरिंग' : currentLanguage === 'hi' ? 'स्मार्ट चार्म ब्लूटूथ पेयरिंग' : 'BLE hardware charm pairing & SOS telemetry',
      icon: <Bluetooth size={15} color="#c084fc" />,
      badgeBg: 'rgba(168, 85, 247, 0.12)',
      badgeBorder: 'rgba(168, 85, 247, 0.35)',
      onClick: onOpenKavachCockpit,
      isAvailable: Boolean(onOpenKavachCockpit)
    }
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn-civic"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full, 9999px)',
          backgroundColor: isOpen ? 'rgba(59, 130, 246, 0.18)' : 'rgba(59, 130, 246, 0.10)',
          border: '1px solid rgba(59, 130, 246, 0.38)',
          color: '#60a5fa',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.18s ease'
        }}
        title="Open Emergency & Safety Protection Suite"
        aria-expanded={isOpen}
      >
        <Shield size={13} color="#60a5fa" />
        <span className="btn-label">
          {currentLanguage === 'mr' ? 'सुरक्षा साधने' : currentLanguage === 'hi' ? 'सुरक्षा टूल्स' : 'Safety Tools'}
        </span>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            color: '#93c5fd'
          }}
        >
          5
        </span>
        <ChevronDown
          size={12}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            opacity: 0.75
          }}
        />
      </button>

      {isOpen && (
        <div
          className="safety-tools-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '0',
            width: '290px',
            backgroundColor: 'var(--surface-elevated, #1e293b)',
            border: '1px solid var(--border-medium, rgba(255, 255, 255, 0.12))',
            borderRadius: '12px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)',
            padding: '8px',
            zIndex: 1500,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* Header Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px 8px',
              borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
              marginBottom: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} color="#60a5fa" />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-primary, #ffffff)'
                }}
              >
                {currentLanguage === 'mr' ? 'सुरक्षा टूल्स संच' : currentLanguage === 'hi' ? 'सुरक्षा सूट' : 'Safety Protection Suite'}
              </span>
            </div>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: 'var(--safe-emerald, #10b981)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 5px',
                borderRadius: '4px'
              }}
            >
              24/7 Active
            </span>
          </div>

          {/* List of Safety Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                disabled={!tool.isAvailable}
                onClick={() => {
                  setIsOpen(false);
                  if (tool.onClick) tool.onClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  cursor: tool.isAvailable ? 'pointer' : 'not-allowed',
                  opacity: tool.isAvailable ? 1 : 0.5,
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (tool.isAvailable) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-hover, rgba(255, 255, 255, 0.06))';
                    e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255, 255, 255, 0.1))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (tool.isAvailable) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: tool.badgeBg,
                    border: `1px solid ${tool.badgeBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {tool.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text-primary, #ffffff)',
                      lineHeight: 1.2
                    }}
                  >
                    {tool.title}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-muted, #94a3b8)',
                      marginTop: '2px',
                      lineHeight: 1.3
                    }}
                  >
                    {tool.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
