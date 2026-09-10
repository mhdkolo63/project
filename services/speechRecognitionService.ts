import { Platform } from 'react-native';

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
}

export interface SpeechRecognitionConfig {
  language: string;
  maxDurationMs: number;
}

export type SpeechRecognitionProvider = {
  isAvailable(): boolean;
  transcribe(audioBase64: string, config: SpeechRecognitionConfig): Promise<TranscriptionResult>;
};

const webSpeechProvider: SpeechRecognitionProvider = {
  isAvailable(): boolean {
    return (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  },

  async transcribe(_audioBase64: string, _config: SpeechRecognitionConfig): Promise<TranscriptionResult> {
    throw new Error('Web Speech API uses real-time recognition, not batch transcription. Use startRealtimeRecognition instead.');
  },
};

let activeProvider: SpeechRecognitionProvider | null = null;

export const speechRecognitionService = {
  setProvider(provider: SpeechRecognitionProvider) {
    activeProvider = provider;
  },

  isAvailable(): boolean {
    if (activeProvider) return activeProvider.isAvailable();
    return webSpeechProvider.isAvailable();
  },

  isRealtimeAvailable(): boolean {
    return (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  },

  async transcribe(audioBase64: string, config: SpeechRecognitionConfig): Promise<TranscriptionResult> {
    if (activeProvider) {
      return activeProvider.transcribe(audioBase64, config);
    }
    if (webSpeechProvider.isAvailable()) {
      return webSpeechProvider.transcribe(audioBase64, config);
    }
    throw new Error(
      'Speech-to-text is not configured. Set EXPO_PUBLIC_SPEECH_API_KEY in your environment and call speechRecognitionService.setProvider() with a provider that calls your speech-to-text API (e.g., Google Cloud Speech-to-Text, OpenAI Whisper, or Azure Speech).'
    );
  },

  createRealtimeRecognizer(language: string): RealtimeRecognizer | null {
    if (!this.isRealtimeAvailable()) return null;

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionType }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionType }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return null;

    const recognition = new SpeechRecognitionClass();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    return recognition as unknown as RealtimeRecognizer;
  },
};

export type SpeechRecognitionType = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

export type RealtimeRecognizer = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};
