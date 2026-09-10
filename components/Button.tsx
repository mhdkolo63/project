import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, fontSize, fontWeight } from '@/constants/layout';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  icon,
  style,
}: ButtonProps) {
  const { theme } = useTheme();

  const getBgColor = () => {
    if (disabled) return theme.colors.border;
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textTertiary;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.textOnPrimary;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.text;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    return 'transparent';
  };

  const getSizeStyles = (): { paddingV: number; paddingH: number; fSize: number } => {
    switch (size) {
      case 'sm':
        return { paddingV: spacing.sm, paddingH: spacing.md, fSize: fontSize.sm };
      case 'lg':
        return { paddingV: spacing.md + 2, paddingH: spacing.xl, fSize: fontSize.lg };
      default:
        return { paddingV: spacing.md - 2, paddingH: spacing.lg, fSize: fontSize.md };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          paddingVertical: sizeStyles.paddingV,
          paddingHorizontal: sizeStyles.paddingH,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              {
                color: getTextColor(),
                fontSize: sizeStyles.fSize,
              },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.sm,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: fontWeight.semibold,
  textAlign: 'center',
  },
});
