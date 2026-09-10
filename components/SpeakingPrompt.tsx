import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { LevelBadge } from '@/components/LevelBadge';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SpeakingPractice } from '@/types';

interface SpeakingPromptProps {
  practice: SpeakingPractice;
  onListen: () => void;
  isSpeaking: boolean;
}

export function SpeakingPrompt({ practice, onListen, isSpeaking }: SpeakingPromptProps) {
  const { theme } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>AI Coach</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{practice.title}</Text>
        </View>
        <LevelBadge level={practice.level} size="sm" />
      </View>
      <Text style={[styles.prompt, { color: theme.colors.text }]}>{practice.aiCoachLine}</Text>
      <Text style={[styles.task, { color: theme.colors.textSecondary }]}>{practice.prompt}</Text>
      <TouchableOpacity
        onPress={onListen}
        activeOpacity={0.8}
        style={[styles.listenButton, { backgroundColor: isSpeaking ? theme.colors.primarySoft : theme.colors.surfaceAlt }]}
      >
        {isSpeaking ? (
          <CheckCircle2 size={18} color={theme.colors.primary} strokeWidth={2} />
        ) : (
          <Volume2 size={18} color={theme.colors.primary} strokeWidth={2} />
        )}
        <Text style={[styles.listenText, { color: theme.colors.primary }]}> 
          {isSpeaking ? 'Speaking...' : 'Listen'}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleArea: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  prompt: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.lg * 1.5,
  },
  task: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  listenText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
