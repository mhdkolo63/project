function envFlag(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

export const featureFlags = {
  aiEnabled: envFlag('EXPO_PUBLIC_AI_ENABLED'),
  aiGrammarEnabled: envFlag('EXPO_PUBLIC_AI_GRAMMAR_ENABLED'),
  aiPersonalizationEnabled: envFlag('EXPO_PUBLIC_AI_PERSONALIZATION_ENABLED'),
  speechToTextEnabled: envFlag('EXPO_PUBLIC_SPEECH_TO_TEXT_ENABLED'),
  pronunciationEnabled: envFlag('EXPO_PUBLIC_PRONUNCIATION_ENABLED'),
  advancedTtsEnabled: envFlag('EXPO_PUBLIC_ADVANCED_TTS_ENABLED'),
} as const;

export type FeatureFlag = keyof typeof featureFlags;
