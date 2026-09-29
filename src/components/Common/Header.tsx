import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, Share2, AlertTriangle, User, LogOut, ChevronDown, Shield, HeartHandshake, Building, Users, RefreshCw, Menu, X, CloudRain, SunMedium, CloudFog } from 'lucide-react';
import { UserRole, AppLanguage, SafeHaven } from '../../types/routing';
import { getTranslation } from '../../services/localizationService';
import { LanguageDropdown } from './LanguageDropdown';
import { SheltersDropdown, ShelterCategoryOption } from './SheltersDropdown';
import { NecessityDropdown } from './NecessityDropdown';
import { NocturnalWeatherCard, WeatherMode, WeatherRiskProfile, WEATHER_PROFILES } from '../Commuter/NocturnalWeatherCard';
import { PuneLocation } from '../../services/geocodingService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  currentRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  isAudioMuted?: boolean;
  onToggleAudio?: () => void;
  currentLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
  onOpenReportModal?: () => void;
  onOpenShareModal?: () => void;
  onOpenSos?: () => void;
  onOpenCabShield?: () => void;
  onOpenShelters?: (category?: ShelterCategoryOption) => void;
  onOpenFakeCall?: () => void;
  onLockSafeHaven?: (haven: SafeHaven) => void;
  currentCoordinates?: [number, number];
  userCoordinates?: [number, number];
  onSelectDestination?: (location: PuneLocation) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeWeatherMode?: WeatherMode;
  onWeatherModeChange?: (mode: WeatherMode, profile: WeatherRiskProfile) => void;
}

export const Header: React.FC<Props> = ({
  currentRole = 'commuter',
  onSelectRole: _onSelectRole,
  isAudioMuted = false,
  onToggleAudio,
  currentLanguage,
  onSelectLanguage,
  onOpenReportModal,
  onOpenShareModal,
  onOpenSos,
  onOpenCabShield,
  onOpenShelters,
  onOpenFakeCall,
  onLockSafeHaven,
  currentCoordinates,
  userCoordinates,
  onSelectDestination,
  theme,
  onToggleTheme,
  activeWeatherMode = 'clear',
  onWeatherModeChange
}) => {
  const t = getTranslation(currentLanguage);
  const { user, openAuthModal, signOut, openGuardianModal } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const activeRole = user?.role || currentRole;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as Node) || (e instanceof TouchEvent && e.touches && e.touches[0] ? (e.touches[0].target as Node) : null);
      if (profileMenuRef.current && target && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && target && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  return (
    <header className="civic-header">
      {/* Left Cluster: Brand Logo & Title (Uncluttered) */}
      <div className="header-left-cluster">
        <div
          className="header-brand"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="SurakshitPath — Safer Routes • Smarter Choices"
        >
          {/* Logo Icon — circular crop with gradient ring */}
          <div
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              flexShrink: 0,
              borderRadius: '50%',
              padding: '2px',
              background: 'linear-gradient(135deg, #1e6fa8 0%, #10b981 100%)',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.40), 0 2px 6px rgba(0,0,0,0.45)',
              transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            }}
          >
            <img
              src="/logo-icon.jpg"
              alt="SurakshitPath Official Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                display: 'block',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontWeight: 900, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Surakshit
              </span>
              <span style={{ fontWeight: 900, fontSize: '16px', color: 'var(--safe-emerald, #10b981)', letterSpacing: '-0.02em' }}>
                Path
              </span>
            </div>
            <span className="header-brand-subtitle" style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted, #94a3b8)', letterSpacing: '0.02em' }}>
              Safer Routes • Smarter Choices
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions Cluster */}
      <div className="header-actions desktop-header-actions">
        {/* Safe Shelters Categorised Dropdown (Hospitals, Temples, Police, Helplines, Supermarts) */}
        {onOpenShelters && (
          <SheltersDropdown
            currentCoordinates={currentCoordinates || [18.5204, 73.8567]}
            onOpenSheltersModal={onOpenShelters}
            onLockSafeHaven={onLockSafeHaven || (() => { })}
          />
        )}

        {/* Nearby Emergency Roadside Necessities Dropdown (Garages, Petrol Pumps, Towing, EV) */}
        <NecessityDropdown
          userCoordinates={userCoordinates || currentCoordinates || [18.5204, 73.8567]}
          onSelectDestination={onSelectDestination}
          currentLanguage={currentLanguage}
        />

        {/* Quick Report Hazard Button */}
        {onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="btn-civic btn-hazard-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'var(--danger-crimson-subtle)',
              color: 'var(--danger-crimson)',
              border: '1px solid var(--danger-crimson)',
              borderRadius: 'var(--radius-full)',
              flexShrink: 0
            }}
            title="Report Dark Spot, Broken Streetlight or Hazard"
          >
            <AlertTriangle size={13} />
            <span className="btn-label">{t.reportHazard}</span>
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
              gap: '6px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'var(--accent-amber-subtle)',
              color: 'var(--accent-amber)',
              border: '1px solid var(--accent-amber)',
              borderRadius: 'var(--radius-full)',
              flexShrink: 0
            }}
            title="Share Live Safe Route Pass with Family / Guardian"
          >
            <Share2 size={13} />
            <span className="btn-label">{t.sharePass}</span>
          </button>
        )}

        {/* Divider between quick actions and utilities */}
        <div className="header-divider" />

        {/* Pune Nocturnal Weather Cloud Button with Weather Risk Simulator */}
        <NocturnalWeatherCard
          compact
          activeWeatherMode={activeWeatherMode}
          onWeatherModeChange={onWeatherModeChange}
        />

        {/* Language Switcher Dropdown */}
        <LanguageDropdown
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
        />

        {/* White / Dark Mode Toggle Icon Button */}
        <button
          onClick={onToggleTheme}
          className="btn-civic btn-icon-round"
          title={theme === 'dark' ? "Switch to Daylight Mode" : "Switch to Dark Mode"}
          aria-label={theme === 'dark' ? "Switch to Daylight Mode" : "Switch to Dark Mode"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(217, 119, 6, 0.12)',
            border: theme === 'dark' ? '1px solid var(--border-subtle)' : '1px solid var(--accent-amber)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--accent-amber)',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0
          }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Voice Guidance Toggle (Icon Only) */}
        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className="btn-civic"
            title={isAudioMuted ? "Enable Voice Safety Guidance" : "Mute Voice Safety Guidance"}
            aria-label={isAudioMuted ? "Enable Voice Safety Guidance" : "Mute Voice Safety Guidance"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              background: isAudioMuted ? 'var(--danger-crimson-subtle)' : 'var(--accent-amber-subtle)',
              border: `1px solid ${isAudioMuted ? 'var(--danger-crimson)' : 'var(--accent-amber)'}`,
              borderRadius: 'var(--radius-full)',
              color: isAudioMuted ? 'var(--danger-crimson)' : 'var(--accent-amber)',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        )}

        {/* Unified Role-Aware User Account Pill / Sign-In Trigger */}
        {user ? (
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="btn-civic"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px 4px 6px',
                borderRadius: 'var(--radius-full)',
                backgroundColor:
                  activeRole === 'admin'
                    ? 'rgba(37, 99, 235, 0.14)'
                    : activeRole === 'volunteer'
                      ? 'rgba(236, 72, 153, 0.14)'
                      : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${activeRole === 'admin'
                    ? '#3b82f6'
                    : activeRole === 'volunteer'
                      ? '#ec4899'
                      : 'var(--safe-emerald)'
                  }`,
                cursor: 'pointer'
              }}
              title={`${user.displayName} · ${activeRole.toUpperCase()} Account`}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor:
                      activeRole === 'admin'
                        ? '#2563eb'
                        : activeRole === 'volunteer'
                          ? '#db2777'
                          : 'var(--safe-emerald)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800
                  }}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName.split(' ')[0]}
              </span>

              {/* Role Indicator Badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor:
                    activeRole === 'admin'
                      ? 'rgba(37, 99, 235, 0.22)'
                      : activeRole === 'volunteer'
                        ? 'rgba(236, 72, 153, 0.22)'
                        : 'rgba(16, 185, 129, 0.18)',
                  color:
                    activeRole === 'admin'
                      ? '#60a5fa'
                      : activeRole === 'volunteer'
                        ? '#f472b6'
                        : 'var(--safe-emerald)',
                  border: `1px solid ${activeRole === 'admin'
                      ? 'rgba(59, 130, 246, 0.4)'
                      : activeRole === 'volunteer'
                        ? 'rgba(236, 72, 153, 0.4)'
                        : 'rgba(16, 185, 129, 0.35)'
                    }`
                }}
              >
                {activeRole === 'admin' ? (
                  <>
                    <Building size={10} />
                    <span>PMC Admin</span>
                  </>
                ) : activeRole === 'volunteer' ? (
                  <>
                    <Users size={10} />
                    <span>Sahayak</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake size={10} />
                    <span>{user.trustedGuardians?.length || 0}</span>
                  </>
                )}
              </span>

              <ChevronDown size={12} color="var(--text-muted)" />
            </button>

            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '260px',
                  backgroundColor: 'var(--surface-elevated, #16181f)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                  padding: '12px',
                  zIndex: 4000,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                {/* User Identity Header */}
                <div style={{ marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{user.displayName}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.email || user.phoneNumber || 'Guest Commuter'}
                  </div>
                  {user.officerId && (
                    <div style={{ fontSize: '10px', color: '#93c5fd', fontFamily: 'monospace', marginTop: '3px' }}>
                      ID: {user.officerId}
                    </div>
                  )}
                  {user.department && (
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {user.department}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '6px',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor:
                        activeRole === 'admin'
                          ? 'rgba(37, 99, 235, 0.15)'
                          : activeRole === 'volunteer'
                            ? 'rgba(236, 72, 153, 0.15)'
                            : 'rgba(16, 185, 129, 0.1)',
                      color:
                        activeRole === 'admin'
                          ? '#60a5fa'
                          : activeRole === 'volunteer'
                            ? '#f472b6'
                            : 'var(--safe-emerald)'
                    }}
                  >
                    <Shield size={10} />
                    <span>
                      {activeRole === 'admin'
                        ? 'Role: Civic Administrator (PMC)'
                        : activeRole === 'volunteer'
                          ? 'Role: Suraksha Sahayak (Damini)'
                          : 'Role: Commuter & Guardian Host'}
                    </span>
                  </div>
                </div>

                {/* 1-Click Role Switch / Re-login Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="btn-civic"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent-amber, #f59e0b)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  title="Switch between Commuter, Civic Admin, or Suraksha Sahayak"
                >
                  <RefreshCw size={12} />
                  <span>Switch Operational Role / Re-login</span>
                </button>

                {/* Commuter-Only: Unified Trusted Guardians Section */}
                {activeRole === 'commuter' && (
                  <div
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.06)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      marginBottom: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--safe-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <HeartHandshake size={12} />
                        <span>{t.guardians} ({user.trustedGuardians?.length || 0}/3)</span>
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: (user.trustedGuardians?.length || 0) > 0 ? 'var(--safe-emerald)' : 'var(--accent-amber)' }}>
                        {(user.trustedGuardians?.length || 0) > 0 ? 'Sync Active' : 'Not Configured'}
                      </span>
                    </div>
                    {(user.trustedGuardians?.length || 0) > 0 ? (
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {user.trustedGuardians.map(g => g.name.split(' ')[0]).join(', ')}
                      </div>
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Add emergency contacts for automated SOS dispatch
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openGuardianModal();
                      }}
                      className="btn-civic"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--safe-emerald)',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '6px'
                      }}
                    >
                      <HeartHandshake size={12} />
                      <span>{t.manageGuardians}</span>
                    </button>
                  </div>
                )}

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    signOut();
                  }}
                  className="btn-civic"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--danger-crimson)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '6px'
                  }}
                >
                  <LogOut size={12} />
                  <span>{t.signOut}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className="btn-civic"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid var(--accent-amber)',
              color: 'var(--accent-amber)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Log in as Commuter, Civic Admin, or Suraksha Sahayak"
          >
            <User size={13} />
            <span className="btn-label">Login / Select Role</span>
          </button>
        )}
      </div>
      {/* Mobile Actions Cluster (Strictly rendered on mobile screens <= 768px) */}
      <div className="mobile-header-cluster">
        {/* High-Contrast 1-Tap SOS Emergency Trigger */}
        {onOpenSos && (
          <button
            type="button"
            onClick={onOpenSos}
            className="mobile-header-sos-btn"
            title="Instant 1-Tap Emergency SOS (112, Police, Siren, Fake Call)"
            aria-label="Instant Emergency SOS"
          >
            <span className="mobile-sos-ping" />
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>🚨</span>
              <span>SOS</span>
            </span>
          </button>
        )}

        {/* Mobile Services & Menu Trigger Button */}
        <div ref={mobileMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`mobile-menu-trigger-btn ${isMobileMenuOpen ? 'active' : ''}`}
            aria-label="Services & Menu"
            title="Open Services, Shelters, Necessities & Account"
          >
            {isMobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            <span>Menu</span>
          </button>

          {isMobileMenuOpen && (
            <div className="mobile-dropdown-menu">
              {/* 1. Account & Operational Role */}
              <div className="mobile-dropdown-header">
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor:
                            activeRole === 'admin'
                              ? '#2563eb'
                              : activeRole === 'volunteer'
                                ? '#db2777'
                                : 'var(--safe-emerald)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.displayName}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {activeRole === 'admin' ? 'PMC Civic Admin' : activeRole === 'volunteer' ? 'Suraksha Sahayak' : 'Commuter'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal();
                      }}
                      className="btn-civic"
                      style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(245, 158, 11, 0.15)',
                        color: 'var(--accent-amber)',
                        border: '1px solid var(--accent-amber)',
                        borderRadius: '6px',
                        flexShrink: 0
                      }}
                    >
                      Switch Role
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal();
                    }}
                    className="btn-civic"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid var(--accent-amber)',
                      color: 'var(--accent-amber)',
                      borderRadius: '8px'
                    }}
                  >
                    <User size={14} />
                    <span>Login / Select Role (Admin / Sahayak)</span>
                  </button>
                )}
              </div>

              {/* 2. Core Safety & Emergency Tools */}
              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">Safety & Emergency Services</div>

                {onOpenShelters && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenShelters();
                    }}
                    className="mobile-dropdown-item"
                  >
                    <div className="mobile-item-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--safe-emerald)' }}>
                      🏥
                    </div>
                    <div className="mobile-item-info">
                      <div className="mobile-item-title">Safe Shelters & Havens</div>
                      <div className="mobile-item-desc">24/7 Police, Hospitals, Illuminated Fuel Stations</div>
                    </div>
                  </button>
                )}

                <div className="mobile-dropdown-item-interactive">
                  <NecessityDropdown
                    userCoordinates={userCoordinates || currentCoordinates || [18.5204, 73.8567]}
                    onSelectDestination={(loc) => {
                      setIsMobileMenuOpen(false);
                      if (onSelectDestination) onSelectDestination(loc);
                    }}
                    currentLanguage={currentLanguage}
                  />
                </div>

                {onOpenCabShield && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCabShield();
                    }}
                    className="mobile-dropdown-item"
                  >
                    <div className="mobile-item-icon" style={{ backgroundColor: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' }}>
                      🛡️
                    </div>
                    <div className="mobile-item-info">
                      <div className="mobile-item-title">Cab Ride Shield</div>
                      <div className="mobile-item-desc">Automated Route Deviation & Telemetry Watchdog</div>
                    </div>
                  </button>
                )}

                {onOpenFakeCall && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenFakeCall();
                    }}
                    className="mobile-dropdown-item"
                  >
                    <div className="mobile-item-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                      📞
                    </div>
                    <div className="mobile-item-info">
                      <div className="mobile-item-title">Fake Call Decoy</div>
                      <div className="mobile-item-desc">Simulated Incoming Ring to Deter Approaching Strangers</div>
                    </div>
                  </button>
                )}

                {onOpenReportModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenReportModal();
                    }}
                    className="mobile-dropdown-item"
                  >
                    <div className="mobile-item-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger-crimson)' }}>
                      ⚠️
                    </div>
                    <div className="mobile-item-info">
                      <div className="mobile-item-title">{t.reportHazard}</div>
                      <div className="mobile-item-desc">Flag Dark Spot, Broken Light, or Road Obstacle</div>
                    </div>
                  </button>
                )}

                {onOpenShareModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenShareModal();
                    }}
                    className="mobile-dropdown-item"
                  >
                    <div className="mobile-item-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                      📲
                    </div>
                    <div className="mobile-item-info">
                      <div className="mobile-item-title">{t.sharePass}</div>
                      <div className="mobile-item-desc">Live Tracking Link for Trusted Family & Guardians</div>
                    </div>
                  </button>
                )}
              </div>

              {/* 3. Nocturnal Weather Risk Simulation */}
              <div className="mobile-dropdown-section">
                <div className="mobile-dropdown-section-title">Night Weather & Road Risk</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onWeatherModeChange) onWeatherModeChange('clear', WEATHER_PROFILES.clear);
                    }}
                    className={`mobile-weather-pill ${activeWeatherMode === 'clear' ? 'active' : ''}`}
                  >
                    <SunMedium size={13} />
                    <span>Clear</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onWeatherModeChange) onWeatherModeChange('rain', WEATHER_PROFILES.rain);
                    }}
                    className={`mobile-weather-pill ${activeWeatherMode === 'rain' ? 'active' : ''}`}
                  >
                    <CloudRain size={13} />
                    <span>Rainy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onWeatherModeChange) onWeatherModeChange('fog', WEATHER_PROFILES.fog);
                    }}
                    className={`mobile-weather-pill ${activeWeatherMode === 'fog' ? 'active' : ''}`}
                  >
                    <CloudFog size={13} />
                    <span>Foggy</span>
                  </button>
                </div>
              </div>

              {/* 4. Quick Preferences: Language, Theme, Voice */}
              <div className="mobile-dropdown-section" style={{ borderBottom: 'none', paddingBottom: '4px' }}>
                <div className="mobile-dropdown-section-title">Quick Settings</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onSelectLanguage(currentLanguage === 'en' ? 'mr' : 'en')}
                    className="mobile-pref-pill"
                  >
                    <span style={{ fontSize: '12px' }}>🌐</span>
                    <span>{currentLanguage === 'en' ? 'मराठी' : 'English'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="mobile-pref-pill"
                  >
                    <span>{theme === 'dark' ? '☀️ Day' : '🌙 Dark'}</span>
                  </button>

                  {onToggleAudio && (
                    <button
                      type="button"
                      onClick={onToggleAudio}
                      className="mobile-pref-pill"
                    >
                      <span>{isAudioMuted ? '🔇 Unmute' : '🔊 Voice'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
