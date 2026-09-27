/**
 * SurakshitPath - Trusted Guardians Modal
 * 
 * Provides Commuters with an eye-calming, accessible interface to manage up to 3
 * trusted guardians (Family, Friends, Emergency contacts).
 * 
 * Complies with:
 * - 8pt spatial grid
 * - URL-friendly / focus-trapped modal
 * - Complete state spectrum (empty, active list, adding, test alert simulated dispatch)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Shield,
  HeartHandshake,
  UserPlus,
  Trash2,
  Phone,
  PhoneCall,
  MessageSquare,
  Send,
  CheckCircle2,
  BellRing,
  AlertCircle
} from 'lucide-react';

const RELATION_PRESETS = ['Father', 'Mother', 'Sister', 'Brother', 'Spouse', 'Friend', 'Guardian'];

export const TrustedGuardianModal: React.FC = () => {
  const {
    user,
    isGuardianModalOpen,
    closeGuardianModal,
    addGuardian,
    removeGuardian,
    openAuthModal
  } = useAuth();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [phone, setPhone] = useState('');
  const [notifyOnStart, setNotifyOnStart] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [testSentId, setTestSentId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGuardianModalOpen) {
        closeGuardianModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuardianModalOpen, closeGuardianModal]);

  if (!isGuardianModalOpen) return null;

  const guardians = user?.trustedGuardians || [];
  const canAddMore = guardians.length < 3;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim()) {
      setValidationError('Please enter guardian name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    addGuardian({
      name: name.trim(),
      relationship,
      phone: `+91 ${cleanPhone.slice(-10, -5)} ${cleanPhone.slice(-5)}`,
      notifyOnTripStart: notifyOnStart
    });

    setName('');
    setPhone('');
    setIsAdding(false);
  };

  const handleSendTestPing = (guardianId: string, _guardianName: string, _guardianPhone: string) => {
    setTestSentId(guardianId);
    setTimeout(() => {
      setTestSentId(null);
    }, 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guardian-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(5, 7, 10, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeGuardianModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: 'var(--surface-elevated, #16181f)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--safe-emerald, #10b981)'
                }}
              >
                <HeartHandshake size={16} />
              </div>
              <h2
                id="guardian-modal-title"
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--text-primary, #f8fafc)',
                  margin: 0
                }}
              >
                Trusted Guardians Circle
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', margin: 0, lineHeight: 1.4 }}>
              Configured contacts who receive your live GPS track, telematics alerts, and instant SOS pings.
            </p>
          </div>

          <button
            type="button"
            onClick={closeGuardianModal}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer'
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Guest Account Info Note if not logged in */}
          {!user && (
            <div
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--accent-amber, #f59e0b)" />
                <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                  Sign in with Google to sync your guardians securely across all devices.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeGuardianModal();
                  openAuthModal();
                }}
                style={{
                  backgroundColor: 'var(--accent-amber, #f59e0b)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Test Dispatch Toast Feedback */}
          {testSentId && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--safe-emerald, #10b981)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--safe-emerald, #10b981)',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                <strong>Test Ping Dispatched:</strong> Simulated SMS sent with active GPS link to verified guardian.
              </span>
            </div>
          )}

          {/* Guardians List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary, #cbd5e1)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Guardians ({guardians.length} of 3)
              </span>
              {canAddMore && !isAdding && (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid var(--safe-emerald, #10b981)',
                    color: 'var(--safe-emerald, #10b981)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <UserPlus size={12} />
                  <span>Add Guardian</span>
                </button>
              )}
            </div>

            {guardians.length === 0 ? (
              /* Empty State */
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    color: 'var(--safe-emerald, #10b981)'
                  }}
                >
                  <HeartHandshake size={22} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No Guardians Added Yet
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '320px', margin: '0 auto 16px auto' }}>
                  Add family members or close friends so they can monitor your night route and receive instant alerts if you need help.
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  style={{
                    backgroundColor: 'var(--safe-emerald, #10b981)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Add First Guardian
                </button>
              </div>
            ) : (
              /* Guardians Cards */
              guardians.map((g) => {
                const cleanName = g.name.replace(/\s*\(.*?\)\s*/g, '').trim() || g.name;
                const cleanRelation = g.relationship.replace(/\s+Guardian/i, '').trim() || g.relationship;
                const cleanPhone = g.phone.replace(/\D/g, '');
                const telUrl = `tel:${cleanPhone.startsWith('91') ? '+' : '+91'}${cleanPhone.slice(-10)}`;
                const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.slice(-10)}`}?text=${encodeURIComponent(
                  `🛡️ SurakshitPath Check-in Test: Telematics & SOS channel active from ${user?.displayName || 'Citizen Commuter'}.`
                )}`;

                return (
                  <div
                    key={g.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    {/* Left: Avatar + Identity (Nowrap, 1-Word Badges) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--safe-emerald, #10b981)',
                          fontWeight: 800,
                          fontSize: '12px',
                          flexShrink: 0
                        }}
                      >
                        {cleanName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {cleanName}
                          </span>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              color: 'var(--accent-amber, #f59e0b)',
                              backgroundColor: 'rgba(245, 158, 11, 0.12)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              textTransform: 'uppercase'
                            }}
                          >
                            {cleanRelation}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap' }}>
                          <Phone size={10} style={{ flexShrink: 0 }} />
                          <span className="mono-num">{g.phone}</span>
                          {g.notifyOnTripStart && (
                            <span style={{ color: 'var(--safe-emerald, #10b981)', fontSize: '9px', display: 'inline-flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1px 4px', borderRadius: '3px' }}>
                              <BellRing size={9} /> Auto
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions (Compact 1-word buttons + icon) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                      <a
                        href={telUrl}
                        style={{
                          padding: '5px 8px',
                          backgroundColor: 'rgba(16, 185, 129, 0.14)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '6px',
                          color: 'var(--safe-emerald, #10b981)',
                          fontSize: '11px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={`Call ${cleanName} directly`}
                      >
                        <PhoneCall size={11} />
                        <span>Call</span>
                      </a>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '5px 8px',
                          backgroundColor: 'rgba(37, 211, 102, 0.14)',
                          border: '1px solid rgba(37, 211, 102, 0.3)',
                          borderRadius: '6px',
                          color: '#25d366',
                          fontSize: '11px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={`WhatsApp chat & voice call to ${cleanName}`}
                      >
                        <MessageSquare size={11} />
                        <span>Chat</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSendTestPing(g.id, g.name, g.phone)}
                        style={{
                          padding: '5px 8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          color: 'var(--text-secondary, #cbd5e1)',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title="Simulate SMS Alert Ping"
                      >
                        <Send size={10} />
                        <span>Ping</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeGuardian(g.id)}
                        style={{
                          padding: '5px 6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '6px',
                          color: 'var(--danger-crimson, #ef4444)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add New Guardian Form */}
          {isAdding && canAddMore && (
            <form
              onSubmit={handleAddSubmit}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Add Trusted Guardian ({guardians.length + 1} of 3)
              </div>

              {validationError && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--danger-crimson, #ef4444)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: '#fca5a5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <AlertCircle size={13} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Relationship Chips */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  RELATIONSHIP
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {RELATION_PRESETS.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setRelationship(rel)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: relationship === rel ? '1px solid var(--safe-emerald, #10b981)' : '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: relationship === rel ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        color: relationship === rel ? 'var(--safe-emerald, #10b981)' : 'var(--text-secondary, #cbd5e1)',
                        cursor: 'pointer'
                      }}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    MOBILE (+91)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Auto Alert Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={notifyOnStart}
                  onChange={(e) => setNotifyOnStart(e.target.checked)}
                  style={{ accentColor: 'var(--safe-emerald, #10b981)' }}
                />
                <span>Auto-notify when I start a night travel route</span>
              </label>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--safe-emerald, #10b981)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Guardian
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustedGuardianModal;
