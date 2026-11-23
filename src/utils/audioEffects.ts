/**
 * Web Audio API synthesizer for celebratory chimes and fanfares.
 * Clean, lightweight, and requires no external audio downloads.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playHappyBirthdayNotes() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // First few cheerful notes of "Happy Birthday" (G4, G4, A4, G4, C5, B4)
      const notes = [
        { freq: 392.0, duration: 0.25, time: 0 },
        { freq: 392.0, duration: 0.25, time: 0.3 },
        { freq: 440.0, duration: 0.45, time: 0.6 },
        { freq: 392.0, duration: 0.45, time: 1.1 },
        { freq: 523.25, duration: 0.45, time: 1.6 },
        { freq: 493.88, duration: 0.8, time: 2.1 },
      ];

      notes.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, this.ctx!.currentTime + note.time);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime + note.time);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx!.currentTime + note.time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + note.time + note.duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + note.time);
        osc.stop(this.ctx!.currentTime + note.time + note.duration + 0.1);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  public playSuccessChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.3); // G5

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Ignore audio failure
    }
  }

  public playErrorBuzz() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundManager();
