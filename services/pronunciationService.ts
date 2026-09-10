export interface PronunciationResult {
  overallScore: number;
  wordsNeedingImprovement: { word: string; score: number; feedback: string }[];
  phoneticAccuracy: number;
}

export type PronunciationProvider = {
  isAvailable(): boolean;
  analyze(audioBase64: string, referenceText: string, language: string): Promise<PronunciationResult>;
};

let activeProvider: PronunciationProvider | null = null;

export const pronunciationService = {
  setProvider(provider: PronunciationProvider) {
    activeProvider = provider;
  },

  isAvailable(): boolean {
    return activeProvider ? activeProvider.isAvailable() : false;
  },

  async analyze(audioBase64: string, referenceText: string, language: string): Promise<PronunciationResult> {
    if (activeProvider) {
      return activeProvider.analyze(audioBase64, referenceText, language);
    }
    throw new Error(
      'Pronunciation analysis is not configured. To enable it, implement a PronunciationProvider that calls a pronunciation scoring API (e.g., Azure Speech Pronunciation Assessment) and register it via pronunciationService.setProvider().'
    );
  },
};
