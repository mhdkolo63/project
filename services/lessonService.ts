import { apiRequest } from './api';
import { Lesson, EnglishLevel } from '@/types';
import { getLessonsByLevel, getLessonById, allLessons } from '@/data/lessons';

export const lessonService = {
  async getLessons(token: string, level?: EnglishLevel): Promise<Lesson[]> {
    const endpoint = level ? `/lessons?level=${level}` : '/lessons';
    return apiRequest<Lesson[]>(endpoint, { token });
  },

  async getLesson(token: string, lessonId: string): Promise<Lesson> {
    return apiRequest<Lesson>(`/lessons/${lessonId}`, { token });
  },

  getLocalLessonsByLevel(level: EnglishLevel): Lesson[] {
    return getLessonsByLevel(level);
  },

  getLocalLessonById(id: string): Lesson | undefined {
    return getLessonById(id);
  },

  getAllLocalLessons(): Lesson[] {
    return allLessons;
  },
};
