import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, CheckCircle2, Lightbulb, Award } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { LevelBadge } from '@/components/LevelBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { getLessonById } from '@/data/lessons';

type Tab = 'learn' | 'examples' | 'practice';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { user, progress, updateLessonProgress, addXP, updateStreakOnActivity, checkAchievements, completeDailyPlanItem } = useApp();
  const [tab, setTab] = useState<Tab>('learn');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const lesson = getLessonById(id);

  if (!lesson) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: theme.colors.text }]}>Lesson not found.</Text>
          <Button label="Go Back" onPress={() => router.back()} />
        </View>
      </ScreenContainer>
    );
  }

  const lessonProgress = progress.find((p) => p.lessonId === lesson.id);
  const exercises = lesson.content.exercises;

  const handleAnswerSelect = (exerciseId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [exerciseId]: answer }));
  };

  const allAnswered = exercises.every((ex) => selectedAnswers[ex.id]);
  const correctCount = exercises.filter((ex) => selectedAnswers[ex.id] === ex.correctAnswer).length;

  const handleComplete = () => {
    const percentage = Math.round((correctCount / exercises.length) * 100);
    const completed = percentage >= 60;
    updateLessonProgress({
      userId: user?.id || 'guest',
      lessonId: lesson.id,
      completionPercentage: completed ? 100 : percentage,
      score: correctCount,
      completed,
      lastAccessedAt: new Date().toISOString(),
    });
    if (completed) {
      addXP(lesson.xpReward);
      updateStreakOnActivity();
      completeDailyPlanItem('grammar_lesson');
    }
    checkAchievements();
    router.push(`/quiz/${lesson.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {lesson.title}
          </Text>
          <View style={styles.headerMeta}>
            <LevelBadge level={lesson.level} size="sm" />
            <Text style={[styles.xpReward, { color: theme.colors.accent }]}>+{lesson.xpReward} XP</Text>
          </View>
        </View>
      </View>

      {lessonProgress && (
        <View style={styles.progressBanner}>
          <ProgressBar progress={lessonProgress.completionPercentage} />
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            {lessonProgress.completionPercentage}% Complete
          </Text>
        </View>
      )}

      <View style={[styles.tabs, { borderBottomColor: theme.colors.border }]}>
        {(['learn', 'examples', 'practice'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tab,
              tab === t && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 },
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: tab === t ? theme.colors.primary : theme.colors.textSecondary },
              ]}
            >
              {t === 'learn' ? 'Learn' : t === 'examples' ? 'Examples' : 'Practice'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tab === 'learn' && (
          <Card style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <BookOpen size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Explanation</Text>
            </View>
            <Text style={[styles.explanation, { color: theme.colors.textSecondary }]}>
              {lesson.content.explanation}
            </Text>
          </Card>
        )}

        {tab === 'examples' && (
          <View style={styles.examplesContainer}>
            {lesson.content.examples.map((example, index) => (
              <Card key={index} style={styles.section}>
                <View style={styles.sectionTitleRow}>
                  <Lightbulb size={20} color={theme.colors.accent} strokeWidth={2} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{example.title}</Text>
                </View>
                <View style={styles.exampleSentences}>
                  {example.sentences.map((sentence, sIndex) => (
                    <View key={sIndex} style={[styles.exampleItem, { borderBottomColor: theme.colors.border }]}>
                      <View style={[styles.bullet, { backgroundColor: theme.colors.primarySoft }]}>
                        <Text style={[styles.bulletText, { color: theme.colors.primary }]}>{sIndex + 1}</Text>
                      </View>
                      <Text style={[styles.exampleText, { color: theme.colors.text }]}>{sentence}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab === 'practice' && (
          <View style={styles.practiceContainer}>
            {exercises.map((exercise, index) => {
              const selected = selectedAnswers[exercise.id];
              const isCorrect = selected === exercise.correctAnswer;
              return (
                <Card key={exercise.id} style={styles.section}>
                  <Text style={[styles.exerciseNumber, { color: theme.colors.textTertiary }]}>
                    Question {index + 1}
                  </Text>
                  <Text style={[styles.exerciseQuestion, { color: theme.colors.text }]}>
                    {exercise.question}
                  </Text>
                  {exercise.options ? (
                    <View style={styles.optionsContainer}>
                      {exercise.options.map((option) => {
                        const isSelected = selected === option;
                        const showCorrect = selected && option === exercise.correctAnswer;
                        const showWrong = isSelected && option !== exercise.correctAnswer;
                        return (
                          <TouchableOpacity
                            key={option}
                            onPress={() => handleAnswerSelect(exercise.id, option)}
                            activeOpacity={0.8}
                            style={[
                              styles.option,
                              {
                                borderColor: showCorrect
                                  ? theme.colors.success
                                  : showWrong
                                  ? theme.colors.error
                                  : isSelected
                                  ? theme.colors.primary
                                  : theme.colors.border,
                                backgroundColor: showCorrect
                                  ? theme.colors.successSoft
                                  : showWrong
                                  ? theme.colors.errorSoft
                                  : isSelected
                                  ? theme.colors.primarySoft
                                  : 'transparent',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                {
                                  color: showCorrect
                                    ? theme.colors.success
                                    : showWrong
                                    ? theme.colors.error
                                    : isSelected
                                    ? theme.colors.primary
                                    : theme.colors.text,
                                },
                              ]}
                            >
                              {option}
                            </Text>
                            {showCorrect && <CheckCircle2 size={18} color={theme.colors.success} strokeWidth={2} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <TextInput
                      style={[styles.fillInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
                      placeholder="Type your answer..."
                      placeholderTextColor={theme.colors.textTertiary}
                      value={selected || ''}
                      onChangeText={(text) => handleAnswerSelect(exercise.id, text)}
                    />
                  )}
                  {selected && (
                    <View style={[styles.explanationBox, { backgroundColor: theme.colors.primarySoft }]}>
                      <Text style={[styles.explanationBoxText, { color: theme.colors.text }]}>
                        {exercise.explanation}
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })}
            {allAnswered && (
              <View style={[styles.resultBox, { backgroundColor: correctCount >= exercises.length * 0.6 ? theme.colors.successSoft : theme.colors.warningSoft }]}>
                <Award size={28} color={correctCount >= exercises.length * 0.6 ? theme.colors.success : theme.colors.warning} strokeWidth={2} />
                <Text style={[styles.resultText, { color: theme.colors.text }]}>
                  You got {correctCount}/{exercises.length} correct!
                </Text>
                <Button label="Take Quiz" onPress={handleComplete} size="md" />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  xpReward: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  progressBanner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: 4,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    textAlign: 'right',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  tabLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  explanation: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.6,
  },
  examplesContainer: {
    gap: spacing.md,
  },
  exampleSentences: {
    gap: 0,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bulletText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  exampleText: {
    flex: 1,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  practiceContainer: {
    gap: spacing.md,
  },
  exerciseNumber: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  exerciseQuestion: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
    lineHeight: fontSize.md * 1.5,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.sm,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
  },
  fillInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    minHeight: 48,
  },
  explanationBox: {
    marginTop: spacing.sm,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
  },
  explanationBoxText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  resultBox: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  resultText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  notFoundText: {
    fontSize: fontSize.lg,
  },
});
