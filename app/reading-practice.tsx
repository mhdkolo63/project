import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { BookOpen, ChevronLeft, ChevronRight, Gauge } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ReadingCard } from '@/components/ReadingCard';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel } from '@/types';
import { getReadingsByLevel, readingSpeedConfig } from '@/data/readingPracticals';

const levelTabs: { level: EnglishLevel; label: string; emoji: string }[] = [
  { level: 'Beginner', label: 'Beginner', emoji: '🟢' },
  { level: 'Intermediate', label: 'Intermediate', emoji: '🟡' },
  { level: 'Advanced', label: 'Advanced', emoji: '🔴' },
];

export default function ReadingPracticeScreen() {
  const { theme } = useTheme();
  const { user, isReadingCompleted } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(user?.englishLevel || 'Beginner');

  const passages = useMemo(() => getReadingsByLevel(selectedLevel), [selectedLevel]);
  const defaultSpeed = readingSpeedConfig[selectedLevel];

  const handleStart = (passageId: string) => {
    router.push(`/reading/${passageId}`);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primarySoft }]}>
            <BookOpen size={24} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Reading Practical</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Improve your English reading speed, comprehension, vocabulary, and confidence.
          </Text>
        </View>
      </View>

      <View style={styles.levelSection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
          Your Reading Level
        </Text>
        <View style={styles.tabs}>
          {levelTabs.map((tab) => {
            const isActive = selectedLevel === tab.level;
            return (
              <TouchableOpacity
                key={tab.level}
                onPress={() => setSelectedLevel(tab.level)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Select ${tab.label} level`}
              >
                <View
                  style={[
                    styles.tab,
                    isActive
                      ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                      : { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
                  ]}
                >
                  <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isActive ? '#FFFFFF' : theme.colors.textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.speedInfo, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Gauge size={18} color={theme.colors.primary} strokeWidth={2} />
        <Text style={[styles.speedInfoText, { color: theme.colors.textSecondary }]}>
          Default speed for {selectedLevel}: <Text style={{ fontWeight: fontWeight.semibold, color: theme.colors.text }}>{defaultSpeed.toFixed(2)}x</Text>
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
        Choose a Passage ({passages.length})
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.passageList}>
        {passages.map((passage) => (
          <ReadingCard
            key={passage.id}
            passage={passage}
            completed={isReadingCompleted(passage.id)}
            onPress={() => handleStart(passage.id)}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  backBtn: {
    marginBottom: spacing.sm,
  },
  headerContent: {
    gap: spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  levelSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tabEmoji: {
    fontSize: fontSize.sm,
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  speedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  speedInfoText: {
    fontSize: fontSize.sm,
  },
  passageList: {
    paddingBottom: spacing.xxl + 40,
    gap: spacing.md,
  },
});
