export const AppConfig = {
  appName: 'EnglishMaster AI',
  tagline: 'Learn. Practice. Speak. Master English.',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || '',
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  levels: ['Beginner', 'Intermediate', 'Advanced'] as const,
  dailyGoalDefault: 3,
  xpPerLesson: 50,
  xpPerQuiz: 50,
};
