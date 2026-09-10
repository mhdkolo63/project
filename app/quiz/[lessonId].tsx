import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Star, RotateCcw } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { getLessonById } from '@/data/lessons';
import { QuizResult } from '@/types';

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { theme } = useTheme();
  const { user, addQuizResult, addXP, updateStreakOnActivity, checkAchievements, completeDailyPlanItem } = useApp();
  const lesson = getLessonById(lessonId);
  const quiz = lesson?.content.quiz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!quiz) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: theme.colors.text }]}>Quiz not found.</Text>
          <Button label="Go Back" onPress={() => router.back()} />
        </View>
      </ScreenContainer>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;
  const progress = ((currentIndex + (showResult ? 1 : 0)) / totalQuestions) * 100;

  const handleSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNext = () => {
    setAnswers((prev) => [...prev, selectedAnswer]);
    if (isLast) {
      const finalAnswers = [...answers, selectedAnswer];
      const score = quiz.questions.filter((q, i) => finalAnswers[i] === q.correctAnswer).length;
      const result: QuizResult = {
        userId: user?.id || 'guest',
        quizId: quiz.id,
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
      };
      addQuizResult(result);
      if (score >= totalQuestions * 0.6) {
        addXP(50);
        updateStreakOnActivity();
        completeDailyPlanItem('quiz');
      }
      checkAchievements();
      setCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  if (completed) {
    const score = quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length;
    const passed = score >= totalQuestions * 0.6;
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.resultContainer}>
          <LinearGradient
            colors={passed ? [theme.colors.success, '#15803D'] : [theme.colors.warning, '#D97706']}
            style={styles.resultIconCircle}
          >
            <Trophy size={56} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>Quiz Completed!</Text>
          <Text style={[styles.resultScore, { color: theme.colors.text }]}>
            Score: {score}/{totalQuestions}
          </Text>
          <View style={[styles.xpEarned, { backgroundColor: theme.colors.accentSoft }]}>
            <Star size={20} color={theme.colors.accent} strokeWidth={2} />
            <Text style={[styles.xpEarnedText, { color: theme.colors.accent }]}>
              {passed ? '+50 XP Earned' : 'Keep practicing!'}
            </Text>
          </View>
          <View style={styles.resultQuestions}>
            {quiz.questions.map((q, i) => {
              const correct = answers[i] === q.correctAnswer;
              return (
                <View key={q.id} style={[styles.resultQuestion, { borderBottomColor: theme.colors.border }]}>
                  {correct ? (
                    <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />
                  ) : (
                    <XCircle size={20} color={theme.colors.error} strokeWidth={2} />
                  )}
                  <View style={styles.resultQuestionInfo}>
                    <Text style={[styles.resultQuestionText, { color: theme.colors.text }]} numberOfLines={2}>
                      {q.question}
                    </Text>
                    {!correct && (
                      <Text style={[styles.resultCorrectAnswer, { color: theme.colors.success }]}>
                        Answer: {q.correctAnswer}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.resultActions}>
            <Button
              label="Back to Lessons"
              onPress={() => router.replace('/(tabs)/learn')}
              fullWidth
              size="lg"
            />
            <TouchableOpacity
              onPress={() => {
                setCurrentIndex(0);
                setSelectedAnswer('');
                setAnswers([]);
                setShowResult(false);
                setCompleted(false);
              }}
              style={styles.retryButton}
            >
              <RotateCcw size={18} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.retryText, { color: theme.colors.primary }]}>Retry Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{quiz.title}</Text>
        <Text style={[styles.questionCounter, { color: theme.colors.textSecondary }]}>
          {currentIndex + 1}/{totalQuestions}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} height={6} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.questionType, { color: theme.colors.textTertiary }]}>
          {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : currentQuestion.type === 'fill-blank' ? 'Fill in the Blank' : 'Sentence Correction'}
        </Text>
        <Text style={[styles.question, { color: theme.colors.text }]}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.options ? (
          <View style={styles.options}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleSelect(option)}
                  disabled={showResult}
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
                        : theme.colors.surface,
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
                  {showCorrect && <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />}
                  {showWrong && <XCircle size={20} color={theme.colors.error} strokeWidth={2} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View>
            <TextInput
              style={[styles.fillInput, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface }]}
              placeholder="Type your answer..."
              placeholderTextColor={theme.colors.textTertiary}
              value={selectedAnswer}
              onChangeText={setSelectedAnswer}
              editable={!showResult}
            />
            {!showResult && (
              <Button
                label="Submit"
                onPress={() => selectedAnswer && setShowResult(true)}
                disabled={!selectedAnswer}
                fullWidth
                style={styles.submitButton}
              />
            )}
          </View>
        )}

        {showResult && (
          <View style={[styles.explanationBox, { backgroundColor: selectedAnswer === currentQuestion.correctAnswer ? theme.colors.successSoft : theme.colors.errorSoft }]}>
            <Text style={[styles.explanationLabel, { color: selectedAnswer === currentQuestion.correctAnswer ? theme.colors.success : theme.colors.error }]}>
              {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Not quite.'}
            </Text>
            <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </ScrollView>

      {showResult && (
        <View style={[styles.bottomBar, { borderTopColor: theme.colors.border }]}>
          <Button
            label={isLast ? 'Finish Quiz' : 'Next Question'}
            onPress={handleNext}
            fullWidth
            size="lg"
          />
        </View>
      )}
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
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  questionCounter: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  questionType: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * 1.4,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.sm,
    minHeight: 56,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
  },
  fillInput: {
    borderWidth: 2,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    minHeight: 52,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  explanationBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: 4,
  },
  explanationLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  explanationText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  bottomBar: {
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  resultIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  resultTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  resultScore: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
  },
  xpEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  xpEarnedText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  resultQuestions: {
    width: '100%',
    gap: 0,
  },
  resultQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  resultQuestionInfo: {
    flex: 1,
    gap: 2,
  },
  resultQuestionText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  resultCorrectAnswer: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  resultActions: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  retryText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
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
