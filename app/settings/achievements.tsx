import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy, Lock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

export default function AchievementsScreen() {
  const { theme } = useTheme();
  const { achievements } = useApp();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerTitleRow}>
          <Trophy size={22} color={theme.colors.accent} strokeWidth={2} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Achievements</Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          {unlockedCount} of {achievements.length} unlocked
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            style={[
              styles.achievementCard,
              ...(achievement.unlocked ? [] : [{ opacity: 0.6 }]),
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: achievement.unlocked
                    ? theme.colors.accentSoft
                    : theme.colors.surfaceAlt,
                },
              ]}
            >
              {achievement.unlocked ? (
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              ) : (
                <Lock size={24} color={theme.colors.textTertiary} strokeWidth={2} />
              )}
            </View>
            <View style={styles.achievementInfo}>
              <Text
                style={[
                  styles.achievementTitle,
                  { color: achievement.unlocked ? theme.colors.text : theme.colors.textSecondary },
                ]}
              >
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDesc, { color: theme.colors.textSecondary }]}>
                {achievement.description}
              </Text>
              {achievement.unlocked && achievement.unlockedAt && (
                <Text style={[styles.unlockedDate, { color: theme.colors.accent }]}>
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </Text>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementInfo: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  achievementDesc: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  unlockedDate: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
