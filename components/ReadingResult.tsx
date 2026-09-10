import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PartyPopper, Clock, FileText, Award, Brain, RotateCcw, ArrowRight, BookmarkPlus, Check } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { ReadingPractical, ReadingVocabWord } from '@/types';
import { ComprehensionQuestion } from './ComprehensionQuestion';

interface ReadingResultProps {
  passage: ReadingPractical;
  readingTimeSeconds: number;
  wordCount: number;
  xpEarned: number;
  comprehensionScore: number;
  totalQuestions: number;
  onReadAgain: () => void;
  onContinue: () => void;
  onSaveVocab: (word: ReadingVocabWord) => void;
  isVocabSaved: (word: string) => boolean;
  onAnswer: (isCorrect: boolean) => void;
}

export function ReadingResult({
  passage,
  readingTimeSeconds,
  wordCount,
  xpEarned,
  comprehensionScore,
  totalQuestions,
  onReadAgain,
  onContinue,
  onSaveVocab,
  isVocabSaved,
  onAnswer,
}: ReadingResultProps) {
  const { theme } = useTheme();
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showComprehension, setShowComprehension] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  const minutes = Math.floor(readingTimeSeconds / 60);
  const seconds = readingTimeSeconds % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const scorePercentage = totalQuestions > 0 ? (comprehensionScore / totalQuestions) * 100 : 0;
  const scoreLabel = scorePercentage >= 80 ? 'Excellent' : scorePercentage >= 60 ? 'Good' : 'Needs Practice';
  const scoreColor = scorePercentage >= 80 ? theme.colors.success : scorePercentage >= 60 ? theme.colors.warning : theme.colors.error;

  const handleAnswer = (index: number, isCorrect: boolean) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = isCorrect;
      return updated;
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Completion Header */}
      <View style={[styles.completionBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={[styles.completionIcon, { backgroundColor: theme.colors.successSoft }]}>
          <PartyPopper size={32} color={theme.colors.success} strokeWidth={2} />
        </View>
        <Text style={[styles.completionTitle, { color: theme.colors.text }]}>Reading Complete!</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Reading</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]} numberOfLines={1}>{passage.title}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Level</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{passage.level}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Clock size={14} color={theme.colors.textTertiary} strokeWidth={2} />
            <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Time</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{timeStr}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceAlt }]}>
            <FileText size={14} color={theme.colors.textTertiary} strokeWidth={2} />
            <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>Words</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{wordCount}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.colors.accentSoft }]}>
            <Award size={14} color={theme.colors.accent} strokeWidth={2} />
            <Text style={[styles.statLabel, { color: theme.colors.textTertiary }]}>XP Earned</Text>
            <Text style={[styles.statValue, { color: theme.colors.accent }]}>+{xpEarned}</Text>
          </View>
        </View>
      </View>

      {/* Comprehension Test Section */}
      {!showComprehension ? (
        <TouchableOpacity onPress={() => setShowComprehension(true)} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Test your understanding">
          <View style={[styles.actionCard, { backgroundColor: theme.colors.primary }]}>
            <Brain size={24} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionCardText}>Test Your Understanding</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.comprehensionBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Comprehension Questions</Text>
          <View style={styles.questionsList}>
            {passage.comprehensionQuestions.map((q, i) => (
              <ComprehensionQuestion
                key={q.id}
                question={q}
                index={i}
                onAnswer={(isCorrect) => {
                  handleAnswer(i, isCorrect);
                  onAnswer(isCorrect);
                }}
              />
            ))}
          </View>

          {answers.length === passage.comprehensionQuestions.length && answers.every((a) => a !== undefined) && (
            <View style={[styles.scoreBox, { backgroundColor: theme.colors.surfaceAlt }]}>
              <Text style={[styles.scoreTitle, { color: theme.colors.text }]}>Comprehension Score</Text>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>
                {comprehensionScore}/{totalQuestions}
              </Text>
              <Text style={[styles.scoreLabel2, { color: scoreColor }]}>{scoreLabel}</Text>
            </View>
          )}
        </View>
      )}

      {/* Vocabulary Section */}
      {!showVocab ? (
        <TouchableOpacity onPress={() => setShowVocab(true)} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Review new words from this passage">
          <View style={[styles.actionCard, { backgroundColor: theme.colors.secondary }]}>
            <BookmarkPlus size={24} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionCardText}>New Words ({passage.vocabulary.length})</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.vocabBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>New Words</Text>
          <View style={styles.vocabList}>
            {passage.vocabulary.map((vocab, i) => {
              const saved = isVocabSaved(vocab.word);
              return (
                <View key={i} style={[styles.vocabItem, { borderBottomColor: theme.colors.border }]}>
                  <View style={styles.vocabHeader}>
                    <Text style={[styles.vocabWord, { color: theme.colors.text }]}>{vocab.word}</Text>
                    <TouchableOpacity
                      onPress={() => onSaveVocab(vocab)}
                      disabled={saved}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={saved ? `${vocab.word} already saved` : `Save ${vocab.word} to vocabulary`}
                    >
                      <View style={[styles.saveBtn, { backgroundColor: saved ? theme.colors.successSoft : theme.colors.primarySoft }]}>
                        {saved ? (
                          <Check size={14} color={theme.colors.success} strokeWidth={2} />
                        ) : (
                          <BookmarkPlus size={14} color={theme.colors.primary} strokeWidth={2} />
                        )}
                        <Text style={[styles.saveBtnText, { color: saved ? theme.colors.success : theme.colors.primary }]}>
                          {saved ? 'Saved' : 'Save'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.vocabMeaning, { color: theme.colors.textSecondary }]}>
                    {vocab.meaning}
                  </Text>
                  <Text style={[styles.vocabExample, { color: theme.colors.textTertiary }]}>
                    "{vocab.example}"
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onReadAgain} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Read this passage again">
          <View style={[styles.btnOutline, { borderColor: theme.colors.primary }]}>
            <RotateCcw size={18} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.btnOutlineText, { color: theme.colors.primary }]}>Read Again</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContinue} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Continue to reading practice list">
          <View style={[styles.btnPrimary, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.btnPrimaryText}>Continue</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + 40,
    gap: spacing.md,
  },
  completionBox: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  completionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  statBox: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    minWidth: 80,
    gap: 2,
  },
  statLabel: {
    fontSize: fontSize.xs,
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
  },
  actionCardText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  comprehensionBox: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  questionsList: {
    gap: spacing.lg,
  },
  scoreBox: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  scoreTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  scoreNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  scoreLabel2: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  vocabBox: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  vocabList: {
    gap: 0,
  },
  vocabItem: {
    paddingVertical: spacing.md,
    gap: 4,
    borderBottomWidth: 1,
  },
  vocabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vocabWord: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  vocabMeaning: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  vocabExample: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    lineHeight: fontSize.sm * 1.4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  saveBtnText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    minHeight: 48,
  },
  btnOutlineText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 48,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
