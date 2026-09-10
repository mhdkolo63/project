import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { XCircle, BookOpen, MessageCircle, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SpeakingFeedback } from '@/types';

interface SpeakingFeedbackViewProps {
  feedback: SpeakingFeedback;
  transcription: string;
}

export function SpeakingFeedbackView({ feedback, transcription }: SpeakingFeedbackViewProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Card style={styles.transcriptionCard}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>What you said</Text>
        <Text style={[styles.transcription, { color: theme.colors.text }]}>{transcription}</Text>
      </Card>

      {feedback.grammar.corrections.length > 0 && (
        <Card style={[styles.sectionCard, { borderColor: theme.colors.error, borderWidth: 2 }]}>
          <View style={styles.sectionHeader}>
            <XCircle size={20} color={theme.colors.error} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Grammar</Text>
          </View>
          {feedback.grammar.corrections.map((c, i) => (
            <View key={i} style={[styles.correctionItem, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.originalText, { color: theme.colors.error }]}>❌ {c.original}</Text>
              <Text style={[styles.correctedText, { color: theme.colors.success }]}>✅ {c.corrected}</Text>
              <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>{c.explanation}</Text>
            </View>
          ))}
        </Card>
      )}

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <BookOpen size={20} color={theme.colors.primary} strokeWidth={2} />
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Vocabulary</Text>
        </View>
        {feedback.vocabulary.goodWords.length > 0 && (
          <View style={styles.vocabSection}>
            <Text style={[styles.vocabLabel, { color: theme.colors.textSecondary }]}>Good use of:</Text>
            {feedback.vocabulary.goodWords.map((w) => (
              <Text key={w} style={[styles.vocabItem, { color: theme.colors.success }]}>• {w}</Text>
            ))}
          </View>
        )}
        {feedback.vocabulary.suggestedWords.length > 0 && (
          <View style={styles.vocabSection}>
            <Text style={[styles.vocabLabel, { color: theme.colors.textSecondary }]}>Suggested words:</Text>
            {feedback.vocabulary.suggestedWords.map((w) => (
              <Text key={w} style={[styles.vocabItem, { color: theme.colors.accent }]}>• {w}</Text>
            ))}
          </View>
        )}
      </Card>

      {feedback.naturalness.alternatives.length > 0 && (
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.primarySoft }]}>
          <View style={styles.sectionHeader}>
            <MessageCircle size={20} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Natural English</Text>
          </View>
          {feedback.naturalness.alternatives.map((alt, i) => (
            <View key={i} style={styles.altItem}>
              <Text style={[styles.altOriginal, { color: theme.colors.textSecondary }]}>Instead of: "{alt.original}"</Text>
              <Text style={[styles.altNatural, { color: theme.colors.text }]}>A more natural sentence is: "{alt.natural}"</Text>
            </View>
          ))}
        </Card>
      )}

      <Card style={[styles.overallCard, { backgroundColor: theme.colors.successSoft, borderColor: theme.colors.success, borderWidth: 2 }]}>
        <View style={styles.sectionHeader}>
          <Lightbulb size={20} color={theme.colors.success} strokeWidth={2} />
          <Text style={[styles.sectionTitle, { color: theme.colors.success }]}>Overall Feedback</Text>
        </View>
        <Text style={[styles.overallText, { color: theme.colors.text }]}>{feedback.overallFeedback}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  transcriptionCard: { gap: spacing.xs },
  label: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.7 },
  transcription: { fontSize: fontSize.md, lineHeight: fontSize.md * 1.5, fontStyle: 'italic' },
  sectionCard: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  correctionItem: { gap: 4, paddingVertical: spacing.sm, borderBottomWidth: 1 },
  originalText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, lineHeight: fontSize.sm * 1.4 },
  correctedText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, lineHeight: fontSize.sm * 1.4 },
  explanationText: { fontSize: fontSize.xs, lineHeight: fontSize.xs * 1.5 },
  vocabSection: { gap: 2 },
  vocabLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  vocabItem: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
  altItem: { gap: 4, paddingVertical: spacing.xs },
  altOriginal: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
  altNatural: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, lineHeight: fontSize.sm * 1.4 },
  overallCard: { gap: spacing.sm },
  overallText: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.5 },
});
