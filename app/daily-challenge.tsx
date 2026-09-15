import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, Trophy, BookOpen, Sparkles, Mic, Star, Home } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import {
  getDailyChallengeActivities,
  getDailyChallengeDate,
  DAILY_CHALLENGE_XP,
  DailyChallengeVocabActivity,
  DailyChallengeGrammarActivity,
  DailyChallengeSpeakingActivity,
} from '@/data/dailyChallengeActivities';

type ActivityState = 'pending' | 'correct' | 'incorrect' | 'completed';

export default function DailyChallengeScreen() {
  const { theme } = useTheme();
  const { user, dailyChallengeCompletion, completeDailyChallenge, isDailyChallengeCompleted } = useApp();

  const activities = useMemo(() => getDailyChallengeActivities(), []);
  const today = getDailyChallengeDate();

  const alreadyCompleted = isDailyChallengeCompleted();

  const [currentActivity, setCurrentActivity] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [activityStates, setActivityStates] = useState<ActivityState[]>(['pending', 'pending', 'pending']);
  const [showResult, setShowResult] = useState(false);
  const [showCompletion, setShowCompletion] = useState(alreadyCompleted);

  const totalActivities = activities.length;
  const progress = (currentActivity / totalActivities) * 100;

  const activity = activities[currentActivity];
  const isLastActivity = currentActivity === totalActivities - 1;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === (activity as DailyChallengeVocabActivity).correctAnswer;
    setActivityStates((prev) => {
      const updated = [...prev];
      updated[currentActivity] = isCorrect ? 'correct' : 'incorrect';
      return updated;
    });
  };

  const handleNext = useCallback(() => {
    if (isLastActivity) {
      const completedCount = activityStates.filter(
        (s) => s === 'correct' || s === 'completed'
      ).length;

      completeDailyChallenge(completedCount, DAILY_CHALLENGE_XP);
      setShowCompletion(true);
      return;
    }

    setCurrentActivity((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [isLastActivity, activityStates, completeDailyChallenge]);

  const handleCompleteSpeaking = useCallback(() => {
    setActivityStates((prev) => {
      const updated = [...prev];
      updated[currentActivity] = 'completed';
      return updated;
    });
    setShowResult(true);
  }, [currentActivity]);

  if (showCompletion || alreadyCompleted) {
    const completedCount = alreadyCompleted
      ? dailyChallengeCompletion?.activitiesCompleted ?? 3
      : activityStates.filter((s) => s === 'correct' || s === 'completed').length;
    const xpEarned = alreadyCompleted
      ? dailyChallengeCompletion?.xpAwarded ?? DAILY_CHALLENGE_XP
      : DAILY_CHALLENGE_XP;

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
            Challenge Completed!
          </Text>
          <Text style={[styles.completionDate, { color: theme.colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <View style={styles.completionStats}>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <CheckCircle2 size={24} color={theme.colors.success} strokeWidth={2} />
              <Text style={[styles.completionStatValue, { color: theme.colors.text }]}>
                {completedCount}/3
              </Text>
              <Text style={[styles.completionStatLabel, { color: theme.colors.textSecondary }]}>
                Activities
              </Text>
            </View>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Star size={24} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.completionStatValue, { color: theme.colors.accent }]}>
                +{xpEarned}
              </Text>
              <Text style={[styles.completionStatLabel, { color: theme.colors.textSecondary }]}>
                XP Earned
              </Text>
            </View>
          </View>

          {!user?.isGuest && (
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

          <Button
            label="Back to Home"
            onPress={() => router.replace('/(tabs)')}
            fullWidth
            size="lg"
            icon={<Home size={18} color="#FFFFFF" strokeWidth={2} />}
          />
        </View>
      </ScreenContainer>
    );
  }

  const renderVocabActivity = (act: DailyChallengeVocabActivity) => (
    <>
      <View style={styles.activityHeader}>
        <View style={[styles.activityIcon, { backgroundColor: theme.colors.primarySoft }]}>
          <BookOpen size={20} color={theme.colors.primary} strokeWidth={2} />
        </View>
        <Text style={[styles.activityType, { color: theme.colors.textSecondary }]}>
          Vocabulary
        </Text>
      </View>
      <Text style={[styles.activityQuestion, { color: theme.colors.text }]}>
        What does "{act.word}" mean?
      </Text>
      <View style={styles.optionsContainer}>
        {act.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === act.correctAnswer;
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
        <View style={[styles.explanationBox, { backgroundColor: selectedAnswer === act.correctAnswer ? theme.colors.successSoft : theme.colors.errorSoft }]}>
          <Text style={[styles.explanationLabel, { color: selectedAnswer === act.correctAnswer ? theme.colors.success : theme.colors.error }]}>
            {selectedAnswer === act.correctAnswer ? '✅ Correct!' : '❌ Not quite.'}
          </Text>
          <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
            {act.explanation}
          </Text>
        </View>
      )}
    </>
  );

  const renderGrammarActivity = (act: DailyChallengeGrammarActivity) => (
    <>
      <View style={styles.activityHeader}>
        <View style={[styles.activityIcon, { backgroundColor: theme.colors.secondarySoft }]}>
          <Sparkles size={20} color={theme.colors.secondary} strokeWidth={2} />
        </View>
        <Text style={[styles.activityType, { color: theme.colors.textSecondary }]}>
          Grammar
        </Text>
      </View>
      <Text style={[styles.activityQuestion, { color: theme.colors.text }]}>
        {act.question}
      </Text>
      <View style={styles.optionsContainer}>
        {act.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === act.correctAnswer;
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
        <View style={[styles.explanationBox, { backgroundColor: selectedAnswer === act.correctAnswer ? theme.colors.successSoft : theme.colors.errorSoft }]}>
          <Text style={[styles.explanationLabel, { color: selectedAnswer === act.correctAnswer ? theme.colors.success : theme.colors.error }]}>
            {selectedAnswer === act.correctAnswer ? '✅ Correct!' : '❌ Not quite.'}
          </Text>
          <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
            {act.explanation}
          </Text>
        </View>
      )}
    </>
  );

  const renderSpeakingActivity = (act: DailyChallengeSpeakingActivity) => (
    <>
      <View style={styles.activityHeader}>
        <View style={[styles.activityIcon, { backgroundColor: theme.colors.accentSoft }]}>
          <Mic size={20} color={theme.colors.accent} strokeWidth={2} />
        </View>
        <Text style={[styles.activityType, { color: theme.colors.textSecondary }]}>
          Speaking Practice
        </Text>
      </View>
      <Text style={[styles.activityQuestion, { color: theme.colors.text }]}>
        {act.prompt}
      </Text>
      <View style={[styles.speakingInstructions, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Text style={[styles.speakingInstructionsText, { color: theme.colors.textSecondary }]}>
          {act.instructions}
        </Text>
      </View>
      <View style={styles.tipsContainer}>
        <Text style={[styles.tipsLabel, { color: theme.colors.textSecondary }]}>
          Tips:
        </Text>
        {act.tips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={[styles.tipBullet, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              {tip}
            </Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => router.push('/speaking-practice')}
        activeOpacity={0.8}
        style={[styles.speakingLink, { borderColor: theme.colors.primary }]}
      >
        <Mic size={18} color={theme.colors.primary} strokeWidth={2} />
        <Text style={[styles.speakingLinkText, { color: theme.colors.primary }]}>
          Go to Speaking Practice
        </Text>
        <ArrowRight size={16} color={theme.colors.primary} strokeWidth={2} />
      </TouchableOpacity>
      {!showResult && (
        <Button
          label="Mark as Complete"
          onPress={handleCompleteSpeaking}
          fullWidth
          size="md"
          icon={<CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2} />}
        />
      )}
      {showResult && (
        <View style={[styles.explanationBox, { backgroundColor: theme.colors.successSoft }]}>
          <Text style={[styles.explanationLabel, { color: theme.colors.success }]}>
            ✅ Activity Complete!
          </Text>
          <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
            Great job! You can practice speaking more in the Speaking Practical section.
          </Text>
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Daily English Challenge
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Complete today's activities and improve your English
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            Activity {currentActivity + 1} of {totalActivities}
          </Text>
          <Text style={[styles.progressCount, { color: theme.colors.text }]}>
            {activityStates.filter((s) => s === 'correct' || s === 'completed').length}/{totalActivities} completed
          </Text>
        </View>
        <ProgressBar progress={progress} height={6} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Card style={styles.activityCard}>
          {activity.type === 'vocabulary' && renderVocabActivity(activity)}
          {activity.type === 'grammar' && renderGrammarActivity(activity)}
          {activity.type === 'speaking' && renderSpeakingActivity(activity)}
        </Card>

        {showResult && (
          <Button
            label={isLastActivity ? 'Finish Challenge' : 'Next Activity'}
            onPress={handleNext}
            fullWidth
            size="lg"
            icon={<ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: { padding: spacing.xs, marginTop: 2 },
  headerInfo: { flex: 1, gap: 4 },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold },
  headerSubtitle: { fontSize: fontSize.sm },
  progressSection: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.xs + 2 },
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
  activityCard: { gap: spacing.md },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityType: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activityQuestion: {
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
  speakingInstructions: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  speakingInstructionsText: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  tipsContainer: { gap: spacing.xs },
  tipsLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tipText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  speakingLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  speakingLinkText: {
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
  completionDate: {
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
});
