/**
 * SurakshitPath - Fake Call Web Audio & Vibration Service
 * 
 * Synthesizes a realistic telephone ringtone using the Web Audio API.
 * - Zero external copyrighted audio assets required
 * - Completely offline-ready
 * - Stops immediately on answer or decline
 * - Gracefully handles browsers without audio/vibration support
 * - Never requests microphone or audio recording permissions
 */

class FakeCallAudioService {
  private audioCtx: AudioContext | null = null;
  private ringInterval: ReturnType<typeof setInterval> | null = null;
  private isRingingActive = false;

  private initAudio() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * Plays a single realistic 1.8-second telephone dual-tone burst (440Hz + 480Hz)
   */
  private playRingBurst() {
    if (!this.audioCtx || !this.isRingingActive) return;

    try {
      const now = this.audioCtx.currentTime;

      // Dual-frequency telephone ringing tone (standard 440 Hz + 480 Hz)
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, now);

      // Envelope: smooth ramp in, hold, ramp out (1.6s burst)
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      gainNode.gain.setValueAtTime(0.18, now + 1.5);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.65);
      osc2.stop(now + 1.65);
    } catch (err) {
      console.warn('Web Audio synthesis error:', err);
    }

    // Trigger subtle phone vibration where supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 200, 400, 1000]);
      } catch {
        // Ignore vibration errors
      }
    }
  }

  /**
   * Starts repeating incoming call ringtone and phone vibration
   */
  public startRinging() {
    this.stopRinging();
    this.isRingingActive = true;
    this.initAudio();

    // Play first burst immediately
    this.playRingBurst();

    // Repeat every 3 seconds (1.6s ring + 1.4s silence)
    this.ringInterval = setInterval(() => {
      if (this.isRingingActive) {
        this.playRingBurst();
      }
    }, 3000);
  }

  /**
   * Stops the ringtone and vibration immediately
   */
  public stopRinging() {
    this.isRingingActive = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch {
        // Ignore
      }
    }
  }
}

export const fakeCallAudio = new FakeCallAudioService();
