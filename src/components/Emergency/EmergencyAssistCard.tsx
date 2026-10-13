/**
 * SurakshitPath - Emergency Assist Dashboard Card
 * 
 * Provides quick 1-tap access to:
 * 1. Fake Call simulation (discreet decoy call)
 * 2. Share My Location (consent-driven live GPS sharing)
 * 3. Trusted Contact configuration
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  StopCircle,
  Users,
  ChevronRight
} from 'lucide-react';
import { locationShareService, LocationShareSession } from '../../services/locationShareService';
import { LocationSharingStatus } from './LocationSharingStatus';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onTriggerFakeCall: () => void;
  onOpenShareLocationModal: () => void;
  onViewOnMap?: (coords: [number, number]) => void;
}

export const EmergencyAssistCard: React.FC<Props> = ({
  onTriggerFakeCall,
  onOpenShareLocationModal,
  onViewOnMap
}) => {
  const { user, openGuardianModal } = useAuth();
  const [session, setSession] = useState<LocationShareSession>(locationShareService.getSession());

  useEffect(() => {
    const unsubscribe = locationShareService.subscribe((s) => {
      setSession(s);
    });
    return () => unsubscribe();
  }, []);

  const guardians = user?.trustedGuardians || [];
  const primaryContact = guardians.length > 0 ? guardians[0].name : 'Mom';

  return (
    <div
      className="emergency-assist-card"
      style={{
        backgroundColor: 'var(--surface-card)',
        border: '1.5px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-amber)'
          }}>
            <ShieldAlert size={16} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Emergency Assist
          </span>
        </div>

        <span
          className="brand-badge"
          style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em' }}
        >
          Safety Tools
        </span>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
        Feeling uncomfortable or need assistance? Activate a discreet simulated call or share live GPS coordinates with your trusted contact.
      </p>

      {/* If Location Sharing is Active, show the dedicated status HUD */}
      {session.isActive ? (
        <div style={{ marginBottom: '12px' }}>
          <LocationSharingStatus onViewOnMap={onViewOnMap} />
        </div>
      ) : null}

      {/* Two Main Action Buttons: Fake Call & Share My Location */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
        {/* Fake Call Button */}
        <button
          type="button"
          onClick={onTriggerFakeCall}
          className="btn-civic"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1.5px solid var(--accent-amber)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.18)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)')}
          title="Simulate an incoming phone call from your trusted contact"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <PhoneCall size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(245,158,11,0.2)', color: 'var(--accent-amber)' }}>
              Decoy
            </span>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800 }}>Fake Call</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Simulate incoming ring</div>
          </div>
        </button>

        {/* Share Location Button */}
        <button
          type="button"
          onClick={session.isActive ? () => locationShareService.stopSharing() : onOpenShareLocationModal}
          className="btn-civic"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: '12px',
            backgroundColor: session.isActive ? 'rgba(220, 38, 38, 0.12)' : 'rgba(59, 130, 246, 0.1)',
            border: `1.5px solid ${session.isActive ? 'var(--danger-crimson)' : 'var(--haven-blue)'}`,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = session.isActive ? 'rgba(220, 38, 38, 0.2)' : 'rgba(59, 130, 246, 0.18)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = session.isActive ? 'rgba(220, 38, 38, 0.12)' : 'rgba(59, 130, 246, 0.1)')}
          title={session.isActive ? "Stop sharing live location" : "Share real-time GPS location with your trusted contact"}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {session.isActive ? <StopCircle size={18} color="var(--danger-crimson)" /> : <MapPin size={18} color="var(--haven-blue)" />}
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: session.isActive ? 'rgba(220,38,38,0.2)' : 'rgba(59,130,246,0.2)', color: session.isActive ? 'var(--danger-crimson)' : 'var(--haven-blue)' }}>
              {session.isActive ? 'Active' : 'Consent'}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800 }}>
              {session.isActive ? 'Stop Sharing' : 'Share Location'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {session.isActive ? 'Turn off GPS link' : 'Send to contact'}
            </div>
          </div>
        </button>
      </div>

      {/* Trusted Contact Footer Bar */}
      <button
        type="button"
        onClick={openGuardianModal}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '10px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left'
        }}
        title="Manage your trusted contacts"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={13} color="var(--text-muted)" />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Trusted Contact: <strong style={{ color: 'var(--text-primary)' }}>{primaryContact}</strong>
          </span>
        </div>
        <ChevronRight size={13} color="var(--text-muted)" />
      </button>
    </div>
  );
};

export default EmergencyAssistCard;
