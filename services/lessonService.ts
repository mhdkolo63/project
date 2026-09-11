import type { Lesson, EnglishLevel } from '@/types';
import {
  getLessonsByLevel,
  getLessonById,
  allLessons,
} from '@/data/lessons';

export const lessonService = {
  async getLessons(level?: EnglishLevel): Promise<Lesson[]> {
    if (level) {
      return getLessonsByLevel(level);
    }

    return allLessons;
  },

  async getLesson(lessonId: string): Promise<Lesson> {
    const lesson = getLessonById(lessonId);

    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }

    return lesson;
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
