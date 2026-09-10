import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Flame, Star, BookOpen, Trophy, TrendingUp, Award, Target, BarChart3, Bookmark } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { StatCard } from '@/components/StatCard';
import { LevelBadge } from '@/components/LevelBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { getLessonsByLevel, allLessons } from '@/data/lessons';
import { EnglishLevel } from '@/types';

export default function ProgressScreen() {
  const { theme } = useTheme();
  const { user, progress, quizResults, vocabulary } = useApp();

  const userLevel = user?.englishLevel || 'Beginner';

  const lessons = useMemo(() => getLessonsByLevel(userLevel), [userLevel]);
  const completedLessons = lessons.filter((l) => progress.find((p) => p.lessonId === l.id && p.completed)).length;
  const courseProgress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  const totalScore = quizResults.reduce((sum, r) => sum + r.score, 0);
  const totalPossible = quizResults.reduce((sum, r) => sum + r.totalQuestions, 0);
  const avgScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  // Per-level progress
  const levelProgress = useMemo(() => {
    const levels: EnglishLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
    return levels.map((level) => {
      const levelLessons = allLessons.filter((l) => l.level === level);
      const completed = levelLessons.filter((l) => progress.find((p) => p.lessonId === l.id && p.completed)).length;
      const pct = levelLessons.length > 0 ? (completed / levelLessons.length) * 100 : 0;
      return { level, completed, total: levelLessons.length, pct: Math.round(pct) };
    });
  }, [progress]);

  // Category tracking based on quiz results
  const categoryStats = useMemo(() => {
    const categories = [
      { name: 'Grammar', icon: BookOpen, lessons: allLessons.filter((l) => l.level === userLevel) },
      { name: 'Vocabulary', icon: Bookmark, count: vocabulary.length },
      { name: 'Reading', icon: TrendingUp, lessons: allLessons.filter((l) => l.level === userLevel) },
      { name: 'Writing', icon: Award, quizzes: quizResults },
      { name: 'Speaking', icon: Trophy, pending: true },
    ];
    return categories;
  }, [userLevel, vocabulary, quizResults]);

  // Recent quizzes sorted by date
  const recentQuizzes = useMemo(() => {
    return [...quizResults]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5);
  }, [quizResults]);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Your Progress</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Track your journey to fluency
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={<BookOpen size={24} color={theme.colors.primary} strokeWidth={2} />}
            label="Lessons Completed"
            value={user?.lessonsCompleted || 0}
            color={theme.colors.primary}
          />
          <StatCard
            icon={<Flame size={24} color={theme.colors.warning} strokeWidth={2} />}
            label="Current Streak"
            value={`${user?.streak || 0} days`}
            color={theme.colors.warning}
          />
          <StatCard
            icon={<Star size={24} color={theme.colors.accent} strokeWidth={2} />}
            label="Total XP"
            value={user?.xp || 0}
            color={theme.colors.accent}
          />
          <StatCard
            icon={<Trophy size={24} color={theme.colors.secondary} strokeWidth={2} />}
            label="Avg Quiz Score"
            value={`${avgScore}%`}
            color={theme.colors.secondary}
          />
        </View>

        {/* Per-level progress */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <BarChart3 size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overall Progress by Level</Text>
            </View>
          </View>
          {levelProgress.map((lp) => (
            <View key={lp.level} style={styles.levelProgressItem}>
              <View style={styles.levelProgressHeader}>
                <LevelBadge level={lp.level} size="sm" />
                <Text style={[styles.levelProgressText, { color: theme.colors.textSecondary }]}>
                  {lp.completed}/{lp.total} lessons
                </Text>
                <Text style={[styles.levelProgressPct, { color: theme.colors.primary }]}>
                  {lp.pct}%
                </Text>
              </View>
              <ProgressBar progress={lp.pct} height={8} />
            </View>
          ))}
        </Card>

        {/* Current level course progress */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Target size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Course Progress</Text>
            </View>
            <LevelBadge level={userLevel} size="sm" />
          </View>
          <View style={styles.courseProgressInfo}>
            <Text style={[styles.progressBig, { color: theme.colors.text }]}>
              {completedLessons}<Text style={[styles.progressSmall, { color: theme.colors.textSecondary }]}>/{lessons.length} lessons</Text>
            </Text>
            <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
              {Math.round(courseProgress)}%
            </Text>
          </View>
          <ProgressBar progress={courseProgress} height={12} />
        </Card>

        {/* Category breakdown */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <TrendingUp size={20} color={theme.colors.secondary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skill Areas</Text>
            </View>
          </View>
          <View style={styles.categoryList}>
            {categoryStats.map((cat) => {
              const Icon = cat.icon;
              let value = '';
              if (cat.name === 'Vocabulary') value = `${cat.count} words saved`;
              else if (cat.name === 'Speaking') value = 'Coming Soon';
              else if (cat.name === 'Writing') value = `${(cat as { quizzes: typeof quizResults }).quizzes.length} quizzes`;
              else value = `${cat.lessons?.length || 0} lessons`;
              return (
                <View key={cat.name} style={[styles.categoryItem, { borderBottomColor: theme.colors.border }]}>
                  <View style={[styles.categoryIcon, { backgroundColor: theme.colors.primarySoft }]}>
                    <Icon size={18} color={theme.colors.primary} strokeWidth={2} />
                  </View>
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>{cat.name}</Text>
                  <Text style={[styles.categoryValue, { color: theme.colors.textSecondary }]}>{value}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Recent quiz results */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Award size={20} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Quiz Results</Text>
            </View>
          </View>
          {recentQuizzes.length > 0 ? (
            <View style={styles.quizList}>
              {recentQuizzes.map((result, index) => {
                const lesson = allLessons.find((l) => l.content.quiz.id === result.quizId);
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <View key={`${result.quizId}-${index}`} style={[styles.quizItem, { borderBottomColor: theme.colors.border }]}>
                    <View style={styles.quizItemInfo}>
                      <Text style={[styles.quizTitle, { color: theme.colors.text }]}>
                        {lesson?.content.quiz.title || 'Quiz'}
                      </Text>
                      <Text style={[styles.quizScore, { color: theme.colors.textSecondary }]}>
                        {result.score}/{result.totalQuestions} correct
                      </Text>
                    </View>
                    <View style={[styles.quizPercent, { backgroundColor: percentage >= 80 ? theme.colors.successSoft : theme.colors.warningSoft }]}>
                      <Text style={[styles.quizPercentText, { color: percentage >= 80 ? theme.colors.success : theme.colors.warning }]}>
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No quizzes completed yet. Start learning to see your results!
            </Text>
          )}
        </Card>

        {/* Achievements link */}
        <TouchableOpacity onPress={() => router.push('/settings/achievements')} activeOpacity={0.8}>
          <Card style={styles.section}>
            <View style={styles.achievementsLink}>
              <Trophy size={20} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>View Achievements</Text>
              <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>→</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  levelProgressItem: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  levelProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelProgressText: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  levelProgressPct: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  courseProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  progressBig: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  progressSmall: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  progressPercent: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  categoryList: {
    gap: 0,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  categoryValue: {
    fontSize: fontSize.sm,
  },
  quizList: {
    gap: 0,
  },
  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  quizItemInfo: {
    flex: 1,
    gap: 2,
  },
  quizTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  quizScore: {
    fontSize: fontSize.xs,
  },
  quizPercent: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  quizPercentText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  emptyText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  achievementsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chevron: {
    marginLeft: 'auto',
    fontSize: fontSize.lg,
  },
});
