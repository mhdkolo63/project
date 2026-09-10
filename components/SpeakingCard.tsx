import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, Mic, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SpeakingPractice } from '@/types';

interface SpeakingCardProps {
  practice: SpeakingPractice;
  completed: boolean;
  onPress: () => void;
}

export function SpeakingCard({ practice, completed, onPress }: SpeakingCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={false}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primarySoft }]}>
            <Mic size={22} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.titleArea}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {practice.title}
            </Text>
            <Text style={[styles.category, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {practice.category}
            </Text>
          </View>
          {completed ? (
            <CheckCircle2 size={24} color={theme.colors.success} strokeWidth={2} />
          ) : (
            <ArrowRight size={20} color={theme.colors.textTertiary} strokeWidth={2} />
          )}
        </View>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {practice.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.skillsRow}>
            {practice.targetSkills.slice(0, 3).map((skill) => (
              <View key={skill} style={[styles.skillChip, { backgroundColor: theme.colors.surfaceAlt }]}>
                <Text style={[styles.skillText, { color: theme.colors.textSecondary }]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
          <View style={[styles.xpBadge, { backgroundColor: theme.colors.accentSoft }]}>
            <Text style={[styles.xpText, { color: theme.colors.accent }]}>
              +{practice.xpReward} XP
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  category: {
    fontSize: fontSize.xs,
  },
  description: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  skillChip: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  skillText: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
  },
  xpBadge: {
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  xpText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
