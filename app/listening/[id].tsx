import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Home,
  Trophy,
  Volume2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { getListeningById } from '@/data/listeningExercises';
import { ttsService } from '@/services/ttsService';

type ScreenState = 'listening' | 'questions' | 'complete';

export default function ListeningExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { user, completeListening, isListeningCompleted } = useApp();

  const exercise = getListeningById(id);

  const [screenState, setScreenState] = useState<ScreenState>('listening');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const ttsUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribe = ttsService.subscribe((state) => {
      setIsPlaying(state.speaking);
      if (!state.speaking && hasPlayed) {
        setHasPlayed(true);
      }
    });
    ttsUnsubscribeRef.current = unsubscribe;
    return () => {
      unsubscribe();
      ttsService.stop();
    };
  }, [hasPlayed]);

  const handlePlay = useCallback(() => {
    if (!exercise) return;
    if (!ttsService.isAvailable()) {
      setError('Audio playback is not available on this device. You can still read the transcript and answer the questions.');
      return;
    }
    setError(null);
    ttsService.speak(exercise.audioText, { language: 'en-US', rate: 0.9 });
    setHasPlayed(true);
  }, [exercise]);

  const handlePause = useCallback(() => {
    ttsService.stop();
    setIsPlaying(false);
  }, []);

  const handleReplay = useCallback(() => {
    if (!exercise) return;
    if (!ttsService.isAvailable()) {
      setError('Audio playback is not available on this device.');
      return;
    }
    setError(null);
    ttsService.stop();
    setTimeout(() => {
      ttsService.speak(exercise.audioText, { language: 'en-US', rate: 0.9 });
      setHasPlayed(true);
    }, 100);
  }, [exercise]);

  const handleStartQuestions = () => {
    ttsService.stop();
    setIsPlaying(false);
    setScreenState('questions');
  };

  const handleAnswer = (answer: string) => {
    if (showResult || !exercise) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === exercise.comprehensionQuestions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!exercise) return;
    if (currentQuestion === exercise.comprehensionQuestions.length - 1) {
      const alreadyCompleted = isListeningCompleted(exercise.id);
      if (!alreadyCompleted) {
        completeListening({
          exerciseId: exercise.id,
          score,
          totalQuestions: exercise.comprehensionQuestions.length,
          completedAt: new Date().toISOString(),
          xpAwarded: true,
          xpAmount: exercise.xpReward,
        });
      }
      setScreenState('complete');
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleTryAgain = () => {
    ttsService.stop();
    setIsPlaying(false);
    setHasPlayed(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setScreenState('listening');
  };

  if (!exercise) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Exercise not found</Text>
        <TouchableOpacity
          onPress={() => router.replace('/listening-practice')}
          style={[styles.errorBtn, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.errorBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalQuestions = exercise.comprehensionQuestions.length;
  const question = exercise.comprehensionQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const alreadyCompleted = isListeningCompleted(exercise.id);

  if (screenState === 'complete') {
    const percentage = Math.round((score / totalQuestions) * 100);
    const xpEarned = alreadyCompleted ? 0 : exercise.xpReward;

    return (
      <ScreenContainer scroll={false}>
        <View style={styles.completionContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.completionIconCircle}
          >
            <Trophy size={56} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={[styles.completionTitle, { color: theme.colors.text }]}>
            Exercise Complete!
          </Text>
          <Text style={[styles.completionExerciseTitle, { color: theme.colors.textSecondary }]}>
            {exercise.title}
          </Text>

          <View style={styles.completionStats}>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.completionStatValue, { color: theme.colors.text }]}>
                {score}/{totalQuestions}
              </Text>
              <Text style={[styles.completionStatLabel, { color: theme.colors.textSecondary }]}>
                Score
              </Text>
            </View>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.completionStatValue, { color: percentage >= 60 ? theme.colors.success : theme.colors.error }]}>
                {percentage}%
              </Text>
              <Text style={[styles.completionStatLabel, { color: theme.colors.textSecondary }]}>
                Accuracy
              </Text>
            </View>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.completionStatValue, { color: theme.colors.accent }]}>
                +{xpEarned}
              </Text>
              <Text style={[styles.completionStatLabel, { color: theme.colors.textSecondary }]}>
                XP
              </Text>
            </View>
          </View>

          {percentage < 60 && (
            <View style={[styles.tipBox, { backgroundColor: theme.colors.warningSoft }]}>
              <Text style={[styles.tipText, { color: theme.colors.warning }]}>
                Keep practicing! Listen to the audio again and try to catch the details you missed.
              </Text>
            </View>
          )}

          {!user?.isGuest && xpEarned > 0 && (
            <View style={[styles.savedBadge, { backgroundColor: theme.colors.successSoft }]}>
              <CheckCircle2 size={16} color={theme.colors.success} strokeWidth={2} />
              <Text style={[styles.savedBadgeText, { color: theme.colors.success }]}>
                Progress saved to your account
              </Text>
            </View>
          )}
          {user?.isGuest && (
            <View style={[styles.guestNote, { backgroundColor: theme.colors.warningSoft }]}>
              <Text style={[styles.guestNoteText, { color: theme.colors.warning }]}>
                Sign in to save your progress and earn XP across devices.
              </Text>
            </View>
          )}

          <View style={styles.completionButtons}>
            <TouchableOpacity
              onPress={handleTryAgain}
              activeOpacity={0.8}
              style={[styles.completionBtn, { backgroundColor: theme.colors.primary }]}
            >
              <RotateCcw size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.completionBtnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace('/listening-practice')}
              activeOpacity={0.8}
              style={[styles.completionBtn, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, borderWidth: 1 }]}
            >
              <Headphones size={18} color={theme.colors.text} strokeWidth={2} />
              <Text style={[styles.completionBtnText, { color: theme.colors.text }]}>
                Back to Listening
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.8}
              style={[styles.completionBtn, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border, borderWidth: 1 }]}
            >
              <Home size={18} color={theme.colors.text} strokeWidth={2} />
              <Text style={[styles.completionBtnText, { color: theme.colors.text }]}>
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (screenState === 'questions') {
    const questionProgress = ((currentQuestion + (showResult ? 1 : 0)) / totalQuestions) * 100;

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity
            onPress={() => {
              ttsService.stop();
              router.back();
            }}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
              {exercise.title}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.primarySoft }]}>
              <Text style={[styles.levelText, { color: theme.colors.primary }]}>
                {exercise.level}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
              Question {currentQuestion + 1} of {totalQuestions}
            </Text>
            <Text style={[styles.progressCount, { color: theme.colors.text }]}>
              Score: {score}
            </Text>
          </View>
          <ProgressBar progress={questionProgress} height={6} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Card style={styles.questionCard}>
            <Text style={[styles.questionText, { color: theme.colors.text }]}>
              {question.question}
            </Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === question.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleAnswer(option)}
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
                    {showCorrect && <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />}
                    {showWrong && <XCircle size={20} color={theme.colors.error} strokeWidth={2} />}
                  </TouchableOpacity>
                );
              })}
            </View>
            {showResult && (
              <View
                style={[
                  styles.explanationBox,
                  {
                    backgroundColor:
                      selectedAnswer === question.correctAnswer
                        ? theme.colors.successSoft
                        : theme.colors.errorSoft,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.explanationLabel,
                    {
                      color:
                        selectedAnswer === question.correctAnswer
                          ? theme.colors.success
                          : theme.colors.error,
                    },
                  ]}
                >
                  {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Not quite.'}
                </Text>
                <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                  {question.explanation}
                </Text>
              </View>
            )}
          </Card>

          {showResult && (
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? 'Finish Exercise' : 'Next Question'}
              </Text>
              <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            ttsService.stop();
            router.back();
          }}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {exercise.title}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: theme.colors.primarySoft }]}>
            <Text style={[styles.levelText, { color: theme.colors.primary }]}>
              {exercise.level}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.audioSection}>
          <View style={[styles.audioIconCircle, { backgroundColor: theme.colors.primarySoft }]}>
            <Headphones size={48} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.audioTitle, { color: theme.colors.text }]}>
            Listen to the Audio
          </Text>
          <Text style={[styles.audioDesc, { color: theme.colors.textSecondary }]}>
            {exercise.description}
          </Text>

          <View style={[styles.audioControls, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <TouchableOpacity
              onPress={isPlaying ? handlePause : handlePlay}
              activeOpacity={0.8}
              style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
            >
              {isPlaying ? (
                <Pause size={28} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <Play size={28} color="#FFFFFF" strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReplay}
              activeOpacity={0.8}
              style={[styles.replayButton, { borderColor: theme.colors.primary }]}
            >
              <RotateCcw size={20} color={theme.colors.primary} strokeWidth={2} />
              <Text style={[styles.replayText, { color: theme.colors.primary }]}>
                Replay
              </Text>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: theme.colors.warningSoft }]}>
              <Text style={[styles.errorBoxText, { color: theme.colors.warning }]}>
                {error}
              </Text>
            </View>
          )}

          {isPlaying && (
            <View style={styles.playingIndicator}>
              <View style={[styles.playingDot, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.playingText, { color: theme.colors.primary }]}>
                Playing audio...
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.transcriptBox, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
          <View style={styles.transcriptHeader}>
            <Volume2 size={16} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.transcriptLabel, { color: theme.colors.textSecondary }]}>
              Transcript
            </Text>
          </View>
          <Text style={[styles.transcriptText, { color: theme.colors.text }]}>
            {exercise.audioText}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleStartQuestions}
          activeOpacity={0.8}
          style={[styles.startQuestionsBtn, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.startQuestionsText}>Start Questions</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>
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
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  levelBadge: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  levelText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  progressSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.xs + 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  progressLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  progressCount: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  audioSection: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  audioIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  audioDesc: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    paddingHorizontal: spacing.md,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  replayText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    width: '100%',
  },
  errorBoxText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  playingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  playingText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  transcriptBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  transcriptLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transcriptText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.6,
  },
  startQuestionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  startQuestionsText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  questionCard: { gap: spacing.md },
  questionText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * 1.4,
  },
  optionsContainer: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.sm,
    minHeight: 52,
  },
  optionText: { flex: 1, fontSize: fontSize.md },
  explanationBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  explanationLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  explanationText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  errorBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  errorBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  completionIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  completionTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  completionExerciseTitle: {
    fontSize: fontSize.md,
  },
  completionStats: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  completionStatBox: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  completionStatValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  completionStatLabel: {
    fontSize: fontSize.sm,
  },
  tipBox: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  tipText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  savedBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  guestNote: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  guestNoteText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
  },
  completionButtons: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  completionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  completionBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
