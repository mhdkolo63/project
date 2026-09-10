import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Mic, ChevronLeft, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SpeakingCard } from '@/components/SpeakingCard';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel } from '@/types';
import { getSpeakingPracticesByLevel } from '@/data/speakingPracticals';

const levelTabs: { level: EnglishLevel; label: string; emoji: string }[] = [
  { level: 'Beginner', label: 'Beginner', emoji: '🟢' },
  { level: 'Intermediate', label: 'Intermediate', emoji: '🟡' },
  { level: 'Advanced', label: 'Advanced', emoji: '🔴' },
];

export default function SpeakingPracticeScreen() {
  const { theme } = useTheme();
  const { user, isSpeakingCompleted, getSpeakingWeaknesses, speakingCompletions } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel>(user?.englishLevel || 'Beginner');

  const practices = useMemo(() => getSpeakingPracticesByLevel(selectedLevel), [selectedLevel]);
  const weaknesses = useMemo(() => getSpeakingWeaknesses(), [getSpeakingWeaknesses]);
  const recentHistory = useMemo(() => {
    return [...speakingCompletions]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5);
  }, [speakingCompletions]);

  const handleStart = (practiceId: string) => {
    router.push(`/speaking/${practiceId}`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
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
            <Mic size={24} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>Speaking Practice</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Speak English, get feedback, and improve with every practice.
          </Text>
        </View>
      </View>

      <View style={styles.levelSection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
          Your Speaking Level
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

      {weaknesses.length >= 2 && (
        <View style={[styles.weaknessBox, { backgroundColor: theme.colors.accentSoft }]}>
          <TrendingUp size={18} color={theme.colors.accent} strokeWidth={2} />
          <View style={styles.weaknessContent}>
            <Text style={[styles.weaknessTitle, { color: theme.colors.accent }]}>Speaking Analysis</Text>
            <Text style={[styles.weaknessText, { color: theme.colors.textSecondary }]}>
              Your main area to improve: 🎯 {weaknesses[0].area} ({weaknesses[0].averageScore}%)
            </Text>
          </View>
        </View>
      )}

      {recentHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
            🎤 Speaking History
          </Text>
          {recentHistory.map((h, i) => (
            <View key={i} style={[styles.historyItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.historyLeft}>
                <Text style={[styles.historyDate, { color: theme.colors.textTertiary }]}>
                  {formatDate(h.completedAt)}
                </Text>
                <Text style={[styles.historyScore, { color: theme.colors.text }]}>
                  Score: {h.overallScore}%
                </Text>
              </View>
              <Text style={[styles.historyMode, { color: theme.colors.textSecondary }]}>
                {h.mode === 'conversation' ? '💬 Conversation' : '🎤 Single'}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
        Choose a Practice ({practices.length})
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.practiceList}>
        {practices.map((practice) => (
          <SpeakingCard
            key={practice.id}
            practice={practice}
            completed={isSpeakingCompleted(practice.id)}
            onPress={() => handleStart(practice.id)}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg },
  backBtn: { marginBottom: spacing.sm },
  headerContent: { gap: spacing.sm },
  iconBox: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: fontSize.xxxl, fontWeight: fontWeight.bold },
  subtitle: { fontSize: fontSize.md, lineHeight: fontSize.md * 1.5 },
  levelSection: { marginBottom: spacing.md },
  sectionLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, marginBottom: spacing.sm },
  tabs: { flexDirection: 'row', gap: spacing.sm },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: spacing.sm - 2, paddingHorizontal: spacing.md, borderRadius: radius.pill, borderWidth: 1 },
  tabEmoji: { fontSize: fontSize.sm },
  tabLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  weaknessBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.lg },
  weaknessContent: { flex: 1, gap: 2 },
  weaknessTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  weaknessText: { fontSize: fontSize.xs, lineHeight: fontSize.xs * 1.4 },
  historySection: { marginBottom: spacing.lg, gap: spacing.sm },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  historyLeft: { gap: 2 },
  historyDate: { fontSize: fontSize.xs, fontWeight: fontWeight.medium },
  historyScore: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  historyMode: { fontSize: fontSize.xs },
  practiceList: { paddingBottom: spacing.xxl + 40, gap: spacing.md },
});
