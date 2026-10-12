import React from 'react';
import { PuneLocation } from '../../services/geocodingService';
import { 
  Search, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Calculator, 
  LifeBuoy, 
  AlertCircle
} from 'lucide-react';

interface Props {
  origin: PuneLocation;
  destination: PuneLocation;
  onOpenSearch: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDiscreetMode: () => void;
  onOpenRefugesModal: () => void;
  onOpenReportModal: () => void;
  activeLockedHavenId?: string | null;
}

export const MobileFloatingHud: React.FC<Props> = ({
  origin,
  destination,
  onOpenSearch,
  isAudioMuted,
  onToggleAudio,
  theme,
  onToggleTheme,
  onOpenDiscreetMode,
  onOpenRefugesModal,
  onOpenReportModal,
  activeLockedHavenId
}) => {
  return (
    <>
      {/* Floating Top Search Bar & Utilities */}
      <div
        className="mobile-floating-top-hud"
        style={{
          position: 'fixed',
          top: 'calc(10px + env(safe-area-inset-top, 0px))',
          left: '12px',
          right: '12px',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          pointerEvents: 'auto'
        }}>
          {/* Main Search Glassmorphic Pill */}
          <div
            onClick={onOpenSearch}
            style={{
              flex: 1,
              backgroundColor: 'rgba(22, 24, 29, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              cursor: 'pointer',
              minWidth: 0
            }}
          >
            <Search size={15} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '42%' }}>
                {origin.name.split('(')[0].trim()}
              </span>
              <ArrowRight size={11} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              <span style={{ color: activeLockedHavenId ? '#34d399' : 'var(--accent-amber)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '46%' }}>
                {destination.name.split('(')[0].trim()}
              </span>
            </div>
          </div>

          {/* Quick Discreet Escort Mode FAB */}
          <button
            onClick={onOpenDiscreetMode}
            className="btn-civic"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'rgba(22, 24, 29, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}
            title="Open Discreet Stealth Calculator"
          >
            <Calculator size={15} color="#94a3b8" />
          </button>

          {/* Audio Guidance FAB */}
          <button
            onClick={onToggleAudio}
            className="btn-civic"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'rgba(22, 24, 29, 0.92)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isAudioMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              color: isAudioMuted ? 'var(--danger-crimson)' : 'var(--accent-amber)',
              flexShrink: 0
            }}
            title={isAudioMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Theme Toggle FAB */}
          <button
            onClick={onToggleTheme}
            className="btn-civic"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'rgba(22, 24, 29, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              color: 'var(--text-primary)',
              flexShrink: 0
            }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#60a5fa" />}
          </button>
        </div>
      </div>

      {/* Floating Floating Emergency Safe Haven & Hazard Actions (Above Bottom Sheet) */}
      <div
        className="mobile-floating-haven-fab"
        style={{
          position: 'fixed',
          right: '16px',
          bottom: '135px',
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end'
        }}
      >
        <button
          onClick={onOpenReportModal}
          className="btn-civic"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(248, 113, 113, 0.5)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '9999px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700
          }}
          title="Report Civic Hazard"
        >
          <AlertCircle size={13} />
          <span>Report Hazard</span>
        </button>

        <button
          onClick={onOpenRefugesModal}
          className="btn-civic"
          style={{
            backgroundColor: activeLockedHavenId ? '#059669' : 'rgba(30, 58, 138, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(96, 165, 250, 0.5)',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700
          }}
          title="Open Ask for Angela 24/7 Safe Haven Directory"
        >
          <LifeBuoy size={14} />
          <span>{activeLockedHavenId ? 'Haven Locked' : 'Ask for Angela (20 Havens)'}</span>
        </button>
      </div>
    </>
  );
};
