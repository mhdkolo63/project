import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Star, BookOpen, Target, ArrowRight, Zap, Calendar, Lightbulb, CheckCircle2, Circle, ListChecks, Mic, Trophy, BookMarked, Headphones, BarChart3, GraduationCap } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { LevelBadge } from '@/components/LevelBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { getLessonsByLevel } from '@/data/lessons';
import { dailyChallenges } from '@/data/dailyChallenges';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user, progress, dailyPlan, dailyChallengeCompletion, isDailyChallengeCompleted, vocabulary } = useApp();
  const [challengeRevealed, setChallengeRevealed] = useState(false);

  const currentLesson = useMemo(() => {
    const lessons = getLessonsByLevel(user?.englishLevel || 'Beginner');
    const inProgress = progress.find((p) => !p.completed && p.completionPercentage > 0);
    if (inProgress) {
      return lessons.find((l) => l.id === inProgress.lessonId);
    }
    const completedIds = progress.filter((p) => p.completed).map((p) => p.lessonId);
    const nextLesson = lessons.find((l) => !completedIds.includes(l.id));
    return nextLesson || lessons[0];
  }, [user, progress]);

  const currentProgress = progress.find((p) => p.lessonId === currentLesson?.id);
  const dailyChallenge = dailyChallenges[new Date().getDate() % dailyChallenges.length];
  const challengeCompleted = isDailyChallengeCompleted();
  const challengeActivitiesDone = dailyChallengeCompletion?.activitiesCompleted ?? 0;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              {getGreeting()}, {user?.name || 'Learner'} 👋
            </Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>Ready to learn today?</Text>
          </View>
          {user && <LevelBadge level={user.englishLevel} size="sm" />}
        </View>

        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.statsCard}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Flame size={24} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.statValue}>{user?.streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Star size={24} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.statValue}>{user?.xp || 0}</Text>
              <Text style={styles.statLabel}>XP Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <BookOpen size={24} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.statValue}>{user?.lessonsCompleted || 0}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/progress')}
          activeOpacity={0.8}
          style={styles.dashboardCard}
        >
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.secondaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dashboardGradient}
          >
            <View style={styles.dashboardIconBox}>
              <BarChart3 size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.dashboardTextContainer}>
              <Text style={styles.dashboardCardTitle}>My Progress</Text>
              <Text style={styles.dashboardCardDesc}>
                View your XP, streak, skill breakdown, and recent activity
              </Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/level-assessment')}
          activeOpacity={0.8}
          style={styles.assessmentCard}
        >
          <LinearGradient
            colors={[theme.colors.accent, theme.colors.warning]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.assessmentGradient}
          >
            <View style={styles.assessmentIconBox}>
              <GraduationCap size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.assessmentTextContainer}>
              <Text style={styles.assessmentCardTitle}>Check My English Level</Text>
              <Text style={styles.assessmentCardDesc}>
                Take a quick assessment to discover your recommended level
              </Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Target size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Goal</Text>
            </View>
            <Text style={[styles.sectionMeta, { color: theme.colors.textSecondary }]}>
              {Math.min(user?.lessonsCompleted || 0, user?.dailyGoal || 3)}/{user?.dailyGoal || 3} lessons
            </Text>
          </View>
          <ProgressBar
            progress={((Math.min(user?.lessonsCompleted || 0, user?.dailyGoal || 3)) / (user?.dailyGoal || 3)) * 100}
            style={styles.progress}
          />
        </Card>

        <TouchableOpacity
          onPress={() => router.push('/daily-challenge')}
          activeOpacity={0.8}
          style={styles.dailyChallengeCard}
        >
          <LinearGradient
            colors={[theme.colors.accent, theme.colors.warning]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dailyChallengeGradient}
          >
            <View style={styles.dailyChallengeIconBox}>
              <Trophy size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.dailyChallengeTextContainer}>
              <Text style={styles.dailyChallengeCardTitle}>Daily English Challenge</Text>
              <Text style={styles.dailyChallengeCardDesc}>
                Complete today's activities and improve your English
              </Text>
              <View style={styles.dailyChallengeProgressRow}>
                <View style={styles.dailyChallengeProgressBar}>
                  <View style={[styles.dailyChallengeProgressFill, { width: `${(challengeActivitiesDone / 3) * 100}%` }]} />
                </View>
                <Text style={styles.dailyChallengeProgressText}>
                  {challengeActivitiesDone} of 3 completed
                </Text>
              </View>
            </View>
            {challengeCompleted ? (
              <CheckCircle2 size={24} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {dailyPlan && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <ListChecks size={20} color={theme.colors.secondary} strokeWidth={2} />
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Learning Plan</Text>
              </View>
              <Text style={[styles.sectionMeta, { color: theme.colors.textSecondary }]}>
                {dailyPlan.items.filter((i) => i.completed).length}/{dailyPlan.items.length}
              </Text>
            </View>
            <View style={styles.planList}>
              {dailyPlan.items.map((item) => (
                <View key={item.id} style={[styles.planItem, { borderBottomColor: theme.colors.border }]}>
                  {item.completed ? (
                    <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />
                  ) : (
                    <Circle size={20} color={theme.colors.textTertiary} strokeWidth={2} />
                  )}
                  <Text
                    style={[
                      styles.planLabel,
                      { color: item.completed ? theme.colors.textSecondary : theme.colors.text },
                      item.completed && styles.planLabelDone,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Zap size={20} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Continue Learning</Text>
            </View>
          </View>
          {currentLesson ? (
            <View>
              <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
                {currentLesson.title}
              </Text>
              <Text style={[styles.lessonDesc, { color: theme.colors.textSecondary }]}>
                {currentLesson.description}
              </Text>
              <ProgressBar
                progress={currentProgress?.completionPercentage || 0}
                style={styles.progress}
                color={theme.colors.accent}
              />
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {currentProgress?.completionPercentage || 0}% Complete
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/lesson/${currentLesson.id}`)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.primaryDark]}
                  style={styles.continueButton}
                >
                  <Text style={styles.continueText}>Continue Learning</Text>
                  <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No lessons available. Select a level to get started.
            </Text>
          )}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Lightbulb size={20} color={theme.colors.warning} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Challenge</Text>
            </View>
          </View>
          <Text style={[styles.challengeQuestion, { color: theme.colors.text }]}>
            {dailyChallenge.question}
          </Text>
          {challengeRevealed ? (
            <View style={[styles.challengeAnswer, { backgroundColor: theme.colors.successSoft }]}>
              <Text style={[styles.challengeAnswerLabel, { color: theme.colors.success }]}>
                ✅ {dailyChallenge.correctAnswer}
              </Text>
              <Text style={[styles.challengeExplanation, { color: theme.colors.textSecondary }]}>
                {dailyChallenge.explanation}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => setChallengeRevealed(!challengeRevealed)}
            style={[styles.challengeButton, { borderColor: theme.colors.warning }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.challengeButtonText, { color: theme.colors.warning }]}>
              {challengeRevealed ? 'Hide Answer' : 'Show Answer'}
            </Text>
          </TouchableOpacity>
        </Card>

        <TouchableOpacity
          onPress={() => router.push('/reading-practice')}
          activeOpacity={0.8}
          style={styles.readingPracticalCard}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.readingGradient}
          >
            <View style={styles.readingIconBox}>
              <BookOpen size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.readingTextContainer}>
              <Text style={styles.readingCardTitle}>Reading Practice</Text>
              <Text style={styles.readingCardDesc}>Read passages by topic & level, with comprehension quizzes</Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/speaking-practice')}
          activeOpacity={0.8}
          style={styles.speakingPracticalCard}
        >
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.secondaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.speakingGradient}
          >
            <View style={styles.speakingIconBox}>
              <Mic size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.speakingTextContainer}>
              <Text style={styles.speakingCardTitle}>Speaking Practical</Text>
              <Text style={styles.speakingCardDesc}>Practice speaking English and get instant AI feedback</Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/vocabulary-review')}
          activeOpacity={0.8}
          style={styles.vocabReviewCard}
        >
          <LinearGradient
            colors={[theme.colors.secondary, theme.colors.secondaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.vocabReviewGradient}
          >
            <View style={styles.vocabReviewIconBox}>
              <BookMarked size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.vocabReviewTextContainer}>
              <Text style={styles.vocabReviewCardTitle}>Vocabulary Review</Text>
              <Text style={styles.vocabReviewCardDesc}>
                {vocabulary.length > 0
                  ? `Review ${vocabulary.length} saved ${vocabulary.length === 1 ? 'word' : 'words'} and mark them as learned`
                  : 'Save words from your lessons to start reviewing'}
              </Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/listening-practice')}
          activeOpacity={0.8}
          style={styles.listeningCard}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.listeningGradient}
          >
            <View style={styles.listeningIconBox}>
              <Headphones size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.listeningTextContainer}>
              <Text style={styles.listeningCardTitle}>Listening Practice</Text>
              <Text style={styles.listeningCardDesc}>Improve your listening skills with practical English conversations.</Text>
            </View>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={() => router.push('/grammar-check')}
            activeOpacity={0.8}
          >
            <Card style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: theme.colors.secondarySoft }]}>
                <BookOpen size={24} color={theme.colors.secondary} strokeWidth={2} />
              </View>
              <Text style={[styles.quickLabel, { color: theme.colors.text }]}>Check My English</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/ai-tutor')}
            activeOpacity={0.8}
          >
            <Card style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: theme.colors.primarySoft }]}>
                <Zap size={24} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <Text style={[styles.quickLabel, { color: theme.colors.text }]}>AI Tutor</Text>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.md,
    marginBottom: 2,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * 1.2,
  },
  statsCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  progress: {
    marginTop: spacing.sm,
  },
  progressText: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  lessonTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs,
  },
  lessonDesc: {
    fontSize: fontSize.sm,
    marginTop: 2,
    marginBottom: spacing.xs,
    lineHeight: fontSize.sm * 1.4,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
    minHeight: 48,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  emptyText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  challengeQuestion: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
    lineHeight: fontSize.md * 1.5,
  },
  challengeAnswer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  challengeAnswerLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  challengeExplanation: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  challengeButton: {
    borderWidth: 2,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  challengeButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  readingPracticalCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  readingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  readingIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  readingTextContainer: {
    flex: 1,
    gap: 4,
  },
  readingCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  readingCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  speakingPracticalCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  speakingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  speakingIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  speakingTextContainer: {
    flex: 1,
    gap: 4,
  },
  speakingCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  speakingCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  planList: {
    gap: 0,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  planLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  planLabelDone: {
    textDecorationLine: 'line-through',
  },
  quickCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  dailyChallengeCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  dailyChallengeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  dailyChallengeIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  dailyChallengeTextContainer: {
    flex: 1,
    gap: 4,
  },
  dailyChallengeCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  dailyChallengeCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  dailyChallengeProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  dailyChallengeProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  dailyChallengeProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  dailyChallengeProgressText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  vocabReviewCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  vocabReviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  vocabReviewIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  vocabReviewTextContainer: {
    flex: 1,
    gap: 4,
  },
  vocabReviewCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  vocabReviewCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  listeningCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  listeningGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  listeningIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  listeningTextContainer: {
    flex: 1,
    gap: 4,
  },
  listeningCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  listeningCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  dashboardCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  dashboardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  dashboardIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  dashboardTextContainer: {
    flex: 1,
    gap: 4,
  },
  dashboardCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  dashboardCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  assessmentCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  assessmentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  assessmentIconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  assessmentTextContainer: {
    flex: 1,
    gap: 4,
  },
  assessmentCardTitle: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  assessmentCardDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
});
