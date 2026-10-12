import React, { useEffect, useState } from 'react';
import { AnomalyCheckState, TelemetryState, RouteOption } from '../../types/routing';
import { dispatchEmergencyAlert } from '../../engine/telemetryWatchdog';
import { AlertTriangle, ShieldCheck, PhoneCall, Check } from 'lucide-react';

interface Props {
  anomalyState: AnomalyCheckState;
  telemetry: TelemetryState;
  activeRoute: RouteOption;
  onDismiss: () => void;
  onSosDispatched: () => void;
}

export const SafetyCheckModal: React.FC<Props> = ({
  anomalyState,
  telemetry,
  activeRoute,
  onDismiss,
  onSosDispatched
}) => {
  const [countdown, setCountdown] = useState(anomalyState.countdownSeconds || 45);
  const [isDispatched, setIsDispatched] = useState(anomalyState.sosDispatched);
  const [dispatchDetails, setDispatchDetails] = useState<string | null>(null);

  // Play gentle web audio beep alert on modal open
  useEffect(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (isDispatched || !anomalyState.isOpen) return;

    if (countdown <= 0) {
      handleTriggerSos();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isDispatched, anomalyState.isOpen]);

  // Handle escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDispatched) {
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDispatched, onDismiss]);

  const handleTriggerSos = async () => {
    setIsDispatched(true);
    const result = await dispatchEmergencyAlert(anomalyState, telemetry, activeRoute);
    setDispatchDetails(result.message);
    onSosDispatched();
  };

  if (!anomalyState.isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="safety-check-title">
      <div className="modal-dialog">
        {!isDispatched ? (
          <>
            <div className="modal-pulsing-icon">
              <AlertTriangle size={32} />
            </div>

            <h2 id="safety-check-title" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Are You Safe?
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {anomalyState.reason === 'deviation'
                ? `Telemetry Watchdog detected that you strayed ${telemetry.crossTrackDistanceMeters}m off your planned safe corridor into an unmonitored lane.`
                : 'Telemetry Watchdog detected an unexpected prolonged stop along an isolated road stretch.'}
            </p>

            <div style={{
              backgroundColor: 'var(--surface-elevated)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Automated SOS Dispatch in
              </div>
              <div className="countdown-timer-circle">
                {countdown}s
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                If not acknowledged, an automated n8n webhook will dispatch your live coordinates to Pune Police (112) and your Trusted Contacts.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onDismiss}
                className="btn-civic"
                style={{ flex: 1, padding: '10px 16px', fontSize: '13px', backgroundColor: 'var(--surface-hover)' }}
              >
                <Check size={16} /> I Am Safe (Dismiss)
              </button>

              <button
                onClick={handleTriggerSos}
                className="btn-civic btn-danger-crimson"
                style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
              >
                <PhoneCall size={16} /> Trigger SOS Now
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--safe-emerald)'
            }}>
              <ShieldCheck size={36} />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--safe-emerald)', marginBottom: '8px' }}>
              Emergency SOS Dispatched
            </h2>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {dispatchDetails || 'Your live GPS coordinates have been broadcast to your Trusted Contacts via WhatsApp & SMS, and forwarded to the nearest Pune Police Control unit.'}
            </p>

            <div style={{
              textAlign: 'left',
              fontSize: '11px',
              backgroundColor: 'var(--surface-elevated)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
              color: 'var(--text-secondary)'
            }}>
              <div><strong>Recipient 1:</strong> +91 98230 XXXXX (Family) · Delivered</div>
              <div><strong>Recipient 2:</strong> +91 98900 XXXXX (Guardian) · Delivered</div>
              <div><strong>Emergency Unit:</strong> Wakad Police Station (020-27278100) notified</div>
              <div style={{ marginTop: '6px', color: 'var(--haven-blue)' }}>
                GPS: {telemetry.currentPosition[0].toFixed(5)}, {telemetry.currentPosition[1].toFixed(5)}
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="btn-civic btn-primary-amber"
              style={{ width: '100%', padding: '10px' }}
            >
              Close & Continue Trip
            </button>
          </>
        )}
      </div>
    </div>
  );
};
