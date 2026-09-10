import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Info, Target, Sparkles, BookOpen, Brain, Trophy, BarChart3, Tag } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

interface FeatureItem {
  icon: typeof Info;
  title: string;
  body: string;
}

const features: FeatureItem[] = [
  {
    icon: Brain,
    title: 'AI English Tutor',
    body: 'Chat with an AI-powered English tutor that corrects your grammar in real time, explains mistakes, and suggests better sentence structures. Practice conversation anytime, anywhere.',
  },
  {
    icon: BookOpen,
    title: 'Learning from Beginner to Advanced',
    body: 'Structured lessons across three levels — Beginner, Intermediate, and Advanced. Each level builds on the previous one with progressively more complex grammar, vocabulary, and usage.',
  },
  {
    icon: Trophy,
    title: 'Quizzes and Practice',
    body: 'Every lesson includes interactive practice exercises and a quiz to test your understanding. Get instant feedback with detailed explanations for each answer.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    body: 'Monitor your learning journey with detailed progress statistics. Track your streaks, XP points, lessons completed, quiz scores, and weekly activity — all in one dashboard.',
  },
];

export default function AboutScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>About App</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.heroCard}
        >
          <View style={styles.heroIcon}>
            <Sparkles size={36} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.appName}>EnglishMaster AI</Text>
          <Text style={styles.tagline}>Learn. Practice. Speak. Master English.</Text>
        </LinearGradient>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primarySoft }]}>
              <Info size={18} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>What EnglishMaster AI Does</Text>
          </View>
          <Text style={[styles.sectionBody, { color: theme.colors.textSecondary }]}>
            EnglishMaster AI is a comprehensive English learning app designed to help learners at all levels improve their grammar, vocabulary, and conversational skills. Through AI-powered tutoring, structured lessons, interactive quizzes, and detailed progress tracking, the app guides you from your current level to fluency.
          </Text>
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: theme.colors.accent + '20' }]}>
              <Target size={18} color={theme.colors.accent} strokeWidth={2} />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Our Mission</Text>
          </View>
          <Text style={[styles.sectionBody, { color: theme.colors.textSecondary }]}>
            To make quality English education accessible to everyone, everywhere. We believe that learning English should be engaging, personalized, and effective. By combining AI technology with proven pedagogical methods, we help learners build confidence and achieve fluency at their own pace.
          </Text>
        </Card>

        <Text style={[styles.featuresHeading, { color: theme.colors.textSecondary }]}>MAIN FEATURES</Text>

        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primarySoft }]}>
                  <Icon size={18} color={theme.colors.primary} strokeWidth={2} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  {feature.title}
                </Text>
              </View>
              <Text style={[styles.sectionBody, { color: theme.colors.textSecondary }]}>
                {feature.body}
              </Text>
            </Card>
          );
        })}

        <Card style={styles.versionCard}>
          <View style={styles.versionRow}>
            <Tag size={18} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.versionLabel, { color: theme.colors.textSecondary }]}>App Version</Text>
            <Text style={[styles.versionValue, { color: theme.colors.text }]}>1.0.0</Text>
          </View>
        </Card>
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
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
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
  featuresHeading: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  versionCard: {
    marginTop: spacing.sm,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  versionLabel: {
    fontSize: fontSize.md,
    flex: 1,
  },
  versionValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
