// ── AUDIO MANAGER ──────────────────────────────────────────────────────

export interface SoundEffect {
  name: string;
  volume: number;
  loop?: boolean;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private activeSources: Map<string, AudioBufferSourceNode[]> = new Map();

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Audio not supported:", error);
    }
  }

  async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }

  playSound(name: string, volume: number = 0.5, loop: boolean = false): void {
    if (!this.audioContext || !this.sounds.has(name)) return;

    const audioBuffer = this.sounds.get(name)!;
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    source.loop = loop;
    
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(0);

    // Track active sources for cleanup
    if (!this.activeSources.has(name)) {
      this.activeSources.set(name, []);
    }
    this.activeSources.get(name)!.push(source);

    source.onended = () => {
      const sources = this.activeSources.get(name);
      if (sources) {
        const index = sources.indexOf(source);
        if (index > -1) {
          sources.splice(index, 1);
        }
      }
    };
  }

  stopSound(name: string): void {
    const sources = this.activeSources.get(name);
    if (sources) {
      sources.forEach(source => {
        try {
          source.stop();
        } catch (error) {
          // Source might have already stopped
        }
      });
      this.activeSources.set(name, []);
    }
  }

  stopAllSounds(): void {
    this.activeSources.forEach((sources, name) => {
      this.stopSound(name);
    });
  }

  setMasterVolume(volume: number): void {
    if (this.audioContext) {
      // In a real implementation, you'd have a master gain node
      // For now, this is a placeholder
    }
  }

  // Generate simple beep sounds using Web Audio API
  generateBeepSound(frequency: number = 440, duration: number = 0.1): AudioBuffer {
    if (!this.audioContext) {
      throw new Error("AudioContext not initialized");
    }

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      channelData[i] = Math.sin(2 * Math.PI * frequency * t) * 
                       Math.exp(-t * 5); // Exponential decay
    }

    return buffer;
  }

  // Initialize with generated sounds
  initGeneratedSounds(): void {
    if (!this.audioContext) return;

    // Generate basic sound effects
    const sounds = [
      { name: 'shoot', freq: 800, duration: 0.05 },
      { name: 'hit', freq: 200, duration: 0.1 },
      { name: 'levelup', freq: 600, duration: 0.3 },
      { name: 'menu', freq: 440, duration: 0.1 },
      { name: 'error', freq: 150, duration: 0.2 },
    ];

    sounds.forEach(({ name, freq, duration }) => {
      try {
        const buffer = this.generateBeepSound(freq, duration);
        this.sounds.set(name, buffer);
      } catch (error) {
        console.warn(`Failed to generate sound ${name}:`, error);
      }
    });
  }
}

// Global audio manager instance
export const audioManager = new AudioManager();

// Initialize audio on first user interaction (required by browsers)
export function initAudioOnFirstInteraction(): void {
  const initAudio = () => {
    audioManager.initGeneratedSounds();
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };

  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);
}

// Convenience functions
export function playSound(name: string, volume?: number): void {
  audioManager.playSound(name, volume);
}

export function stopSound(name: string): void {
  audioManager.stopSound(name);
}

export function stopAllSounds(): void {
  audioManager.stopAllSounds();
}
