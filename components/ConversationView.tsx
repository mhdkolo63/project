import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Volume2, User, Bot } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { SpeakingConversationTurn } from '@/types';

interface ConversationViewProps {
  turns: SpeakingConversationTurn[];
  onListen: (text: string) => void;
  speakingText: string | null;
}

export function ConversationView({ turns, onListen, speakingText }: ConversationViewProps) {
  const { theme } = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {turns.map((turn, i) => {
        const isAI = turn.role === 'ai';
        return (
          <View key={i} style={[styles.messageRow, isAI ? styles.aiRow : styles.userRow]}>
            <View style={[styles.avatar, { backgroundColor: isAI ? theme.colors.primarySoft : theme.colors.surfaceAlt }]}>
              {isAI ? (
                <Bot size={18} color={theme.colors.primary} strokeWidth={2} />
              ) : (
                <User size={18} color={theme.colors.textSecondary} strokeWidth={2} />
              )}
            </View>
            <View style={[styles.bubble, isAI ? { backgroundColor: theme.colors.primarySoft } : { backgroundColor: theme.colors.surfaceAlt }]}>
              <Text style={[styles.messageText, { color: theme.colors.text }]}>{turn.text}</Text>
              {isAI && (
                <TouchableOpacity onPress={() => onListen(turn.text)} style={styles.listenIcon}>
                  <Volume2 size={14} color={theme.colors.primary} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
      {speakingText && (
        <View style={styles.speakingIndicator}>
          <Text style={[styles.speakingText, { color: theme.colors.primary }]}>🔊 Speaking...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, maxHeight: 400 },
  content: { gap: spacing.sm, paddingBottom: spacing.md },
  messageRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-end' },
  aiRow: { alignSelf: 'flex-start' },
  userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '78%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg, gap: spacing.xs },
  messageText: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
  listenIcon: { alignSelf: 'flex-start' },
  speakingIndicator: { alignItems: 'center', paddingVertical: spacing.xs },
  speakingText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
});
