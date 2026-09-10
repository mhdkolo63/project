import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Shield, FileText, Database, Brain, UserCog, Lock, Users, Mail } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

interface PrivacySection {
  icon: typeof Shield;
  title: string;
  body: string;
}

const sections: PrivacySection[] = [
  {
    icon: FileText,
    title: 'Privacy Policy',
    body: 'EnglishMaster AI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our English learning application. By using EnglishMaster AI, you agree to the practices described in this policy.',
  },
  {
    icon: Database,
    title: 'Information We Collect',
    body: 'We collect information you provide directly, such as your name, email address, and preferred English learning level. We also collect usage data including lessons completed, quiz scores, study streaks, XP points, and chat interactions with the AI Tutor. Device information such as app version and preferred language may also be collected to improve your experience.',
  },
  {
    icon: Brain,
    title: 'How User Data Is Used',
    body: 'Your data is used to personalize your learning journey, track your progress, recommend lessons at the right difficulty level, and provide AI-powered grammar corrections. Usage analytics help us identify popular lessons and improve course content. We do not sell your personal data to third parties under any circumstances.',
  },
  {
    icon: Database,
    title: 'Data Storage',
    body: 'Your data is stored securely on encrypted servers. Account information and learning progress are persisted in a secure database. AI Tutor conversations are stored temporarily to provide contextual responses and may be retained for quality improvement. You can request deletion of your data at any time.',
  },
  {
    icon: Brain,
    title: 'AI Conversations and User Privacy',
    body: 'When you chat with the AI English Tutor, your messages are processed to generate grammar corrections and learning suggestions. These conversations are not shared with other users. We use language models to analyze your input and provide educational feedback. Sensitive personal information should never be shared in chat messages.',
  },
  {
    icon: UserCog,
    title: 'Account Information',
    body: 'You can view and edit your account information at any time from the Edit Profile screen. Your email address is used for account authentication and important notifications. You may change your display name, English level, and daily learning goal without affecting your progress data.',
  },
  {
    icon: Lock,
    title: 'Security',
    body: 'We employ industry-standard security measures including encrypted data transmission (TLS/SSL), hashed passwords, and secure authentication tokens. Access to your personal data is restricted to authorized systems only. We regularly review our security practices to protect against unauthorized access.',
  },
  {
    icon: Users,
    title: 'User Rights',
    body: 'You have the right to access your personal data, correct inaccurate information, request data export, and delete your account and all associated data. To exercise any of these rights, contact us using the information below. We will respond to your request within 30 days.',
  },
  {
    icon: Mail,
    title: 'Contact Information',
    body: 'If you have questions about this Privacy Policy or how your data is handled, please contact our support team. You can reach us through the Help & Support section in the app, or by sending feedback directly from the Help & Support screen. We are committed to addressing your privacy concerns promptly.',
  },
];

export default function PrivacyScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <View style={[styles.introIcon, { backgroundColor: theme.colors.primarySoft }]}>
            <Shield size={32} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={[styles.introTitle, { color: theme.colors.text }]}>Your Privacy Matters</Text>
          <Text style={[styles.introSubtitle, { color: theme.colors.textSecondary }]}>
            Last updated: September 2026
          </Text>
        </View>

        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primarySoft }]}>
                  <Icon size={18} color={theme.colors.primary} strokeWidth={2} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {section.title}
                </Text>
              </View>
              <Text style={[styles.sectionBody, { color: theme.colors.textSecondary }]}>
                {section.body}
              </Text>
            </Card>
          );
        })}
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
  intro: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  introSubtitle: {
    fontSize: fontSize.sm,
  },
  sectionCard: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  sectionBody: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
});
