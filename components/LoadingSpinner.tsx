import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  fullscreen?: boolean;
}

export function LoadingSpinner({ size = 'large', fullscreen }: LoadingSpinnerProps) {
  const { theme } = useTheme();

  if (fullscreen) {
    return (
      <View style={[styles.fullscreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size={size} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
