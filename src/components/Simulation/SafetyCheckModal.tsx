import React, { useEffect, useState } from 'react';
import { AnomalyCheckState, TelemetryState, RouteOption } from '../../types/routing';
import { dispatchEmergencyAlert, verifyDuressPin, MASTER_PIN, DURESS_PIN } from '../../engine/telemetryWatchdog';
import { AlertTriangle, Lock, PhoneCall, Check, ShieldAlert } from 'lucide-react';

interface Props {
  anomalyState: AnomalyCheckState;
  telemetry: TelemetryState;
  activeRoute: RouteOption;
  onDismiss: () => void;
  onSosDispatched: () => void;
  onTriggerFakeCall?: () => void;
  onOpenShareLocation?: () => void;
}

export const SafetyCheckModal: React.FC<Props> = ({
  anomalyState,
  telemetry,
  activeRoute,
  onDismiss,
  onSosDispatched,
  onTriggerFakeCall,
  onOpenShareLocation
}) => {
  const [countdown, setCountdown] = useState(anomalyState.countdownSeconds || 15);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isDispatched, setIsDispatched] = useState(anomalyState.sosDispatched);
  const [dispatchDetails, setDispatchDetails] = useState<string | null>(null);
  const [duressSimulatedSuccess, setDuressSimulatedSuccess] = useState(false);

  useEffect(() => {
    setCountdown(anomalyState.countdownSeconds || 15);
  }, [anomalyState.countdownSeconds]);

  // Play gentle web audio beep alert on modal open
  useEffect(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext unavailable or blocked by autoplay
    }
  }, []);

  // Countdown timer: triggers automated SOS if 0 reached
  useEffect(() => {
    if (isDispatched || !anomalyState.isOpen || duressSimulatedSuccess) return;

    if (countdown <= 0) {
      handleTriggerSos();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isDispatched, anomalyState.isOpen, duressSimulatedSuccess]);

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      setEnteredPin(prev => prev + num);
      setPinError(null);
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setPinError(null);
  };

  const handleClear = () => {
    setEnteredPin('');
    setPinError(null);
  };

  const handleVerifyPin = async () => {
    if (enteredPin.length < 4) {
      setPinError('Please enter a 4-digit security PIN');
      return;
    }

    const result = verifyDuressPin(enteredPin);

    if (result.status === 'master_dismiss') {
      onDismiss();
    } else if (result.status === 'duress_sos') {
      // DURESS PIN ACTIVATED: Visually simulate dismissal to deceive attacker, silently fire SOS!
      setDuressSimulatedSuccess(true);
      await dispatchEmergencyAlert(anomalyState, telemetry, activeRoute, true);
      onSosDispatched();
      setTimeout(() => {
        onDismiss();
      }, 1800);
    } else {
      setPinError('Incorrect PIN. Emergency watchdog timer running.');
      setEnteredPin('');
    }
  };

  const handleTriggerSos = async () => {
    setIsDispatched(true);
    const result = await dispatchEmergencyAlert(anomalyState, telemetry, activeRoute, false);
    setDispatchDetails(result.message);
    onSosDispatched();
  };

  if (!anomalyState.isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="safety-check-title">
      <div className="modal-dialog" style={{ maxWidth: '420px', padding: '20px 24px', textAlign: 'center' }}>
        
        {/* State A: Duress PIN Silent Success Decoy */}
        {duressSimulatedSuccess ? (
          <div style={{ padding: '24px 0', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: 'var(--safe-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <Check size={32} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Alarm Dismissed
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Safe commute resumed. Resuming navigation guidance.
            </p>
          </div>
        ) : !isDispatched ? (
          /* State B: High-Contrast Virtual Keypad Lockout */
          <>
            <div className="modal-pulsing-icon" style={{ margin: '0 auto 12px' }}>
              <AlertTriangle size={28} />
            </div>

            <h2 id="safety-check-title" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Watchdog Safety Check-In
            </h2>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              {anomalyState.reason === 'deviation'
                ? `Cross-track corridor deviation of ${telemetry.crossTrackDistanceMeters}m detected (>50m buffer).`
                : 'Motionless stall detected in isolated stretch (>3 mins).'}
            </p>

            {/* Quick Emergency Assist Choices */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'var(--surface-elevated)',
              borderRadius: '14px',
              border: '1.5px solid var(--border-medium)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                ⚠ Are you okay?
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                We detected an unexpected corridor stop/deviation. Select action:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="btn-civic"
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.18)',
                    border: '1px solid var(--safe-emerald)',
                    color: 'var(--safe-emerald)',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  title="Dismiss alert, I am fine"
                >
                  ✓ I'm Safe
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDismiss();
                    if (onTriggerFakeCall) onTriggerFakeCall();
                  }}
                  className="btn-civic"
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(245, 158, 11, 0.18)',
                    border: '1px solid var(--accent-amber)',
                    color: 'var(--accent-amber)',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  title="Simulate incoming call as decoy"
                >
                  📞 Fake Call
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDismiss();
                    if (onOpenShareLocation) onOpenShareLocation();
                  }}
                  className="btn-civic"
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.18)',
                    border: '1px solid var(--haven-blue)',
                    color: 'var(--haven-blue)',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  title="Share live GPS location with trusted contact"
                >
                  📍 Share Loc
                </button>
              </div>
            </div>

            {/* Anti-Coercion Security Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              marginBottom: '14px',
              fontSize: '10px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} color="var(--accent-amber)" />
                <span>Anti-Biometric Lockout Enforced</span>
              </div>
              <span className="mono-num" style={{ fontWeight: 800, color: countdown <= 5 ? 'var(--danger-crimson)' : 'var(--accent-amber)' }}>
                SOS in {countdown}s
              </span>
            </div>

            {/* 4-Digit PIN Indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '14px'
            }}>
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${isFilled ? 'var(--accent-amber)' : 'var(--border-medium)'}`,
                      backgroundColor: isFilled ? 'var(--accent-amber)' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  />
                );
              })}
            </div>

            {pinError && (
              <div style={{ fontSize: '11px', color: 'var(--danger-crimson)', fontWeight: 700, marginBottom: '10px' }}>
                {pinError}
              </div>
            )}

            {/* High-Contrast Non-Biometric Numeric Keypad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              maxWidth: '260px',
              margin: '0 auto 16px'
            }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => {
                const isAction = key === 'C' || key === '⌫';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'C') handleClear();
                      else if (key === '⌫') handleDelete();
                      else handleKeyPress(key);
                    }}
                    style={{
                      padding: '12px 0',
                      fontSize: isAction ? '12px' : '18px',
                      fontWeight: 700,
                      fontFamily: isAction ? 'inherit' : 'var(--font-mono, monospace)',
                      backgroundColor: isAction ? 'var(--surface-elevated)' : 'var(--surface-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: isAction ? 'var(--text-secondary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                      userSelect: 'none'
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-hover)';
                      e.currentTarget.style.transform = 'scale(0.96)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            {/* PIN Hint & Actions */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={handleVerifyPin}
                className="btn-civic btn-primary-amber"
                style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: 800 }}
              >
                Confirm PIN
              </button>

              <button
                type="button"
                onClick={handleTriggerSos}
                className="btn-civic"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  borderColor: 'var(--danger-crimson)',
                  color: 'var(--danger-crimson)',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontWeight: 800
                }}
              >
                <PhoneCall size={14} />
                <span>Instant 112</span>
              </button>
            </div>

            {/* Subtle Demo Master & Duress PIN Footnote */}
            <div style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
              backgroundColor: 'var(--surface-elevated)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)'
            }}>
              <strong>Safety Key:</strong> Master PIN: <span className="mono-num" style={{ color: 'var(--safe-emerald)' }}>{MASTER_PIN}</span> (I'm Safe) &middot; Duress: <span className="mono-num" style={{ color: 'var(--danger-crimson)' }}>{DURESS_PIN}</span> (Silent Coercion SOS)
            </div>
          </>
        ) : (
          /* State C: Emergency SOS Dispatched Confirmation */
          <div style={{ padding: '16px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: 'var(--danger-crimson)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px'
            }}>
              <ShieldAlert size={32} />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger-crimson)', marginBottom: '8px' }}>
              Emergency SOS Dispatched
            </h2>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {dispatchDetails || 'Encrypted telemetry packet dispatched to Dhruv (+91 96651 84535), trusted guardians, and Pune Police Control (112).'}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <a
                href="tel:+919665184535"
                className="btn-civic btn-primary-amber"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <PhoneCall size={14} />
                <span>Call Dhruv</span>
              </a>

              <a
                href="tel:112"
                className="btn-civic"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  backgroundColor: 'var(--danger-crimson)',
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <PhoneCall size={14} />
                <span>Call 112</span>
              </a>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              className="btn-civic"
              style={{ padding: '8px 16px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}
            >
              Dismiss Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
