import { apiRequest } from './api';
import { UserProgress, QuizResult } from '@/types';

export const progressService = {
  async getUserProgress(token: string): Promise<UserProgress[]> {
    return apiRequest<UserProgress[]>('/progress', { token });
  },

  async updateProgress(
    token: string,
    lessonId: string,
    completionPercentage: number,
    score: number,
    completed: boolean
  ): Promise<UserProgress> {
    return apiRequest<UserProgress>('/progress', {
      method: 'POST',
      body: { lessonId, completionPercentage, score, completed },
      token,
    });
  },

  async getQuizResults(token: string): Promise<QuizResult[]> {
    return apiRequest<QuizResult[]>('/quiz-results', { token });
  },

  async saveQuizResult(
    token: string,
    quizId: string,
    score: number,
    totalQuestions: number
  ): Promise<QuizResult> {
    return apiRequest<QuizResult>('/quiz-results', {
      method: 'POST',
      body: { quizId, score, totalQuestions },
      token,
    });
  },
};
