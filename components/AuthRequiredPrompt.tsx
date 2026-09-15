import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

interface AuthRequiredPromptProps {
  title?: string;
  message?: string;
}

export function AuthRequiredPrompt({
  title = 'Sign In Required',
  message = 'Please sign in or create an account to use AI features.',
}: AuthRequiredPromptProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primarySoft }]}>
          <Lock size={32} color={theme.colors.primary} strokeWidth={2} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
        <View style={styles.actions}>
          <Button
            label="Sign In"
            onPress={() => router.push('/(auth)/login')}
            fullWidth
            size="lg"
          />
          <Button
            label="Create Account"
            onPress={() => router.push('/(auth)/signup')}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    maxWidth: 380,
    width: '100%',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
