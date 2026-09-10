import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Mail, AlertTriangle, MessageSquare, Send, CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I start learning?',
    answer: 'After creating an account or continuing as a guest, select your English level (Beginner, Intermediate, or Advanced). Then go to the Learn tab to see your learning path. Tap any lesson to start. Each lesson includes an explanation, examples, and practice exercises.',
  },
  {
    question: 'How does the AI Tutor work?',
    answer: 'The AI English Tutor is available in the AI Tutor tab. Type any sentence or question in English, and the tutor will check your grammar, explain mistakes, and suggest improvements. It can correct common errors like verb tenses, subject-verb agreement, and word choice.',
  },
  {
    question: 'How do I change my English level?',
    answer: 'Go to the Profile tab, tap the Settings gear icon, then tap Edit Profile. You can select Beginner, Intermediate, or Advanced from the English Level section. Changing your level will update the lessons shown in your learning path.',
  },
  {
    question: 'How is my progress calculated?',
    answer: 'Your progress is tracked based on lessons completed, quiz scores, XP points earned, and your daily learning streak. Each lesson you complete awards XP. Quiz scores contribute to your average score shown on the Progress tab. Your streak increases each day you complete at least one lesson.',
  },
  {
    question: 'How do I reset my progress?',
    answer: 'Currently, progress reset is handled by logging out and creating a new account. In a future update, a dedicated reset option will be added to Settings. If you need an immediate reset, contact support through this screen.',
  },
  {
    question: 'Is EnglishMaster AI free?',
    answer: 'EnglishMaster AI offers a free tier with access to beginner lessons, the AI Tutor, and basic progress tracking. Premium features including advanced lessons and unlimited AI tutoring may require a subscription in the future. The core learning experience remains free.',
  },
];

type ContactMode = 'support' | 'feedback' | 'problem' | null;

export default function HelpScreen() {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [contactMode, setContactMode] = useState<ContactMode>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const startContact = (mode: ContactMode) => {
    setContactMode(mode);
    setSent(false);
    setError(null);
    if (mode === 'feedback') {
      setSubject('Feedback: ');
    } else if (mode === 'problem') {
      setSubject('Bug Report: ');
    } else {
      setSubject('');
    }
    setMessage('');
  };

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in both the subject and message fields.');
      return;
    }
    setError(null);
    setSending(true);
    // Mock send — will be replaced with real backend/email API call
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setSubject('');
      setMessage('');
      setTimeout(() => {
        setContactMode(null);
        setSent(false);
      }, 2500);
    }, 1200);
  };

  const contactOptions = [
    { mode: 'support' as const, icon: Mail, label: 'Contact Support', desc: 'Get help with account or app issues' },
    { mode: 'problem' as const, icon: AlertTriangle, label: 'Report a Problem', desc: 'Tell us about a bug or technical issue' },
    { mode: 'feedback' as const, icon: MessageSquare, label: 'Send Feedback', desc: 'Share your ideas and suggestions' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Help & Support</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sectionHeading, { color: theme.colors.textSecondary }]}>FREQUENTLY ASKED QUESTIONS</Text>

          <Card style={styles.faqCard}>
            {faqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View
                  key={index}
                  style={[
                    styles.faqItem,
                    index < faqs.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => toggleFAQ(index)}
                    style={styles.faqHeader}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.faqQuestion, { color: theme.colors.text }]}>
                      {faq.question}
                    </Text>
                    {isExpanded ? (
                      <ChevronUp size={18} color={theme.colors.textTertiary} strokeWidth={2} />
                    ) : (
                      <ChevronDown size={18} color={theme.colors.textTertiary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                  {isExpanded && (
                    <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  )}
                </View>
              );
            })}
          </Card>

          <Text style={[styles.sectionHeading, { color: theme.colors.textSecondary }]}>GET IN TOUCH</Text>

          {contactMode === null ? (
            <View style={styles.contactOptions}>
              {contactOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <TouchableOpacity
                    key={option.mode}
                    onPress={() => startContact(option.mode)}
                    activeOpacity={0.7}
                  >
                    <Card style={styles.contactCard}>
                      <View style={[styles.contactIcon, { backgroundColor: theme.colors.primarySoft }]}>
                        <Icon size={22} color={theme.colors.primary} strokeWidth={2} />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { color: theme.colors.text }]}>
                          {option.label}
                        </Text>
                        <Text style={[styles.contactDesc, { color: theme.colors.textSecondary }]}>
                          {option.desc}
                        </Text>
                      </View>
                      <ChevronDown size={18} color={theme.colors.textTertiary} strokeWidth={2} />
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Card style={styles.formCard}>
              {sent ? (
                <View style={styles.sentContainer}>
                  <CheckCircle size={40} color={theme.colors.success} strokeWidth={2} />
                  <Text style={[styles.sentText, { color: theme.colors.success }]}>
                    Message sent successfully! We'll get back to you soon.
                  </Text>
                </View>
              ) : (
                <View style={styles.form}>
                  <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                    {contactMode === 'support' && 'Contact Support'}
                    {contactMode === 'problem' && 'Report a Problem'}
                    {contactMode === 'feedback' && 'Send Feedback'}
                  </Text>
                  {error && (
                    <Text style={[styles.formError, { color: theme.colors.error }]}>
                      {error}
                    </Text>
                  )}
                  <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Subject</Text>
                  <TextInput
                    style={[styles.textInput, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surfaceAlt }]}
                    placeholder="Enter subject..."
                    placeholderTextColor={theme.colors.textTertiary}
                    value={subject}
                    onChangeText={setSubject}
                  />
                  <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Message</Text>
                  <TextInput
                    style={[styles.messageInput, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surfaceAlt }]}
                    placeholder="Describe your issue or feedback..."
                    placeholderTextColor={theme.colors.textTertiary}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    textAlignVertical="top"
                  />
                  <View style={styles.formActions}>
                    <TouchableOpacity onPress={() => setContactMode(null)} style={styles.cancelBtn}>
                      <Text style={[styles.cancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Button
                      label="Send"
                      onPress={handleSend}
                      loading={sending}
                      icon={<Send size={16} color="#FFFFFF" strokeWidth={2} />}
                      size="sm"
                    />
                  </View>
                </View>
              )}
            </Card>
          )}

          <Text style={[styles.note, { color: theme.colors.textTertiary }]}>
            Messages are sent through a mock system for now. When a backend is connected, your message will be delivered to our support team.
          </Text>
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
  sectionHeading: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  faqCard: {
    gap: 0,
  },
  faqItem: {
    paddingVertical: spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  faqQuestion: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  faqAnswer: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
    marginTop: spacing.sm,
  },
  contactOptions: {
    gap: spacing.sm,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  contactDesc: {
    fontSize: fontSize.xs,
  },
  formCard: {
    gap: 0,
  },
  form: {
    gap: spacing.sm,
  },
  formTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  formError: {
    fontSize: fontSize.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,0,0,0.08)',
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    minHeight: 120,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cancelText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  sentContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  sentText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
  },
  note: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.5,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
