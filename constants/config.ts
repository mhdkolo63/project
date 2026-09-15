export const AppConfig = {
  appName: 'EnglishMaster AI',
  tagline: 'Learn. Practice. Speak. Master English.',

  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || '',

  supabaseUrl: 'https://aiturrmfbkjdopsvhlmh.supabase.co',

  supabaseAnonKey:
    'sb_publishable_S03iLRuQK_mgYbYj62cOpQ_jWBGBY0g',

  levels: ['Beginner', 'Intermediate', 'Advanced'] as const,

  dailyGoalDefault: 3,

  xpPerLesson: 50,

  xpPerQuiz: 50,

  xpPerVocabLearned: 10,

  xpPerListening: 50,
};

export type EnglishLevel = (typeof AppConfig.levels)[number];
