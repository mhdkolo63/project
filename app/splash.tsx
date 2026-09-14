import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Sparkles } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { spacing, fontSize, fontWeight } from '@/constants/layout';
import { AppConfig } from '@/constants/config';

export default function SplashScreen() {
  const { theme } = useTheme();
  const { user, isOnboarded, isLoading } = useApp();

  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const footerOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const animationDoneRef = useRef(false);
  const loadingDoneRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  const navigateAway = () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    if (user && !user.isGuest && isOnboarded) {
      router.replace('/(tabs)');
    } else if (user && user.isGuest) {
      router.replace('/(tabs)');
    } else if (isOnboarded) {
      router.replace('/(auth)/login');
    } else {
      router.replace('/onboarding');
    }
  };

  const tryNavigate = () => {
    if (animationDoneRef.current && loadingDoneRef.current) {
      runOnJS(navigateAway)();
    }
  };

  useEffect(() => {
    logoScale.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.5)) }));
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));

    textOpacity.value = withDelay(700, withTiming(1, { duration: 500 }));
    textTranslateY.value = withDelay(700, withTiming(0, { duration: 500 }));

    footerOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));

    screenOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          animationDoneRef.current = true;
          tryNavigate();
        }
      })
    );
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadingDoneRef.current = true;
      tryNavigate();
    }
  }, [isLoading]);

  const logoAnim = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnim = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const footerAnim = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const screenAnim = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.screenWrapper, screenAnim]}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.container}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoAnim]}>
            <View style={styles.logoCircle}>
              <BookOpen size={48} color={theme.colors.textOnPrimary} strokeWidth={2} />
            </View>
            <View style={styles.sparkle1}>
              <Sparkles size={20} color={theme.colors.accentLight} strokeWidth={2} />
            </View>
          </Animated.View>
          <Animated.View style={textAnim}>
            <Text style={styles.appName}>{AppConfig.appName}</Text>
            <Text style={styles.tagline}>{AppConfig.tagline}</Text>
          </Animated.View>
        </View>
        <Animated.View style={footerAnim}>
          <Text style={styles.footer}>Learn. Practice. Speak. Master English.</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle1: {
    position: 'absolute',
    top: -8,
    right: -12,
  },
  appName: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.xs,
    fontWeight: fontWeight.regular,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },
});
