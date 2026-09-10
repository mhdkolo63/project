declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_BASE_URL: string;
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_AI_ENABLED?: string;
      EXPO_PUBLIC_AI_GRAMMAR_ENABLED?: string;
      EXPO_PUBLIC_AI_PERSONALIZATION_ENABLED?: string;
      EXPO_PUBLIC_SPEECH_TO_TEXT_ENABLED?: string;
      EXPO_PUBLIC_PRONUNCIATION_ENABLED?: string;
      EXPO_PUBLIC_ADVANCED_TTS_ENABLED?: string;
    }
  }
}

export {};
