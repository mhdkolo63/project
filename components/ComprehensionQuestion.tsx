import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { ReadingComprehensionQuestion } from '@/types';

interface ComprehensionQuestionProps {
  question: ReadingComprehensionQuestion;
  index: number;
  onAnswer: (isCorrect: boolean) => void;
}

export function ComprehensionQuestion({ question, index, onAnswer }: ComprehensionQuestionProps) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    onAnswer(option === question.correctAnswer);
  };

  const getOptionStyle = (option: string) => {
    if (!answered) {
      return { backgroundColor: theme.colors.surface, borderColor: theme.colors.border };
    }
    if (option === question.correctAnswer) {
      return { backgroundColor: theme.colors.successSoft, borderColor: theme.colors.success };
    }
    if (option === selected) {
      return { backgroundColor: theme.colors.errorSoft, borderColor: theme.colors.error };
    }
    return { backgroundColor: theme.colors.surface, borderColor: theme.colors.border };
  };

  const getOptionTextColor = (option: string) => {
    if (!answered) return theme.colors.text;
    if (option === question.correctAnswer) return theme.colors.success;
    if (option === selected) return theme.colors.error;
    return theme.colors.textTertiary;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.questionText, { color: theme.colors.text }]}>
        {index + 1}. {question.question}
      </Text>
      <View style={styles.options}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleSelect(option)}
            disabled={answered}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Answer option: ${option}`}
          >
            <View style={[styles.option, getOptionStyle(option), { borderWidth: 1.5 }]}>
              <Text style={[styles.optionText, { color: getOptionTextColor(option) }]}>
                {option}
              </Text>
              {answered && option === question.correctAnswer && (
                <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} />
              )}
              {answered && option === selected && option !== question.correctAnswer && (
                <XCircle size={20} color={theme.colors.error} strokeWidth={2} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {answered && (
        <View style={[styles.explanation, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
            {question.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  questionText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * 1.4,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    minHeight: 52,
  },
  optionText: {
    fontSize: fontSize.md,
    flex: 1,
    fontWeight: fontWeight.regular,
  },
  explanation: {
    padding: spacing.md,
    borderRadius: radius.md,
  },
  explanationText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
});
