import React from 'react';
import { ShieldCheck, Moon, Sun, Activity, MapPin, Volume2, VolumeX, Share2, AlertTriangle } from 'lucide-react';
import { UserRole, AppLanguage } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { RoleDropdown } from './RoleDropdown';
import { LanguageDropdown } from './LanguageDropdown';

interface Props {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isAudioMuted?: boolean;
  onToggleAudio?: () => void;
  currentLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onOpenReportModal?: () => void;
  onOpenShareModal?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<Props> = ({
  currentRole,
  onSelectRole,
  isAudioMuted = false,
  onToggleAudio,
  currentLanguage,
  onSelectLanguage,
  onOpenReportModal,
  onOpenShareModal,
  theme,
  onToggleTheme
}) => {
  const t = getTranslation(currentLanguage);

  return (
    <header className="civic-header">
      <div className="header-brand">
        <div className="brand-icon-shield">
          <ShieldCheck size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-title">{t.appName}</span>
            <span className="brand-badge">{t.appTagline}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <MapPin size={11} color="var(--accent-amber)" />
            <span>{t.testbedSubtitle}</span>
          </div>
        </div>
      </div>

      {/* Center: Sleek Role Dropdown */}
      <RoleDropdown
        currentRole={currentRole}
        onSelectRole={onSelectRole}
        currentLanguage={currentLanguage}
      />

      <div className="header-actions">
        {/* Quick Report Hazard Button */}
        {onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="btn-civic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger-crimson)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '9999px'
            }}
            title="Report Dark Spot or Hazard"
          >
            <AlertTriangle size={12} />
            <span>Report Hazard</span>
          </button>
        )}

        {/* Quick Share Pass Button */}
        {onOpenShareModal && (
          <button
            onClick={onOpenShareModal}
            className="btn-civic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--accent-amber)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '9999px'
            }}
            title="Share Safe Route Pass"
          >
            <Share2 size={12} />
            <span>Share Pass</span>
          </button>
        )}

        {/* Language Switcher Dropdown */}
        <LanguageDropdown
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
        />

        {/* White / Dark Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="btn-civic"
          title={theme === 'dark' ? "Switch to Crisp Daylight White Mode" : "Switch to Nocturnal Dark Mode"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(217, 119, 6, 0.12)',
            border: theme === 'dark' ? '1px solid var(--border-subtle)' : '1px solid var(--accent-amber)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            color: theme === 'dark' ? 'var(--text-primary)' : 'var(--accent-amber)',
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={12} color="#f59e0b" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={12} color="#d97706" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Voice Guidance Toggle */}
        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className="btn-civic"
            title={isAudioMuted ? "Enable Voice Safety Guidance" : "Mute Voice Safety Guidance"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: isAudioMuted ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${isAudioMuted ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.35)'}`,
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              color: isAudioMuted ? 'var(--danger-crimson)' : 'var(--accent-amber)',
              cursor: 'pointer'
            }}
          >
            {isAudioMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            <span>{isAudioMuted ? t.voiceMuted : t.voiceActive}</span>
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--safe-emerald)'
        }}>
          <Activity size={12} className="animate-pulse" />
          <span>{t.telemetryActive}</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldCheck size={12} color="var(--accent-amber)" />
          <span>{t.sdgAligned}</span>
        </div>
      </div>
    </header>
  );
};

