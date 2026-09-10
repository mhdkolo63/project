import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { SpeakingPrompt } from '@/components/SpeakingPrompt';
import { SpeakingRecorder } from '@/components/SpeakingRecorder';
import { SpeakingFeedbackView } from '@/components/SpeakingFeedback';
import { SpeakingScore } from '@/components/SpeakingScore';
import { ConversationView } from '@/components/ConversationView';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SpeakingFeedback, SpeakingConversationTurn, SavedVocabWord, SpeakingVocabWord } from '@/types';
import { getSpeakingPracticeById, speakingTtsConfig } from '@/data/speakingPracticals';
import { ttsService } from '@/services/ttsService';
import { speakingService } from '@/services/speakingService';

type ScreenState = 'prompt' | 'recording' | 'feedback' | 'score' | 'conversation';

export default function SpeakingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, saveVocabWord, vocabulary, completeSpeaking, isSpeakingCompleted, updateStreakOnActivity, completeDailyPlanItem } = useApp();

  const practice = useMemo(() => getSpeakingPracticeById(id), [id]);

  const [screenState, setScreenState] = useState<ScreenState>('prompt');
  const [transcription, setTranscription] = useState('');
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationTurns, setConversationTurns] = useState<SpeakingConversationTurn[]>([]);
  const [conversationMode, setConversationMode] = useState(false);
  const [conversationTurnNumber, setConversationTurnNumber] = useState(0);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [ttsRate] = useState(speakingTtsConfig[user?.englishLevel || 'Beginner'].rate);

  const ttsUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsub = ttsService.subscribe((state) => {
      setIsSpeaking(state.speaking);
      if (!state.speaking) setSpeakingText(null);
    });
    ttsUnsubRef.current = unsub;
    return () => { unsub(); };
  }, []);

  const handleListen = useCallback((text: string) => {
    ttsService.speak(text, { rate: ttsRate, language: 'en-US' });
    setSpeakingText(text);
  }, [ttsRate]);

  const handleTranscription = useCallback(async (text: string) => {
    setTranscription(text);
    setError(null);
    setLoading(true);
    setScreenState('feedback');

    if (conversationMode) {
      const newTurn: SpeakingConversationTurn = { role: 'user', text, timestamp: new Date().toISOString() };
      const updatedTurns = [...conversationTurns, newTurn];
      setConversationTurns(updatedTurns);

      try {
        const response = await speakingService.getConversationReply({
          userMessage: text,
          userLevel: practice?.level || 'Beginner',
          conversationHistory: updatedTurns,
          category: practice?.category || 'Daily Conversation',
          turnNumber: conversationTurnNumber + 1,
        });

        const aiTurn: SpeakingConversationTurn = { role: 'ai', text: response.reply, timestamp: new Date().toISOString() };
        setConversationTurns((prev) => [...prev, aiTurn]);
        setConversationTurnNumber((n) => n + 1);
        setScreenState('conversation');

        if (response.shouldGiveFeedback && response.feedback) {
          setFeedback(response.feedback);
        }
      } catch {
        setError('We could not get a response from the AI coach. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const result = await speakingService.getFeedback({
        transcription: text,
        userLevel: practice?.level || 'Beginner',
        practicePrompt: practice?.prompt || '',
        category: practice?.category || 'Daily Conversation',
      });
      setFeedback(result);
    } catch {
      setError('We could not analyze your speech. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [conversationMode, conversationTurns, conversationTurnNumber, practice]);

  const handleTryAgain = useCallback(() => {
    setTranscription('');
    setFeedback(null);
    setError(null);
    setAttemptNumber((n) => n + 1);
    setScreenState('prompt');
  }, []);

  const handleComplete = useCallback(() => {
    if (!practice || !feedback) return;

    const alreadyCompleted = isSpeakingCompleted(practice.id);
    const xpAmount = alreadyCompleted ? 0 : practice.xpReward;

    completeSpeaking({
      practiceId: practice.id,
      completedAt: new Date().toISOString(),
      overallScore: feedback.overallScore,
      attempts: [{
        attemptNumber,
        transcription,
        feedback,
        completedAt: new Date().toISOString(),
      }],
      xpAwarded: !alreadyCompleted,
      xpAmount,
      mode: conversationMode ? 'conversation' : 'single',
    });

    updateStreakOnActivity();
    completeDailyPlanItem('conversation');

    router.replace('/speaking-practice');
  }, [practice, feedback, isSpeakingCompleted, completeSpeaking, attemptNumber, transcription, conversationMode, updateStreakOnActivity, completeDailyPlanItem]);

  const handleStartConversation = useCallback(() => {
    if (!practice) return;
    setConversationMode(true);
    const firstTurn: SpeakingConversationTurn = {
      role: 'ai',
      text: practice.aiCoachLine,
      timestamp: new Date().toISOString(),
    };
    setConversationTurns([firstTurn]);
    setConversationTurnNumber(0);
    setScreenState('conversation');
    handleListen(practice.aiCoachLine);
  }, [practice, handleListen]);

  const handleSaveVocab = useCallback((vocab: SpeakingVocabWord) => {
    if (!practice) return;
    const savedWord: SavedVocabWord = {
      id: `speaking-${practice.id}-${vocab.word}`,
      word: vocab.word,
      meaning: vocab.meaning,
      example: vocab.example,
      partOfSpeech: '',
      level: practice.level,
      savedAt: new Date().toISOString(),
      learned: false,
    };
    saveVocabWord(savedWord);
  }, [practice, saveVocabWord]);

  const isVocabSaved = useCallback((word: string) => {
    return vocabulary.some((v) => v.word === word);
  }, [vocabulary]);

  if (!practice) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Practice not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.errorBtn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.errorBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back to speaking practice"
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {practice.title}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: theme.colors.primarySoft }]}>
            <Text style={[styles.levelText, { color: theme.colors.primary }]}>
              {practice.level}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xxl }]} showsVerticalScrollIndicator={false}>
        {screenState === 'prompt' && (
          <>
            <SpeakingPrompt practice={practice} onListen={() => handleListen(practice.aiCoachLine)} isSpeaking={isSpeaking} />

            {practice.conversationMode && (
              <TouchableOpacity onPress={handleStartConversation} activeOpacity={0.8} style={[styles.conversationModeBtn, { borderColor: theme.colors.primary }]}>
                <Text style={[styles.conversationModeText, { color: theme.colors.primary }]}>💬 Start Conversation Mode</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.instructionsLabel, { color: theme.colors.textSecondary }]}>
              When you are ready, press the button below and speak your answer.
            </Text>

            <SpeakingRecorder onTranscription={handleTranscription} />

            {attemptNumber > 1 && (
              <View style={[styles.attemptBanner, { backgroundColor: theme.colors.accentSoft }]}>
                <Text style={[styles.attemptText, { color: theme.colors.accent }]}>
                  Attempt {attemptNumber}
                </Text>
              </View>
            )}
          </>
        )}

        {screenState === 'conversation' && (
          <>
            <ConversationView turns={conversationTurns} onListen={handleListen} speakingText={speakingText} />
            {loading && (
              <View style={[styles.loadingBox, { backgroundColor: theme.colors.primarySoft }]}>
                <Loader2 size={20} color={theme.colors.primary} strokeWidth={2} />
                <Text style={[styles.loadingText, { color: theme.colors.primary }]}>Listening to you...</Text>
              </View>
            )}
            {!loading && (
              <SpeakingRecorder onTranscription={handleTranscription} />
            )}
            {feedback && conversationTurnNumber >= 4 && (
              <TouchableOpacity onPress={handleComplete} activeOpacity={0.8} style={[styles.endConversationBtn, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.endConversationText}>End Conversation & See Feedback</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {screenState === 'feedback' && (
          <>
            {loading && (
              <View style={[styles.loadingBox, { backgroundColor: theme.colors.primarySoft }]}>
                <Loader2 size={20} color={theme.colors.primary} strokeWidth={2} />
                <Text style={[styles.loadingText, { color: theme.colors.primary }]}>Analyzing your English...</Text>
              </View>
            )}
            {error && (
              <View style={[styles.errorBox, { backgroundColor: theme.colors.errorSoft }]}>
                <AlertCircle size={20} color={theme.colors.error} strokeWidth={2} />
                <Text style={[styles.errorMsg, { color: theme.colors.error }]}>{error}</Text>
                <TouchableOpacity onPress={() => handleTryAgain()} style={[styles.retryBtn, { borderColor: theme.colors.error }]}>
                  <Text style={[styles.retryText, { color: theme.colors.error }]}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
            {feedback && !loading && !error && (
              <>
                <SpeakingFeedbackView feedback={feedback} transcription={transcription} />
                <View style={styles.feedbackActions}>
                  <TouchableOpacity onPress={handleTryAgain} activeOpacity={0.8} style={[styles.tryAgainBtn, { borderColor: theme.colors.primary }]}>
                    <Text style={[styles.tryAgainText, { color: theme.colors.primary }]}>🎤 Try Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setScreenState('score')} activeOpacity={0.8} style={[styles.seeScoreBtn, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.seeScoreText}>See My Score</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}

        {screenState === 'score' && feedback && (
          <SpeakingScore
            feedback={feedback}
            attemptNumber={attemptNumber}
            xpEarned={isSpeakingCompleted(practice.id) ? 0 : practice.xpReward}
            onTryAgain={handleTryAgain}
            onContinue={handleComplete}
            vocabulary={practice.vocabulary}
            onSaveVocab={handleSaveVocab}
            isVocabSaved={isVocabSaved}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, flex: 1 },
  levelBadge: { paddingVertical: 3, paddingHorizontal: spacing.sm, borderRadius: radius.pill },
  levelText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, gap: spacing.md },
  conversationModeBtn: { minHeight: 48, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  conversationModeText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  instructionsLabel: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.5, textAlign: 'center' },
  attemptBanner: { alignItems: 'center', padding: spacing.sm, borderRadius: radius.md },
  attemptText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  loadingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
  loadingText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  errorBox: { gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
  errorMsg: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
  retryBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, alignSelf: 'flex-start' },
  retryText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  feedbackActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  tryAgainBtn: { flex: 1, minHeight: 48, borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  tryAgainText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  seeScoreBtn: { flex: 1, minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  seeScoreText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  endConversationBtn: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  endConversationText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  errorText: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  errorBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.md },
  errorBtnText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: fontWeight.semibold },
});
