import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Edit, Star, Flame, BookOpen, ChevronRight, Bell, Shield, LogOut, Mail, Calendar } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { LevelBadge } from '@/components/LevelBadge';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useApp();

  const menuItems = [
    { icon: Bell, label: 'Notifications', action: () => router.push('/settings/notifications') },
    { icon: Shield, label: 'Privacy', action: () => router.push('/settings/privacy') },
    { icon: LogOut, label: 'Logout', action: () => { logout(); router.replace('/splash'); }, danger: true },
  ];

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name || 'G').charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.profileName}>{user?.name || 'Guest'}</Text>
          {user?.email ? (
            <Text style={styles.profileEmail}>{user.email}</Text>
          ) : (
            <Text style={styles.profileEmail}>Guest Mode</Text>
          )}
          {user && <LevelBadge level={user.englishLevel} size="md" />}
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <Star size={20} color={theme.colors.accent} strokeWidth={2} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{user?.xp || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>XP Points</Text>
          </View>
          <View style={[styles.statBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <BookOpen size={20} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{user?.lessonsCompleted || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Lessons</Text>
          </View>
          <View style={[styles.statBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <Flame size={20} color={theme.colors.warning} strokeWidth={2} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{user?.streak || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Day Streak</Text>
          </View>
        </View>

        <Card style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Edit size={18} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
          </View>
          <View style={styles.infoList}>
            <View style={[styles.infoItem, { borderBottomColor: theme.colors.border }]}>
              <Mail size={18} color={theme.colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]} numberOfLines={1}>
                {user?.email || 'Not set'}
              </Text>
            </View>
            <View style={[styles.infoItem, { borderBottomColor: theme.colors.border }]}>
              <Calendar size={18} color={theme.colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Joined</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {user ? new Date(user.createdAt).toLocaleDateString() : '-'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings/edit-profile')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.editButton}
            >
              <Edit size={16} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Card>

        <Card style={styles.section}>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}
            style={styles.menuItemRow}
          >
            <View style={[styles.menuIcon, { backgroundColor: theme.colors.primarySoft }]}>
              <Settings size={20} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <Text style={[styles.menuLabel, { color: theme.colors.text }]}>Settings</Text>
            <ChevronRight size={20} color={theme.colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.section}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.label}
                onPress={item.action}
                activeOpacity={0.8}
                style={[
                  styles.menuItemRow,
                  index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                ]}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.danger ? theme.colors.errorSoft : theme.colors.surfaceAlt }]}>
                  <Icon size={20} color={item.danger ? theme.colors.error : theme.colors.textSecondary} strokeWidth={2} />
                </View>
                <Text style={[styles.menuLabel, { color: item.danger ? theme.colors.error : theme.colors.text }]}>
                  {item.label}
                </Text>
                {!item.danger && <ChevronRight size={20} color={theme.colors.textTertiary} strokeWidth={2} />}
              </TouchableOpacity>
            );
          })}
        </Card>

        <Text style={[styles.version, { color: theme.colors.textTertiary }]}>
          EnglishMaster AI v1.0.0
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    gap: spacing.xs + 2,
  },
  avatarContainer: {
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: fontSize.xs,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  infoList: {
    gap: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    maxWidth: 160,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.md,
    marginTop: spacing.md,
    minHeight: 48,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  version: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
