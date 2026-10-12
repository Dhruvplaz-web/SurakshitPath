import React, { useState, useEffect } from 'react';
import { 
  bleHardwareBridge, 
  KavachTelemetry,
  KAVACH_SERVICE_UUID 
} from '../../services/bleHardwareBridge';
import { 
  BluetoothConnected, 
  BluetoothOff, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Battery, 
  Radio, 
  Zap, 
  Fingerprint, 
  CheckCircle2 
} from 'lucide-react';

interface Props {
  onTriggerSos: (reason: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SurakshitKavachCockpit: React.FC<Props> = ({
  onTriggerSos,
  isOpen,
  onClose
}) => {
  const [telemetry, setTelemetry] = useState<KavachTelemetry>(bleHardwareBridge.getTelemetry());
  const [isPairing, setIsPairing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Listen for hardware alert triggers
    const unsubscribe = bleHardwareBridge.addAlertListener((type, data) => {
      setTelemetry(bleHardwareBridge.getTelemetry());
      if (type === 'hostile_decoupling') {
        showToast('⚠️ HOSTILE DECOUPLING: Charm disconnected without user authorization!');
        onTriggerSos('Hostile Decoupling: Surakshit-Kavach charm forcibly separated from user');
      } else if (type === 'hardware_squeeze_sos') {
        showToast('🚨 HARDWARE SQUEEZE SOS: 3-second pressure trigger activated');
        onTriggerSos('Hardware Squeeze Panic: Concealed smart charm squeeze button pressed');
      } else if (type === 'dark_corridor_detected') {
        showToast(`🌙 Dark Corridor Alert: Ambient lighting dropped to ${data.lux} lux`);
      }
    });

    const interval = setInterval(() => {
      setTelemetry(bleHardwareBridge.getTelemetry());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [onTriggerSos]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleConnect = async () => {
    if (telemetry.isConnected) {
      bleHardwareBridge.disconnectCharm();
      setTelemetry(bleHardwareBridge.getTelemetry());
      showToast('Charm disconnected normally.');
    } else {
      setIsPairing(true);
      await bleHardwareBridge.connectCharm();
      setIsPairing(false);
      setTelemetry(bleHardwareBridge.getTelemetry());
      showToast('Surakshit-Kavach Smart Charm paired over encrypted BLE 5.3.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kavach-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Fingerprint size={20} color="var(--haven-blue)" />
            </div>
            <div>
              <h2 id="kavach-modal-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Surakshit-Kavach™ Hardware Cockpit</span>
                <span className="brand-badge" style={{ fontSize: '9px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--haven-blue)', borderColor: 'var(--haven-blue)' }}>
                  PATENT PENDING
                </span>
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                2.5cm × 1.5cm Smart Charm • BLE 5.3 Rolling Heartbeat Interlock
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-civic"
            style={{ padding: '6px 12px', fontSize: '11px', minHeight: '36px' }}
          >
            ✕ Close
          </button>
        </div>

        {/* Status Toast */}
        {toastMessage && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            borderBottom: '1px solid var(--accent-amber)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Zap size={13} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '78vh', overflowY: 'auto' }}>
          {/* Hardware Connection Card */}
          <div style={{
            backgroundColor: 'var(--surface-card)',
            border: `1px solid ${telemetry.isConnected ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: telemetry.isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {telemetry.isConnected ? <BluetoothConnected size={20} color="var(--safe-emerald)" /> : <BluetoothOff size={20} color="#f87171" />}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{telemetry.isConnected ? 'Kavach-01 Linked' : 'Charm Disconnected'}</span>
                  {telemetry.isConnected && <span style={{ fontSize: '10px', color: 'var(--safe-emerald)', fontWeight: 600 }}>• Active Sync</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  UUID: {KAVACH_SERVICE_UUID.slice(0, 18)}...
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleConnect}
              disabled={isPairing}
              className="btn-civic"
              style={{
                padding: '8px 14px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '8px',
                backgroundColor: telemetry.isConnected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: telemetry.isConnected ? '#f87171' : '#34d399',
                borderColor: telemetry.isConnected ? '#ef4444' : '#10b981',
                minHeight: '40px'
              }}
            >
              {isPairing ? 'Pairing...' : telemetry.isConnected ? 'Disconnect' : 'Pair Charm'}
            </button>
          </div>

          {/* Telemetry Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* Battery */}
            <div style={{
              backgroundColor: 'var(--surface-card)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Battery size={13} color="var(--safe-emerald)" />
                <span>BATTERY</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {telemetry.isConnected ? `${telemetry.batteryPercent}%` : '--'}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CR1632 Coin Cell</div>
            </div>

            {/* Signal RSSI */}
            <div style={{
              backgroundColor: 'var(--surface-card)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                <Radio size={13} color="var(--haven-blue)" />
                <span>SIGNAL (RSSI)</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {telemetry.isConnected ? `${telemetry.rssiDbm} dBm` : '--'}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--safe-emerald)' }}>Excellent Range</div>
            </div>

            {/* Ambient Lux */}
            <div style={{
              backgroundColor: 'var(--surface-card)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                {telemetry.ambientLux >= 15 ? <Sun size={13} color="var(--accent-amber)" /> : <Moon size={13} color="#818cf8" />}
                <span>LIGHT SENSOR</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: telemetry.ambientLux < 5 ? '#f87171' : 'var(--text-primary)' }}>
                {telemetry.isConnected ? `${telemetry.ambientLux} lux` : '--'}
              </div>
              <div style={{ fontSize: '9px', color: telemetry.ambientLux < 5 ? '#f87171' : 'var(--text-muted)' }}>
                {telemetry.ambientLux < 5 ? 'Dangerously Dark' : 'Adequately Lit'}
              </div>
            </div>
          </div>

          {/* Interactive Hardware Demonstration Controls */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="var(--accent-amber)" />
              <span>Interactive Hardware Attack &amp; Trigger Demonstrator</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* Trigger 1: Hostile Decoupling Snatch */}
              <button
                onClick={() => bleHardwareBridge.simulateHostileDecoupling()}
                className="btn-civic"
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '44px'
                }}
              >
                <ShieldAlert size={14} color="#ef4444" />
                <span>Simulate Snatch / Decoupling</span>
              </button>

              {/* Trigger 2: Concealed Hardware Squeeze */}
              <button
                onClick={() => bleHardwareBridge.simulateHardwareSqueezeSos()}
                className="btn-civic"
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  borderColor: 'rgba(245, 158, 11, 0.4)',
                  color: 'var(--accent-amber)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '44px'
                }}
              >
                <Fingerprint size={14} color="var(--accent-amber)" />
                <span>Simulate Pocket Squeeze SOS</span>
              </button>
            </div>

            {/* Lux slider simulation */}
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Simulate Ambient Illumination (Lux)</span>
                <span className="mono-num" style={{ fontWeight: 700, color: telemetry.ambientLux < 5 ? '#f87171' : 'var(--text-primary)' }}>
                  {telemetry.ambientLux} lux
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={telemetry.ambientLux}
                onChange={(e) => bleHardwareBridge.setAmbientLux(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: telemetry.ambientLux < 5 ? '#ef4444' : '#f59e0b', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Patent Novelty Claims Summary */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--surface-card)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '10.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="var(--safe-emerald)" />
              <span>Patent Novelty Specification: Claim 1 (Hostile-Decoupling Interlock)</span>
            </div>
            <div>
              The physical breakaway magnetic clasp maintains a closed circuit. Upon hostile separation exceeding 4.2N, the charm broadcasts a priority BLE distress packet while the paired smartphone initiates an unskippable countdown with last-known Kalman-smoothed GPS coordinates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
