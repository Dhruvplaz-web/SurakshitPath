/**
 * SurakshitPath Industry-Grade Authentication Modal
 * 
 * Multi-Role Civic Authentication & Onboarding:
 * 1. Commuter (Google Sign-In, Indian +91 OTP, 1-Click Verified Demo, Emergency Guest)
 * 2. Civic Admin (Pune Municipal Corporation - PMC Smart City & Electrical Dept)
 * 3. Suraksha Sahayak (Pune Police Damini Squad & Emergency First Responder)
 * 
 * Accessible, responsive, 8-point spatial grid, zero AI-sludge design.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Zap,
  CheckCircle2,
  Lock,
  HeartHandshake,
  User,
  Building,
  Users,
  BadgeCheck,
  Radio,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types/routing';
import {
  DEMO_CIVIC_ADMIN_USER,
  DEMO_SURAKSHA_SAHAYAK_USER,
  DEMO_COMMUTER_USER
} from '../../services/firebaseAuthService';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInGoogle,
    signInPhone,
    signInGuest,
    signInRole,
    isLoading,
    openGuardianModal,
    user
  } = useAuth();

  // Role Tab selection in login modal: Commuter | Civic Admin | Suraksha Sahayak
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'commuter');
  
  // Commuter form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  // Custom email inputs for Admin / Sahayak
  const [adminCustomEmail, setAdminCustomEmail] = useState('');
  const [sahayakCustomEmail, setSahayakCustomEmail] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync selectedRole with existing user role when opened
  useEffect(() => {
    if (isAuthModalOpen) {
      if (user?.role) {
        setSelectedRole(user.role);
      }
      setErrorMsg(null);
    }
  }, [isAuthModalOpen, user?.role]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    try {
      await signInGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not complete Google Sign-In. Please try again.');
    }
  };

  const handleSendOtp = () => {
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    setErrorMsg(null);
    setIsOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    setErrorMsg(null);
    try {
      await signInPhone(phoneNumber, otpCode);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid verification code. Please try again.');
    }
  };

  const handleGuestAccess = async () => {
    setErrorMsg(null);
    try {
      await signInGuest();
    } catch (err: any) {
      setErrorMsg(err.message || 'Guest mode error');
    }
  };

  const handleQuickRoleLogin = async (role: UserRole, customEmail?: string) => {
    setErrorMsg(null);
    try {
      await signInRole(role, customEmail);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to log in as ${role}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(5, 7, 10, 0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--surface-elevated, #16181f)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '20px 24px 16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background:
              selectedRole === 'admin'
                ? 'linear-gradient(180deg, rgba(37, 99, 235, 0.12) 0%, transparent 100%)'
                : selectedRole === 'volunteer'
                ? 'linear-gradient(180deg, rgba(236, 72, 153, 0.12) 0%, transparent 100%)'
                : 'linear-gradient(180deg, rgba(16, 185, 129, 0.10) 0%, transparent 100%)',
            position: 'relative',
            transition: 'background 0.25s ease'
          }}
        >
          <button
            type="button"
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Close"
          >
            <X size={16} />
          </button>

          {/* Brand Logo & Security Assurance Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <img
              src="/logo.png"
              alt="SurakshitPath Official Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                objectFit: 'contain',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '3px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            />
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor:
                    selectedRole === 'admin'
                      ? 'rgba(37, 99, 235, 0.15)'
                      : selectedRole === 'volunteer'
                      ? 'rgba(236, 72, 153, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${
                    selectedRole === 'admin'
                      ? 'rgba(37, 99, 235, 0.35)'
                      : selectedRole === 'volunteer'
                      ? 'rgba(236, 72, 153, 0.35)'
                      : 'rgba(16, 185, 129, 0.35)'
                  }`,
                  borderRadius: '9999px',
                  padding: '3px 9px'
                }}
              >
                {selectedRole === 'admin' ? (
                  <Building size={12} color="#3b82f6" />
                ) : selectedRole === 'volunteer' ? (
                  <Users size={12} color="#ec4899" />
                ) : (
                  <ShieldCheck size={12} color="#10b981" />
                )}
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color:
                      selectedRole === 'admin'
                        ? '#60a5fa'
                        : selectedRole === 'volunteer'
                        ? '#f472b6'
                        : '#10b981',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedRole === 'admin'
                    ? 'Civic Administration Gateway'
                    : selectedRole === 'volunteer'
                    ? 'Emergency First Responder Gateway'
                    : 'Commuter & Guardian Portal'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                Pune Smart City Safety Ecosystem
              </div>
            </div>
          </div>

          <h2
            id="auth-modal-title"
            style={{
              fontSize: '19px',
              fontWeight: 800,
              color: 'var(--text-primary, #f8fafc)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            {selectedRole === 'admin'
              ? 'Civic Admin (PMC) Login'
              : selectedRole === 'volunteer'
              ? 'Suraksha Sahayak Login'
              : 'Commuter & Guardian Login'}
          </h2>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted, #94a3b8)',
              margin: 0,
              lineHeight: 1.45
            }}
          >
            {selectedRole === 'admin'
              ? 'Authorize as Pune Municipal Corporation officer to resolve dark spots, monitor lighting grids & push infrastructure updates.'
              : selectedRole === 'volunteer'
              ? 'Authorize as Pune Police Damini Squad responder or verified citizen safety escort for live emergency distress intercepts.'
              : 'Sign in to plan safe nocturnal routes, view ML hazard breakdowns, and sync with Trusted Guardians for automated SOS alerts.'}
          </p>

          {/* Segmented 3-Way Role Selector */}
          <div
            style={{
              marginTop: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Tab 1: Commuter */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('commuter');
                setErrorMsg(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 4px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'commuter' ? 'var(--surface-card, #202430)' : 'transparent',
                color: selectedRole === 'commuter' ? 'var(--accent-amber, #f59e0b)' : 'var(--text-muted, #94a3b8)',
                boxShadow: selectedRole === 'commuter' ? '0 2px 6px rgba(0, 0, 0, 0.4)' : 'none',
                fontWeight: selectedRole === 'commuter' ? 700 : 500,
                fontSize: '11px',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={13} color={selectedRole === 'commuter' ? '#f59e0b' : '#64748b'} />
              <span>Commuter</span>
            </button>

            {/* Tab 2: Civic Admin */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 4px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'admin' ? 'rgba(37, 99, 235, 0.22)' : 'transparent',
                color: selectedRole === 'admin' ? '#60a5fa' : 'var(--text-muted, #94a3b8)',
                boxShadow: selectedRole === 'admin' ? '0 2px 6px rgba(0, 0, 0, 0.4)' : 'none',
                fontWeight: selectedRole === 'admin' ? 700 : 500,
                fontSize: '11px',
                transition: 'all 0.15s ease'
              }}
            >
              <Building size={13} color={selectedRole === 'admin' ? '#60a5fa' : '#64748b'} />
              <span>Civic Admin</span>
            </button>

            {/* Tab 3: Suraksha Sahayak */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('volunteer');
                setErrorMsg(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 4px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedRole === 'volunteer' ? 'rgba(236, 72, 153, 0.22)' : 'transparent',
                color: selectedRole === 'volunteer' ? '#f472b6' : 'var(--text-muted, #94a3b8)',
                boxShadow: selectedRole === 'volunteer' ? '0 2px 6px rgba(0, 0, 0, 0.4)' : 'none',
                fontWeight: selectedRole === 'volunteer' ? 700 : 500,
                fontSize: '11px',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={13} color={selectedRole === 'volunteer' ? '#f472b6' : '#64748b'} />
              <span>Sahayak</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px' }}>
          {errorMsg && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid var(--danger-crimson, #ef4444)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#fca5a5',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Lock size={14} color="#ef4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VIEW A: CIVIC ADMIN (PMC) LOGIN */}
          {selectedRole === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Dummy Officer Credential Preview Card */}
              <div
                style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#60a5fa',
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <BadgeCheck size={12} />
                    <span>PRE-CONFIGURED OFFICIAL DEMO ID</span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontFamily: 'monospace' }}>
                    {DEMO_CIVIC_ADMIN_USER.officerId}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.25)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#93c5fd',
                      fontWeight: 800,
                      fontSize: '16px'
                    }}
                  >
                    RP
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                      {DEMO_CIVIC_ADMIN_USER.displayName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {DEMO_CIVIC_ADMIN_USER.email}
                    </div>
                    <div style={{ fontSize: '10px', color: '#93c5fd', marginTop: '2px' }}>
                      {DEMO_CIVIC_ADMIN_USER.department}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Demo Login Button */}
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('admin', adminCustomEmail || undefined)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2563eb',
                  border: '1px solid #3b82f6',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Building size={16} />
                )}
                <span>Authorize &amp; Log In as Civic Admin (PMC)</span>
              </button>

              {/* Optional Custom Govt Email Field */}
              <div style={{ marginTop: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '6px' }}>
                  Or enter custom PMC official email:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="officer@pmc.punecorporation.gov.in"
                    value={adminCustomEmail}
                    onChange={(e) => setAdminCustomEmail(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('admin', adminCustomEmail)}
                    disabled={!adminCustomEmail || isLoading}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: adminCustomEmail ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: adminCustomEmail ? '#93c5fd' : 'var(--text-muted, #64748b)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: adminCustomEmail ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Features hint */}
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted, #94a3b8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  lineHeight: 1.45
                }}
              >
                ⚡ <strong>Admin Dashboard Features:</strong> Municipal streetlamp fault ticketing, dark spot density heatmap, SDG-11 compliance metrics, citizen complaint verification.
              </div>
            </div>
          )}

          {/* VIEW B: SURAKSHA SAHAYAK (DAMINI SQUAD) LOGIN */}
          {selectedRole === 'volunteer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Dummy Officer Credential Preview Card */}
              <div
                style={{
                  backgroundColor: 'rgba(236, 72, 153, 0.08)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#f472b6',
                      backgroundColor: 'rgba(236, 72, 153, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em'
                    }}
                  >
                    <Radio size={12} />
                    <span>PRE-CONFIGURED SQUAD DEMO ID</span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontFamily: 'monospace' }}>
                    {DEMO_SURAKSHA_SAHAYAK_USER.officerId}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(236, 72, 153, 0.25)',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fbcfe8',
                      fontWeight: 800,
                      fontSize: '16px'
                    }}
                  >
                    SM
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                      {DEMO_SURAKSHA_SAHAYAK_USER.displayName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {DEMO_SURAKSHA_SAHAYAK_USER.email}
                    </div>
                    <div style={{ fontSize: '10px', color: '#fbcfe8', marginTop: '2px' }}>
                      {DEMO_SURAKSHA_SAHAYAK_USER.department}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Demo Login Button */}
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('volunteer', sahayakCustomEmail || undefined)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#db2777',
                  border: '1px solid #ec4899',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(219, 39, 119, 0.4)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#be185d';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#db2777';
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Users size={16} />
                )}
                <span>Authorize &amp; Log In as Suraksha Sahayak</span>
              </button>

              {/* Optional Custom Squad/Responder Email Field */}
              <div style={{ marginTop: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '6px' }}>
                  Or enter custom responder badge email:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="officer@damini.punepolice.gov.in"
                    value={sahayakCustomEmail}
                    onChange={(e) => setSahayakCustomEmail(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#fff',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('volunteer', sahayakCustomEmail)}
                    disabled={!sahayakCustomEmail || isLoading}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: sahayakCustomEmail ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: sahayakCustomEmail ? '#fbcfe8' : 'var(--text-muted, #64748b)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: sahayakCustomEmail ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Features hint */}
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted, #94a3b8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  lineHeight: 1.45
                }}
              >
                🚨 <strong>Sahayak Cockpit Features:</strong> Live geo-spatial distress radar, quick-accept escort requests, instant navigation to victim coordinates, police dispatch sync.
              </div>
            </div>
          )}

          {/* VIEW C: COMMUTER & GUARDIAN LOGIN */}
          {selectedRole === 'commuter' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Primary Quick Login: Google Official Auth */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#1e293b',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" color="#1e293b" />
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>{isLoading ? 'Verifying...' : 'Continue with Google'}</span>
              </button>

              {/* 1-Click Pre-Configured Demo Commuter ID (Dhruv) */}
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('commuter')}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '10px',
                  color: 'var(--accent-amber, #f59e0b)',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)';
                }}
              >
                <Sparkles size={14} />
                <span>1-Click Demo Commuter Login ({DEMO_COMMUTER_USER.displayName})</span>
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '4px 0',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  or with mobile number
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              </div>

              {/* Mobile Phone OTP Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!isOtpSent ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '0 10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--text-primary, #f8fafc)'
                      }}
                    >
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>

                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        fontSize: '13px',
                        color: '#fff',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={phoneNumber.length < 10 || isLoading}
                      style={{
                        padding: '9px 14px',
                        backgroundColor: phoneNumber.length === 10 ? 'var(--accent-amber, #f59e0b)' : 'rgba(255, 255, 255, 0.06)',
                        color: phoneNumber.length === 10 ? '#000' : 'var(--text-muted, #64748b)',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: phoneNumber.length === 10 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Get OTP</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>Code sent to +91 {phoneNumber}</span>
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(false)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-amber, #f59e0b)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                      >
                        Change Number
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        autoFocus
                        placeholder="Enter 6-digit OTP (e.g. 123456)"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--accent-amber, #f59e0b)',
                          borderRadius: '8px',
                          padding: '9px 12px',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          color: '#fff',
                          outline: 'none',
                          textAlign: 'center'
                        }}
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpCode.length !== 6 || isLoading}
                        style={{
                          padding: '9px 16px',
                          backgroundColor: otpCode.length === 6 ? 'var(--safe-emerald, #10b981)' : 'rgba(255, 255, 255, 0.06)',
                          color: otpCode.length === 6 ? '#fff' : 'var(--text-muted, #64748b)',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: otpCode.length === 6 ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        <span>Verify</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Trusted Guardians Setup Shortcut */}
              <div
                style={{
                  marginTop: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.22)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <HeartHandshake size={15} color="var(--safe-emerald, #10b981)" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                      Trusted Guardians Setup
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Configure up to 3 emergency contacts
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    openGuardianModal();
                  }}
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    color: 'var(--safe-emerald, #10b981)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  Setup Guardians →
                </button>
              </div>

              {/* Emergency Zero-Barrier Guest Access Link */}
              <div
                style={{
                  marginTop: '4px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={13} color="#f59e0b" />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>In a rush or traveling right now?</span>
                </div>

                <button
                  type="button"
                  onClick={handleGuestAccess}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-amber, #f59e0b)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '4px'
                  }}
                >
                  Continue as Guest →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
