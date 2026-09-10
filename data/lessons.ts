import { Lesson, EnglishLevel } from '@/types';
import { beginnerLessons } from './beginnerLessons';
import { intermediateLessons } from './intermediateLessons';
import { advancedLessons } from './advancedLessons';

export const allLessons: Lesson[] = [
  ...beginnerLessons,
  ...intermediateLessons,
  ...advancedLessons,
];

export function getLessonsByLevel(level: EnglishLevel): Lesson[] {
  return allLessons.filter((lesson) => lesson.level === level).sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.id === id);
}

export function getTotalLessonsByLevel(level: EnglishLevel): number {
  return getLessonsByLevel(level).length;
}

export { beginnerLessons, intermediateLessons, advancedLessons };
