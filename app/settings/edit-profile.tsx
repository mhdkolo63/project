import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, User, Mail, Target } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { EnglishLevel } from '@/types';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [level, setLevel] = useState<EnglishLevel>(user?.englishLevel || 'Beginner');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal?.toString() || '3');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({
      name,
      email,
      englishLevel: level,
      dailyGoal: parseInt(dailyGoal, 10) || 3,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.back();
    }, 1000);
  };

  const levels: EnglishLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {(name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.avatarHint, { color: theme.colors.textSecondary }]}>
              Profile photo coming soon
            </Text>
          </View>

          <Card style={styles.formSection}>
            <Input
              label="Full Name"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              icon={<User size={20} color={theme.colors.textTertiary} strokeWidth={2} />}
            />
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail size={20} color={theme.colors.textTertiary} strokeWidth={2} />}
            />
            <Input
              label="Daily Learning Goal (lessons)"
              placeholder="3"
              value={dailyGoal}
              onChangeText={setDailyGoal}
              keyboardType="numeric"
              icon={<Target size={20} color={theme.colors.textTertiary} strokeWidth={2} />}
            />
          </Card>

          <Card style={styles.formSection}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
              English Level
            </Text>
            <View style={styles.levelOptions}>
              {levels.map((lvl) => {
                const isSelected = level === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setLevel(lvl)}
                    activeOpacity={0.8}
                    style={[
                      styles.levelOption,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceAlt,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelOptionText,
                        { color: isSelected ? '#FFFFFF' : theme.colors.textSecondary },
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {saved && (
            <View style={[styles.savedBanner, { backgroundColor: theme.colors.successSoft }]}>
              <Text style={[styles.savedText, { color: theme.colors.success }]}>
                ✓ Profile saved successfully!
              </Text>
            </View>
          )}

          <Button label="Save Changes" onPress={handleSave} fullWidth size="lg" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
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
  avatarSection: {
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarHint: {
    fontSize: fontSize.xs,
  },
  formSection: {
    gap: 0,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
  },
  levelOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelOption: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  levelOptionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  savedBanner: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  savedText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
