import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, EnglishLevel, UserProgress, QuizResult, SavedVocabWord, Achievement, StreakData, DailyPlan, ReadingCompletion, SpeakingCompletion, SpeakingWeakness } from '@/types';
import { storage } from '@/utils/storage';
import { AppConfig } from '@/constants/config';

interface AppContextValue {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  progress: UserProgress[];
  quizResults: QuizResult[];
  notificationPrefs: Record<string, boolean>;
  vocabulary: SavedVocabWord[];
  achievements: Achievement[];
  streakData: StreakData;
  dailyPlan: DailyPlan | null;
  login: (user: User) => void;
  logout: () => void;
  continueAsGuest: () => void;
  setEnglishLevel: (level: EnglishLevel) => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  updateLessonProgress: (progress: UserProgress) => void;
  addQuizResult: (result: QuizResult) => void;
  setOnboarded: (value: boolean) => void;
  setNotificationPref: (key: string, value: boolean) => void;
  saveVocabWord: (word: SavedVocabWord) => void;
  removeVocabWord: (wordId: string) => void;
  toggleVocabLearned: (wordId: string) => void;
  checkAchievements: () => void;
  updateStreakOnActivity: () => void;
  completeDailyPlanItem: (itemId: string) => void;
  resetDailyPlan: () => void;
  readingCompletions: ReadingCompletion[];
  completeReading: (completion: ReadingCompletion) => boolean;
  isReadingCompleted: (passageId: string) => boolean;
  speakingCompletions: SpeakingCompletion[];
  completeSpeaking: (completion: SpeakingCompletion) => boolean;
  isSpeakingCompleted: (practiceId: string) => boolean;
  getSpeakingWeaknesses: () => SpeakingWeakness[];
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
};

const DEFAULT_NOTIFICATION_PREFS: Record<string, boolean> = {
  dailyReminder: true,
  quizReminder: true,
  streakReminder: true,
  newLessons: false,
  general: true,
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', title: 'First Lesson', description: 'Complete your first lesson', icon: '🏅', unlocked: false },
  { id: 'ten_lessons', title: '10 Lessons Completed', description: 'Complete 10 lessons', icon: '📚', unlocked: false },
  { id: 'streak_7', title: '7-Day Streak', description: 'Maintain a 7-day streak', icon: '🔥', unlocked: false },
  { id: 'streak_30', title: '30-Day Streak', description: 'Maintain a 30-day streak', icon: '🔥', unlocked: false },
  { id: 'grammar_master', title: 'Grammar Master', description: 'Complete 5 quizzes with 80%+', icon: '🧠', unlocked: false },
  { id: 'conversation_starter', title: 'Conversation Starter', description: 'Send 10 messages to AI Tutor', icon: '💬', unlocked: false },
  { id: 'english_champion', title: 'English Champion', description: 'Reach 1000 XP', icon: '🏆', unlocked: false },
];

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function createDailyPlan(): DailyPlan {
  return {
    date: getTodayString(),
    items: [
      { id: 'vocab', label: 'Learn 5 Vocabulary Words', completed: false },
      { id: 'grammar_lesson', label: 'Complete 1 Grammar Lesson', completed: false },
      { id: 'conversation', label: 'Practice English Conversation', completed: false },
      { id: 'quiz', label: 'Complete Daily Quiz', completed: false },
    ],
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>(DEFAULT_NOTIFICATION_PREFS);
  const [vocabulary, setVocabulary] = useState<SavedVocabWord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [readingCompletions, setReadingCompletions] = useState<ReadingCompletion[]>([]);
  const [speakingCompletions, setSpeakingCompletions] = useState<SpeakingCompletion[]>([]);

  // Load persisted state on mount
  useEffect(() => {
    loadPersistedState();
  }, []);

  const loadPersistedState = async () => {
    const [savedUser, savedProgress, savedQuizResults, savedPrefs, savedVocab, savedAchievements, savedStreak, savedPlan, savedOnboarded, savedReadings, savedSpeaking] = await Promise.all([
      storage.get<User>(storage.KEYS.USER),
      storage.get<UserProgress[]>(storage.KEYS.PROGRESS),
      storage.get<QuizResult[]>(storage.KEYS.QUIZ_RESULTS),
      storage.get<Record<string, boolean>>(storage.KEYS.NOTIFICATION_PREFS),
      storage.get<SavedVocabWord[]>(storage.KEYS.VOCABULARY),
      storage.get<Achievement[]>(storage.KEYS.ACHIEVEMENTS),
      storage.get<StreakData>(storage.KEYS.STREAK_DATA),
      storage.get<DailyPlan>(storage.KEYS.DAILY_PLAN),
      storage.get<boolean>('@englishmaster_onboarded'),
      storage.get<ReadingCompletion[]>(storage.KEYS.READING_COMPLETIONS),
      storage.get<SpeakingCompletion[]>(storage.KEYS.SPEAKING_COMPLETIONS),
    ]);
    if (savedReadings) setReadingCompletions(savedReadings);
    if (savedSpeaking) setSpeakingCompletions(savedSpeaking);

    if (savedUser) setUser(savedUser);
    if (savedProgress) setProgress(savedProgress);
    if (savedQuizResults) setQuizResults(savedQuizResults);
    if (savedPrefs) setNotificationPrefs(savedPrefs);
    if (savedVocab) setVocabulary(savedVocab);
    if (savedAchievements) setAchievements(savedAchievements);
    if (savedStreak) setStreakData(savedStreak);
    if (savedOnboarded) setIsOnboarded(savedOnboarded);

    // Reset daily plan if it's a new day
    if (savedPlan && savedPlan.date === getTodayString()) {
      setDailyPlan(savedPlan);
    } else {
      const newPlan = createDailyPlan();
      setDailyPlan(newPlan);
      storage.set(storage.KEYS.DAILY_PLAN, newPlan);
    }

    setIsLoading(false);
  };

  // Persist user whenever it changes
  const persistUser = useCallback((u: User | null) => {
    if (u) {
      storage.set(storage.KEYS.USER, u);
    } else {
      storage.remove(storage.KEYS.USER);
    }
  }, []);

  const login = useCallback((u: User) => {
    const userWithStreak: User = {
      ...u,
      longestStreak: u.longestStreak ?? u.streak ?? 0,
    };
    setUser(userWithStreak);
    persistUser(userWithStreak);
    // Load any existing progress from storage (not mock data)
    storage.get<UserProgress[]>(storage.KEYS.PROGRESS).then((saved) => {
      if (saved) setProgress(saved);
    });
    storage.get<QuizResult[]>(storage.KEYS.QUIZ_RESULTS).then((saved) => {
      if (saved) setQuizResults(saved);
    });
  }, [persistUser]);

  const logout = useCallback(() => {
    setUser(null);
    setProgress([]);
    setQuizResults([]);
    setIsOnboarded(false);
    storage.remove(storage.KEYS.USER);
    storage.remove('@englishmaster_onboarded');
  }, []);

  const continueAsGuest = useCallback(() => {
    const guest: User = {
      id: 'guest-' + Date.now(),
      name: 'Guest',
      email: '',
      englishLevel: 'Beginner',
      xp: 0,
      streak: 0,
      longestStreak: 0,
      lessonsCompleted: 0,
      dailyGoal: AppConfig.dailyGoalDefault,
      createdAt: new Date().toISOString(),
      isGuest: true,
    };
    setUser(guest);
    persistUser(guest);
  }, [persistUser]);

  const setEnglishLevel = useCallback((level: EnglishLevel) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, englishLevel: level };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  const addXP = useCallback((amount: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, xp: prev.xp + amount };
      persistUser(updated);
      return updated;
    });
  }, [persistUser]);

  // Fixed: XP idempotency — only award XP and increment lessonsCompleted if lesson wasn't already completed
  const updateLessonProgress = useCallback((newProgress: UserProgress) => {
    setProgress((prev) => {
      const existing = prev.find((p) => p.lessonId === newProgress.lessonId);
      const wasCompleted = existing?.completed ?? false;
      const isNowCompleted = newProgress.completed;

      let updated: UserProgress[];
      if (existing) {
        updated = prev.map((p) =>
          p.lessonId === newProgress.lessonId ? newProgress : p
        );
      } else {
        updated = [...prev, newProgress];
      }
      storage.set(storage.KEYS.PROGRESS, updated);

      // Only award XP if transitioning from not-completed to completed
      if (isNowCompleted && !wasCompleted) {
        setUser((u) => {
          if (!u) return u;
          const updatedUser = {
            ...u,
            lessonsCompleted: u.lessonsCompleted + 1,
            xp: u.xp + AppConfig.xpPerLesson,
          };
          persistUser(updatedUser);
          return updatedUser;
        });
      }

      return updated;
    });
  }, [persistUser]);

  const addQuizResult = useCallback((result: QuizResult) => {
    setQuizResults((prev) => {
      const updated = [...prev, result];
      storage.set(storage.KEYS.QUIZ_RESULTS, updated);
      return updated;
    });
  }, []);

  const setOnboarded = useCallback((value: boolean) => {
    setIsOnboarded(value);
    storage.set('@englishmaster_onboarded', value);
  }, []);

  const setNotificationPref = useCallback((key: string, value: boolean) => {
    setNotificationPrefs((prev) => {
      const updated = { ...prev, [key]: value };
      storage.set(storage.KEYS.NOTIFICATION_PREFS, updated);
      return updated;
    });
  }, []);

  const saveVocabWord = useCallback((word: SavedVocabWord) => {
    setVocabulary((prev) => {
      if (prev.some((w) => w.id === word.id)) return prev;
      const updated = [...prev, word];
      storage.set(storage.KEYS.VOCABULARY, updated);
      return updated;
    });
  }, []);

  const removeVocabWord = useCallback((wordId: string) => {
    setVocabulary((prev) => {
      const updated = prev.filter((w) => w.id !== wordId);
      storage.set(storage.KEYS.VOCABULARY, updated);
      return updated;
    });
  }, []);

  const toggleVocabLearned = useCallback((wordId: string) => {
    setVocabulary((prev) => {
      const updated = prev.map((w) =>
        w.id === wordId ? { ...w, learned: !w.learned } : w
      );
      storage.set(storage.KEYS.VOCABULARY, updated);
      return updated;
    });
  }, []);

  const updateStreakOnActivity = useCallback(() => {
    const today = getTodayString();
    setStreakData((prev) => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let newCurrent: number;
      if (prev.lastActiveDate === yesterday) {
        newCurrent = prev.currentStreak + 1;
      } else if (prev.lastActiveDate === '') {
        newCurrent = 1;
      } else {
        newCurrent = 1;
      }
      const newLongest = Math.max(newCurrent, prev.longestStreak);
      const updated = {
        currentStreak: newCurrent,
        longestStreak: newLongest,
        lastActiveDate: today,
      };
      storage.set(storage.KEYS.STREAK_DATA, updated);

      // Also update user streak
      setUser((u) => {
        if (!u) return u;
        const updatedUser = { ...u, streak: newCurrent, longestStreak: newLongest };
        persistUser(updatedUser);
        return updatedUser;
      });

      return updated;
    });
  }, [persistUser]);

  const checkAchievements = useCallback(() => {
    setAchievements((prev) => {
      const u = user;
      if (!u) return prev;
      let updated = [...prev];
      let changed = false;

      const unlock = (id: string) => {
        const idx = updated.findIndex((a) => a.id === id);
        if (idx >= 0 && !updated[idx].unlocked) {
          updated[idx] = { ...updated[idx], unlocked: true, unlockedAt: new Date().toISOString() };
          changed = true;
        }
      };

      if (u.lessonsCompleted >= 1) unlock('first_lesson');
      if (u.lessonsCompleted >= 10) unlock('ten_lessons');
      if (u.streak >= 7) unlock('streak_7');
      if (u.streak >= 30) unlock('streak_30');
      if (u.xp >= 1000) unlock('english_champion');

      const highScoreQuizzes = quizResults.filter((r) => r.score / r.totalQuestions >= 0.8).length;
      if (highScoreQuizzes >= 5) unlock('grammar_master');

      if (changed) {
        storage.set(storage.KEYS.ACHIEVEMENTS, updated);
      }
      return changed ? updated : prev;
    });
  }, [user, quizResults]);

  const completeDailyPlanItem = useCallback((itemId: string) => {
    setDailyPlan((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId ? { ...item, completed: true } : item
        ),
      };
      storage.set(storage.KEYS.DAILY_PLAN, updated);
      return updated;
    });
  }, []);

  const resetDailyPlan = useCallback(() => {
    const newPlan = createDailyPlan();
    setDailyPlan(newPlan);
    storage.set(storage.KEYS.DAILY_PLAN, newPlan);
  }, []);

  const isReadingCompleted = useCallback((passageId: string): boolean => {
    return readingCompletions.some((r) => r.passageId === passageId && r.xpAwarded);
  }, [readingCompletions]);

  const completeReading = useCallback((completion: ReadingCompletion): boolean => {
    const existing = readingCompletions.find((r) => r.passageId === completion.passageId);
    if (existing?.xpAwarded) return false;

    const updated = [
      ...readingCompletions.filter((r) => r.passageId !== completion.passageId),
      { ...completion, xpAwarded: true },
    ];
    setReadingCompletions(updated);
    storage.set(storage.KEYS.READING_COMPLETIONS, updated);
    addXP(completion.xpAmount);
    return true;
  }, [addXP, readingCompletions]);

  const isSpeakingCompleted = useCallback((practiceId: string): boolean => {
    return speakingCompletions.some((s) => s.practiceId === practiceId && s.xpAwarded);
  }, [speakingCompletions]);

  const completeSpeaking = useCallback((completion: SpeakingCompletion): boolean => {
    const existing = speakingCompletions.find((s) => s.practiceId === completion.practiceId);
    if (existing?.xpAwarded) return false;

    const updated = [
      ...speakingCompletions.filter((s) => s.practiceId !== completion.practiceId),
      { ...completion, xpAwarded: true },
    ];
    setSpeakingCompletions(updated);
    storage.set(storage.KEYS.SPEAKING_COMPLETIONS, updated);
    addXP(completion.xpAmount);
    return true;
  }, [addXP, speakingCompletions]);

  const getSpeakingWeaknesses = useCallback((): SpeakingWeakness[] => {
    if (speakingCompletions.length === 0) return [];
    const areaScores: Record<string, number[]> = {
      Grammar: [],
      Vocabulary: [],
      Naturalness: [],
    };
    speakingCompletions.forEach((sc) => {
      sc.attempts.forEach((att) => {
        if (att.feedback) {
          areaScores.Grammar.push(att.feedback.grammar.score);
          areaScores.Vocabulary.push(att.feedback.vocabulary.score);
          areaScores.Naturalness.push(att.feedback.naturalness.score);
        }
      });
    });
    return Object.entries(areaScores)
      .filter(([, scores]) => scores.length > 0)
      .map(([area, scores]) => ({
        area,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        practiceCount: scores.length,
      }))
      .sort((a, b) => a.averageScore - b.averageScore);
  }, [speakingCompletions]);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        isOnboarded,
        progress,
        quizResults,
        notificationPrefs,
        vocabulary,
        achievements,
        streakData,
        dailyPlan,
        login,
        logout,
        continueAsGuest,
        setEnglishLevel,
        updateUser,
        addXP,
        updateLessonProgress,
        addQuizResult,
        setOnboarded,
        setNotificationPref,
        saveVocabWord,
        removeVocabWord,
        toggleVocabLearned,
        checkAchievements,
        updateStreakOnActivity,
        completeDailyPlanItem,
        resetDailyPlan,
        readingCompletions,
        completeReading,
        isReadingCompleted,
        speakingCompletions,
        completeSpeaking,
        isSpeakingCompleted,
        getSpeakingWeaknesses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
