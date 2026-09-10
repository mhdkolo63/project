import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Bot, Trophy, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: BookOpen,
    title: 'Learn English Step by Step',
    description: 'Start from the basics and build your way up to fluency with structured lessons designed for your level.',
    colors: ['#2563EB', '#1D4ED8'] as [string, string],
  },
  {
    icon: Bot,
    title: 'Practice With Your AI English Tutor',
    description: 'Chat with an AI tutor that corrects your grammar, explains mistakes, and helps you improve in real-time.',
    colors: ['#0D9488', '#0F766E'] as [string, string],
  },
  {
    icon: Trophy,
    title: 'Track Your Progress and Become Fluent',
    description: 'Earn XP, maintain streaks, complete daily challenges, and watch yourself become fluent in English.',
    colors: ['#F59E0B', '#D97706'] as [string, string],
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { setOnboarded } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    setOnboarded(true);
    router.replace('/(auth)/login');
  };

  const handleGetStarted = () => {
    setOnboarded(true);
    router.replace('/(auth)/signup');
  };

  const currentSlide = slides[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.skipContainer}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <LinearGradient colors={currentSlide.colors} style={styles.iconCircle}>
            <Icon size={56} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{currentSlide.title}</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {currentSlide.description}
        </Text>
      </View>

      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? theme.colors.primary : theme.colors.border },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            {currentIndex < slides.length - 1 && <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  paddingHorizontal: spacing.xl,
  paddingBottom: spacing.xl + 20,
  justifyContent: 'space-between',
  },
  skipContainer: {
    alignItems: 'flex-end',
    minHeight: 30,
  },
  skipText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  iconWrapper: {
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    lineHeight: fontSize.xxxl * 1.2,
  },
  description: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
    paddingHorizontal: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    gap: spacing.sm,
    minHeight: 56,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
