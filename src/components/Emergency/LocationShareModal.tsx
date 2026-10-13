/**
 * SurakshitPath - Location Sharing Opt-in Consent Modal
 * 
 * Enforces explicit consent before any GPS coordinate is shared.
 * Shows trusted contact, clear explanation, and provides [Cancel] and [Share Location].
 */

import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  X,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { locationShareService, LocationShareSession } from '../../services/locationShareService';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSharingStarted?: (session: LocationShareSession) => void;
}

export const LocationShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSharingStarted
}) => {
  const { user } = useAuth();
  const guardians = user?.trustedGuardians || [];

  const defaultContactName = guardians.length > 0 ? guardians[0].name : 'Mom';
  const defaultContactPhone = guardians.length > 0 ? guardians[0].phone : '+91 98220 12345';

  const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string }>({
    name: defaultContactName,
    phone: defaultContactPhone
  });

  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmShare = async () => {
    setIsStarting(true);
    setErrorMessage(null);

    try {
      const session = await locationShareService.startSharing(
        selectedContact.name,
        selectedContact.phone
      );
      if (onSharingStarted) {
        onSharingStarted(session);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not acquire GPS position. Please check browser permissions.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      style={{
        zIndex: 5000,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="modal-dialog"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--surface-card)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-medium)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          padding: '24px',
          color: 'var(--text-primary)',
          position: 'relative'
        }}
      >
        {/* Header with Close Button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid var(--haven-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--haven-blue)'
            }}>
              <MapPin size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Share Live Location?
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Consent-based trip sharing
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-civic"
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Informative Explanation Box */}
        <div style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '16px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5'
        }}>
          <p style={{ marginBottom: '8px' }}>
            Your real-time GPS location will be securely shared with your selected trusted contact for the duration of this trip.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--safe-emerald)', fontWeight: 600, fontSize: '11px' }}>
            <ShieldCheck size={14} />
            <span>Opt-in only · You can tap "Stop Sharing" at any second</span>
          </div>
        </div>

        {/* Select Trusted Contact */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Share With Trusted Contact:
          </label>

          {guardians.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {guardians.map((g) => (
                <div
                  key={g.id}
                  onClick={() => setSelectedContact({ name: g.name, phone: g.phone })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: selectedContact.name === g.name ? 'rgba(59, 130, 246, 0.15)' : 'var(--surface-elevated)',
                    border: `1.5px solid ${selectedContact.name === g.name ? 'var(--haven-blue)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {g.name} ({g.relationship})
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {g.phone}
                    </div>
                  </div>
                  {selectedContact.name === g.name && (
                    <CheckCircle size={18} color="var(--haven-blue)" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1.5px solid var(--haven-blue)'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Mom (Trusted Contact)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  +91 98220 12345
                </div>
              </div>
              <CheckCircle size={18} color="var(--haven-blue)" />
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--danger-crimson)',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '16px',
            color: '#fca5a5',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-civic"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmShare}
            disabled={isStarting}
            className="btn-civic"
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: '#059669',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)',
              cursor: isStarting ? 'not-allowed' : 'pointer'
            }}
          >
            {isStarting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Acquiring GPS...</span>
              </>
            ) : (
              <>
                <MapPin size={16} />
                <span>Share Location</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationShareModal;
