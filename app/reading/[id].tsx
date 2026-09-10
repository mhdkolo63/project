import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ReadingScroller } from '@/components/ReadingScroller';
import { ReadingControls } from '@/components/ReadingControls';
import { ReadingResult } from '@/components/ReadingResult';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SavedVocabWord, ReadingVocabWord } from '@/types';
import { getReadingById, readingSpeedConfig } from '@/data/readingPracticals';

type ScreenState = 'reading' | 'complete';

export default function ReadingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, saveVocabWord, vocabulary, completeReading, isReadingCompleted } = useApp();

  const passage = getReadingById(id);

  const [screenState, setScreenState] = useState<ScreenState>('reading');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(readingSpeedConfig[user?.englishLevel || 'Beginner']);
  const [restartSignal, setRestartSignal] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [comprehensionScore, setComprehensionScore] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Timer management
  useEffect(() => {
    if (screenState === 'reading' && isPlaying) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setReadingTime(Math.floor((accumulatedTimeRef.current + Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          accumulatedTimeRef.current += Date.now() - startTimeRef.current;
        }
      };
    }
  }, [isPlaying, screenState]);

  if (!passage) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Passage not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.errorBtn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.errorBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const wordCount = passage.text.split(/\s+/).filter(Boolean).length;

  const handleReachEnd = () => {
    setIsPlaying(false);
    completeReading({
      passageId: passage.id,
      completedAt: new Date().toISOString(),
      readingTimeSeconds: readingTime,
      comprehensionScore,
      totalQuestions: passage.comprehensionQuestions.length,
      xpAwarded: true,
      xpAmount: passage.xpReward,
    });
    setScreenState('complete');
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    accumulatedTimeRef.current = 0;
    setReadingTime(0);
    setRestartSignal((prev) => prev + 1);
    setIsPlaying(true);
    setScreenState('reading');
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleReadAgain = () => {
    setComprehensionScore(0);
    handleRestart();
  };

  const handleContinue = () => {
    router.replace('/reading-practice');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setComprehensionScore((prev) => prev + 1);
    }
  };

  const handleSaveVocab = (vocab: ReadingVocabWord) => {
    const savedWord: SavedVocabWord = {
      id: `reading-${passage.id}-${vocab.word}`,
      word: vocab.word,
      meaning: vocab.meaning,
      example: vocab.example,
      partOfSpeech: '',
      level: passage.level,
      savedAt: new Date().toISOString(),
      learned: false,
    };
    saveVocabWord(savedWord);
  };

  const isVocabSaved = (word: string) => {
    return vocabulary.some((v) => v.word === word);
  };


  if (screenState === 'complete') {
    const alreadyCompleted = isReadingCompleted(passage.id);
    return (
      <View style={[styles.completeContainer, { backgroundColor: theme.colors.background }]}>
        <ReadingResult
          passage={passage}
          readingTimeSeconds={readingTime}
          wordCount={wordCount}
          xpEarned={alreadyCompleted ? 0 : passage.xpReward}
          comprehensionScore={comprehensionScore}
          totalQuestions={passage.comprehensionQuestions.length}
          onReadAgain={handleReadAgain}
          onContinue={handleContinue}
          onSaveVocab={handleSaveVocab}
          isVocabSaved={isVocabSaved}
          onAnswer={handleAnswer}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back to reading practice"
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {passage.title}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: theme.colors.primarySoft }]}>
            <Text style={[styles.levelText, { color: theme.colors.primary }]}>
              {passage.level}
            </Text>
          </View>
        </View>
      </View>

      {/* Reading Area */}
      <ReadingScroller
        text={passage.text}
        speed={speed}
        isPlaying={isPlaying}
        onReachEnd={handleReachEnd}
        restartSignal={restartSignal}
      />

      {/* Controls */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ReadingControls
          isPlaying={isPlaying}
          speed={speed}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          onSpeedChange={handleSpeedChange}
        />
      </View>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  completeContainer: {
    flex: 1,
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
});
