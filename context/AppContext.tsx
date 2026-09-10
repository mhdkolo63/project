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

  /*
   * LOAD ALL CLOUD DATA
   */
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
      ]);

      /*
       * PROFILE
       */
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

      /*
       * PROGRESS
       */
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

      /*
       * QUIZ RESULTS
       */
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

      /*
       * VOCABULARY
       */
      if (vocabResponse.data) {
        setVocabulary(
          vocabResponse.data.map((v) => ({
            id: v.word,
            word: v.word,
            meaning: v.meaning || '',
            example: v.example || '',
            partOfSpeech: v.part_of_speech || '',
            level: v.level || 'Beginner',
            savedAt: v.saved_at || new Date().toISOString(),
            learned: v.learned || false,
          }))
        );
      }

      /*
       * ACHIEVEMENTS
       */
      if (achievementResponse.data) {
        const cloudAchievements = achievementResponse.data.map((a) => ({
          id: a.achievement_id,
          title: a.title || '',
          description: a.description || '',
          icon: a.icon || '🏆',
          unlocked: a.unlocked || false,
          unlockedAt: a.unlocked_at || undefined,
        }));

        setAchievements(
          cloudAchievements.length > 0
            ? cloudAchievements
            : DEFAULT_ACHIEVEMENTS
        );
      }

      /*
       * STREAK
       */
      if (streakResponse.data) {
        setStreakData({
          currentStreak:
            streakResponse.data.current_streak || 0,
          longestStreak:
            streakResponse.data.longest_streak || 0,
          lastActiveDate:
            streakResponse.data.last_active_date || '',
        });
      }

      /*
       * DAILY PLAN
       */
      if (dailyPlanResponse.data) {
        setDailyPlan({
          date: dailyPlanResponse.data.plan_date,
          items: dailyPlanResponse.data.items || [],
        });
      } else {
        setDailyPlan(createDailyPlan());
      }

      /*
       * NOTIFICATION SETTINGS
       */
      if (notificationResponse.data?.preferences) {
        setNotificationPrefs(
          notificationResponse.data.preferences
        );
      }

      /*
       * READING
       */
      if (readingResponse.data) {
        setReadingCompletions(
          readingResponse.data.map((r) => ({
            passageId: r.passage_id,
            completedAt: r.completed_at,
            readingTimeSeconds: r.reading_time_seconds || 0,
            comprehensionScore: r.comprehension_score || 0,
            totalQuestions: r.total_questions || 0,
            xpAwarded: r.xp_awarded || false,
            xpAmount: r.xp_amount || 0,
          }))
        );
      }

      /*
       * SPEAKING
       */
      if (speakingResponse.data) {
        setSpeakingCompletions(
          speakingResponse.data.map((s) => ({
            practiceId: s.practice_id,
            completedAt: s.completed_at,
            overallScore: s.overall_score || 0,
            attempts: s.attempts || [],
            xpAwarded: s.xp_awarded || false,
            xpAmount: s.xp_amount || 0,
            mode: s.mode || 'single',
          }))
        );
      }
    } catch (error) {
      console.error('Cloud data loading error:', error);
    }
  }, []);

  /*
   * INITIAL AUTH CHECK
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          await loadCloudData(authUser.id);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadCloudData(session.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadCloudData]);

  /*
   * LOGIN
   */
  const login = useCallback(
    async (u: User) => {
      setUser(u);

      if (!u.isGuest) {
        await loadCloudData(u.id);
      }
    },
    [loadCloudData]
  );

  /*
   * LOGOUT
   */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();

    setUser(null);
    setProgress([]);
    setQuizResults([]);
    setVocabulary([]);
    setAchievements(DEFAULT_ACHIEVEMENTS);
    setStreakData(DEFAULT_STREAK);
    setDailyPlan(null);
    setReadingCompletions([]);
    setSpeakingCompletions([]);
    setNotificationPrefs(DEFAULT_NOTIFICATION_PREFS);
    setIsOnboarded(false);
  }, []);

  /*
   * GUEST
   */
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
  }, []);

  /*
   * UPDATE PROFILE
   */
  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user || user.isGuest) return;

      const updatedUser = {
        ...user,
        ...updates,
      };

      setUser(updatedUser);

      await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          email: updatedUser.email,
          english_level: updatedUser.englishLevel,
          xp: updatedUser.xp,
          streak: updatedUser.streak,
          longest_streak: updatedUser.longestStreak,
          lessons_completed: updatedUser.lessonsCompleted,
          daily_goal: updatedUser.dailyGoal,
        })
        .eq('id', user.id);
    },
    [user]
  );

  const setEnglishLevel = useCallback(
    async (level: EnglishLevel) => {
      await updateUser({
        englishLevel: level,
      });
    },
    [updateUser]
  );

  /*
   * XP
   */
  const addXP = useCallback(
    async (amount: number) => {
      if (!user || user.isGuest) return;

      const newXP = user.xp + amount;

      setUser((prev) =>
        prev ? { ...prev, xp: newXP } : prev
      );

      await supabase
        .from('profiles')
        .update({ xp: newXP })
        .eq('id', user.id);
    },
    [user]
  );

  /*
   * LESSON PROGRESS
   */
  const updateLessonProgress = useCallback(
    async (newProgress: UserProgress) => {
      if (!user || user.isGuest) return;

      const existing = progress.find(
        (p) => p.lessonId === newProgress.lessonId
      );

      setProgress((prev) => {
        const exists = prev.some(
          (p) => p.lessonId === newProgress.lessonId
        );

        return exists
          ? prev.map((p) =>
              p.lessonId === newProgress.lessonId
                ? newProgress
                : p
            )
          : [...prev, newProgress];
      });

      await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: newProgress.lessonId,
            completion_percentage:
              newProgress.completionPercentage,
            score: newProgress.score,
            completed: newProgress.completed,
            last_accessed_at: newProgress.lastAccessedAt,
          },
          {
            onConflict: 'user_id,lesson_id',
          }
        );

      if (
        newProgress.completed &&
        !existing?.completed
      ) {
        const newLessons =
          user.lessonsCompleted + 1;
        const newXP =
          user.xp + AppConfig.xpPerLesson;

        setUser((prev) =>
          prev
            ? {
                ...prev,
                lessonsCompleted: newLessons,
                xp: newXP,
              }
            : prev
        );

        await supabase
          .from('profiles')
          .update({
            lessons_completed: newLessons,
            xp: newXP,
          })
          .eq('id', user.id);
      }
    },
    [user, progress]
  );

  /*
   * QUIZ RESULT
   */
  const addQuizResult = useCallback(
    async (result: QuizResult) => {
      if (!user || user.isGuest) return;

      setQuizResults((prev) => [
        ...prev,
        result,
      ]);

      await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: result.quizId,
          score: result.score,
          total_questions: result.totalQuestions,
          completed_at: result.completedAt,
        });
    },
    [user]
  );

  /*
   * ONBOARDING
   */
  const setOnboarded = useCallback(
    (value: boolean) => {
      setIsOnboarded(value);
    },
    []
  );

  /*
   * NOTIFICATIONS
   */
  const setNotificationPref = useCallback(
    async (key: string, value: boolean) => {
      if (!user || user.isGuest) return;

      const updated = {
        ...notificationPrefs,
        [key]: value,
      };

      setNotificationPrefs(updated);

      await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          preferences: updated,
        });
    },
    [user, notificationPrefs]
  );

  /*
   * SAVE VOCABULARY
   */
  const saveVocabWord = useCallback(
    async (word: SavedVocabWord) => {
      if (!user || user.isGuest) return;

      if (
        vocabulary.some(
          (w) => w.id === word.id
        )
      ) {
        return;
      }

      setVocabulary((prev) => [
        ...prev,
        word,
      ]);

      await supabase
        .from('saved_vocabulary')
        .insert({
          user_id: user.id,
          word: word.word,
          meaning: word.meaning,
          pronunciation: '',
          example: word.example,
          part_of_speech: word.partOfSpeech,
          saved_at: word.savedAt,
          learned: word.learned,
        });
    },
    [user, vocabulary]
  );

  /*
   * REMOVE VOCABULARY
   */
  const removeVocabWord = useCallback(
    async (wordId: string) => {
      if (!user || user.isGuest) return;

      setVocabulary((prev) =>
        prev.filter(
          (w) => w.id !== wordId
        )
      );

      await supabase
        .from('saved_vocabulary')
        .delete()
        .eq('user_id', user.id)
        .eq('word', wordId);
    },
    [user]
  );

  /*
   * TOGGLE VOCABULARY
   */
  const toggleVocabLearned = useCallback(
    async (wordId: string) => {
      if (!user || user.isGuest) return;

      const current = vocabulary.find(
        (w) => w.id === wordId
      );

      if (!current) return;

      const learned = !current.learned;

      setVocabulary((prev) =>
        prev.map((w) =>
          w.id === wordId
            ? { ...w, learned }
            : w
        )
      );

      await supabase
        .from('saved_vocabulary')
        .update({ learned })
        .eq('user_id', user.id)
        .eq('word', wordId);
    },
    [user, vocabulary]
  );

  /*
   * STREAK
   */
  const updateStreakOnActivity = useCallback(
    async () => {
      if (!user || user.isGuest) return;

      const today = getTodayString();

      if (streakData.lastActiveDate === today) {
        return;
      }

      const yesterday = new Date(
        Date.now() - 86400000
      )
        .toISOString()
        .split('T')[0];

      let newCurrent = 1;

      if (
        streakData.lastActiveDate ===
        yesterday
      ) {
        newCurrent =
          streakData.currentStreak + 1;
      }

      const newLongest = Math.max(
        newCurrent,
        streakData.longestStreak
      );

      const updated = {
        currentStreak: newCurrent,
        longestStreak: newLongest,
        lastActiveDate: today,
      };

      setStreakData(updated);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              streak: newCurrent,
              longestStreak: newLongest,
            }
          : prev
      );

      await supabase
        .from('streak_data')
        .upsert({
          user_id: user.id,
          current_streak: newCurrent,
          longest_streak: newLongest,
          last_active_date: today,
        });

      await supabase
        .from('profiles')
        .update({
          streak: newCurrent,
          longest_streak: newLongest,
        })
        .eq('id', user.id);
    },
    [user, streakData]
  );

  /*
   * DAILY PLAN
   */
  const completeDailyPlanItem = useCallback(
    async (itemId: string) => {
      if (!user || user.isGuest || !dailyPlan) {
        return;
      }

      const updated = {
        ...dailyPlan,
        items: dailyPlan.items.map((item) =>
          item.id === itemId
            ? { ...item, completed: true }
            : item
        ),
      };

      setDailyPlan(updated);

      await supabase
        .from('daily_plans')
        .upsert({
          user_id: user.id,
          plan_date: updated.date,
          items: updated.items,
        });
    },
    [user, dailyPlan]
  );

  const resetDailyPlan = useCallback(
    async () => {
      if (!user || user.isGuest) return;

      const newPlan = createDailyPlan();

      setDailyPlan(newPlan);

      await supabase
        .from('daily_plans')
        .upsert({
          user_id: user.id,
          plan_date: newPlan.date,
          items: newPlan.items,
        });
    },
    [user]
  );

  /*
   * ACHIEVEMENTS
   */
  const checkAchievements = useCallback(
    async () => {
      if (!user || user.isGuest) return;

      let updated = [...achievements];

      const unlock = (id: string) => {
        const index = updated.findIndex(
          (a) => a.id === id
        );

        if (
          index >= 0 &&
          !updated[index].unlocked
        ) {
          updated[index] = {
            ...updated[index],
            unlocked: true,
            unlockedAt:
              new Date().toISOString(),
          };
        }
      };

      if (user.lessonsCompleted >= 1) {
        unlock('first_lesson');
      }

      if (user.lessonsCompleted >= 10) {
        unlock('ten_lessons');
      }

      if (user.streak >= 7) {
        unlock('streak_7');
      }

      if (user.streak >= 30) {
        unlock('streak_30');
      }

      if (user.xp >= 1000) {
        unlock('english_champion');
      }

      const highScoreQuizzes =
        quizResults.filter(
          (r) =>
            r.totalQuestions > 0 &&
            r.score / r.totalQuestions >= 0.8
        ).length;

      if (highScoreQuizzes >= 5) {
        unlock('grammar_master');
      }

      setAchievements(updated);

      for (const achievement of updated) {
        await supabase
          .from('achievements')
          .upsert({
            user_id: user.id,
            achievement_id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            unlocked: achievement.unlocked,
            unlocked_at:
              achievement.unlockedAt || null,
          });
      }
    },
    [user, achievements, quizResults]
  );

  /*
   * READING
   */
  const isReadingCompleted = useCallback(
    (passageId: string) => {
      return readingCompletions.some(
        (r) =>
          r.passageId === passageId &&
          r.xpAwarded
      );
    },
    [readingCompletions]
  );

  const completeReading = useCallback(
    (completion: ReadingCompletion): boolean => {
      if (!user || user.isGuest) return false;

      const existing =
        readingCompletions.find(
          (r) =>
            r.passageId ===
            completion.passageId
        );

      if (existing?.xpAwarded) {
        return false;
      }

      const updated = [
        ...readingCompletions.filter(
          (r) =>
            r.passageId !==
            completion.passageId
        ),
        {
          ...completion,
          xpAwarded: true,
        },
      ];

      setReadingCompletions(updated);

      supabase
        .from('reading_completions')
        .insert({
          user_id: user.id,
          passage_id: completion.passageId,
          completed_at: completion.completedAt,
          reading_time_seconds:
            completion.readingTimeSeconds,
          comprehension_score:
            completion.comprehensionScore,
          total_questions:
            completion.totalQuestions,
          xp_awarded: true,
          xp_amount: completion.xpAmount,
        });

      addXP(completion.xpAmount);

      return true;
    },
    [user, readingCompletions, addXP]
  );

  /*
   * SPEAKING
   */
  const isSpeakingCompleted = useCallback(
    (practiceId: string) => {
      return speakingCompletions.some(
        (s) =>
          s.practiceId === practiceId &&
          s.xpAwarded
      );
    },
    [speakingCompletions]
  );

  const completeSpeaking = useCallback(
    (completion: SpeakingCompletion): boolean => {
      if (!user || user.isGuest) return false;

      const existing =
        speakingCompletions.find(
          (s) =>
            s.practiceId ===
            completion.practiceId
        );

      if (existing?.xpAwarded) {
        return false;
      }

      const updated = [
        ...speakingCompletions.filter(
          (s) =>
            s.practiceId !==
            completion.practiceId
        ),
        {
          ...completion,
          xpAwarded: true,
        },
      ];

      setSpeakingCompletions(updated);

      supabase
        .from('speaking_completions')
        .insert({
          user_id: user.id,
          practice_id: completion.practiceId,
          completed_at: completion.completedAt,
          overall_score:
            completion.overallScore,
          attempts: completion.attempts,
          xp_awarded: true,
          xp_amount: completion.xpAmount,
          mode: completion.mode,
        });

      addXP(completion.xpAmount);

      return true;
    },
    [user, speakingCompletions, addXP]
  );

  /*
   * SPEAKING WEAKNESSES
   */
  const getSpeakingWeaknesses =
    useCallback((): SpeakingWeakness[] => {
      if (speakingCompletions.length === 0) {
        return [];
      }

      const areaScores: Record<
        string,
        number[]
      > = {
        Grammar: [],
        Vocabulary: [],
        Naturalness: [],
      };

      speakingCompletions.forEach((sc) => {
        sc.attempts.forEach((att) => {
          if (!att.feedback) return;

          areaScores.Grammar.push(
            att.feedback.grammar.score
          );

          areaScores.Vocabulary.push(
            att.feedback.vocabulary.score
          );

          areaScores.Naturalness.push(
            att.feedback.naturalness.score
          );
        });
      });

      return Object.entries(areaScores)
        .filter(
          ([, scores]) =>
            scores.length > 0
        )
        .map(([area, scores]) => ({
          area,
          averageScore: Math.round(
            scores.reduce(
              (a, b) => a + b,
              0
            ) / scores.length
          ),
          practiceCount:
            scores.length,
        }))
        .sort(
          (a, b) =>
            a.averageScore -
            b.averageScore
        );
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
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within AppProvider'
    );
  }

  return context;
}  speakingCompletions: SpeakingCompletion[];
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
