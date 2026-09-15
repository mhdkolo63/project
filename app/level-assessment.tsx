import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Home,
  Trophy,
  BookOpen,
  Bookmark,
  PenLine,
  FileText,
  Star,
  AlertCircle,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { LevelBadge } from '@/components/LevelBadge';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { assessmentQuestions } from '@/data/levelAssessment';
import { EnglishLevel } from '@/types';

type Phase = 'intro' | 'quiz' | 'result';

const categoryIcons: Record<string, typeof BookOpen> = {
  Grammar: BookOpen,
  Vocabulary: Bookmark,
  'Sentence Usage': PenLine,
  'Reading Comprehension': FileText,
};

export default function LevelAssessmentScreen() {
  const { theme } = useTheme();
  const { user, setEnglishLevel } = useApp();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const totalQuestions = assessmentQuestions.length;
  const question = assessmentQuestions[currentIndex];

  const score = useMemo(() => answers.filter(Boolean).length, [answers]);

  const result = useMemo(() => {
    const beginnerCorrect = assessmentQuestions
      .map((q, i) => ({ q, correct: answers[i] ?? false }))
      .filter(({ q, correct }) => q.level === 'Beginner' && correct).length;
    const beginnerTotal = assessmentQuestions.filter(
      (q) => q.level === 'Beginner'
    ).length;
    const intermediateCorrect = assessmentQuestions
      .map((q, i) => ({ q, correct: answers[i] ?? false }))
      .filter(({ q, correct }) => q.level === 'Intermediate' && correct).length;
    const intermediateTotal = assessmentQuestions.filter(
      (q) => q.level === 'Intermediate'
    ).length;
    const advancedCorrect = assessmentQuestions
      .map((q, i) => ({ q, correct: answers[i] ?? false }))
      .filter(({ q, correct }) => q.level === 'Advanced' && correct).length;
    const advancedTotal = assessmentQuestions.filter(
      (q) => q.level === 'Advanced'
    ).length;

    const beginnerPct = beginnerTotal > 0 ? beginnerCorrect / beginnerTotal : 0;
    const intermediatePct =
      intermediateTotal > 0 ? intermediateCorrect / intermediateTotal : 0;
    const advancedPct = advancedTotal > 0 ? advancedCorrect / advancedTotal : 0;

    let recommendedLevel: EnglishLevel = 'Beginner';
    if (advancedPct >= 0.6) recommendedLevel = 'Advanced';
    else if (intermediatePct >= 0.6) recommendedLevel = 'Intermediate';
    else recommendedLevel = 'Beginner';

    return {
      recommendedLevel,
      beginnerCorrect,
      beginnerTotal,
      intermediateCorrect,
      intermediateTotal,
      advancedCorrect,
      advancedTotal,
      beginnerPct: Math.round(beginnerPct * 100),
      intermediatePct: Math.round(intermediatePct * 100),
      advancedPct: Math.round(advancedPct * 100),
    };
  }, [answers]);

  const handleSelectAnswer = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !question) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    setAnswers((prev) => [...prev, isCorrect]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex === totalQuestions - 1) {
      setPhase('result');
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleStart = () => {
    setPhase('quiz');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers([]);
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleSaveLevel = useCallback(() => {
    const currentLevel = user?.englishLevel;
    const recommended = result.recommendedLevel;

    if (currentLevel && currentLevel !== recommended) {
      Alert.alert(
        'Change Your Level?',
        `Your current level is ${currentLevel}. The assessment recommends ${recommended}. Would you like to update your level?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update Level',
            onPress: () => {
              setEnglishLevel(recommended);
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } else {
      setEnglishLevel(recommended);
      router.replace('/(tabs)');
    }
  }, [user, result, setEnglishLevel]);

  const progressPct = ((currentIndex + (showFeedback ? 1 : 0)) / totalQuestions) * 100;

  if (phase === 'intro') {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.introContainer}>
          <View style={styles.introHeader}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.introContent}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.introIconCircle}
            >
              <GraduationCap size={48} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>

            <Text style={[styles.introTitle, { color: theme.colors.text }]}>
              English Level Assessment
            </Text>
            <Text
              style={[
                styles.introDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Answer a few questions to discover your approximate English level.
              The assessment covers grammar, vocabulary, sentence usage, and
              reading comprehension.
            </Text>

            <View
              style={[
                styles.introInfoCard,
                { backgroundColor: theme.colors.surfaceAlt },
              ]}
            >
              <View style={styles.introInfoRow}>
                <BookOpen size={18} color={theme.colors.primary} strokeWidth={2} />
                <Text
                  style={[
                    styles.introInfoText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {totalQuestions} multiple-choice questions
                </Text>
              </View>
              <View style={styles.introInfoRow}>
                <Star size={18} color={theme.colors.accent} strokeWidth={2} />
                <Text
                  style={[
                    styles.introInfoText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Beginner, Intermediate & Advanced coverage
                </Text>
              </View>
              <View style={styles.introInfoRow}>
                <Trophy size={18} color={theme.colors.secondary} strokeWidth={2} />
                <Text
                  style={[
                    styles.introInfoText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Get a recommended level instantly
                </Text>
              </View>
            </View>

            {user?.isGuest && (
              <View
                style={[
                  styles.guestNote,
                  { backgroundColor: theme.colors.warningSoft },
                ]}
              >
                <AlertCircle
                  size={16}
                  color={theme.colors.warning}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.guestNoteText,
                    { color: theme.colors.warning },
                  ]}
                >
                  You can take the assessment as a guest, but you'll need to
                  sign in to save the result to your account.
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleStart}
              activeOpacity={0.8}
              style={styles.introButtonWrap}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.introButton}
              >
                <Text style={styles.introButtonText}>Start Assessment</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (phase === 'result') {
    const percentage = Math.round((score / totalQuestions) * 100);
    const levelAdvice: Record<EnglishLevel, string> = {
      Beginner: 'Start with foundational lessons to build your grammar and vocabulary.',
      Intermediate:
        'Practice grammar, vocabulary, and everyday conversations to strengthen your skills.',
      Advanced:
        'Focus on fluency, accuracy, and advanced communication to refine your mastery.',
    };

    const levelColor: Record<EnglishLevel, string> = {
      Beginner: theme.colors.beginner,
      Intermediate: theme.colors.intermediate,
      Advanced: theme.colors.advanced,
    };

    return (
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultScroll}
        >
          <View style={styles.resultHeader}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.resultIconCircle}
            >
              <Trophy size={48} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
            <Text style={[styles.resultTitle, { color: theme.colors.text }]}>
              Assessment Complete!
            </Text>
          </View>

          <Card style={styles.section}>
            <Text
              style={[
                styles.resultLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
            Recommended Level
            </Text>
            <View style={styles.resultLevelRow}>
              <LevelBadge level={result.recommendedLevel} size="md" />
              <Text
                style={[
                  styles.resultLevelText,
                  { color: levelColor[result.recommendedLevel] },
                ]}
              >
                {result.recommendedLevel}
              </Text>
            </View>
            <Text
              style={[
                styles.resultAdvice,
                { color: theme.colors.textSecondary },
              ]}
            >
              {levelAdvice[result.recommendedLevel]}
            </Text>
          </Card>

          <View style={styles.scoreGrid}>
            <View
              style={[
                styles.scoreCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text style={[styles.scoreValue, { color: theme.colors.text }]}>
                {score}/{totalQuestions}
              </Text>
              <Text
                style={[
                  styles.scoreLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Correct Answers
              </Text>
            </View>
            <View
              style={[
                styles.scoreCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.scoreValue,
                  {
                    color:
                      percentage >= 70
                        ? theme.colors.success
                        : percentage >= 40
                        ? theme.colors.warning
                        : theme.colors.error,
                  },
                ]}
              >
                {percentage}%
              </Text>
              <Text
                style={[
                  styles.scoreLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Total Score
              </Text>
            </View>
          </View>

          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Score Breakdown by Level
            </Text>
            <View style={styles.breakdownList}>
              <View
                style={[
                  styles.breakdownRow,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <LevelBadge level="Beginner" size="sm" />
                <Text
                  style={[
                    styles.breakdownScore,
                    { color: theme.colors.text },
                  ]}
                >
                  {result.beginnerCorrect}/{result.beginnerTotal}
                </Text>
                <Text
                  style={[
                    styles.breakdownPct,
                    { color: theme.colors.beginner },
                  ]}
                >
                  {result.beginnerPct}%
                </Text>
              </View>
              <View
                style={[
                  styles.breakdownRow,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <LevelBadge level="Intermediate" size="sm" />
                <Text
                  style={[
                    styles.breakdownScore,
                    { color: theme.colors.text },
                  ]}
                >
                  {result.intermediateCorrect}/{result.intermediateTotal}
                </Text>
                <Text
                  style={[
                    styles.breakdownPct,
                    { color: theme.colors.intermediate },
                  ]}
                >
                  {result.intermediatePct}%
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <LevelBadge level="Advanced" size="sm" />
                <Text
                  style={[
                    styles.breakdownScore,
                    { color: theme.colors.text },
                  ]}
                >
                  {result.advancedCorrect}/{result.advancedTotal}
                </Text>
                <Text
                  style={[
                    styles.breakdownPct,
                    { color: theme.colors.advanced },
                  ]}
                >
                  {result.advancedPct}%
                </Text>
              </View>
            </View>
          </Card>

          <View
            style={[
              styles.disclaimer,
              { backgroundColor: theme.colors.surfaceAlt },
            ]}
          >
            <AlertCircle
              size={16}
              color={theme.colors.textTertiary}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.disclaimerText,
                { color: theme.colors.textTertiary },
              ]}
            >
              This result is an estimate based on this assessment and is not an
              official certification.
            </Text>
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity
              onPress={handleSaveLevel}
              activeOpacity={0.8}
              style={styles.resultButtonWrap}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.resultButton}
              >
                <Text style={styles.resultButtonText}>
                  Save as My Level
                </Text>
                <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2} />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.resultSecondaryButtons}>
              <TouchableOpacity
                onPress={handleRestart}
                activeOpacity={0.8}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <RotateCcw size={18} color={theme.colors.text} strokeWidth={2} />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: theme.colors.text },
                  ]}
                >
                  Retake
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                activeOpacity={0.8}
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: theme.colors.surfaceAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Home size={18} color={theme.colors.text} strokeWidth={2} />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: theme.colors.text },
                  ]}
                >
                  Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Quiz phase
  const CategoryIcon = question ? categoryIcons[question.category] || BookOpen : BookOpen;
  const isCorrect = showFeedback && selectedAnswer === question?.correctAnswer;

  return (
    <ScreenContainer scroll={false}>
      <View style={[styles.quizHeader, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Leave Assessment?',
              'Your progress will be lost. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Leave',
                  style: 'destructive',
                  onPress: () => router.back(),
                },
              ]
            );
          }}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.quizHeaderInfo}>
          <Text
            style={[styles.quizHeaderTitle, { color: theme.colors.text }]}
          >
            Level Assessment
          </Text>
          <Text
            style={[
              styles.quizHeaderSubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
        </View>
      </View>

      <View style={styles.quizProgressSection}>
        <ProgressBar progress={progressPct} height={6} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.quizScroll}
      >
        {question && (
          <>
            <View style={styles.quizCategoryRow}>
              <View
                style={[
                  styles.quizCategoryBadge,
                  { backgroundColor: theme.colors.primarySoft },
                ]}
              >
                <CategoryIcon
                  size={14}
                  color={theme.colors.primary}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.quizCategoryText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {question.category}
                </Text>
              </View>
              <LevelBadge level={question.level} size="sm" />
            </View>

            <Text
              style={[styles.quizQuestion, { color: theme.colors.text }]}
            >
              {question.question}
            </Text>

            <View style={styles.quizOptions}>
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === question.correctAnswer;
                let optionStyle = styles.quizOption;
                let optionTextStyle = styles.quizOptionText;
                let optionColor = theme.colors.surface;
                let textColor = theme.colors.text;
                let borderColor = theme.colors.border;
                let iconEl: React.ReactNode = null;

                if (showFeedback) {
                  if (isCorrectOption) {
                    optionColor = theme.colors.successSoft;
                    borderColor = theme.colors.success;
                    textColor = theme.colors.success;
                    iconEl = (
                      <CheckCircle2
                        size={20}
                        color={theme.colors.success}
                        strokeWidth={2}
                      />
                    );
                  } else if (isSelected && !isCorrectOption) {
                    optionColor = theme.colors.errorSoft;
                    borderColor = theme.colors.error;
                    textColor = theme.colors.error;
                    iconEl = (
                      <XCircle
                        size={20}
                        color={theme.colors.error}
                        strokeWidth={2}
                      />
                    );
                  }
                } else if (isSelected) {
                  optionColor = theme.colors.primarySoft;
                  borderColor = theme.colors.primary;
                  textColor = theme.colors.primary;
                }

                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleSelectAnswer(option)}
                    disabled={showFeedback}
                    activeOpacity={0.8}
                    style={[
                      optionStyle,
                      {
                        backgroundColor: optionColor,
                        borderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        optionTextStyle,
                        { color: textColor },
                        !showFeedback && !isSelected && {
                          color: theme.colors.text,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                    {iconEl}
                  </TouchableOpacity>
                );
              })}
            </View>

            {showFeedback && (
              <View
                style={[
                  styles.feedbackBox,
                  {
                    backgroundColor: isCorrect
                      ? theme.colors.successSoft
                      : theme.colors.errorSoft,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.feedbackTitle,
                    {
                      color: isCorrect ? theme.colors.success : theme.colors.error,
                    },
                  ]}
                >
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </Text>
                <Text
                  style={[
                    styles.feedbackExplanation,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {question.explanation}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View
        style={[styles.quizFooter, { borderTopColor: theme.colors.border }]}
      >
        {!showFeedback ? (
          <TouchableOpacity
            onPress={handleSubmitAnswer}
            disabled={!selectedAnswer}
            activeOpacity={0.8}
            style={styles.quizFooterButtonWrap}
          >
            <LinearGradient
              colors={
                selectedAnswer
                  ? [theme.colors.primary, theme.colors.primaryDark]
                  : [theme.colors.surfaceAlt, theme.colors.surfaceAlt]
              }
              style={[
                styles.quizFooterButton,
                !selectedAnswer && styles.quizFooterButtonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.quizFooterButtonText,
                  {
                    color: selectedAnswer ? '#FFFFFF' : theme.colors.textTertiary,
                  },
                ]}
              >
                Submit Answer
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={styles.quizFooterButtonWrap}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.quizFooterButton}
            >
              <Text style={styles.quizFooterButtonText}>
                {currentIndex === totalQuestions - 1
                  ? 'See Results'
                  : 'Next Question'}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.xs,
  },
  introContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  introIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  introTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  introDescription: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.lg,
  },
  introInfoCard: {
    width: '100%',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  introInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  introInfoText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  guestNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  guestNoteText: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
    flex: 1,
    fontWeight: fontWeight.medium,
  },
  introButtonWrap: {
    width: '100%',
  },
  introButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  introButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  quizHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  quizHeaderTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  quizHeaderSubtitle: {
    fontSize: fontSize.sm,
  },
  quizProgressSection: {
    marginVertical: spacing.md,
  },
  quizScroll: {
    paddingBottom: spacing.xl,
  },
  quizCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  quizCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  quizCategoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  quizQuestion: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * 1.4,
    marginBottom: spacing.lg,
  },
  quizOptions: {
    gap: spacing.sm,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    minHeight: 52,
  },
  quizOptionText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  feedbackBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  feedbackTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  feedbackExplanation: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  quizFooter: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  quizFooterButtonWrap: {
    width: '100%',
  },
  quizFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  quizFooterButtonDisabled: {
    opacity: 0.6,
  },
  quizFooterButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  resultScroll: {
    paddingBottom: spacing.xl,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  resultIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  section: {
    marginBottom: spacing.md,
  },
  resultLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  resultLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  resultLevelText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  resultAdvice: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  scoreGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  scoreCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  scoreLabel: {
    fontSize: fontSize.xs,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  breakdownList: {
    gap: 0,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  breakdownScore: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  breakdownPct: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  disclaimerText: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
    flex: 1,
  },
  resultButtons: {
    gap: spacing.md,
  },
  resultButtonWrap: {
    width: '100%',
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  resultButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  resultSecondaryButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 48,
  },
  secondaryButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
