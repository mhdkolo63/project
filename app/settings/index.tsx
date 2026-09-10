import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Moon, Bell, Globe, Shield, LogOut, Info, HelpCircle, ChevronRight } from 'lucide-react-native';
import { useTheme, ThemeMode } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

type ItemType = 'theme' | 'toggle' | 'link';

interface SettingItem {
  icon: typeof Moon;
  label: string;
  type: ItemType;
  value?: string;
  route?: string;
}

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const { logout } = useApp();

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Appearance',
      items: [
        { icon: Moon, label: 'Dark Mode', type: 'theme' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', type: 'link', route: '/settings/notifications' },
        { icon: Globe, label: 'App Language', type: 'link', value: 'English' },
        { icon: Shield, label: 'Privacy', type: 'link', route: '/settings/privacy' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: Info, label: 'About App', type: 'link', route: '/settings/about' },
        { icon: HelpCircle, label: 'Help & Support', type: 'link', route: '/settings/help' },
      ],
    },
  ];

  const handleItemPress = (item: SettingItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              {section.title}
            </Text>
            <Card>
              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isLink = item.type === 'link';
                return (
                  <TouchableOpacity
                    key={item.label}
                    onPress={() => handleItemPress(item)}
                    disabled={!isLink}
                    activeOpacity={0.7}
                    style={[
                      styles.settingItem,
                      index < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                    ]}
                  >
                    <View style={[styles.settingIcon, { backgroundColor: theme.colors.surfaceAlt }]}>
                      <Icon size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                    </View>
                    <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                      {item.label}
                    </Text>
                    {item.type === 'theme' && (
                      <View style={styles.themeSelector}>
                        {themeOptions.map((opt) => (
                          <TouchableOpacity
                            key={opt.value}
                            onPress={() => setMode(opt.value)}
                            style={[
                              styles.themeOption,
                              mode === opt.value
                                ? { backgroundColor: theme.colors.primary }
                                : { backgroundColor: theme.colors.surfaceAlt },
                            ]}
                          >
                            <Text
                              style={[
                                styles.themeOptionText,
                                { color: mode === opt.value ? '#FFFFFF' : theme.colors.textSecondary },
                              ]}
                            >
                              {opt.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {item.type === 'link' && (
                      <View style={styles.linkRow}>
                        {item.value && (
                          <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
                            {item.value}
                          </Text>
                        )}
                        <ChevronRight size={18} color={theme.colors.textTertiary} strokeWidth={2} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Card>
          </View>
        ))}

        <View style={styles.section}>
          <Card>
            <TouchableOpacity
              onPress={() => {
                logout();
                router.replace('/splash');
              }}
              activeOpacity={0.8}
              style={styles.logoutItem}
            >
              <View style={[styles.settingIcon, { backgroundColor: theme.colors.errorSoft }]}>
                <LogOut size={20} color={theme.colors.error} strokeWidth={2} />
              </View>
              <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <Text style={[styles.version, { color: theme.colors.textTertiary }]}>
          EnglishMaster AI v1.0.0
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
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  settingValue: {
    fontSize: fontSize.sm,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: radius.sm,
    padding: 2,
  },
  themeOption: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  themeOptionText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  version: {
    fontSize: fontSize.xs,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
