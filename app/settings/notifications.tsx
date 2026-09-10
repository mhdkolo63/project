import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Calendar, Trophy, Flame, BookPlus, Megaphone } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

interface NotificationToggle {
  key: string;
  icon: typeof Bell;
  label: string;
  description: string;
}

const toggles: NotificationToggle[] = [
  {
    key: 'dailyReminder',
    icon: Calendar,
    label: 'Daily Learning Reminder',
    description: 'Get a reminder to practice English every day',
  },
  {
    key: 'quizReminder',
    icon: Trophy,
    label: 'Quiz Reminder',
    description: 'Notifications when new quizzes are available',
  },
  {
    key: 'streakReminder',
    icon: Flame,
    label: 'Learning Streak Reminder',
    description: 'Stay on track with streak protection alerts',
  },
  {
    key: 'newLessons',
    icon: BookPlus,
    label: 'New Lessons',
    description: 'Be the first to know when new lessons are added',
  },
  {
    key: 'general',
    icon: Megaphone,
    label: 'General Notifications',
    description: 'Announcements and app updates',
  },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { notificationPrefs, setNotificationPref } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Notifications</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.introRow}>
          <View style={[styles.introIcon, { backgroundColor: theme.colors.primarySoft }]}>
            <Bell size={28} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.introText}>
            <Text style={[styles.introTitle, { color: theme.colors.text }]}>Notification Preferences</Text>
            <Text style={[styles.introSubtitle, { color: theme.colors.textSecondary }]}>
              Choose which notifications you want to receive. Your preferences are saved on this device.
            </Text>
          </View>
        </View>

        <Card style={styles.togglesCard}>
          {toggles.map((toggle, index) => {
            const Icon = toggle.icon;
            const isEnabled = notificationPrefs[toggle.key] ?? false;
            return (
              <View
                key={toggle.key}
                style={[
                  styles.toggleItem,
                  index < toggles.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                ]}
              >
                <View style={[styles.toggleIcon, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <Icon size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                </View>
                <View style={styles.toggleInfo}>
                  <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
                    {toggle.label}
                  </Text>
                  <Text style={[styles.toggleDesc, { color: theme.colors.textSecondary }]}>
                    {toggle.description}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setNotificationPref(toggle.key, !isEnabled)}
                  activeOpacity={0.8}
                  style={[
                    styles.switch,
                    { backgroundColor: isEnabled ? theme.colors.primary : theme.colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.switchKnob,
                      isEnabled ? styles.switchKnobOn : styles.switchKnobOff,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </Card>

        <Text style={[styles.note, { color: theme.colors.textTertiary }]}>
          Push notifications will be available in a future update. Your preferences are saved locally and will apply when push notifications are enabled.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  introIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    flex: 1,
    gap: 4,
  },
  introTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  introSubtitle: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.4,
  },
  togglesCard: {
    gap: 0,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleInfo: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  toggleDesc: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  switchKnobOn: {
    alignSelf: 'flex-end',
  },
  switchKnobOff: {
    alignSelf: 'flex-start',
  },
  note: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.5,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
