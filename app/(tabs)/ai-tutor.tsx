import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Bot, User, AlertCircle, RefreshCw, Volume2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ChatMessage } from '@/types';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { aiService, ConversationMode } from '@/services/aiService';
import { ServiceUnavailableCard } from '@/components/ServiceUnavailableCard';
import { ttsService } from '@/services/ttsService';

const CONVERSATION_MODES: { id: ConversationMode; label: string; icon: string }[] = [
  { id: 'free', label: 'Free Chat', icon: '💬' },
  { id: 'grammar', label: 'Grammar Teacher', icon: '📚' },
  { id: 'business', label: 'Business English', icon: '💼' },
  { id: 'interview', label: 'Interview Practice', icon: '🎤' },
  { id: 'travel', label: 'Travel English', icon: '✈️' },
  { id: 'daily', label: 'Daily Conversation', icon: '🗣️' },
];

const MODE_PROMPTS: Record<ConversationMode, string> = {
  free: 'You are a friendly English tutor. Have a natural conversation and correct mistakes when needed.',
  grammar: 'You are a grammar teacher. Focus on correcting mistakes and explaining grammar rules clearly.',
  business: 'You are a business English coach. Practice professional workplace communication, emails, and meetings.',
  interview: 'You are a job interviewer. Ask interview questions one at a time and give feedback on the user\'s responses.',
  travel: 'You are a travel English partner. Simulate travel situations like airports, hotels, restaurants, and asking for directions.',
  daily: 'You are a daily conversation partner. Practice everyday English conversations about common topics.',
};

export default function AITutorScreen() {
  const { theme } = useTheme();
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hello ${user?.name || 'there'}! I'm your AI English tutor. I'm here to help you learn and practice English. You can chat with me, and I'll correct your grammar, explain mistakes, and suggest better sentences. What would you like to practice today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ConversationMode>('free');
  const aiAvailable = aiService.isAvailable();
  const scrollRef = useRef<ScrollView>(null);

  const userLevel = user?.englishLevel || 'Beginner';

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping, error]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    const conversationHistory = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await aiService.sendMessage({
        message: trimmed,
        userLevel,
        conversationHistory,
        mode: selectedMode,
      });

      const aiMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        text: response.reply,
        correction: response.correction,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      const errorMessage: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'ai',
        text: `I couldn't connect to the AI service. ${errorMsg}`,
        timestamp: new Date().toISOString(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(errorMsg);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, userLevel, selectedMode]);

  const handleRetry = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Remove the last error message
    setMessages((prev) => {
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].error) {
          updated.splice(i, 1);
          break;
        }
      }
      return updated;
    });

    setError(null);
    setIsTyping(true);

    const conversationHistory = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const response = await aiService.sendMessage({
        message: lastUserMsg.text,
        userLevel,
        conversationHistory,
        mode: selectedMode,
      });

      const aiMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        text: response.reply,
        correction: response.correction,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      const errorMessage: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'ai',
        text: `I couldn't connect to the AI service. ${errorMsg}`,
        timestamp: new Date().toISOString(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(errorMsg);
    } finally {
      setIsTyping(false);
    }
  }, [messages, userLevel, selectedMode]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={[styles.botAvatar, { backgroundColor: theme.colors.primarySoft }]}>
          <Bot size={24} color={theme.colors.primary} strokeWidth={2} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI English Tutor</Text>
          <Text style={[styles.headerStatus, { color: isTyping ? theme.colors.textSecondary : theme.colors.success }]}>
            {isTyping ? '● Thinking...' : '● Online'}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.modeBar}
        contentContainerStyle={styles.modeBarContent}
      >
        {CONVERSATION_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            onPress={() => setSelectedMode(mode.id)}
            style={[
              styles.modeChip,
              {
                backgroundColor: selectedMode === mode.id ? theme.colors.primary : theme.colors.surfaceAlt,
                borderColor: selectedMode === mode.id ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <Text style={styles.modeIcon}>{mode.icon}</Text>
            <Text
              style={[
                styles.modeLabel,
                { color: selectedMode === mode.id ? '#FFFFFF' : theme.colors.textSecondary },
              ]}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.role === 'user' ? styles.messageRowUser : styles.messageRowAI,
            ]}
          >
            {msg.role === 'ai' && (
              <View style={[styles.msgAvatar, { backgroundColor: msg.error ? theme.colors.errorSoft : theme.colors.primarySoft }]}>
                {msg.error ? (
                  <AlertCircle size={16} color={theme.colors.error} strokeWidth={2} />
                ) : (
                  <Bot size={16} color={theme.colors.primary} strokeWidth={2} />
                )}
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                msg.role === 'user'
                  ? { backgroundColor: theme.colors.primary }
                  : msg.error
                    ? { backgroundColor: theme.colors.errorSoft, borderColor: theme.colors.error }
                    : { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: msg.role === 'user' ? '#FFFFFF' : msg.error ? theme.colors.error : theme.colors.text },
                ]}
              >
                {msg.text}
              </Text>
              {msg.role === 'ai' && !msg.error && (
                <TouchableOpacity
                  onPress={() => ttsService.speak(msg.text, { language: 'en-US', rate: 0.9 })}
                  style={styles.speakButton}
                >
                  <Volume2 size={14} color={theme.colors.textTertiary} strokeWidth={2} />
                </TouchableOpacity>
              )}
              {msg.error && (
                <TouchableOpacity
                  onPress={handleRetry}
                  activeOpacity={0.8}
                  style={[styles.retryButton, { borderColor: theme.colors.error }]}
                >
                  <RefreshCw size={14} color={theme.colors.error} strokeWidth={2} />
                  <Text style={[styles.retryText, { color: theme.colors.error }]}>Retry</Text>
                </TouchableOpacity>
              )}
              {msg.correction && (
                <View style={[styles.correctionBox, { backgroundColor: theme.colors.errorSoft }]}>
                  <Text style={[styles.correctionLabel, { color: theme.colors.error }]}>
                    ❌ {msg.correction.original}
                  </Text>
                  <Text style={[styles.correctionLabel, { color: theme.colors.success }]}>
                    ✅ {msg.correction.corrected}
                  </Text>
                  <Text style={[styles.correctionExplanation, { color: theme.colors.textSecondary }]}>
                    📚 {msg.correction.explanation}
                  </Text>
                  {msg.correction.naturalAlternative && (
                    <Text style={[styles.correctionExplanation, { color: theme.colors.primary }]}>
                      💬 {msg.correction.naturalAlternative}
                    </Text>
                  )}
                </View>
              )}
            </View>
            {msg.role === 'user' && (
              <View style={[styles.msgAvatar, { backgroundColor: theme.colors.surfaceAlt }]}>
                <User size={16} color={theme.colors.textSecondary} strokeWidth={2} />
              </View>
            )}
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowAI]}>
            <View style={[styles.msgAvatar, { backgroundColor: theme.colors.primarySoft }]}>
              <Bot size={16} color={theme.colors.primary} strokeWidth={2} />
            </View>
            <View style={[styles.messageBubble, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surfaceAlt }]}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textTertiary}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!isTyping}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isTyping}
            activeOpacity={0.8}
            style={[styles.sendButton, { backgroundColor: input.trim() && !isTyping ? theme.colors.primary : theme.colors.border }]}
          >
            <Send size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    gap: 2,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  headerStatus: {
    fontSize: fontSize.xs,
  },
  modeBar: {
    maxHeight: 48,
  },
  modeBarContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  modeIcon: {
    fontSize: 14,
  },
  modeLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  speakButton: {
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    maxWidth: '100%',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  correctionBox: {
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    gap: 4,
  },
  correctionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * 1.4,
  },
  correctionExplanation: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
