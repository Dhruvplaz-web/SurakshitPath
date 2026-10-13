/**
 * SurakshitPath - Ride Shield Sidebar Card
 * 
 * Prominent route-selection safety assistance card:
 * - Displays quick journey parameters (pickup, dest, distance, time, safety score)
 * - Quick-action provider triggers for Uber / Ola
 * - Direct access to Ride Shield modal & monitoring status
 * - Compliant with safety transparency guidelines
 */

import React from 'react';
import { RouteOption, TelemetryState, AppLanguage } from '../../types/routing';
import { PuneLocation } from '../../services/geocodingService';
import { getTranslation } from '../../services/localizationService';
import { rideShieldService } from '../../services/rideShieldService';
import {
  ShieldCheck,
  ExternalLink,
  Radio,
  MapPin,
  ArrowRight
} from 'lucide-react';

interface Props {
  origin: PuneLocation;
  destination: PuneLocation;
  activeRoute: RouteOption;
  telemetry?: TelemetryState;
  onOpenRideShield: () => void;
  currentLanguage?: AppLanguage;
}

export const RideShieldCard: React.FC<Props> = ({
  origin,
  destination,
  activeRoute,
  onOpenRideShield,
  currentLanguage = 'en'
}) => {
  const t = getTranslation(currentLanguage);
  const activeSession = rideShieldService.getActiveSession();
  const isMonitoring = activeSession?.monitoring_enabled || false;
  const isDemo = rideShieldService.isDemo();

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-card, #16181f)',
        border: isMonitoring ? '1.5px solid var(--safe-emerald, #10b981)' : '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: isMonitoring ? '0 0 16px rgba(16, 185, 129, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: isMonitoring ? 'var(--safe-emerald, #10b981)' : 'var(--accent-amber, #f59e0b)'
        }}
      />

      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: isMonitoring ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isMonitoring ? 'var(--safe-emerald, #10b981)' : 'var(--accent-amber, #f59e0b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldCheck size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t.rideShield}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {t.rideShieldNeedCab}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isDemo && (
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#60a5fa',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                padding: '2px 5px',
                borderRadius: '4px'
              }}
            >
              Demo
            </span>
          )}
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: isMonitoring ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.12)',
              color: isMonitoring ? 'var(--safe-emerald)' : 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Radio size={10} className={isMonitoring ? 'animate-pulse' : ''} />
            <span>{isMonitoring ? 'Active' : 'Ready'}</span>
          </span>
        </div>
      </div>

      {/* Origin -> Destination Pill */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: '8px 10px',
          borderRadius: '8px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={12} color="var(--accent-amber)" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            From: <strong style={{ color: 'var(--text-primary)' }}>{origin.name}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={12} color="var(--safe-emerald)" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            To: <strong style={{ color: 'var(--text-primary)' }}>{destination.name}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '4px', marginTop: '2px', fontSize: '10px' }}>
          <span>Corridor: {activeRoute.name}</span>
          <span style={{ color: 'var(--safe-emerald)', fontWeight: 700 }}>{(activeRoute.distanceMeters / 1000).toFixed(1)} km · {activeRoute.durationMinutes} min</span>
        </div>
      </div>

      {/* Quick Provider Launch Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button
          type="button"
          onClick={onOpenRideShield}
          style={{
            padding: '7px 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          <span>🚗 Uber</span>
          <ExternalLink size={11} color="var(--text-muted)" />
        </button>

        <button
          type="button"
          onClick={onOpenRideShield}
          style={{
            padding: '7px 10px',
            backgroundColor: 'rgba(0, 209, 102, 0.08)',
            border: '1px solid rgba(0, 209, 102, 0.25)',
            borderRadius: '6px',
            color: '#00D166',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
        >
          <span>🚖 Ola</span>
          <ExternalLink size={11} />
        </button>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onOpenRideShield}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: isMonitoring ? 'var(--safe-emerald, #10b981)' : 'var(--accent-amber, #f59e0b)',
          color: isMonitoring ? '#ffffff' : '#000000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: isMonitoring ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(245, 158, 11, 0.25)'
        }}
      >
        <ShieldCheck size={14} />
        <span>{isMonitoring ? 'Open Active Ride Shield' : 'Configure Ride Shield'}</span>
        <ArrowRight size={12} />
      </button>

      {/* Disclaimer */}
      <div style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
        Driver verification & booking handled by external ride provider.
      </div>
    </div>
  );
};

export default RideShieldCard;
