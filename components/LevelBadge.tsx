import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight } from '@/constants/layout';
import { EnglishLevel } from '@/types';

interface LevelBadgeProps {
  level: EnglishLevel;
  size?: 'sm' | 'md';
}

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const { theme } = useTheme();

  const getColor = () => {
    switch (level) {
      case 'Beginner':
        return { bg: theme.colors.beginnerSoft, text: theme.colors.beginner };
      case 'Intermediate':
        return { bg: theme.colors.intermediateSoft, text: theme.colors.intermediate };
      case 'Advanced':
        return { bg: theme.colors.advancedSoft, text: theme.colors.advanced };
    }
  };

  const colors = getColor();
  const fontSizeVal = size === 'sm' ? fontSize.xs : fontSize.sm;
  const paddingV = size === 'sm' ? spacing.xs : spacing.xs + 2;
  const paddingH = size === 'sm' ? spacing.sm : spacing.md;

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, paddingVertical: paddingV, paddingHorizontal: paddingH }]}>
      <Text style={[styles.text, { color: colors.text, fontSize: fontSizeVal }]}>
        {level}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: fontWeight.semibold,
  letterSpacing: 0.3,
  textTransform: 'uppercase',
  fontSize: 11,
  fontFamily: undefined,
  },
});
