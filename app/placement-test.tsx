import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Sprout, TrendingUp, Flame } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { placementQuestions } from '@/data/placementTest';
import { EnglishLevel } from '@/types';

export default function PlacementTestScreen() {
  const { theme } = useTheme();
  const { setEnglishLevel } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);

  const totalQuestions = placementQuestions.length;
  const currentQuestion = placementQuestions[currentIndex];
  const isLast = currentIndex === totalQuestions - 1;
  const progress = ((currentIndex + (showResult ? 1 : 0)) / totalQuestions) * 100;

  const handleSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleNext = () => {
    const finalAnswers = [...answers, selectedAnswer];
    if (isLast) {
      setAnswers(finalAnswers);
      setCompleted(true);
    } else {
      setAnswers(finalAnswers);
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  if (completed) {
    let beginnerCorrect = 0, intermediateCorrect = 0, advancedCorrect = 0;
    let beginnerTotal = 0, intermediateTotal = 0, advancedTotal = 0;

    placementQuestions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (q.level === 'Beginner') { beginnerTotal++; if (isCorrect) beginnerCorrect++; }
      else if (q.level === 'Intermediate') { intermediateTotal++; if (isCorrect) intermediateCorrect++; }
      else { advancedTotal++; if (isCorrect) advancedCorrect++; }
    });

    const beginnerPct = beginnerCorrect / beginnerTotal;
    const intermediatePct = intermediateTotal > 0 ? intermediateCorrect / intermediateTotal : 0;
    const advancedPct = advancedTotal > 0 ? advancedCorrect / advancedTotal : 0;

    let recommendedLevel: EnglishLevel;
    if (advancedPct >= 0.6) recommendedLevel = 'Advanced';
    else if (intermediatePct >= 0.6) recommendedLevel = 'Intermediate';
    else recommendedLevel = 'Beginner';

    const levelIcons: Record<EnglishLevel, typeof Sprout> = {
      Beginner: Sprout,
      Intermediate: TrendingUp,
      Advanced: Flame,
    };
    const levelColors: Record<EnglishLevel, [string, string]> = {
      Beginner: ['#22C55E', '#15803D'],
      Intermediate: ['#F59E0B', '#D97706'],
      Advanced: ['#EF4444', '#DC2626'],
    };
    const Icon = levelIcons[recommendedLevel];

    return (
      <ScreenContainer scroll={false}>
        <View style={styles.resultContainer}>
          <LinearGradient
            colors={levelColors[recommendedLevel]}
            style={styles.resultIconCircle}
          >
            <Icon size={56} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={[styles.resultTitle, { color: theme.colors.text }]}>Placement Complete!</Text>
          <Text style={[styles.resultSubtitle, { color: theme.colors.textSecondary }]}>
            Based on your answers, we recommend:
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: levelColors[recommendedLevel][0] }]}>
            <Text style={styles.levelBadgeText}>{recommendedLevel}</Text>
          </View>

          <View style={styles.scoreBreakdown}>
            <View style={[styles.scoreRow, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>Beginner</Text>
              <Text style={[styles.scoreValue, { color: theme.colors.text }]}>{beginnerCorrect}/{beginnerTotal}</Text>
            </View>
            <View style={[styles.scoreRow, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>Intermediate</Text>
              <Text style={[styles.scoreValue, { color: theme.colors.text }]}>{intermediateCorrect}/{intermediateTotal}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>Advanced</Text>
              <Text style={[styles.scoreValue, { color: theme.colors.text }]}>{advancedCorrect}/{advancedTotal}</Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <Button
              label={`Start as ${recommendedLevel}`}
              onPress={() => {
                setEnglishLevel(recommendedLevel);
                router.replace('/(tabs)');
              }}
              fullWidth
              size="lg"
            />
            <TouchableOpacity
              onPress={() => router.replace('/level-select')}
              style={styles.chooseLink}
            >
              <Text style={[styles.chooseText, { color: theme.colors.primary }]}>
                Choose level manually
              </Text>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Placement Test</Text>
        <Text style={[styles.questionCounter, { color: theme.colors.textSecondary }]}>
          {currentIndex + 1}/{totalQuestions}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} height={6} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.question, { color: theme.colors.text }]}>
          {currentQuestion.question}
        </Text>
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
                    borderColor: showCorrect ? theme.colors.success : showWrong ? theme.colors.error : isSelected ? theme.colors.primary : theme.colors.border,
                    backgroundColor: showCorrect ? theme.colors.successSoft : showWrong ? theme.colors.errorSoft : isSelected ? theme.colors.primarySoft : theme.colors.surface,
                  },
                ]}
              >
                <Text style={[styles.optionText, { color: showCorrect ? theme.colors.success : showWrong ? theme.colors.error : isSelected ? theme.colors.primary : theme.colors.text }]}>
                  {option}
                </Text>
                {showCorrect && <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />}
                {showWrong && <XCircle size={20} color={theme.colors.error} strokeWidth={2} />}
              </TouchableOpacity>
            );
          })}
        </View>
        {showResult && (
          <View style={[styles.hintBox, { backgroundColor: selectedAnswer === currentQuestion.correctAnswer ? theme.colors.successSoft : theme.colors.errorSoft }]}>
            <Text style={[styles.hintText, { color: selectedAnswer === currentQuestion.correctAnswer ? theme.colors.success : theme.colors.error }]}>
              {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : `The correct answer is: ${currentQuestion.correctAnswer}`}
            </Text>
          </View>
        )}
      </ScrollView>

      {showResult && (
        <View style={[styles.bottomBar, { borderTopColor: theme.colors.border }]}>
          <Button
            label={isLast ? 'See Results' : 'Next Question'}
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { flex: 1, fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  questionCounter: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  progressContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  question: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, lineHeight: fontSize.xl * 1.4 },
  options: { gap: spacing.sm },
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
  optionText: { flex: 1, fontSize: fontSize.md },
  hintBox: { padding: spacing.md, borderRadius: radius.md, gap: 4 },
  hintText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  bottomBar: { padding: spacing.lg, borderTopWidth: 1 },
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
  resultTitle: { fontSize: fontSize.xxxl, fontWeight: fontWeight.bold },
  resultSubtitle: { fontSize: fontSize.md },
  levelBadge: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  levelBadgeText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: '#FFFFFF' },
  scoreBreakdown: { width: '100%', paddingHorizontal: spacing.xl },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  scoreLabel: { fontSize: fontSize.md },
  scoreValue: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  resultActions: { width: '100%', gap: spacing.md, marginTop: spacing.md },
  chooseLink: { paddingVertical: spacing.sm, alignItems: 'center' },
  chooseText: { fontSize: fontSize.md, fontWeight: fontWeight.medium },
});
