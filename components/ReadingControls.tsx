import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { speedPresets, speedLimits } from '@/data/readingPracticals';

interface ReadingControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onRestart: () => void;
  onSpeedChange: (speed: number) => void;
}

export function ReadingControls({
  isPlaying,
  speed,
  onPlayPause,
  onRestart,
  onSpeedChange,
}: ReadingControlsProps) {
  const { theme } = useTheme();

  const decreaseSpeed = () => {
    const next = Math.max(speedLimits.min, Math.round((speed - speedLimits.step) * 100) / 100);
    onSpeedChange(next);
  };

  const increaseSpeed = () => {
    const next = Math.min(speedLimits.max, Math.round((speed + speedLimits.step) * 100) / 100);
    onSpeedChange(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      <View style={styles.mainRow}>
        <TouchableOpacity
          onPress={onRestart}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Restart reading"
          style={styles.iconBtn}
        >
          <RotateCcw size={22} color={theme.colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlayPause}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause reading' : 'Play reading'}
          style={[styles.playBtn, { backgroundColor: theme.colors.primary }]}
        >
          {isPlaying ? (
            <Pause size={24} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
          ) : (
            <Play size={24} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
          )}
        </TouchableOpacity>

        <View style={styles.speedControl}>
          <TouchableOpacity
            onPress={decreaseSpeed}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Decrease reading speed"
            style={styles.speedBtn}
          >
            <Minus size={18} color={theme.colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[styles.speedLabel, { color: theme.colors.text }]}>
            {speed.toFixed(2)}x
          </Text>
          <TouchableOpacity
            onPress={increaseSpeed}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Increase reading speed"
            style={styles.speedBtn}
          >
            <Plus size={18} color={theme.colors.textSecondary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.presetsRow}>
        {speedPresets.map((preset) => {
          const isActive = Math.abs(speed - preset) < 0.01;
          return (
            <TouchableOpacity
              key={preset}
              onPress={() => onSpeedChange(preset)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Set speed to ${preset}x`}
            >
              <View
                style={[
                  styles.preset,
                  isActive
                    ? { backgroundColor: theme.colors.primary }
                    : { backgroundColor: theme.colors.surfaceAlt },
                ]}
              >
                <Text
                  style={[
                    styles.presetText,
                    { color: isActive ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}
                >
                  {preset}x
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  speedBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    minWidth: 56,
    textAlign: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  preset: {
    paddingVertical: 4,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.pill,
  },
  presetText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
