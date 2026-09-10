import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
  runOnJS,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight } from '@/constants/layout';

interface ReadingScrollerProps {
  text: string;
  speed: number;
  isPlaying: boolean;
  onReachEnd: () => void;
  restartSignal: number;
}

const BASE_PIXELS_PER_SECOND = 38;

export function ReadingScroller({ text, speed, isPlaying, onReachEnd, restartSignal }: ReadingScrollerProps) {
  const { theme } = useTheme();
  const translateY = useSharedValue(0);
  const [containerHeight, setContainerHeight] = useState(400);
  const [textHeight, setTextHeight] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const hasEnded = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  const paragraphs = text.split('\n\n');

  // Keep refs in sync for use in callbacks
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Mark ready once we have both heights measured
  useEffect(() => {
    if (containerHeight > 0 && textHeight > 0 && !isReady) {
      // Position text below the viewport initially
      translateY.value = containerHeight;
      setIsReady(true);
    }
  }, [containerHeight, textHeight, isReady]);

  // Reset on restart signal
  useEffect(() => {
    if (isReady) {
      cancelAnimation(translateY);
      hasEnded.current = false;
      translateY.value = containerHeight;
      if (isPlaying) {
        startAnimation();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartSignal, isReady]);

  // Handle play/pause
  useEffect(() => {
    if (!isReady) return;
    if (isPlaying) {
      startAnimation();
    } else {
      cancelAnimation(translateY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isReady]);

  // Handle speed change — restart animation from current position with new speed
  useEffect(() => {
    if (!isReady) return;
    if (isPlaying) {
      cancelAnimation(translateY);
      startAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, isReady]);

  const startAnimation = () => {
    const pixelsPerSecond = BASE_PIXELS_PER_SECOND * speedRef.current;
    // Total distance: from current position to -(textHeight) — fully above viewport
    const targetY = -textHeight;
    const currentY = translateY.value;
    const distance = currentY - targetY;

    if (distance <= 0) {
      // Already at or past the end
      if (!hasEnded.current) {
        hasEnded.current = true;
        runOnJS(onReachEnd)();
      }
      return;
    }

    const durationMs = (distance / pixelsPerSecond) * 1000;

    translateY.value = withTiming(targetY, {
      duration: durationMs,
      easing: Easing.linear,
    }, (finished) => {
      if (finished && !hasEnded.current) {
        hasEnded.current = true;
        runOnJS(onReachEnd)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      {/* Clipped viewport */}
      <View style={styles.viewport} pointerEvents="none">
        <Animated.View
          style={[styles.textContainer, animatedStyle]}
          onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
        >
          {paragraphs.map((para, i) => (
            <Text
              key={i}
              style={[
                styles.paragraph,
                {
                  color: theme.colors.text,
                  fontSize: fontSize.lg,
                  lineHeight: fontSize.lg * 1.6,
                },
              ]}
            >
              {para}
            </Text>
          ))}
        </Animated.View>
      </View>

      {/* Top fade gradient */}
      <View
        style={[styles.fadeTop, {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        }]}
        pointerEvents="none"
      />

      {/* Bottom fade gradient */}
      <View
        style={[styles.fadeBottom, {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
  },
  textContainer: {
    paddingTop: 0,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  paragraph: {
    fontWeight: fontWeight.regular,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    opacity: 0.92,
    zIndex: 2,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.92,
    zIndex: 2,
  },
});
