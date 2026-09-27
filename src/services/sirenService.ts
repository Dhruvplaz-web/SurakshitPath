/**
 * SurakshitPath Web Audio Emergency Siren Service
 * 
 * Generates an authentic pulsating high-decibel acoustic deterrent
 * without requiring external sound files or network requests.
 */

class SirenService {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;

  public startSiren(): void {
    if (this.isPlaying) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);

      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      // Sweep frequency back and forth between 750Hz and 1250Hz every 400ms
      let high = false;
      this.intervalId = setInterval(() => {
        if (!this.oscillator || !this.audioCtx) return;
        const targetFreq = high ? 750 : 1250;
        this.oscillator.frequency.exponentialRampToValueAtTime(targetFreq, this.audioCtx.currentTime + 0.35);
        high = !high;
      }, 400);
    } catch (err) {
      console.warn('Could not initialize Web Audio siren:', err);
    }
  }

  public stopSiren(): void {
    if (!this.isPlaying) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (err) {
      console.warn('Error stopping siren:', err);
    }

    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const sirenService = new SirenService();
