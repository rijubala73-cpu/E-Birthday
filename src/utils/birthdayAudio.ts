/**
 * Web Audio API synthesizer for the "Happy Birthday" melody.
 * Plays sweet music box chimes without external audio dependencies.
 */

class BirthdayAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  private notes: { note: string; freq: number; duration: number }[] = [
    // "Happy Birthday to you"
    { note: "G4", freq: 392.0, duration: 0.35 },
    { note: "G4", freq: 392.0, duration: 0.15 },
    { note: "A4", freq: 440.0, duration: 0.5 },
    { note: "G4", freq: 392.0, duration: 0.5 },
    { note: "C5", freq: 523.25, duration: 0.5 },
    { note: "B4", freq: 493.88, duration: 1.0 },

    // "Happy Birthday to you"
    { note: "G4", freq: 392.0, duration: 0.35 },
    { note: "G4", freq: 392.0, duration: 0.15 },
    { note: "A4", freq: 440.0, duration: 0.5 },
    { note: "G4", freq: 392.0, duration: 0.5 },
    { note: "D5", freq: 587.33, duration: 0.5 },
    { note: "C5", freq: 523.25, duration: 1.0 },

    // "Happy Birthday dear Mehwish"
    { note: "G4", freq: 392.0, duration: 0.35 },
    { note: "G4", freq: 392.0, duration: 0.15 },
    { note: "G5", freq: 783.99, duration: 0.5 },
    { note: "E5", freq: 659.25, duration: 0.5 },
    { note: "C5", freq: 523.25, duration: 0.5 },
    { note: "B4", freq: 493.88, duration: 0.5 },
    { note: "A4", freq: 440.0, duration: 0.8 },

    // "Happy Birthday to you!"
    { note: "F5", freq: 698.46, duration: 0.35 },
    { note: "F5", freq: 698.46, duration: 0.15 },
    { note: "E5", freq: 659.25, duration: 0.5 },
    { note: "C5", freq: 523.25, duration: 0.5 },
    { note: "D5", freq: 587.33, duration: 0.5 },
    { note: "C5", freq: 523.25, duration: 1.2 },
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playChime(freq: number, duration = 0.4, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Chime bell envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Ignore audio policy errors
    }
  }

  public playPop() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  public toggleMelody(onStateChange?: (playing: boolean) => void) {
    if (this.isPlaying) {
      this.stopMelody();
      onStateChange?.(false);
      return false;
    } else {
      this.startMelody(onStateChange);
      onStateChange?.(true);
      return true;
    }
  }

  public startMelody(onStateChange?: (playing: boolean) => void) {
    this.initCtx();
    this.isPlaying = true;
    let step = 0;

    const playNext = () => {
      if (!this.isPlaying) return;
      if (step >= this.notes.length) {
        step = 0; // Loop or pause briefly
        this.timer = window.setTimeout(playNext, 1200);
        return;
      }

      const note = this.notes[step];
      // Music box sound has a soft fundamental + harmonic
      this.playChime(note.freq, note.duration + 0.3, 'sine');
      this.playChime(note.freq * 2, note.duration * 0.6, 'triangle');

      step++;
      this.timer = window.setTimeout(playNext, note.duration * 1000 * 1.05);
    };

    playNext();
  }

  public stopMelody() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const birthdayAudio = new BirthdayAudioPlayer();
