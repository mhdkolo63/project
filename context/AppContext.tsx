import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  User,
  EnglishLevel,
  UserProgress,
  QuizResult,
  SavedVocabWord,
  Achievement,
  StreakData,
  DailyPlan,
  ReadingCompletion,
  SpeakingCompletion,
  SpeakingWeakness,
  DailyChallengeCompletion,
  ListeningCompletion,
} from '@/types';

import { supabase } from '@/services/supabase';
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

  dailyChallengeCompletion: DailyChallengeCompletion | null;
  completeDailyChallenge: (activitiesCompleted: number, xpAwarded: number) => boolean;
  isDailyChallengeCompleted: () => boolean;

  listeningCompletions: ListeningCompletion[];
  completeListening: (completion: ListeningCompletion) => boolean;
  isListeningCompleted: (exerciseId: string) => boolean;
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
  {
    id: 'first_lesson',
    title: 'First Lesson',
    description: 'Complete your first lesson',
    icon: '🏅',
    unlocked: false,
  },
  {
    id: 'ten_lessons',
    title: '10 Lessons Completed',
    description: 'Complete 10 lessons',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'streak_30',
    title: '30-Day Streak',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'grammar_master',
    title: 'Grammar Master',
    description: 'Complete 5 quizzes with 80%+',
    icon: '🧠',
    unlocked: false,
  },
  {
    id: 'conversation_starter',
    title: 'Conversation Starter',
    description: 'Send 10 messages to AI Tutor',
    icon: '💬',
    unlocked: false,
  },
  {
    id: 'english_champion',
    title: 'English Champion',
    description: 'Reach 1000 XP',
    icon: '🏆',
    unlocked: false,
  },
];

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function createDailyPlan(): DailyPlan {
  return {
    date: getTodayString(),
    items: [
      {
        id: 'vocab',
        label: 'Learn 5 Vocabulary Words',
        completed: false,
      },
      {
        id: 'grammar_lesson',
        label: 'Complete 1 Grammar Lesson',
        completed: false,
      },
      {
        id: 'conversation',
        label: 'Practice English Conversation',
        completed: false,
      },
      {
        id: 'quiz',
        label: 'Complete Daily Quiz',
        completed: false,
      },
    ],
  };
}

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [notificationPrefs, setNotificationPrefs] =
    useState<Record<string, boolean>>(DEFAULT_NOTIFICATION_PREFS);

  const [vocabulary, setVocabulary] = useState<SavedVocabWord[]>([]);
  const [achievements, setAchievements] =
    useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  const [streakData, setStreakData] =
    useState<StreakData>(DEFAULT_STREAK);

  const [dailyPlan, setDailyPlan] =
    useState<DailyPlan | null>(null);

  const [readingCompletions, setReadingCompletions] =
    useState<ReadingCompletion[]>([]);

  const [speakingCompletions, setSpeakingCompletions] =
    useState<SpeakingCompletion[]>([]);

  const [dailyChallengeCompletion, setDailyChallengeCompletion] =
    useState<DailyChallengeCompletion | null>(null);

  const [listeningCompletions, setListeningCompletions] =
    useState<ListeningCompletion[]>([]);

  const loadCloudData = useCallback(async (userId: string) => {
    try {
      const [
        profileResponse,
        progressResponse,
        quizResponse,
        vocabResponse,
        achievementResponse,
        streakResponse,
        dailyPlanResponse,
        notificationResponse,
        readingResponse,
        speakingResponse,
        dailyChallengeResponse,
        listeningResponse,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),

        supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId),

        supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false }),

        supabase
          .from('saved_vocabulary')
          .select('*')
          .eq('user_id', userId),

        supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId),

        supabase
          .from('streak_data')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),

        supabase
          .from('daily_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('plan_date', getTodayString())
          .maybeSingle(),

        supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),

        supabase
          .from('reading_completions')
          .select('*')
          .eq('user_id', userId),

        supabase
          .from('speaking_completions')
          .select('*')
          .eq('user_id', userId),

        supabase
          .from('daily_challenge_completions')
          .select('*')
          .eq('user_id', userId)
          .eq('challenge_date', getTodayString())
          .maybeSingle(),

        supabase
          .from('listening_completions')
          .select('*')
          .eq('user_id', userId),
      ]);

      if (profileResponse.data) {
        const p = profileResponse.data;

        setUser({
          id: p.id,
          name: p.name || 'User',
          email: p.email || '',
          englishLevel: p.english_level || 'Beginner',
          xp: p.xp || 0,
          streak: p.streak || 0,
          longestStreak: p.longest_streak || 0,
          lessonsCompleted: p.lessons_completed || 0,
          dailyGoal: p.daily_goal || AppConfig.dailyGoalDefault,
          createdAt: p.created_at || new Date().toISOString(),
          isGuest: false,
        });
      }

      if (progressResponse.data) {
        setProgress(
          progressResponse.data.map((p) => ({
            userId: p.user_id,
            lessonId: p.lesson_id,
            completionPercentage: p.completion_percentage || 0,
            score: p.score || 0,
            completed: p.completed || false,
            lastAccessedAt:
              p.last_accessed_at || new Date().toISOString(),
          }))
        );
      }

      if (quizResponse.data) {
        setQuizResults(
          quizResponse.data.map((q) => ({
            userId: q.user_id,
            quizId: q.quiz_id,
            score: q.score || 0,
            totalQuestions: q.total_questions || 0,
            completedAt:
              q.completed_at || new Date().toISOString(),
          }))
        );
      }

      if (vocabResponse.data) {
        setVocabulary(
         vocabResponse.data.map((v) => ({
  id: v.id || v.word,
  word: v.word,
  meaning: v.meaning || v.definition || '',
  definition: v.definition || v.meaning || '',
  example: v.example || '',
  partOfSpeech: v.part_of_speech || 'word',
  level: v.level || 'Beginner',
  pronunciation: v.pronunciation || '',
  learned: v.learned ?? false,
  savedAt: v.saved_at || new Date().toISOString(),
}))
        );
      }

      if (achievementResponse.data?.length) {
        setAchievements(
          achievementResponse.data.map((a) => ({
            id: a.achievement_id || a.id,
            title: a.title || '',
            description: a.description || '',
            icon: a.icon || '🏅',
            unlocked: a.unlocked || false,
            unlockedAt: a.unlocked_at || undefined,
          }))
        );
      }

      if (streakResponse.data) {
        const s = streakResponse.data;

        setStreakData({
          currentStreak: s.current_streak || 0,
          longestStreak: s.longest_streak || 0,
          lastActiveDate: s.last_active_date || '',
        });
      }

      if (dailyPlanResponse.data) {
        const d = dailyPlanResponse.data;
        setDailyPlan(d.plan || d.items || createDailyPlan());
      } else {
        setDailyPlan(createDailyPlan());
      }

      if (notificationResponse.data?.preferences) {
        setNotificationPrefs({
          ...DEFAULT_NOTIFICATION_PREFS,
          ...notificationResponse.data.preferences,
        });
      }

      if (readingResponse.data) {
        setReadingCompletions(
          readingResponse.data.map((r) => ({
            userId: r.user_id,
            passageId: r.passage_id,
            score: r.score || 0,
            completedAt:
              r.completed_at || new Date().toISOString(),
          }))
        );
      }

      if (speakingResponse.data) {
        setSpeakingCompletions(
          speakingResponse.data.map((s) => ({
            userId: s.user_id,
            practiceId: s.practice_id,
            pronunciationScore: s.pronunciation_score || 0,
            grammarScore: s.grammar_score || 0,
            vocabularyScore: s.vocabulary_score || 0,
            naturalnessScore: s.naturalness_score || 0,
            completedAt:
              s.completed_at || new Date().toISOString(),
          }))
        );
      }

      if (dailyChallengeResponse.data) {
        const dc = dailyChallengeResponse.data;
        setDailyChallengeCompletion({
          userId: dc.user_id,
          challengeDate: dc.challenge_date,
          activitiesCompleted: dc.activities_completed || 0,
          totalActivities: 3,
          xpAwarded: dc.xp_awarded || 0,
          completed: (dc.activities_completed || 0) >= 3,
          completedAt: dc.completed_at || new Date().toISOString(),
        });
      } else {
        setDailyChallengeCompletion(null);
      }

      if (listeningResponse.data) {
        setListeningCompletions(
          listeningResponse.data.map((l) => ({
            userId: l.user_id,
            exerciseId: l.exercise_id,
            score: l.score || 0,
            totalQuestions: l.total_questions || 0,
            completedAt: l.completed_at || new Date().toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load cloud data:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (!mounted) return;

        if (data.user) {
          await loadCloudData(data.user.id);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null);
        setProgress([]);
        setQuizResults([]);
        setVocabulary([]);
        setAchievements(DEFAULT_ACHIEVEMENTS);
        setStreakData(DEFAULT_STREAK);
        setDailyPlan(null);
        setReadingCompletions([]);
        setSpeakingCompletions([]);
        setDailyChallengeCompletion(null);
        setListeningCompletions([]);
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadCloudData(session.user.id).catch((error) =>
          console.error('Failed to refresh cloud data:', error)
        );
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadCloudData]);

  const login = useCallback(
    async (loggedInUser: User) => {
      setUser(loggedInUser);

      if (!loggedInUser.isGuest) {
        await loadCloudData(loggedInUser.id);
      }
    },
    [loadCloudData]
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error);
    }

    setUser(null);
    setProgress([]);
    setQuizResults([]);
    setVocabulary([]);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStreakData(DEFAULT_STREAK);
    setDailyPlan(null);
    setReadingCompletions([]);
    setSpeakingCompletions([]);
    setDailyChallengeCompletion(null);
    setListeningCompletions([]);
    setIsOnboarded(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
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

    setUser(guestUser);
    setProgress([]);
    setQuizResults([]);
    setVocabulary([]);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStreakData(DEFAULT_STREAK);
    setDailyPlan(createDailyPlan());
    setReadingCompletions([]);
    setSpeakingCompletions([]);
    setDailyChallengeCompletion(null);
    setListeningCompletions([]);
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      setUser((current) =>
        current ? { ...current, ...updates } : current
      );

      if (!user || user.isGuest) return;

      const dbUpdates: Record<string, unknown> = {};

      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.englishLevel !== undefined) {
        dbUpdates.english_level = updates.englishLevel;
      }
      if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
      if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
      if (updates.longestStreak !== undefined) {
        dbUpdates.longest_streak = updates.longestStreak;
      }
      if (updates.lessonsCompleted !== undefined) {
        dbUpdates.lessons_completed = updates.lessonsCompleted;
      }
      if (updates.dailyGoal !== undefined) {
        dbUpdates.daily_goal = updates.dailyGoal;
      }

      if (Object.keys(dbUpdates).length === 0) return;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Failed to update profile:', error);
      }
    },
    [user]
  );

  const setEnglishLevel = useCallback(
    (level: EnglishLevel) => {
      updateUser({ englishLevel: level });
    },
    [updateUser]
  );

  const addXP = useCallback(
    async (amount: number) => {
      if (!user) return;

      const newXP = user.xp + amount;

      setUser((current) =>
        current ? { ...current, xp: newXP } : current
      );

      if (!user.isGuest) {
        const { error } = await supabase
          .from('profiles')
          .update({ xp: newXP })
          .eq('id', user.id);

        if (error) {
          console.error('Failed to update XP:', error);
        }
      }
    },
    [user]
  );

  const updateLessonProgress = useCallback(
    async (lessonProgress: UserProgress) => {
      if (!user) return;

      const previous = progress.find(
        (p) => p.lessonId === lessonProgress.lessonId
      );

      const wasCompleted = previous?.completed ?? false;

      setProgress((current) => {
        const exists = current.some(
          (p) => p.lessonId === lessonProgress.lessonId
        );

        if (exists) {
          return current.map((p) =>
            p.lessonId === lessonProgress.lessonId
              ? lessonProgress
              : p
          );
        }

        return [...current, lessonProgress];
      });

      if (user.isGuest) return;

      const { error } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonProgress.lessonId,
            completion_percentage:
              lessonProgress.completionPercentage,
            score: lessonProgress.score,
            completed: lessonProgress.completed,
            last_accessed_at: lessonProgress.lastAccessedAt,
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) {
        console.error('Failed to save lesson progress:', error);
      }

      if (lessonProgress.completed && !wasCompleted) {
        const newCount = user.lessonsCompleted + 1;
        const newXP = user.xp + AppConfig.xpPerLesson;

        setUser((current) =>
          current
            ? {
                ...current,
                lessonsCompleted: newCount,
                xp: newXP,
              }
            : current
        );

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            lessons_completed: newCount,
            xp: newXP,
          })
          .eq('id', user.id);

        if (profileError) {
          console.error(
            'Failed to update lesson completion:',
            profileError
          );
        }
      }
    },
    [user, progress]
  );

  const addQuizResult = useCallback(
    async (result: QuizResult) => {
      if (!user) return;

      setQuizResults((current) => [result, ...current]);

      if (user.isGuest) return;

      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: result.quizId,
          score: result.score,
          total_questions: result.totalQuestions,
          completed_at: result.completedAt,
        });

      if (error) {
        console.error('Failed to save quiz result:', error);
      }
    },
    [user]
  );

  const setOnboarded = useCallback((value: boolean) => {
    setIsOnboarded(value);
  }, []);

  const setNotificationPref = useCallback(
    async (key: string, value: boolean) => {
      const preferences = {
        ...notificationPrefs,
        [key]: value,
      };

      setNotificationPrefs(preferences);

      if (!user || user.isGuest) return;

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: user.id,
            preferences,
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error(
          'Failed to save notification preferences:',
          error
        );
      }
    },
    [user, notificationPrefs]
  );

  const saveVocabWord = useCallback(
    async (word: SavedVocabWord) => {
      if (!user) return;

      setVocabulary((current) => {
        if (
          current.some(
            (item) => item.id === word.id || item.word === word.word
          )
        ) {
          return current;
        }

        return [...current, word];
      });

      if (user.isGuest) return;

      const { error } = await supabase
        .from('saved_vocabulary')
        .upsert({
          id: word.id,
          user_id: user.id,
          word: word.word,
          definition: word.definition,
          example: word.example,
          pronunciation: word.pronunciation,
          learned: word.learned,
          saved_at: word.savedAt,
        });

      if (error) {
        console.error('Failed to save vocabulary word:', error);
      }
    },
    [user]
  );

  const removeVocabWord = useCallback(
    async (wordId: string) => {
      setVocabulary((current) =>
        current.filter((word) => word.id !== wordId)
      );

      if (!user || user.isGuest) return;

      const { error } = await supabase
        .from('saved_vocabulary')
        .delete()
        .eq('user_id', user.id)
        .eq('id', wordId);

      if (error) {
        console.error(
          'Failed to remove vocabulary word:',
          error
        );
      }
    },
    [user]
  );

  const toggleVocabLearned = useCallback(
    async (wordId: string) => {
      const target = vocabulary.find(
        (word) => word.id === wordId
      );

      if (!target) return;

      const learned = !target.learned;

      setVocabulary((current) =>
        current.map((word) =>
          word.id === wordId ? { ...word, learned } : word
        )
      );

      if (!user || user.isGuest) return;

      const { error } = await supabase
        .from('saved_vocabulary')
        .update({ learned })
        .eq('user_id', user.id)
        .eq('id', wordId);

      if (error) {
        console.error(
          'Failed to update vocabulary:',
          error
        );
      }
    },
    [user, vocabulary]
  );

  const updateStreakOnActivity = useCallback(async () => {
    if (!user) return;

    const today = getTodayString();
    const lastDate = streakData.lastActiveDate;

    if (lastDate === today) return;

    let currentStreak = 1;

    if (lastDate) {
      const last = new Date(`${lastDate}T00:00:00`);
      const now = new Date(`${today}T00:00:00`);

      const difference = Math.floor(
        (now.getTime() - last.getTime()) / 86400000
      );

      if (difference === 1) {
        currentStreak = streakData.currentStreak + 1;
      }
    }

    const longestStreak = Math.max(
      streakData.longestStreak,
      currentStreak
    );

    const nextStreak: StreakData = {
      currentStreak,
      longestStreak,
      lastActiveDate: today,
    };

    setStreakData(nextStreak);

    setUser((current) =>
      current
        ? {
            ...current,
            streak: currentStreak,
            longestStreak,
          }
        : current
    );

    if (user.isGuest) return;

    const { error: streakError } = await supabase
      .from('streak_data')
      .upsert(
        {
          user_id: user.id,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_active_date: today,
        },
        { onConflict: 'user_id' }
      );

    if (streakError) {
      console.error(
        'Failed to save streak:',
        streakError
      );
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        streak: currentStreak,
        longest_streak: longestStreak,
      })
      .eq('id', user.id);

    if (profileError) {
      console.error(
        'Failed to update profile streak:',
        profileError
      );
    }
  }, [user, streakData]);

  const completeDailyPlanItem = useCallback(
    async (itemId: string) => {
      if (!user) return;

      const currentPlan = dailyPlan || createDailyPlan();

      const updatedPlan: DailyPlan = {
        ...currentPlan,
        items: currentPlan.items.map((item) =>
          item.id === itemId
            ? { ...item, completed: true }
            : item
        ),
      };

      setDailyPlan(updatedPlan);

      if (user.isGuest) return;

      const { error } = await supabase
        .from('daily_plans')
        .upsert(
          {
            user_id: user.id,
            plan_date: updatedPlan.date,
            plan: updatedPlan,
          },
          { onConflict: 'user_id,plan_date' }
        );

      if (error) {
        console.error(
          'Failed to save daily plan:',
          error
        );
      }
    },
    [user, dailyPlan]
  );

  const resetDailyPlan = useCallback(async () => {
    if (!user) return;

    const newPlan = createDailyPlan();

    setDailyPlan(newPlan);

    if (user.isGuest) return;

    const { error } = await supabase
      .from('daily_plans')
      .upsert(
        {
          user_id: user.id,
          plan_date: newPlan.date,
          plan: newPlan,
        },
        { onConflict: 'user_id,plan_date' }
      );

    if (error) {
      console.error(
        'Failed to reset daily plan:',
        error
      );
    }
  }, [user]);

  const checkAchievements = useCallback(async () => {
    if (!user) return;

    const unlocked = new Set(
      achievements
        .filter((a) => a.unlocked)
        .map((a) => a.id)
    );

    if (user.lessonsCompleted >= 1) {
      unlocked.add('first_lesson');
    }

    if (user.lessonsCompleted >= 10) {
      unlocked.add('ten_lessons');
    }

    if (streakData.currentStreak >= 7) {
      unlocked.add('streak_7');
    }

    if (streakData.currentStreak >= 30) {
      unlocked.add('streak_30');
    }

    if (user.xp >= 1000) {
      unlocked.add('english_champion');
    }

    const highScoreQuizzes = quizResults.filter((q) => {
      if (!q.totalQuestions) return false;
      return q.score / q.totalQuestions >= 0.8;
    });

    if (highScoreQuizzes.length >= 5) {
      unlocked.add('grammar_master');
    }

    const updatedAchievements =
      DEFAULT_ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlocked.has(achievement.id);

        return {
          ...achievement,
          unlocked: isUnlocked,
          unlockedAt: isUnlocked
            ? achievement.unlockedAt ||
              new Date().toISOString()
            : undefined,
        };
      });

    setAchievements(updatedAchievements);

    if (user.isGuest) return;

    for (const achievement of updatedAchievements) {
      const { error } = await supabase
        .from('achievements')
        .upsert(
          {
            user_id: user.id,
            achievement_id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            unlocked: achievement.unlocked,
            unlocked_at: achievement.unlockedAt || null,
          },
          { onConflict: 'user_id,achievement_id' }
        );

      if (error) {
        console.error(
          `Failed to save achievement ${achievement.id}:`,
          error
        );
      }
    }
  }, [user, achievements, streakData, quizResults]);

  const completeReading = useCallback(
    (completion: ReadingCompletion): boolean => {
      if (!user) return false;

      if (
        readingCompletions.some(
          (item) => item.passageId === completion.passageId
        )
      ) {
        return false;
      }

      setReadingCompletions((current) => [
        ...current,
        completion,
      ]);

      if (!user.isGuest) {
        supabase
          .from('reading_completions')
          .insert({
            user_id: user.id,
            passage_id: completion.passageId,
            score: completion.score,
            completed_at: completion.completedAt,
          })
          .then(({ error }) => {
            if (error) {
              console.error(
                'Failed to save reading completion:',
                error
              );
            }
          });

        addXP(AppConfig.xpPerLesson);
      }

      return true;
    },
    [user, readingCompletions, addXP]
  );

  const isReadingCompleted = useCallback(
    (passageId: string) => {
      return readingCompletions.some(
        (item) => item.passageId === passageId
      );
    },
    [readingCompletions]
  );

  const completeSpeaking = useCallback(
    (completion: SpeakingCompletion): boolean => {
      if (!user) return false;

      if (
        speakingCompletions.some(
          (item) => item.practiceId === completion.practiceId
        )
      ) {
        return false;
      }

      setSpeakingCompletions((current) => [
        ...current,
        completion,
      ]);

      if (!user.isGuest) {
        supabase
          .from('speaking_completions')
          .insert({
            user_id: user.id,
            practice_id: completion.practiceId,
            pronunciation_score:
              completion.pronunciationScore,
            grammar_score: completion.grammarScore,
            vocabulary_score:
              completion.vocabularyScore,
            naturalness_score:
              completion.naturalnessScore,
            completed_at: completion.completedAt,
          })
          .then(({ error }) => {
            if (error) {
              console.error(
                'Failed to save speaking completion:',
                error
              );
            }
          });

        addXP(AppConfig.xpPerLesson);
      }

      return true;
    },
    [user, speakingCompletions, addXP]
  );

  const isSpeakingCompleted = useCallback(
    (practiceId: string) => {
      return speakingCompletions.some(
        (item) => item.practiceId === practiceId
      );
    },
    [speakingCompletions]
  );

  const getSpeakingWeaknesses =
    useCallback((): SpeakingWeakness[] => {
      if (speakingCompletions.length === 0) {
        return [];
      }

      const categories = [
        {
          category: 'Pronunciation',
          getScore: (item: SpeakingCompletion) =>
            item.pronunciationScore,
        },
        {
          category: 'Grammar',
          getScore: (item: SpeakingCompletion) =>
            item.grammarScore,
        },
        {
          category: 'Vocabulary',
          getScore: (item: SpeakingCompletion) =>
            item.vocabularyScore,
        },
        {
          category: 'Naturalness',
          getScore: (item: SpeakingCompletion) =>
            item.naturalnessScore,
        },
      ];

      return categories
        .map(({ category, getScore }) => {
          const total = speakingCompletions.reduce(
          (sum, item) => sum + (getScore(item) ?? 0),
            0
          );

          return {
            category,
            averageScore: Math.round(
              total / speakingCompletions.length
            ),
          };
        })
        .sort(
          (a, b) => a.averageScore - b.averageScore
        ) as SpeakingWeakness[];
    }, [speakingCompletions]);

  const completeDailyChallenge = useCallback(
    (activitiesCompleted: number, xpAwarded: number): boolean => {
      if (!user) return false;

      const today = getTodayString();

      if (
        dailyChallengeCompletion &&
        dailyChallengeCompletion.challengeDate === today &&
        dailyChallengeCompletion.completed
      ) {
        return false;
      }

      const completion: DailyChallengeCompletion = {
        userId: user.id,
        challengeDate: today,
        activitiesCompleted,
        totalActivities: 3,
        xpAwarded,
        completed: activitiesCompleted >= 3,
        completedAt: new Date().toISOString(),
      };

      setDailyChallengeCompletion(completion);

      if (!user.isGuest) {
        supabase
          .from('daily_challenge_completions')
          .upsert(
            {
              user_id: user.id,
              challenge_date: today,
              activities_completed: activitiesCompleted,
              xp_awarded: xpAwarded,
              completed_at: completion.completedAt,
            },
            { onConflict: 'user_id,challenge_date' }
          )
          .then(({ error }) => {
            if (error) {
              console.error(
                'Failed to save daily challenge completion:',
                error
              );
            }
          });

        if (xpAwarded > 0) {
          addXP(xpAwarded);
        }
        updateStreakOnActivity();
        checkAchievements();
      }

      return true;
    },
    [user, dailyChallengeCompletion, addXP, updateStreakOnActivity, checkAchievements]
  );

  const isDailyChallengeCompleted = useCallback(() => {
    const today = getTodayString();
    return (
      dailyChallengeCompletion !== null &&
      dailyChallengeCompletion.challengeDate === today &&
      dailyChallengeCompletion.completed
    );
  }, [dailyChallengeCompletion]);

  const completeListening = useCallback(
    (completion: ListeningCompletion): boolean => {
      if (!user) return false;

      if (
        listeningCompletions.some(
          (item) => item.exerciseId === completion.exerciseId
        )
      ) {
        return false;
      }

      setListeningCompletions((current) => [
        ...current,
        completion,
      ]);

      if (!user.isGuest) {
        supabase
          .from('listening_completions')
          .insert({
            user_id: user.id,
            exercise_id: completion.exerciseId,
            score: completion.score,
            total_questions: completion.totalQuestions,
            completed_at: completion.completedAt,
          })
          .then(({ error }) => {
            if (error) {
              console.error(
                'Failed to save listening completion:',
                error
              );
            }
          });

        addXP(AppConfig.xpPerListening);
        updateStreakOnActivity();
      }

      return true;
    },
    [user, listeningCompletions, addXP, updateStreakOnActivity]
  );

  const isListeningCompleted = useCallback(
    (exerciseId: string) => {
      return listeningCompletions.some(
        (item) => item.exerciseId === exerciseId
      );
    },
    [listeningCompletions]
  );

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
        dailyChallengeCompletion,
        completeDailyChallenge,
        isDailyChallengeCompleted,
        listeningCompletions,
        completeListening,
        isListeningCompleted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
}
