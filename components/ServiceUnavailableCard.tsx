import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight } from '@/constants/layout';

interface ServiceUnavailableCardProps {
  title: string;
  message: string;
}

export function ServiceUnavailableCard({ title, message }: ServiceUnavailableCardProps) {
  const { theme } = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.primarySoft }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  message: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.5 },
});
