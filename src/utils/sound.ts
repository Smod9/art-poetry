type AudioContextLike = AudioContext;

const AUDIO_LOOKUP = window.AudioContext || (window as typeof window & {
  webkitAudioContext?: typeof AudioContext;
}).webkitAudioContext;

class RetroMusicLoop {
  private context: AudioContextLike | null = null;
  private masterGain: GainNode | null = null;
  private schedulerId: number | null = null;
  private step = 0;
  private nextNoteTime = 0;
  private readonly masterVolume = 0.035;
  private readonly lookAhead = 0.12;
  private readonly scheduleEveryMs = 80;
  private readonly noteLength = 0.28;
  private readonly melody = [
    523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 698.46,
    493.88, 587.33, 659.25, 783.99, 698.46, 659.25, 587.33, 523.25,
    523.25, 587.33, 659.25, 523.25, 698.46, 783.99, 880, 783.99,
  ];
  private readonly bass = [
    130.81, 130.81, 146.83, 146.83, 174.61, 174.61, 146.83, 146.83,
    123.47, 123.47, 130.81, 130.81, 146.83, 146.83, 130.81, 130.81,
    110, 110, 123.47, 123.47, 146.83, 146.83, 164.81, 164.81,
  ];

  private ensureAudio() {
    if (!AUDIO_LOOKUP) {
      return false;
    }

    if (!this.context) {
      this.context = new AUDIO_LOOKUP();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.context.destination);
    }

    if (this.context.state === 'suspended') {
      void this.context.resume();
    }

    if (this.masterGain && this.context) {
      this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), this.context.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        this.masterVolume,
        this.context.currentTime + 0.08,
      );
    }

    return true;
  }

  start() {
    if (!this.ensureAudio()) {
      return;
    }

    const context = this.context;
    if (!context) {
      return;
    }

    if (this.schedulerId !== null) {
      return;
    }

    this.step = 0;
    this.nextNoteTime = context.currentTime + 0.02;
    this.schedulerId = window.setInterval(() => this.scheduleNotes(), this.scheduleEveryMs);
  }

  stop() {
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }

    if (this.masterGain && this.context) {
      this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
      this.masterGain.gain.setTargetAtTime(0.0001, this.context.currentTime, 0.04);
    }
  }

  private scheduleNotes() {
    if (!this.context || !this.masterGain) {
      return;
    }

    while (this.nextNoteTime < this.context.currentTime + this.lookAhead) {
      const melodyNote = this.melody[this.step % this.melody.length];
      const bassNote = this.bass[this.step % this.bass.length];
      const accent = this.step % 4 === 0;

      this.playVoice(melodyNote, this.nextNoteTime, this.noteLength, 'square', accent ? 0.028 : 0.02);
      this.playVoice(bassNote, this.nextNoteTime, this.noteLength * 0.9, 'triangle', 0.018);

      if (this.step % 2 === 1) {
        this.playVoice(melodyNote / 2, this.nextNoteTime + 0.02, 0.08, 'square', 0.01);
      }

      this.nextNoteTime += this.noteLength;
      this.step += 1;
    }
  }

  private playVoice(
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ) {
    if (!this.context || !this.masterGain) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(this.masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }

  playBootJingle() {
    if (!this.ensureAudio() || !this.context) {
      return;
    }

    const startAt = this.context.currentTime + 0.02;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((note, index) => {
      const time = startAt + index * 0.12;
      this.playVoice(note, time, 0.12, 'square', 0.018);
      if (index > 0) {
        this.playVoice(note / 2, time, 0.1, 'triangle', 0.01);
      }
    });
  }
}

const retroMusicLoop = new RetroMusicLoop();

export function startRetroMusicLoop() {
  retroMusicLoop.start();
}

export function stopRetroMusicLoop() {
  retroMusicLoop.stop();
}

export function playBootLoadingSound() {
  retroMusicLoop.playBootJingle();
}
