/**
 * SurakshitPath - Emergency Fake Call Simulation Modal
 * 
 * Provides an authentic, simulated incoming call screen to help commuters
 * disengage from uncomfortable or potentially unsafe situations.
 * 
 * Complies with strict privacy standards:
 * - NO real phone calls placed
 * - NO contacts accessed
 * - NO microphone permission or audio recording
 * - Uses Web Audio API for synthetic ringtone
 * - Clearly indicates "SIMULATED CALL"
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Volume2,
  Mic,
  MicOff,
  User,
  ShieldCheck,
  X
} from 'lucide-react';
import { fakeCallAudio } from '../../services/fakeCallAudio';
import { useAuth } from '../../context/AuthContext';

export interface FakeCallerConfig {
  name: string;
  relation: string;
  phoneNumber?: string;
  avatarBg?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  callerConfig?: FakeCallerConfig;
  skipCountdown?: boolean;
}

type CallState = 'countdown' | 'ringing' | 'connected' | 'ended';

export const FakeCallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  callerConfig,
  skipCountdown = false
}) => {
  const { user } = useAuth();
  const primaryGuardian = user?.trustedGuardians?.[0];
  const activeCaller: FakeCallerConfig = callerConfig || {
    name: primaryGuardian?.name || 'Mom',
    relation: primaryGuardian?.relationship || 'Mother',
    phoneNumber: primaryGuardian?.phone || '+91 98220 12345',
    avatarBg: '#059669'
  };

  const [callState, setCallState] = useState<CallState>(skipCountdown ? 'ringing' : 'countdown');
  const [countdown, setCountdown] = useState<number>(3);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [callerReply, setCallerReply] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (!isOpen) {
      fakeCallAudio.stopRinging();
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      setDurationSeconds(0);
      setSelectedResponse(null);
      setCallerReply(null);
      return;
    }

    if (skipCountdown) {
      setCallState('ringing');
      fakeCallAudio.startRinging();
    } else {
      setCallState('countdown');
      setCountdown(3);
    }
  }, [isOpen, skipCountdown]);

  // Handle countdown stage
  useEffect(() => {
    if (callState !== 'countdown' || !isOpen) return;

    if (countdown <= 0) {
      setCallState('ringing');
      fakeCallAudio.startRinging();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callState, countdown, isOpen]);

  // Handle call timer when connected
  useEffect(() => {
    if (callState === 'connected') {
      fakeCallAudio.stopRinging();
      durationTimerRef.current = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    }

    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callState]);

  // Answer call handler
  const handleAnswer = () => {
    fakeCallAudio.stopRinging();
    setCallState('connected');
    setDurationSeconds(0);
    // Initial simulated greeting
    setTimeout(() => {
      setCallerReply("Hi! Where are you right now? Are you on your way home?");
    }, 1200);
  };

  // Decline/End call handler
  const handleEndCall = () => {
    fakeCallAudio.stopRinging();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  // Quick responses
  const quickResponses = [
    {
      label: "I'm almost home",
      text: "Yes, I'm almost home. Just crossing the main road now.",
      reply: "Good, stay on the well-lit street. I'm waiting for you."
    },
    {
      label: "I'm travelling now",
      text: "I'm travelling right now, taking the main illuminated route.",
      reply: "Okay, keep your phone in hand and stay on the call."
    },
    {
      label: "Please stay on call",
      text: "Please stay on the call with me until I reach the colony gate.",
      reply: "Of course! I am right here with you. Take your time."
    },
    {
      label: "I'll reach in 5 mins",
      text: "I'll be there in about 5 minutes, see you soon.",
      reply: "Alright, walking up to the door now. Drive safe."
    }
  ];

  const handleSelectResponse = (resp: typeof quickResponses[0]) => {
    setSelectedResponse(resp.text);
    setCallerReply("...");
    setTimeout(() => {
      setCallerReply(resp.reply);
    }, 1500);
  };

  // Format call duration MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      style={{
        zIndex: 5000,
        backgroundColor: 'rgba(5, 7, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      {/* Mobile-Style Phone Frame Container */}
      <div
        className="fake-call-container"
        style={{
          width: '100%',
          maxWidth: '380px',
          height: '620px',
          maxHeight: '92vh',
          backgroundColor: '#0a0d14',
          borderRadius: '36px',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(16, 185, 129, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          color: '#ffffff',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* Subtle Watermark: Clear Simulation Disclaimer */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '3px 12px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#a7f3d0',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ShieldCheck size={11} />
          <span>SIMULATED CALL</span>
        </div>

        {/* Close Button on top-right */}
        <button
          onClick={handleEndCall}
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            zIndex: 10
          }}
          title="Exit Fake Call"
        >
          <X size={15} />
        </button>

        {/* STAGE 1: COUNTDOWN */}
        {callState === 'countdown' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '2px dashed var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 900,
              color: 'var(--accent-amber)',
              marginBottom: '20px',
              animation: 'pulseGlow 1.2s infinite'
            }}>
              {countdown}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
              Preparing Incoming Call
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '260px', marginBottom: '28px' }}>
              Your simulated call from <strong>{activeCaller.name}</strong> will ring in {countdown} seconds.
            </p>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '280px' }}>
              <button
                onClick={onClose}
                className="btn-civic"
                style={{ flex: 1, padding: '10px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '12px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCallState('ringing');
                  fakeCallAudio.startRinging();
                }}
                className="btn-civic"
                style={{ flex: 1, padding: '10px', fontSize: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800 }}
              >
                Ring Now
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: INCOMING RINGING CALL */}
        {callState === 'ringing' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '50px 24px 40px',
            textAlign: 'center'
          }}>
            {/* Top Caller Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Pulsing Avatar */}
              <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '16px' }}>
                <div style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.25)',
                  animation: 'pulseRing 1.8s infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: '-20px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  animation: 'pulseRing 2.6s infinite'
                }} />
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  backgroundColor: activeCaller.avatarBg || '#059669',
                  border: '3px solid #34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(5, 150, 105, 0.45)',
                  position: 'relative'
                }}>
                  <User size={52} />
                </div>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {activeCaller.name}
              </h2>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
                {activeCaller.relation} · {activeCaller.phoneNumber || 'Mobile'}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                <span>Incoming Call...</span>
              </div>
            </div>

            {/* Bottom Actions: Decline (Red) & Answer (Green) */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 20px' }}>
              {/* Decline Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleEndCall}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#dc2626',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(220, 38, 38, 0.45)',
                    transition: 'transform 0.15s ease'
                  }}
                  title="Decline Call"
                >
                  <PhoneOff size={28} />
                </button>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fca5a5' }}>Decline</span>
              </div>

              {/* Answer Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleAnswer}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.55)',
                    animation: 'bounce 1.5s infinite',
                    transition: 'transform 0.15s ease'
                  }}
                  title="Answer Call"
                >
                  <Phone size={28} />
                </button>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#6ee7b7' }}>Answer</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: CONNECTED CALL CONVERSATION INTERFACE */}
        {callState === 'connected' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px 18px 28px',
            overflowY: 'auto'
          }}>
            {/* Top Active Caller Status & Timer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: activeCaller.avatarBg || '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
              }}>
                <User size={32} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>
                {activeCaller.name}
              </h2>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {formatDuration(durationSeconds)}
              </div>

              {/* Audio visualizer bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px', marginBottom: '8px' }}>
                {[6, 12, 18, 14, 8, 16, 20, 10, 14, 6].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '3px',
                      height: `${h}px`,
                      backgroundColor: '#10b981',
                      borderRadius: '2px',
                      opacity: 0.85,
                      animation: `pulseGlow ${0.6 + (i * 0.1)}s ease-in-out infinite alternate`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Conversation Log & Simulated Dialogue Display */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '12px 14px',
              margin: '12px 0',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              minHeight: '110px'
            }}>
              {callerReply && (
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(5, 150, 105, 0.25)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '8px 12px',
                  borderRadius: '12px 12px 12px 2px',
                  fontSize: '12px',
                  color: '#d1fae5',
                  maxWidth: '85%'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#6ee7b7', marginBottom: '2px' }}>
                    {activeCaller.name}
                  </div>
                  {callerReply}
                </div>
              )}

              {selectedResponse && (
                <div style={{
                  alignSelf: 'flex-end',
                  backgroundColor: 'rgba(59, 130, 246, 0.25)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  padding: '8px 12px',
                  borderRadius: '12px 12px 2px 12px',
                  fontSize: '12px',
                  color: '#dbeafe',
                  maxWidth: '85%',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#93c5fd', marginBottom: '2px' }}>
                    You (Spoken)
                  </div>
                  "{selectedResponse}"
                </div>
              )}

              {!selectedResponse && !callerReply && (
                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', padding: '16px 0' }}>
                  Tap a response below to speak aloud or guide your conversation
                </div>
              )}
            </div>

            {/* Quick Response Buttons */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.04em' }}>
                Quick Responses (Tap to Say):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '16px' }}>
                {quickResponses.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectResponse(item)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                  >
                    "{item.label}"
                  </button>
                ))}
              </div>
            </div>

            {/* Mid Call Utility Controls (Mute & Speaker) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: isMuted ? '#ffffff' : 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: isMuted ? '#000' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: isSpeaker ? '#34d399' : 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: isSpeaker ? '#064e3b' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isSpeaker ? "Speaker On" : "Speaker Off"}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* End Call Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleEndCall}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dc2626',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.45)',
                  transition: 'transform 0.15s ease'
                }}
                title="End Call"
              >
                <PhoneOff size={26} />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: CALL ENDED */}
        {callState === 'ended' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <PhoneOff size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
              Call Ended
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Call duration: {formatDuration(durationSeconds)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FakeCallModal;
