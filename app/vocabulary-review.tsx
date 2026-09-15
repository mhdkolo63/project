import { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  Eye,
  CheckCircle2,
  RotateCcw,
  Home,
  BookOpen,
  Sparkles,
  Trophy,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { AppConfig } from '@/constants/config';
import { SavedVocabWord } from '@/types';
import { ttsService } from '@/services/ttsService';

const XP_PER_WORD_LEARNED = 10;

export default function VocabularyReviewScreen() {
  const { theme } = useTheme();
  const { user, vocabulary, toggleVocabLearned, addXP, updateStreakOnActivity } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [reviewedWordIds, setReviewedWordIds] = useState<Set<string>>(new Set());
  const [wordsLearnedThisSession, setWordsLearnedThisSession] = useState(0);
  const xpAwardedRef = useRef<Set<string>>(new Set());

  const reviewQueue = useMemo(() => {
    const unlearned = vocabulary.filter((w) => !w.learned);
    const learned = vocabulary.filter((w) => w.learned);
    const learnedReviewCount = Math.min(learned.length, Math.ceil(unlearned.length * 0.3));
    const learnedReview = learned
      .sort(() => Math.random() - 0.5)
      .slice(0, learnedReviewCount);
    return [...unlearned, ...learnedReview];
  }, [vocabulary]);

  const totalWords = reviewQueue.length;
  const currentWord = reviewQueue[currentIndex];
  const isLastWord = currentIndex === totalWords - 1;
  const progress = totalWords > 0 ? (currentIndex / totalWords) * 100 : 0;

  const handleSpeak = useCallback((text: string) => {
    ttsService.speak(text, { language: 'en-US', rate: 0.9 });
  }, []);

  const advance = useCallback(() => {
    if (isLastWord) {
      setShowCompletion(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setRevealed(false);
  }, [isLastWord]);

  const handleKnowThis = useCallback(() => {
    if (!currentWord) return;

    const wasUnlearned = !currentWord.learned;
    const wordId = currentWord.id;

    if (wasUnlearned && !xpAwardedRef.current.has(wordId)) {
      toggleVocabLearned(wordId);
      addXP(XP_PER_WORD_LEARNED);
      updateStreakOnActivity();
      xpAwardedRef.current.add(wordId);
      setWordsLearnedThisSession((c) => c + 1);
    }

    setReviewedWordIds((prev) => new Set(prev).add(wordId));
    advance();
  }, [currentWord, toggleVocabLearned, addXP, updateStreakOnActivity, advance]);

  const handleReviewAgain = useCallback(() => {
    if (!currentWord) return;
    setReviewedWordIds((prev) => new Set(prev).add(currentWord.id));
    advance();
  }, [currentWord, advance]);

  const handleNext = useCallback(() => {
    if (!currentWord) return;
    setReviewedWordIds((prev) => new Set(prev).add(currentWord.id));
    advance();
  }, [currentWord, advance]);

  if (vocabulary.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Vocabulary Review
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              Review your saved words
            </Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<BookOpen size={48} color={theme.colors.textTertiary} strokeWidth={2} />}
            title="No saved words yet"
            message="You have no saved words to review yet. Save new words from your lessons to start building your vocabulary."
          />
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/vocabulary')}
            activeOpacity={0.8}
            style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
          >
            <BookOpen size={18} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.emptyButtonText}>Browse Vocabulary</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showCompletion) {
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
            Review Complete!
          </Text>
          <Text style={[styles.completionSubtitle, { color: theme.colors.textSecondary }]}>
            You reviewed {totalWords} {totalWords === 1 ? 'word' : 'words'}
          </Text>

          <View style={styles.completionStats}>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <CheckCircle2 size={24} color={theme.colors.success} strokeWidth={2} />
              <Text style={[styles.completionStatValue, { color: theme.colors.text }]}>
                {wordsLearnedThisSession}
              </Text>
              <Text style={[styles.completionStatLabel, { color: theme.colors.textSecondary }]}>
                Words Learned
              </Text>
            </View>
            <View style={[styles.completionStatBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Sparkles size={24} color={theme.colors.accent} strokeWidth={2} />
              <Text style={[styles.completionStatValue, { color: theme.colors.accent }]}>
                +{wordsLearnedThisSession * XP_PER_WORD_LEARNED}
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

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
            style={[styles.completionButton, { backgroundColor: theme.colors.primary }]}
          >
            <Home size={18} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.completionButtonText}>Back to Home</Text>
          </TouchableOpacity>
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
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Vocabulary Review
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Review your saved words and mark them as learned
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
            Word {currentIndex + 1} of {totalWords}
          </Text>
          <Text style={[styles.progressCount, { color: theme.colors.text }]}>
            {reviewedWordIds.size}/{totalWords} reviewed
          </Text>
        </View>
        <ProgressBar progress={progress} height={6} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {currentWord && (
          <Card style={styles.wordCard}>
            <View style={styles.wordTopRow}>
              <View style={styles.wordMainInfo}>
                <Text style={[styles.wordText, { color: theme.colors.text }]}>
                  {currentWord.word}
                </Text>
                <TouchableOpacity onPress={() => handleSpeak(currentWord.word)} style={styles.speakButton}>
                  <Volume2 size={22} color={theme.colors.primary} strokeWidth={2} />
                </TouchableOpacity>
              </View>
              {currentWord.learned && (
                <View style={[styles.learnedBadge, { backgroundColor: theme.colors.successSoft }]}>
                  <CheckCircle2 size={14} color={theme.colors.success} strokeWidth={2} />
                  <Text style={[styles.learnedBadgeText, { color: theme.colors.success }]}>
                    Learned
                  </Text>
                </View>
              )}
            </View>

            {!revealed ? (
              <View style={styles.revealContainer}>
                <Text style={[styles.revealHint, { color: theme.colors.textSecondary }]}>
                  Tap to reveal the meaning and details
                </Text>
                <TouchableOpacity
                  onPress={() => setRevealed(true)}
                  activeOpacity={0.8}
                  style={[styles.revealButton, { borderColor: theme.colors.primary }]}
                >
                  <Eye size={18} color={theme.colors.primary} strokeWidth={2} />
                  <Text style={[styles.revealButtonText, { color: theme.colors.primary }]}>
                    Reveal Meaning
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Part of Speech
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.accent }]}>
                    {currentWord.partOfSpeech}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Meaning
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {currentWord.meaning}
                  </Text>
                </View>

                {currentWord.definition && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Definition
                    </Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                      {currentWord.definition}
                    </Text>
                  </View>
                )}

                {currentWord.pronunciation && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                      Pronunciation
                    </Text>
                    <View style={styles.pronunciationRow}>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                        {currentWord.pronunciation}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleSpeak(currentWord.word)}
                        style={styles.speakButtonSmall}
                      >
                        <Volume2 size={16} color={theme.colors.primary} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={[styles.exampleBox, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <Text style={[styles.exampleLabel, { color: theme.colors.textSecondary }]}>
                    Example
                  </Text>
                  <View style={styles.exampleRow}>
                    <Text style={[styles.exampleText, { color: theme.colors.text }]}>
                      {currentWord.example}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleSpeak(currentWord.example)}
                      style={styles.speakButtonSmall}
                    >
                      <Volume2 size={16} color={theme.colors.primary} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Card>
        )}

        {revealed && currentWord && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handleKnowThis}
              activeOpacity={0.8}
              style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            >
              <CheckCircle2 size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.actionButtonText}>I Know This</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReviewAgain}
              activeOpacity={0.8}
              style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
            >
              <RotateCcw size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.actionButtonText}>Review Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            >
              <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.actionButtonText}>
                {isLastWord ? 'Finish Review' : 'Next Word'}
              </Text>
            </TouchableOpacity>
          </View>
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
  wordCard: { gap: spacing.md },
  wordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  wordText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  speakButton: { padding: spacing.xs },
  learnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  learnedBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  revealContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  revealHint: {
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  revealButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  detailsContainer: { gap: spacing.md },
  detailRow: { gap: spacing.xs },
  detailLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  speakButtonSmall: { padding: spacing.xs },
  exampleBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  exampleLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  exampleText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
    fontStyle: 'italic',
  },
  actionButtons: { gap: spacing.sm },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyButtonText: {
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
  completionSubtitle: {
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
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  completionButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
