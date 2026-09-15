import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { BookOpen, ChevronLeft, Gauge, CheckCircle2, FolderOpen } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ReadingCard } from '@/components/ReadingCard';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel, ReadingCategory } from '@/types';
import { getReadingsByLevel, readingSpeedConfig, readingPracticals } from '@/data/readingPracticals';

const levelTabs: { level: EnglishLevel; label: string; emoji: string }[] = [
  { level: 'Beginner', label: 'Beginner', emoji: '🟢' },
  { level: 'Intermediate', label: 'Intermediate', emoji: '🟡' },
  { level: 'Advanced', label: 'Advanced', emoji: '🔴' },
];

const allCategories: ReadingCategory[] = [
  'Daily Life',
  'Education',
  'Travel',
  'Work & Business',
  'Technology',
  'Health',
  'Culture',
];

export default function ReadingPracticeScreen() {
  const { theme } = useTheme();
  const { user, isReadingCompleted } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(user?.englishLevel || 'Beginner');
  const [selectedCategory, setSelectedCategory] = useState<ReadingCategory | 'All'>('All');

  const levelPassages = useMemo(() => getReadingsByLevel(selectedLevel), [selectedLevel]);

  const availableCategories = useMemo(() => {
    const cats = new Set(levelPassages.map((p) => p.category));
    return allCategories.filter((c) => cats.has(c));
  }, [levelPassages]);

  const passages = useMemo(() => {
    if (selectedCategory === 'All') return levelPassages;
    return levelPassages.filter((p) => p.category === selectedCategory);
  }, [levelPassages, selectedCategory]);

  const defaultSpeed = readingSpeedConfig[selectedLevel];

  const completedCount = useMemo(
    () => levelPassages.filter((p) => isReadingCompleted(p.id)).length,
    [levelPassages, isReadingCompleted]
  );

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
          <Text style={[styles.title, { color: theme.colors.text }]}>Reading Practice</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Improve your reading speed, comprehension, and vocabulary with passages across different topics.
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
                onPress={() => {
                  setSelectedLevel(tab.level);
                  setSelectedCategory('All');
                }}
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

      <View
        style={[
          styles.progressSummary,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <View style={styles.progressItem}>
          <CheckCircle2 size={18} color={theme.colors.success} strokeWidth={2} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            <Text style={{ fontWeight: fontWeight.semibold, color: theme.colors.text }}>
              {completedCount}
            </Text>
            /{levelPassages.length} completed
          </Text>
        </View>
        <View style={styles.progressItem}>
          <Gauge size={18} color={theme.colors.primary} strokeWidth={2} />
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Speed: <Text style={{ fontWeight: fontWeight.semibold, color: theme.colors.text }}>{defaultSpeed.toFixed(2)}x</Text>
          </Text>
        </View>
      </View>

      <View style={styles.topicSection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
          Topic
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicChips}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.topicChip,
                selectedCategory === 'All'
                  ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                  : { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.topicChipText,
                  { color: selectedCategory === 'All' ? '#FFFFFF' : theme.colors.textSecondary },
                ]}
              >
                All Topics
              </Text>
            </View>
          </TouchableOpacity>
          {availableCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.topicChip,
                    isActive
                      ? { backgroundColor: theme.colors.secondary, borderColor: theme.colors.secondary }
                      : { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.topicChipText,
                      { color: isActive ? '#FFFFFF' : theme.colors.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
        Choose a Passage ({passages.length})
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.passageList}>
        {passages.length > 0 ? (
          passages.map((passage) => (
            <ReadingCard
              key={passage.id}
              passage={passage}
              completed={isReadingCompleted(passage.id)}
              onPress={() => handleStart(passage.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <FolderOpen size={48} color={theme.colors.textTertiary} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No passages found
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.colors.textSecondary }]}>
              Try selecting a different topic or level.
            </Text>
          </View>
        )}
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
  progressSummary: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressText: {
    fontSize: fontSize.sm,
  },
  topicSection: {
    marginBottom: spacing.lg,
  },
  topicChips: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  topicChip: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  topicChipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  passageList: {
    paddingBottom: spacing.xxl + 40,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
