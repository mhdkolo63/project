import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle2, BookOpen, Tag } from 'lucide-react-native';
import { Card } from './Card';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { ReadingPractical } from '@/types';

interface ReadingCardProps {
  passage: ReadingPractical;
  completed: boolean;
  onPress: () => void;
}

export function ReadingCard({ passage, completed, onPress }: ReadingCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={`Reading passage: ${passage.title}`}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primarySoft }]}>
            <BookOpen size={20} color={theme.colors.primary} strokeWidth={2} />
          </View>
          {completed && (
            <View style={[styles.completedBadge, { backgroundColor: theme.colors.successSoft }]}>
              <CheckCircle2 size={14} color={theme.colors.success} strokeWidth={2} />
              <Text style={[styles.completedText, { color: theme.colors.success }]}>Done</Text>
            </View>
          )}
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {passage.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color={theme.colors.textTertiary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: theme.colors.textTertiary }]}>
              {passage.estimatedMinutes} min
            </Text>
          </View>
          <View style={[styles.catBadge, { backgroundColor: theme.colors.secondarySoft }]}>
            <Tag size={12} color={theme.colors.secondary} strokeWidth={2} />
            <Text style={[styles.catText, { color: theme.colors.secondary }]}>
              {passage.category}
            </Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={[styles.diffBadge, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Text style={[styles.diffText, { color: theme.colors.textSecondary }]}>
              {passage.level}
            </Text>
          </View>
          <View style={[styles.xpBadge, { backgroundColor: theme.colors.accentSoft }]}>
            <Text style={[styles.xpText, { color: theme.colors.accent }]}>
              +{passage.xpReward} XP
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  completedText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * 1.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSize.xs,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  catText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  diffBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  diffText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  xpBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  xpText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
