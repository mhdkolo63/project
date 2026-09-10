import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sprout, TrendingUp, Flame, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel } from '@/types';

const levels: {
  level: EnglishLevel;
  icon: typeof Sprout;
  label: string;
  description: string;
  colors: [string, string];
}[] = [
  {
    level: 'Beginner',
    icon: Sprout,
    label: 'Beginner',
    description: 'Start with the basics: alphabet, greetings, and simple sentences.',
    colors: ['#16A34A', '#15803D'],
  },
  {
    level: 'Intermediate',
    icon: TrendingUp,
    label: 'Intermediate',
    description: 'Build your skills with grammar, vocabulary, and daily conversations.',
    colors: ['#F59E0B', '#D97706'],
  },
  {
    level: 'Advanced',
    icon: Flame,
    label: 'Advanced',
    description: 'Master professional English, public speaking, and advanced grammar.',
    colors: ['#DC2626', '#B91C1C'],
  },
];

export default function LevelSelectScreen() {
  const { theme } = useTheme();
  const { setEnglishLevel, user } = useApp();
  const [selected, setSelected] = useState<EnglishLevel | null>(user?.englishLevel || null);

  const handleContinue = () => {
    if (selected) {
      setEnglishLevel(selected);
      router.replace('/(tabs)');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>What is your English level?</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          We'll personalize your lessons based on your selection.
        </Text>
      </View>

      <View style={styles.levelsContainer}>
        {levels.map((item) => {
          const Icon = item.icon;
          const isSelected = selected === item.level;
          return (
            <TouchableOpacity
              key={item.level}
              onPress={() => setSelected(item.level)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isSelected ? item.colors : [theme.colors.surface, theme.colors.surface]}
                style={[
                  styles.levelCard,
                  { borderColor: isSelected ? 'transparent' : theme.colors.border },
                ]}
              >
                <View style={[styles.levelIcon, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : item.colors[0] + '20' }]}>
                  <Icon size={28} color={isSelected ? '#FFFFFF' : item.colors[0]} strokeWidth={2} />
                </View>
                <View style={styles.levelInfo}>
                  <Text style={[styles.levelLabel, { color: isSelected ? '#FFFFFF' : theme.colors.text }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.levelDesc, { color: isSelected ? 'rgba(255,255,255,0.85)' : theme.colors.textSecondary }]}>
                    {item.description}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={() => router.push('/placement-test')} activeOpacity={0.7} style={styles.placementLink}>
        <Text style={[styles.placementText, { color: theme.colors.primary }]}>
          Not sure? Take the placement test
        </Text>
      </TouchableOpacity>

      <View style={styles.bottom}>
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!selected}
          fullWidth
          size="lg"
          icon={selected ? <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} /> : undefined}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * 1.2,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  levelsContainer: {
    gap: spacing.md,
    flex: 1,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 2,
    gap: spacing.md,
  },
  levelIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfo: {
    flex: 1,
    gap: 4,
  },
  levelLabel: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  levelDesc: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottom: {
    paddingTop: spacing.lg,
  },
  placementLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  placementText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
