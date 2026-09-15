import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Flame,
  Star,
  BookOpen,
  Trophy,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Bookmark,
  Headphones,
  Mic,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Zap,
  BookMarked,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { StatCard } from '@/components/StatCard';
import { LevelBadge } from '@/components/LevelBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { getLessonsByLevel, allLessons } from '@/data/lessons';
import { getReadingsByLevel } from '@/data/readingPracticals';
import { getSpeakingPracticesByLevel } from '@/data/speakingPracticals';
import { getListeningByLevel } from '@/data/listeningExercises';
import { EnglishLevel } from '@/types';

interface SkillRow {
  name: string;
  icon: typeof BookOpen;
  completed: number;
  total: number;
  colorKey: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

interface RecentActivity {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
  icon: typeof BookOpen;
  colorKey: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ProgressScreen() {
  const { theme } = useTheme();
  const {
    user,
    progress,
    quizResults,
    vocabulary,
    streakData,
    achievements,
    dailyPlan,
    readingCompletions,
    speakingCompletions,
    listeningCompletions,
    dailyChallengeCompletion,
    isDailyChallengeCompleted,
  } = useApp();

  const userLevel = user?.englishLevel || 'Beginner';
  const isGuest = user?.isGuest ?? false;

  const lessons = useMemo(() => getLessonsByLevel(userLevel), [userLevel]);
  const completedLessons = lessons.filter(
    (l) => progress.find((p) => p.lessonId === l.id && p.completed)
  ).length;
  const courseProgress =
    lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const totalScore = quizResults.reduce((sum, r) => sum + r.score, 0);
  const totalPossible = quizResults.reduce(
    (sum, r) => sum + r.totalQuestions,
    0
  );
  const avgScore =
    totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  const vocabLearned = vocabulary.filter((v) => v.learned).length;

  const levelProgress = useMemo(() => {
    const levels: EnglishLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
    return levels.map((level) => {
      const levelLessons = allLessons.filter((l) => l.level === level);
      const completed = levelLessons.filter(
        (l) => progress.find((p) => p.lessonId === l.id && p.completed)
      ).length;
      const pct =
        levelLessons.length > 0
          ? (completed / levelLessons.length) * 100
          : 0;
      return { level, completed, total: levelLessons.length, pct: Math.round(pct) };
    });
  }, [progress]);

  const skillRows: SkillRow[] = useMemo(() => {
    const levelLessons = allLessons.filter((l) => l.level === userLevel);
    const grammarCompleted = levelLessons.filter(
      (l) => progress.find((p) => p.lessonId === l.id && p.completed)
    ).length;

    const readings = getReadingsByLevel(userLevel);
    const speakingPractices = getSpeakingPracticesByLevel(userLevel);
    const listeningExercises = getListeningByLevel(userLevel);

    return [
      {
        name: 'Grammar',
        icon: BookOpen,
        completed: grammarCompleted,
        total: levelLessons.length,
        colorKey: 'primary',
      },
      {
        name: 'Vocabulary',
        icon: Bookmark,
        completed: vocabLearned,
        total: vocabulary.length,
        colorKey: 'secondary',
      },
      {
        name: 'Speaking',
        icon: Mic,
        completed: speakingCompletions.length,
        total: speakingPractices.length,
        colorKey: 'accent',
      },
      {
        name: 'Listening',
        icon: Headphones,
        completed: listeningCompletions.length,
        total: listeningExercises.length,
        colorKey: 'success',
      },
      {
        name: 'Reading',
        icon: BookMarked,
        completed: readingCompletions.length,
        total: readings.length,
        colorKey: 'warning',
      },
    ];
  }, [
    userLevel,
    progress,
    vocabLearned,
    vocabulary,
    speakingCompletions,
    listeningCompletions,
    readingCompletions,
  ]);

  const recentActivities: RecentActivity[] = useMemo(() => {
    const activities: RecentActivity[] = [];

    progress
      .filter((p) => p.completed)
      .sort(
        (a, b) =>
          new Date(b.lastAccessedAt).getTime() -
          new Date(a.lastAccessedAt).getTime()
      )
      .slice(0, 1)
      .forEach((p) => {
        const lesson = allLessons.find((l) => l.id === p.lessonId);
        if (lesson) {
          activities.push({
            id: `lesson-${p.lessonId}`,
            label: `Completed: ${lesson.title}`,
            detail: `${userLevel} level`,
            timestamp: p.lastAccessedAt,
            icon: BookOpen,
            colorKey: 'primary',
          });
        }
      });

    quizResults
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
      .slice(0, 1)
      .forEach((r) => {
        const lesson = allLessons.find((l) => l.content.quiz.id === r.quizId);
        activities.push({
          id: `quiz-${r.quizId}`,
          label: `Quiz: ${lesson?.content.quiz.title || 'Quiz'}`,
          detail: `${r.score}/${r.totalQuestions} correct`,
          timestamp: r.completedAt,
          icon: Award,
          colorKey: 'accent',
        });
      });

    speakingCompletions
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
      .slice(0, 1)
      .forEach((s) => {
        activities.push({
          id: `speaking-${s.practiceId}`,
          label: `Speaking practice completed`,
          detail: s.overallScore ? `Score: ${s.overallScore}` : 'Completed',
          timestamp: s.completedAt,
          icon: Mic,
          colorKey: 'secondary',
        });
      });

    listeningCompletions
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
      .slice(0, 1)
      .forEach((l) => {
        activities.push({
          id: `listening-${l.exerciseId}`,
          label: `Listening exercise completed`,
          detail: `${l.score}/${l.totalQuestions} correct`,
          timestamp: l.completedAt,
          icon: Headphones,
          colorKey: 'success',
        });
      });

    readingCompletions
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
      .slice(0, 1)
      .forEach((r) => {
        activities.push({
          id: `reading-${r.passageId}`,
          label: `Reading exercise completed`,
          detail: r.comprehensionScore != null
            ? `${r.comprehensionScore}% comprehension`
            : 'Completed',
          timestamp: r.completedAt,
          icon: BookMarked,
          colorKey: 'warning',
        });
      });

    if (dailyChallengeCompletion?.completedAt) {
      activities.push({
        id: 'daily-challenge',
        label: 'Daily Challenge completed',
        detail: `${dailyChallengeCompletion.activitiesCompleted}/${dailyChallengeCompletion.totalActivities} activities`,
        timestamp: dailyChallengeCompletion.completedAt,
        icon: Trophy,
        colorKey: 'accent',
      });
    }

    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 6);
  }, [
    progress,
    quizResults,
    speakingCompletions,
    listeningCompletions,
    readingCompletions,
    dailyChallengeCompletion,
    userLevel,
  ]);

  const dailyGoalProgress =
    dailyPlan && dailyPlan.items.length > 0
      ? (dailyPlan.items.filter((i) => i.completed).length /
          dailyPlan.items.length) *
        100
      : 0;

  const challengeCompleted = isDailyChallengeCompleted();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  const colorMap: Record<string, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    accent: theme.colors.accent,
    success: theme.colors.success,
    warning: theme.colors.warning,
  };

  const softColorMap: Record<string, string> = {
    primary: theme.colors.primarySoft,
    secondary: theme.colors.secondarySoft,
    accent: theme.colors.accentSoft,
    success: theme.colors.successSoft,
    warning: theme.colors.warningSoft,
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Progress Dashboard
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Track your journey to fluency
          </Text>
        </View>

        {isGuest && (
          <View
            style={[
              styles.guestBanner,
              { backgroundColor: theme.colors.warningSoft },
            ]}
          >
            <Text style={[styles.guestText, { color: theme.colors.warning }]}>
              You're browsing as a guest. Sign in to save your progress and see
              your full learning history.
            </Text>
          </View>
        )}

        {/* Hero stats card */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroStat}>
              <Star size={22} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.heroValue}>{user?.xp || 0}</Text>
              <Text style={styles.heroLabel}>Total XP</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Flame size={22} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.heroValue}>{user?.streak || 0}</Text>
              <Text style={styles.heroLabel}>Day Streak</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <BookOpen size={22} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.heroValue}>
                {user?.lessonsCompleted || 0}
              </Text>
              <Text style={styles.heroLabel}>Lessons</Text>
            </View>
          </View>
          <View style={styles.heroLevelRow}>
            <LevelBadge level={userLevel} size="sm" />
            <Text style={styles.heroLongest}>
              Longest streak: {streakData.longestStreak || user?.longestStreak || 0} days
            </Text>
          </View>
        </LinearGradient>

        {/* Quick stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<Mic size={22} color={theme.colors.secondary} strokeWidth={2} />}
            label="Speaking"
            value={speakingCompletions.length}
            color={theme.colors.secondary}
          />
          <StatCard
            icon={<Headphones size={22} color={theme.colors.success} strokeWidth={2} />}
            label="Listening"
            value={listeningCompletions.length}
            color={theme.colors.success}
          />
          <StatCard
            icon={<BookMarked size={22} color={theme.colors.warning} strokeWidth={2} />}
            label="Reading"
            value={readingCompletions.length}
            color={theme.colors.warning}
          />
          <StatCard
            icon={<Trophy size={22} color={theme.colors.accent} strokeWidth={2} />}
            label="Avg Quiz"
            value={`${avgScore}%`}
            color={theme.colors.accent}
          />
        </View>

        {/* Daily goal progress */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Target size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Daily Goal
              </Text>
            </View>
            <Text style={[styles.sectionMeta, { color: theme.colors.textSecondary }]}>
              {dailyPlan
                ? `${dailyPlan.items.filter((i) => i.completed).length}/${dailyPlan.items.length} tasks`
                : 'No plan today'}
            </Text>
          </View>
          <ProgressBar progress={dailyGoalProgress} height={10} />
          {dailyPlan && (
            <View style={styles.dailyPlanList}>
              {dailyPlan.items.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.dailyPlanItem,
                    { borderBottomColor: theme.colors.border },
                  ]}
                >
                  {item.completed ? (
                    <CheckCircle2
                      size={18}
                      color={theme.colors.success}
                      strokeWidth={2}
                    />
                  ) : (
                    <View
                      style={[
                        styles.dailyPlanCircle,
                        { borderColor: theme.colors.textTertiary },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.dailyPlanLabel,
                      {
                        color: item.completed
                          ? theme.colors.textSecondary
                          : theme.colors.text,
                      },
                      item.completed && styles.dailyPlanLabelDone,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Daily challenge status */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Trophy size={20} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Daily Challenge
              </Text>
            </View>
            {challengeCompleted ? (
              <View
                style={[
                  styles.challengeBadge,
                  { backgroundColor: theme.colors.successSoft },
                ]}
              >
                <CheckCircle2
                  size={14}
                  color={theme.colors.success}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.challengeBadgeText,
                    { color: theme.colors.success },
                  ]}
                >
                  Done
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.challengeBadge,
                  { backgroundColor: theme.colors.warningSoft },
                ]}
              >
                <Text
                  style={[
                    styles.challengeBadgeText,
                    { color: theme.colors.warning },
                  ]}
                >
                  {dailyChallengeCompletion?.activitiesCompleted ?? 0}/
                  {dailyChallengeCompletion?.totalActivities ?? 3}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.challengeStatusText, { color: theme.colors.textSecondary }]}>
            {challengeCompleted
              ? "Today's challenge is complete. Come back tomorrow for a new one!"
              : "Complete today's challenge to earn bonus XP."}
          </Text>
          {!challengeCompleted && (
            <TouchableOpacity
              onPress={() => router.push('/daily-challenge')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.accent, theme.colors.warning]}
                style={styles.challengeGoBtn}
              >
                <Text style={styles.challengeGoBtnText}>Go to Challenge</Text>
                <ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Card>

        {/* Per-level progress */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <BarChart3 size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Overall Progress by Level
              </Text>
            </View>
          </View>
          {levelProgress.map((lp) => (
            <View key={lp.level} style={styles.levelProgressItem}>
              <View style={styles.levelProgressHeader}>
                <LevelBadge level={lp.level} size="sm" />
                <Text
                  style={[
                    styles.levelProgressText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {lp.completed}/{lp.total} lessons
                </Text>
                <Text
                  style={[
                    styles.levelProgressPct,
                    { color: theme.colors.primary },
                  ]}
                >
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
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Course Progress
              </Text>
            </View>
            <LevelBadge level={userLevel} size="sm" />
          </View>
          <View style={styles.courseProgressInfo}>
            <Text style={[styles.progressBig, { color: theme.colors.text }]}>
              {completedLessons}
              <Text
                style={[
                  styles.progressSmall,
                  { color: theme.colors.textSecondary },
                ]}
              >
                /{lessons.length} lessons
              </Text>
            </Text>
            <Text
              style={[
                styles.progressPercent,
                { color: theme.colors.primary },
              ]}
            >
              {Math.round(courseProgress)}%
            </Text>
          </View>
          <ProgressBar progress={courseProgress} height={12} />
        </Card>

        {/* Skill breakdown */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <TrendingUp size={20} color={theme.colors.secondary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Skill Breakdown
              </Text>
            </View>
          </View>
          <View style={styles.skillList}>
            {skillRows.map((skill) => {
              const Icon = skill.icon;
              const pct =
                skill.total > 0
                  ? Math.round((skill.completed / skill.total) * 100)
                  : 0;
              const hasData = skill.completed > 0 || skill.total > 0;
              return (
                <View
                  key={skill.name}
                  style={[
                    styles.skillItem,
                    { borderBottomColor: theme.colors.border },
                  ]}
                >
                  <View style={styles.skillHeader}>
                    <View
                      style={[
                        styles.skillIcon,
                        { backgroundColor: softColorMap[skill.colorKey] },
                      ]}
                    >
                      <Icon
                        size={18}
                        color={colorMap[skill.colorKey]}
                        strokeWidth={2}
                      />
                    </View>
                    <Text
                      style={[
                        styles.skillName,
                        { color: theme.colors.text },
                      ]}
                    >
                      {skill.name}
                    </Text>
                    <Text
                      style={[
                        styles.skillValue,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {hasData
                        ? `${skill.completed}/${skill.total}`
                        : '—'}
                    </Text>
                  </View>
                  {hasData ? (
                    <View style={styles.skillBarWrap}>
                      <ProgressBar
                        progress={pct}
                        height={6}
                        color={colorMap[skill.colorKey]}
                      />
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.skillEmpty,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      Keep practicing to see your progress here.
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </Card>

        {/* Recent activity */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Calendar size={20} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Activity
              </Text>
            </View>
          </View>
          {recentActivities.length > 0 ? (
            <View style={styles.activityList}>
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <View
                    key={activity.id}
                    style={[
                      styles.activityItem,
                      { borderBottomColor: theme.colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.activityIcon,
                        { backgroundColor: softColorMap[activity.colorKey] },
                      ]}
                    >
                      <Icon
                        size={16}
                        color={colorMap[activity.colorKey]}
                        strokeWidth={2}
                      />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text
                        style={[
                          styles.activityLabel,
                          { color: theme.colors.text },
                        ]}
                        numberOfLines={1}
                      >
                        {activity.label}
                      </Text>
                      <Text
                        style={[
                          styles.activityDetail,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {activity.detail}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.activityTime,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {getRelativeTime(activity.timestamp)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.textSecondary },
              ]}
            >
              No recent activity yet. Start learning to see your progress here!
            </Text>
          )}
        </Card>

        {/* Achievements inline */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Award size={20} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Achievements
              </Text>
            </View>
            <Text
              style={[
                styles.sectionMeta,
                { color: theme.colors.textSecondary },
              ]}
            >
              {unlockedAchievements.length}/{achievements.length}
            </Text>
          </View>
          <View style={styles.achievementGrid}>
            {achievements.map((ach) => (
              <View
                key={ach.id}
                style={[
                  styles.achievementChip,
                  {
                    backgroundColor: ach.unlocked
                      ? theme.colors.successSoft
                      : theme.colors.surfaceAlt,
                    borderColor: ach.unlocked
                      ? theme.colors.success
                      : theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.achievementIcon}>
                  {ach.unlocked ? ach.icon : '🔒'}
                </Text>
                <Text
                  style={[
                    styles.achievementTitle,
                    {
                      color: ach.unlocked
                        ? theme.colors.text
                        : theme.colors.textTertiary,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {ach.title}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings/achievements')}
            activeOpacity={0.8}
            style={styles.achievementsLink}
          >
            <Text
              style={[
                styles.achievementsLinkText,
                { color: theme.colors.primary },
              ]}
            >
              View All Achievements
            </Text>
            <ArrowRight size={16} color={theme.colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </Card>
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
  guestBanner: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  guestText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
    fontWeight: fontWeight.medium,
  },
  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroStat: {
    alignItems: 'center',
    gap: 4,
  },
  heroValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  heroLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  heroDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  heroLongest: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: fontWeight.medium,
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
  sectionMeta: {
    fontSize: fontSize.sm,
  },
  dailyPlanList: {
    marginTop: spacing.md,
    gap: 0,
  },
  dailyPlanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  dailyPlanCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  dailyPlanLabel: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  dailyPlanLabelDone: {
    textDecorationLine: 'line-through',
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  challengeBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  challengeStatusText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  marginBottom: spacing.sm,
  },
  challengeGoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    minHeight: 44,
  },
  challengeGoBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
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
  skillList: {
    gap: 0,
  },
  skillItem: {
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    gap: spacing.xs,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  skillIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillName: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  skillValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  skillBarWrap: {
    marginLeft: 52,
  },
  skillEmpty: {
    marginLeft: 52,
    fontSize: fontSize.xs,
    fontStyle: 'italic',
  },
  activityList: {
    gap: 0,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    gap: 2,
  },
  activityLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  activityDetail: {
    fontSize: fontSize.xs,
  },
  activityTime: {
    fontSize: fontSize.xs,
  },
  emptyText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achievementChip: {
    width: '47%',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    lineHeight: fontSize.xs * 1.3,
  },
  achievementsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  achievementsLinkText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
