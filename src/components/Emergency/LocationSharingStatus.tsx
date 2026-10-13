/**
 * SurakshitPath - Live Location Sharing Status Card
 * 
 * Displayed when real-time GPS location sharing is active.
 * Shows trusted contact, accuracy, last update time, and 1-tap [Stop Sharing].
 */

import React, { useState, useEffect } from 'react';
import {
  StopCircle,
  Copy,
  Check,
  Crosshair,
  AlertTriangle
} from 'lucide-react';
import { locationShareService, LocationShareSession } from '../../services/locationShareService';

interface Props {
  onViewOnMap?: (coords: [number, number]) => void;
}

export const LocationSharingStatus: React.FC<Props> = ({ onViewOnMap }) => {
  const [session, setSession] = useState<LocationShareSession>(locationShareService.getSession());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = locationShareService.subscribe((s) => {
      setSession(s);
    });
    return () => unsubscribe();
  }, []);

  // Update "X seconds ago" ticker
  useEffect(() => {
    if (!session.isActive) return;

    const interval = setInterval(() => {
      if (session.lastUpdatedAt) {
        const diff = Math.max(0, Math.floor((Date.now() - session.lastUpdatedAt) / 1000));
        setSecondsAgo(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isActive, session.lastUpdatedAt]);

  if (!session.isActive) return null;

  const handleCopyLink = () => {
    if (session.shareUrl) {
      navigator.clipboard.writeText(session.shareUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    }
  };

  const handleStop = () => {
    locationShareService.stopSharing();
  };

  const isLowAccuracy = session.accuracyMeters !== null && session.accuracyMeters > 80;

  return (
    <div
      className="location-sharing-active-card"
      style={{
        backgroundColor: 'rgba(6, 78, 59, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid #10b981',
        borderRadius: '16px',
        padding: '14px 16px',
        color: '#ffffff',
        boxShadow: '0 8px 30px rgba(5, 150, 105, 0.35)',
        animation: 'slideDown 0.25s ease-out'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }} />
            <span style={{ position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(52, 211, 153, 0.4)', animation: 'pulse 1.5s infinite' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#d1fae5' }}>
            Live Location Sharing Active
          </span>
        </div>

        <button
          onClick={handleStop}
          className="btn-civic"
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            border: 'none',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="Stop sharing your location"
        >
          <StopCircle size={13} />
          <span>Stop</span>
        </button>
      </div>

      {/* Shared With Contact Info */}
      <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
        Shared with: <strong style={{ color: '#a7f3d0' }}>{session.trustedContactName}</strong>
      </div>

      {/* Telemetry Stats: Accuracy & Timestamp */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#a7f3d0', marginBottom: '10px' }}>
        <span>
          Accuracy: <strong>{session.accuracyMeters !== null ? `±${session.accuracyMeters} m` : 'Detecting...'}</strong>
        </span>
        <span>•</span>
        <span>
          Updated: <strong>{secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`}</strong>
        </span>
      </div>

      {/* Low Accuracy Warning */}
      {isLowAccuracy && (
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '8px',
          padding: '6px 8px',
          marginBottom: '10px',
          fontSize: '10px',
          color: '#fef08a',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertTriangle size={12} style={{ flexShrink: 0 }} />
          <span>GPS signal is fluctuating (urban canyon). Tracking continues with best available fix.</span>
        </div>
      )}

      {/* Action Buttons: View on Map & Copy Share Link */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {session.coordinates && onViewOnMap && (
          <button
            type="button"
            onClick={() => onViewOnMap(session.coordinates!)}
            className="btn-civic"
            style={{
              flex: 1,
              padding: '6px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            <Crosshair size={13} />
            <span>View on Map</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleCopyLink}
          className="btn-civic"
          style={{
            flex: 1,
            padding: '6px 10px',
            backgroundColor: isCopied ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            cursor: 'pointer'
          }}
          title="Copy demo session URL"
        >
          {isCopied ? <Check size={13} /> : <Copy size={13} />}
          <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};

export default LocationSharingStatus;
