import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Headphones, ChevronLeft, CheckCircle2, Clock, Star } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel } from '@/types';
import { getListeningByLevel } from '@/data/listeningExercises';

const levelTabs: { level: EnglishLevel; label: string; emoji: string }[] = [
  { level: 'Beginner', label: 'Beginner', emoji: '🟢' },
  { level: 'Intermediate', label: 'Intermediate', emoji: '🟡' },
  { level: 'Advanced', label: 'Advanced', emoji: '🔴' },
];

export default function ListeningPracticeScreen() {
  const { theme } = useTheme();
  const { user, isListeningCompleted } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(user?.englishLevel || 'Beginner');

  const exercises = useMemo(() => getListeningByLevel(selectedLevel), [selectedLevel]);

  const handleStart = (exerciseId: string) => {
    router.push(`/listening/${exerciseId}`);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primarySoft }]}>
            <Headphones size={24} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Listening Practice</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Improve your listening skills with practical English conversations.
          </Text>
        </View>
      </View>

      <View style={styles.levelSection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
          Choose Your Level
        </Text>
        <View style={styles.tabs}>
          {levelTabs.map((tab) => {
            const isActive = selectedLevel === tab.level;
            return (
              <TouchableOpacity
                key={tab.level}
                onPress={() => setSelectedLevel(tab.level)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Select ${tab.label} level`}
              >
                <View
                  style={[
                    styles.tab,
                    isActive
                      ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
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
      </View>

      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
        Choose an Exercise ({exercises.length})
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.exerciseList}>
        {exercises.map((exercise) => {
          const completed = isListeningCompleted(exercise.id);
          return (
            <TouchableOpacity
              key={exercise.id}
              onPress={() => handleStart(exercise.id)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Start ${exercise.title}`}
            >
              <Card style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={[styles.exerciseIcon, { backgroundColor: theme.colors.primarySoft }]}>
                    <Headphones size={20} color={theme.colors.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseTitle, { color: theme.colors.text }]}>
                      {exercise.title}
                    </Text>
                    <Text
                      style={[styles.exerciseDesc, { color: theme.colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {exercise.description}
                    </Text>
                  </View>
                  {completed && (
                    <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />
                  )}
                </View>
                <View style={styles.exerciseMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={theme.colors.textTertiary} strokeWidth={2} />
                    <Text style={[styles.metaText, { color: theme.colors.textTertiary }]}>
                      {exercise.estimatedMinutes} min
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Star size={14} color={theme.colors.textTertiary} strokeWidth={2} />
                    <Text style={[styles.metaText, { color: theme.colors.textTertiary }]}>
                      {exercise.xpReward} XP
                    </Text>
                  </View>
                  <View style={[styles.metaBadge, { backgroundColor: theme.colors.surfaceAlt }]}>
                    <Text style={[styles.metaBadgeText, { color: theme.colors.textSecondary }]}>
                      {exercise.comprehensionQuestions.length} questions
                    </Text>
                  </View>
                </View>
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
  },
  backBtn: {
    marginBottom: spacing.sm,
  },
  headerContent: {
    gap: spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  levelSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  exerciseList: {
    paddingBottom: spacing.xxl + 40,
    gap: spacing.md,
  },
  exerciseCard: {
    gap: spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  exerciseTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  exerciseDesc: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingLeft: 48,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSize.xs,
  },
  metaBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  metaBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
