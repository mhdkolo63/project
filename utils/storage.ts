import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@englishmaster_user',
  PROGRESS: '@englishmaster_progress',
  QUIZ_RESULTS: '@englishmaster_quiz_results',
  NOTIFICATION_PREFS: '@englishmaster_notification_prefs',
  THEME_MODE: '@englishmaster_theme_mode',
  VOCABULARY: '@englishmaster_vocabulary',
  ACHIEVEMENTS: '@englishmaster_achievements',
  STREAK_DATA: '@englishmaster_streak_data',
  DAILY_PLAN: '@englishmaster_daily_plan',
  PLACEMENT_RESULT: '@englishmaster_placement_result',
  READING_COMPLETIONS: '@englishmaster_reading_completions',
  SPEAKING_COMPLETIONS: '@englishmaster_speaking_completions',
  SPEAKING_HISTORY: '@englishmaster_speaking_history',
} as const;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage write failed — data works in-memory for this session
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch {
      // Ignore
    }
  },

  KEYS,
};
