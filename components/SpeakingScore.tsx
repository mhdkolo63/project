import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RotateCw, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SpeakingFeedback, SpeakingVocabWord } from '@/types';

interface SpeakingScoreProps {
  feedback: SpeakingFeedback;
  attemptNumber: number;
  xpEarned: number;
  onTryAgain: () => void;
  onContinue: () => void;
  vocabulary: SpeakingVocabWord[];
  onSaveVocab: (word: SpeakingVocabWord) => void;
  isVocabSaved: (word: string) => boolean;
}

export function SpeakingScore({
  feedback, attemptNumber, xpEarned, onTryAgain, onContinue, vocabulary, onSaveVocab, isVocabSaved,
}: SpeakingScoreProps) {
  const { theme } = useTheme();

  const scoreRow = (label: string, score: number, color: string) => (
    <View style={styles.scoreRow}>
      <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <View style={styles.scoreBarContainer}>
        <View style={[styles.scoreBarFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.scoreValue, { color }]}>{score}%</Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={[styles.celebrationBox, { backgroundColor: theme.colors.primarySoft }]}>
        <Text style={styles.celebrationEmoji}>🎉</Text>
        <Text style={[styles.celebrationTitle, { color: theme.colors.primary }]}>Speaking Practice Complete!</Text>
        <Text style={[styles.attemptText, { color: theme.colors.textSecondary }]}>Attempt {attemptNumber}</Text>
      </View>

      <Card style={styles.scoreCard}>
        <Text style={[styles.scoreCardTitle, { color: theme.colors.text }]}>Your Score</Text>
        {scoreRow('Grammar', feedback.grammar.score, theme.colors.success)}
        {scoreRow('Vocabulary', feedback.vocabulary.score, theme.colors.primary)}
        {scoreRow('Naturalness', feedback.naturalness.score, theme.colors.accent)}
        <View style={[styles.overallRow, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.overallLabel, { color: theme.colors.text }]}>Overall</Text>
          <Text style={[styles.overallScore, { color: theme.colors.primary }]}>{feedback.overallScore}%</Text>
        </View>
      </Card>

      {xpEarned > 0 && (
        <View style={[styles.xpBanner, { backgroundColor: theme.colors.accentSoft }]}>
          <Text style={[styles.xpText, { color: theme.colors.accent }]}>+{xpEarned} XP Earned!</Text>
        </View>
      )}

      {vocabulary.length > 0 && (
        <Card style={styles.vocabCard}>
          <Text style={[styles.vocabTitle, { color: theme.colors.text }]}>📚 New Words</Text>
          {vocabulary.map((v) => (
            <View key={v.word} style={[styles.vocabItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.vocabHeader}>
                <Text style={[styles.vocabWord, { color: theme.colors.primary }]}>"{v.word}"</Text>
                {!isVocabSaved(v.word) ? (
                  <TouchableOpacity onPress={() => onSaveVocab(v)} style={[styles.saveVocabBtn, { borderColor: theme.colors.primary }]}>
                    <Text style={[styles.saveVocabText, { color: theme.colors.primary }]}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.savedText, { color: theme.colors.success }]}>Saved ✓</Text>
                )}
              </View>
              <Text style={[styles.vocabMeaning, { color: theme.colors.textSecondary }]}>Meaning: {v.meaning}</Text>
              <Text style={[styles.vocabExample, { color: theme.colors.textSecondary }]}>Example: {v.example}</Text>
            </View>
          ))}
        </Card>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onTryAgain} activeOpacity={0.8} style={[styles.tryAgainBtn, { borderColor: theme.colors.primary }]}>
          <RotateCw size={18} color={theme.colors.primary} strokeWidth={2} />
          <Text style={[styles.tryAgainText, { color: theme.colors.primary }]}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContinue} activeOpacity={0.8} style={[styles.continueBtn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.continueText}>Continue</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  celebrationBox: { alignItems: 'center', gap: spacing.xs, padding: spacing.lg, borderRadius: radius.lg },
  celebrationEmoji: { fontSize: 48 },
  celebrationTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, textAlign: 'center' },
  attemptText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  scoreCard: { gap: spacing.sm },
  scoreCardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, marginBottom: spacing.xs },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  scoreLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, width: 90 },
  scoreBarContainer: { flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.08)' },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scoreValue: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, width: 40, textAlign: 'right', fontVariant: ['tabular-nums'] },
  overallRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm, borderTopWidth: 1, marginTop: spacing.xs },
  overallLabel: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  overallScore: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, fontVariant: ['tabular-nums'] },
  xpBanner: { alignItems: 'center', padding: spacing.md, borderRadius: radius.md },
  xpText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  vocabCard: { gap: spacing.sm },
  vocabTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  vocabItem: { gap: 4, paddingVertical: spacing.sm, borderBottomWidth: 1 },
  vocabHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vocabWord: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  saveVocabBtn: { paddingVertical: 2, paddingHorizontal: spacing.sm, borderRadius: radius.pill, borderWidth: 1 },
  saveVocabText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  savedText: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  vocabMeaning: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
  vocabExample: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  tryAgainBtn: { flex: 1, minHeight: 48, borderRadius: radius.md, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  tryAgainText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  continueBtn: { flex: 1, minHeight: 48, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  continueText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
});
