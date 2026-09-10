import { Platform } from 'react-native';

type SpeakOptions = {
  language?: string;
  pitch?: number;
  rate?: number;
};

type SpeakState = {
  speaking: boolean;
};

let listeners: Array<(state: SpeakState) => void> = [];
let currentState: SpeakState = { speaking: false };

function notify() {
  listeners.forEach((l) => l(currentState));
}

export const ttsService = {
  isAvailable(): boolean {
    return Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  speak(text: string, options?: SpeakOptions) {
    if (!this.isAvailable()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (options?.language) utterance.lang = options.language;
    if (options?.pitch) utterance.pitch = options.pitch;
    if (options?.rate) utterance.rate = options.rate;

    utterance.onstart = () => {
      currentState = { speaking: true };
      notify();
    };
    utterance.onend = () => {
      currentState = { speaking: false };
      notify();
    };
    utterance.onerror = () => {
      currentState = { speaking: false };
      notify();
    };

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if (!this.isAvailable()) return;
    window.speechSynthesis.cancel();
    currentState = { speaking: false };
    notify();
  },

  subscribe(listener: (state: SpeakState) => void): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getState(): SpeakState {
    return currentState;
  },
};
