import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, Circle, Lock, Play, Mic, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { LevelBadge } from '@/components/LevelBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel } from '@/types';
import { getLessonsByLevel } from '@/data/lessons';

const levelTabs: { level: EnglishLevel; label: string; emoji: string }[] = [
  { level: 'Beginner', label: 'Beginner', emoji: '🟢' },
  { level: 'Intermediate', label: 'Intermediate', emoji: '🟡' },
  { level: 'Advanced', label: 'Advanced', emoji: '🔴' },
];

export default function LearnScreen() {
  const { theme } = useTheme();
  const { user, progress } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(user?.englishLevel || 'Beginner');

  const lessons = useMemo(() => getLessonsByLevel(selectedLevel), [selectedLevel]);

  const getLessonStatus = (lessonId: string) => {
    const p = progress.find((pr) => pr.lessonId === lessonId);
    if (p?.completed) return 'completed';
    if (p && p.completionPercentage > 0) return 'in-progress';
    return 'locked';
  };

  const completedCount = lessons.filter((l) => getLessonStatus(l.id) === 'completed').length;
  const overallProgress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Learning Path</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Master English step by step
        </Text>
      </View>

      <View style={styles.tabs}>
        {levelTabs.map((tab) => {
          const isActive = selectedLevel === tab.level;
          return (
            <TouchableOpacity
              key={tab.level}
              onPress={() => setSelectedLevel(tab.level)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.tab,
                  isActive
                    ? { backgroundColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
                ]}
              >
                <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            Course Progress
          </Text>
          <Text style={[styles.progressValue, { color: theme.colors.text }]}>
            {completedCount}/{lessons.length} lessons
          </Text>
        </View>
        <ProgressBar progress={overallProgress} />
      </View>

      <TouchableOpacity
        onPress={() => router.push('/speaking-practice')}
        activeOpacity={0.8}
        style={styles.speakingCard}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.speakingGradient}
        >
          <View style={styles.speakingIconBox}>
            <Mic size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={styles.speakingTextContainer}>
            <Text style={styles.speakingCardTitle}>Speaking Practice</Text>
            <Text style={styles.speakingCardDesc}>Improve your English speaking confidence</Text>
          </View>
          <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.lessonsList}>
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson.id);
          const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
          return (
            <TouchableOpacity
              key={lesson.id}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
              activeOpacity={0.8}
              style={styles.lessonRow}
            >
              <View style={styles.lessonNumber}>
                {status === 'completed' ? (
                  <CheckCircle2 size={28} color={theme.colors.success} strokeWidth={2} />
                ) : status === 'in-progress' ? (
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryDark]}
                    style={styles.lessonNumberCircle}
                  >
                    <Play size={16} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
                  </LinearGradient>
                ) : (
                  <View style={[styles.lessonNumberCircle, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
                    <Text style={[styles.lessonNumberText, { color: theme.colors.textTertiary }]}>
                      {index + 1}
                    </Text>
                  </View>
                )}
              </View>
              <Card style={styles.lessonCard}>
                <View style={styles.lessonCardHeader}>
                  <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
                    {lesson.title}
                  </Text>
                  {status === 'completed' && (
                    <View style={[styles.xpBadge, { backgroundColor: theme.colors.accentSoft }]}>
                      <Text style={[styles.xpText, { color: theme.colors.accent }]}>
                        +{lesson.xpReward} XP
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.lessonDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {lesson.description}
                </Text>
                {status === 'in-progress' && lessonProgress && (
                  <View style={styles.lessonProgressBar}>
                    <ProgressBar progress={lessonProgress.completionPercentage} />
                    <Text style={[styles.lessonProgressText, { color: theme.colors.textSecondary }]}>
                      {lessonProgress.completionPercentage}% Complete
                    </Text>
                  </View>
                )}
                {status === 'locked' && (
                  <View style={styles.lessonFooter}>
                    <Lock size={14} color={theme.colors.textTertiary} strokeWidth={2} />
                    <Text style={[styles.lockedText, { color: theme.colors.textTertiary }]}>
                      Tap to start
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tabEmoji: {
    fontSize: fontSize.sm,
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  progressValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  speakingCard: { marginBottom: spacing.lg, borderRadius: radius.lg, overflow: 'hidden' },
  speakingGradient: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  speakingIconBox: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.16)' },
  speakingTextContainer: { flex: 1, gap: 4 },
  speakingCardTitle: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: fontWeight.bold },
  speakingCardDesc: { color: 'rgba(255,255,255,0.88)', fontSize: fontSize.xs, lineHeight: fontSize.xs * 1.4 },
  lessonsList: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lessonNumber: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  lessonNumberText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  lessonCard: {
    flex: 1,
    paddingVertical: spacing.md,
  paddingHorizontal: spacing.md,
  gap: 4,
  },
  lessonCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lessonTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  xpBadge: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  xpText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  lessonDesc: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  lessonProgressBar: {
    marginTop: spacing.xs + 2,
    gap: 4,
  },
  lessonProgressText: {
    fontSize: fontSize.xs,
    textAlign: 'right',
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  lockedText: {
    fontSize: fontSize.xs,
  },
});
