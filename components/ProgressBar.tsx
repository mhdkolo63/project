import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius } from '@/constants/layout';

interface ProgressBarProps {
  progress: number;
  height?: number;
  style?: ViewStyle;
  color?: string;
  trackColor?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  style,
  color,
  trackColor,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor || theme.colors.surfaceAlt,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: color || theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
