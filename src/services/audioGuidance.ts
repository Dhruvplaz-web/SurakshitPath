/**
 * Web Speech API Proactive Turn-by-Turn Safety Guidance
 * 
 * Provides voice prompts highlighting upcoming safe havens,
 * lighting transitions, and proactive anomaly check-ins.
 */

class AudioGuidanceService {
  private isEnabled: boolean = true;
  private synth: SpeechSynthesis | null = null;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public speakSafetyCue(text: string, force: boolean = false): void {
    if (!this.isEnabled || !this.synth) return;

    const now = Date.now();
    // Prevent duplicate spam within 8 seconds
    if (!force && this.lastSpokenText === text && now - this.lastSpokenTime < 8000) {
      return;
    }

    this.synth.cancel(); // Stop prior utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN'; // Indian English cadence if available

    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    this.synth.speak(utterance);
  }
}

export const audioGuidance = new AudioGuidanceService();
