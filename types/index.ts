export type EnglishLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  englishLevel: EnglishLevel;
  xp: number;
  streak: number;
  longestStreak: number;
  lessonsCompleted: number;
  dailyGoal: number;
  createdAt: string;
  isGuest: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  level: EnglishLevel;
  description: string;
  content: LessonContent;
  xpReward: number;
  order: number;
}

export interface LessonContent {
  explanation: string;
  examples: LessonExample[];
  exercises: Exercise[];
  quiz: Quiz;
}

export interface LessonExample {
  title: string;
  sentences: string[];
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-correction';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'sentence-correction';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completionPercentage: number;
  score: number;
  completed: boolean;
  lastAccessedAt: string;
}

export interface QuizResult {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface ChatCorrection {
  original: string;
  corrected: string;
  explanation: string;
  naturalAlternative?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  correction?: ChatCorrection;
  timestamp: string;
  error?: boolean;
}

export interface DailyChallenge {
  id: string;
  type: 'sentence-correction';
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface GrammarMistake {
  original: string;
  correction: string;
  explanation: string;
}

export interface GrammarCheckResult {
  original: string;
  isCorrect: boolean;
  corrected: string;
  mistakes: GrammarMistake[];
  explanation: string;
  suggestion: string;
}

export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  example: string;
  partOfSpeech: string;
  level: EnglishLevel;
}

export interface SavedVocabWord extends VocabWord {
  savedAt: string;
  learned: boolean;
  definition?: string;
  pronunciation?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface DailyPlanItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface DailyPlan {
  date: string;
  items: DailyPlanItem[];
}

export interface PlacementQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  level: EnglishLevel;
}

export interface PlacementResult {
  level: EnglishLevel;
  score: number;
  totalQuestions: number;
  takenAt: string;
}

export interface AssessmentQuestion {
  id: string;
  category: 'Grammar' | 'Vocabulary' | 'Sentence Usage' | 'Reading Comprehension';
  question: string;
  options: string[];
  correctAnswer: string;
  level: EnglishLevel;
  explanation: string;
}

export type ReadingCategory =
  | 'Daily Life'
  | 'Education'
  | 'Travel'
  | 'Work & Business'
  | 'Technology'
  | 'Health'
  | 'Culture';

export interface ReadingPractical {
  id: string;
  title: string;
  level: EnglishLevel;
  category: ReadingCategory;
  text: string;
  estimatedMinutes: number;
  vocabulary: ReadingVocabWord[];
  comprehensionQuestions: ReadingComprehensionQuestion[];
  xpReward: number;
}

export interface ReadingVocabWord {
  word: string;
  meaning: string;
  example: string;
}

export interface ReadingComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ReadingCompletion {
  userId?: string;
  passageId: string;
  score?: number;
  completedAt: string;
  readingTimeSeconds?: number;
  comprehensionScore?: number;
  totalQuestions?: number;
  xpAwarded?: boolean;
  xpAmount?: number;
}

export interface SpeakingPractice {
  id: string;
  title: string;
  category: string;
  level: EnglishLevel;
  description: string;
  prompt: string;
  aiCoachLine: string;
  sampleResponses: string[];
  vocabulary: SpeakingVocabWord[];
  targetSkills: string[];
  xpReward: number;
  conversationMode: boolean;
}

export interface SpeakingVocabWord {
  word: string;
  meaning: string;
  example: string;
}

export interface SpeakingFeedback {
  grammar: {
    score: number;
    corrections: {
      original: string;
      corrected: string;
      explanation: string;
    }[];
  };
  vocabulary: {
    score: number;
    goodWords: string[];
    suggestedWords: string[];
  };
  naturalness: {
    score: number;
    alternatives: {
      original: string;
      natural: string;
    }[];
  };
  overallFeedback: string;
  overallScore: number;
}

export interface SpeakingAttempt {
  attemptNumber: number;
  transcription: string;
  feedback: SpeakingFeedback | null;
  completedAt: string;
}

export interface SpeakingCompletion {
  userId?: string;
  practiceId: string;
  pronunciationScore?: number;
  grammarScore?: number;
  vocabularyScore?: number;
  naturalnessScore?: number;
  overallScore?: number;
  completedAt: string;
  attempts?: SpeakingAttempt[];
  xpAwarded?: boolean;
  xpAmount?: number;
  mode?: 'single' | 'conversation';
}

export interface SpeakingConversationTurn {
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface SpeakingWeakness {
  area?: string;
  category?: string;
  averageScore: number;
  practiceCount?: number;
}

export interface DailyChallengeCompletion {
  userId?: string;
  challengeDate: string;
  activitiesCompleted: number;
  totalActivities: number;
  xpAwarded: number;
  completed: boolean;
  completedAt: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  level: EnglishLevel;
  description: string;
  audioText: string;
  estimatedMinutes: number;
  comprehensionQuestions: ListeningComprehensionQuestion[];
  xpReward: number;
}

export interface ListeningComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ListeningCompletion {
  userId?: string;
  exerciseId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  xpAwarded?: boolean;
  xpAmount?: number;
}
