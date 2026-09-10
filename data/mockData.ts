import { User, UserProgress, QuizResult } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Mohammed',
  email: 'mohammed@example.com',
  englishLevel: 'Beginner',
  xp: 350,
  streak: 7,
  lessonsCompleted: 7,
  dailyGoal: 3,
  createdAt: '2025-01-15T10:00:00Z',
  isGuest: false,
  longestStreak: 7,
};

export const mockUserProgress: UserProgress[] = [
  {
    userId: 'user-1',
    lessonId: 'beg-1',
    completionPercentage: 100,
    score: 100,
    completed: true,
    lastAccessedAt: '2025-09-01T10:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-2',
    completionPercentage: 100,
    score: 80,
    completed: true,
    lastAccessedAt: '2025-09-02T10:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-3',
    completionPercentage: 100,
    score: 90,
    completed: true,
    lastAccessedAt: '2025-09-03T10:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-4',
    completionPercentage: 100,
    score: 100,
    completed: true,
    lastAccessedAt: '2025-09-04T10:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-5',
    completionPercentage: 100,
    score: 85,
    completed: true,
    lastAccessedAt: '2025-09-04T14:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-6',
    completionPercentage: 100,
    score: 95,
    completed: true,
    lastAccessedAt: '2025-09-05T08:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-7',
    completionPercentage: 100,
    score: 90,
    completed: true,
    lastAccessedAt: '2025-09-05T09:00:00Z',
  },
  {
    userId: 'user-1',
    lessonId: 'beg-8',
    completionPercentage: 60,
    score: 0,
    completed: false,
    lastAccessedAt: '2025-09-05T10:00:00Z',
  },
];

export const mockQuizResults: QuizResult[] = [
  { userId: 'user-1', quizId: 'beg-1-quiz', score: 5, totalQuestions: 5, completedAt: '2025-09-01T10:30:00Z' },
  { userId: 'user-1', quizId: 'beg-2-quiz', score: 4, totalQuestions: 5, completedAt: '2025-09-02T10:30:00Z' },
  { userId: 'user-1', quizId: 'beg-3-quiz', score: 5, totalQuestions: 5, completedAt: '2025-09-03T10:30:00Z' },
  { userId: 'user-1', quizId: 'beg-4-quiz', score: 5, totalQuestions: 5, completedAt: '2025-09-04T10:30:00Z' },
  { userId: 'user-1', quizId: 'beg-5-quiz', score: 4, totalQuestions: 5, completedAt: '2025-09-04T14:30:00Z' },
  { userId: 'user-1', quizId: 'beg-6-quiz', score: 5, totalQuestions: 5, completedAt: '2025-09-05T08:30:00Z' },
  { userId: 'user-1', quizId: 'beg-7-quiz', score: 5, totalQuestions: 5, completedAt: '2025-09-05T09:30:00Z' },
];
