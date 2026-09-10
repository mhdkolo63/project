import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';

function RootStack() {
  useFrameworkReady();
  const { theme, isDark } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="splash">
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="level-select" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]" />
        <Stack.Screen name="quiz/[lessonId]" />
        <Stack.Screen name="grammar-check" />
        <Stack.Screen name="placement-test" />
        <Stack.Screen name="reading-practice" />
        <Stack.Screen name="reading/[id]" />
        <Stack.Screen name="speaking-practice" />
        <Stack.Screen name="speaking/[id]" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/edit-profile" />
        <Stack.Screen name="settings/privacy" />
        <Stack.Screen name="settings/about" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/help" />
        <Stack.Screen name="settings/achievements" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RootStack />
      </AppProvider>
    </ThemeProvider>
  );
}
