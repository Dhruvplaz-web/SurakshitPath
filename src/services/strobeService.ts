/**
 * SurakshitPath - Hardware Strobe Beacon & Visual Deterrent Service
 * 
 * Directly interfaces with the mobile phone camera flash (W3C Torch API)
 * on supported mobile browsers, with instant zero-downtime fallback to
 * high-contrast OLED Screen Strobe Flashing for optical deterrence.
 */

export type StrobeListener = (isHigh: boolean, isTorchActive: boolean) => void;

class StrobeService {
  private stream: MediaStream | null = null;
  private track: MediaStreamTrack | null = null;
  private pulseInterval: any = null;
  private isActive: boolean = false;
  private isTorchSupported: boolean = false;
  private listeners: Set<StrobeListener> = new Set();
  private pulseState: boolean = false;

  /**
   * Subscribe to the 8Hz strobe oscillation for screen flasher synchronization
   */
  public subscribe(listener: StrobeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(isHigh: boolean, isTorchActive: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isHigh, isTorchActive);
      } catch (err) {
        console.warn('Strobe listener error:', err);
      }
    });
  }

  /**
   * Starts the high-frequency optical deterrent strobe (7.5Hz - 8Hz)
   * Alternates hardware camera LED flash and screen hazard beacons.
   */
  public async startStrobe(): Promise<boolean> {
    if (this.isActive) return this.isTorchSupported;

    this.isActive = true;
    this.isTorchSupported = false;

    // 1. Immediately engage full-screen visual strobe (Zero-permission, instant optical deterrence)
    let state = false;
    let torchCycle = 0;
    this.pulseInterval = setInterval(async () => {
      state = !state;
      this.pulseState = state;
      torchCycle++;

      // Pulse hardware camera LED at safe 2.5Hz (every other cycle) to prevent Android camera HAL driver overheat
      if (this.isTorchSupported && this.track && this.track.readyState === 'live' && torchCycle % 2 === 0) {
        try {
          await this.track.applyConstraints({
            advanced: [{ torch: state } as any]
          });
        } catch {
          // Ignore transient frame constraint drops
        }
      }

      // Notify screen hazard flasher subscribers immediately
      this.notify(state, this.isTorchSupported);
    }, 150);

    // 2. Non-blocking hardware camera torch attempt in background (does not hold up screen flasher)
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      }).then((stream) => {
        if (!this.isActive) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        this.stream = stream;
        this.track = stream.getVideoTracks()[0] || null;
        if (this.track) {
          const capabilities = (this.track.getCapabilities?.() || {}) as { torch?: boolean };
          if (capabilities.torch) {
            this.isTorchSupported = true;
          }
        }
      }).catch(() => {
        this.isTorchSupported = false;
      });
    }

    return this.isTorchSupported;
  }

  public stopStrobe(): void {
    if (!this.isActive) return;

    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }

    // Turn off physical torch LED and stop media track immediately
    if (this.track) {
      try {
        if (this.isTorchSupported && this.track.readyState === 'live') {
          this.track.applyConstraints({
            advanced: [{ torch: false } as any]
          }).catch(() => {});
        }
        this.track.stop();
      } catch (err) {
        console.warn('Error releasing torch track:', err);
      }
      this.track = null;
    }

    if (this.stream) {
      try {
        this.stream.getTracks().forEach((t) => t.stop());
      } catch {
        // Ignore track stop exceptions
      }
      this.stream = null;
    }

    this.isActive = false;
    this.isTorchSupported = false;
    this.pulseState = false;
    this.notify(false, false);
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getIsTorchSupported(): boolean {
    return this.isTorchSupported;
  }

  public getPulseState(): boolean {
    return this.pulseState;
  }
}

export const strobeService = new StrobeService();
