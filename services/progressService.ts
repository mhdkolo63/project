import { supabase } from './supabase';
import type { UserProgress, QuizResult } from '@/types';

const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('You must be logged in.');
  }

  return user.id;
};

const mapProgress = (row: any): UserProgress => ({
  userId: row.user_id,
  lessonId: row.lesson_id,
  completionPercentage: row.completion_percentage ?? 0,
  score: row.score ?? 0,
  completed: row.completed ?? false,
  lastAccessedAt: row.last_accessed_at,
});

const mapQuizResult = (row: any): QuizResult => ({
  userId: row.user_id,
  quizId: row.quiz_id,
  score: row.score ?? 0,
  totalQuestions: row.total_questions ?? 0,
  completedAt: row.completed_at,
});

export const progressService = {
  async getUserProgress(): Promise<UserProgress[]> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map(mapProgress);
  },

  async updateProgress(
    lessonId: string,
    completionPercentage: number,
    score: number,
    completed: boolean
  ): Promise<UserProgress> {
    const userId = await getCurrentUserId();

    const progressData = {
      user_id: userId,
      lesson_id: lessonId,
      completion_percentage: completionPercentage,
      score,
      completed,
      last_accessed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progressData, {
        onConflict: 'user_id,lesson_id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapProgress(data);
  },

  async getQuizResults(): Promise<QuizResult[]> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map(mapQuizResult);
  },

  async saveQuizResult(
    quizId: string,
    score: number,
    totalQuestions: number
  ): Promise<QuizResult> {
    const userId = await getCurrentUserId();

    const quizResultData = {
      user_id: userId,
      quiz_id: quizId,
      score,
      total_questions: totalQuestions,
      completed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('quiz_results')
      .insert(quizResultData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapQuizResult(data);
  },
};
