function envFlag(name: string, fallback = false): boolean {
  const value = process.env[name];

  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

export const featureFlags = {
  aiEnabled: envFlag('EXPO_PUBLIC_AI_ENABLED', true),

  aiGrammarEnabled: envFlag(
    'EXPO_PUBLIC_AI_GRAMMAR_ENABLED',
    true
  ),

  aiPersonalizationEnabled: envFlag(
    'EXPO_PUBLIC_AI_PERSONALIZATION_ENABLED',
    false
  ),

  speechToTextEnabled: envFlag(
    'EXPO_PUBLIC_SPEECH_TO_TEXT_ENABLED',
    false
  ),

  pronunciationEnabled: envFlag(
    'EXPO_PUBLIC_PRONUNCIATION_ENABLED',
    false
  ),

  advancedTtsEnabled: envFlag(
    'EXPO_PUBLIC_ADVANCED_TTS_ENABLED',
    false
  ),
} as const;