import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/constants/layout';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function ScreenContainer({ children, scroll = true, style, noPadding }: ScreenContainerProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.inner, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.lg }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top + spacing.lg }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl + 40,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
});
