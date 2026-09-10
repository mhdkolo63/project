import { useColorScheme } from 'react-native';

export const lightTheme = {
  dark: false,
  colors: {
    // Primary - Blue
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    primarySoft: '#DBEAFE',

    // Secondary - Teal
    secondary: '#0D9488',
    secondaryLight: '#14B8A6',
    secondarySoft: '#CCFBF1',

    // Accent - Amber
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentSoft: '#FEF3C7',

    // Success - Green
    success: '#16A34A',
    successSoft: '#DCFCE7',

    // Warning - Orange
    warning: '#EA580C',
    warningSoft: '#FFEDD5',

    // Error - Red
    error: '#DC2626',
    errorSoft: '#FEE2E2',

    // Neutrals
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    surfaceElevated: '#FFFFFF',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',

    // Text
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    textOnPrimary: '#FFFFFF',

    // Level colors
    beginner: '#16A34A',
    beginnerSoft: '#DCFCE7',
    intermediate: '#F59E0B',
    intermediateSoft: '#FEF3C7',
    advanced: '#DC2626',
    advancedSoft: '#FEE2E2',
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    primarySoft: '#1E3A5F',

    secondary: '#14B8A6',
    secondaryLight: '#2DD4BF',
    secondarySoft: '#134E4A',

    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentSoft: '#78350F',

    success: '#22C55E',
    successSoft: '#14532D',

    warning: '#F97316',
    warningSoft: '#7C2D12',

    error: '#EF4444',
    errorSoft: '#7F1D1D',

    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#334155',
    surfaceElevated: '#1E293B',
    border: '#334155',
    borderStrong: '#475569',

    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    textOnPrimary: '#FFFFFF',

    beginner: '#22C55E',
    beginnerSoft: '#14532D',
    intermediate: '#F59E0B',
    intermediateSoft: '#78350F',
    advanced: '#EF4444',
    advancedSoft: '#7F1D1D',
  },
};

export type Theme = typeof lightTheme;

export { useColorScheme };
