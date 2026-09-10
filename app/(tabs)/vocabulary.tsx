import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Bookmark, BookmarkCheck, Volume2, BookOpen, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { vocabularyData, getVocabByLevel } from '@/data/vocabulary';
import { SavedVocabWord } from '@/types';
import { ttsService } from '@/services/ttsService';

export default function VocabularyScreen() {
  const { theme } = useTheme();
  const { user, vocabulary, saveVocabWord, removeVocabWord, toggleVocabLearned } = useApp();
  const [filter, setFilter] = useState<'all' | 'saved'>('all');

  const level = user?.englishLevel || 'Beginner';
  const words = filter === 'saved' ? vocabulary : getVocabByLevel(level);
  const savedIds = new Set(vocabulary.map((w) => w.id));

  const isSaved = (wordId: string) => savedIds.has(wordId);

  const handleSave = (word: typeof vocabularyData[0]) => {
    if (isSaved(word.id)) {
      removeVocabWord(word.id);
    } else {
      const saved: SavedVocabWord = { ...word, savedAt: new Date().toISOString(), learned: false };
      saveVocabWord(saved);
    }
  };

  const handleSpeak = (text: string) => {
    ttsService.speak(text, { language: 'en-US', rate: 0.9 });
  };

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerTitleRow}>
          <BookOpen size={22} color={theme.colors.primary} strokeWidth={2} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Vocabulary</Text>
        </View>
        <View style={[styles.filterRow, { backgroundColor: theme.colors.surfaceAlt }]}>
          <TouchableOpacity
            onPress={() => setFilter('all')}
            style={[styles.filterButton, filter === 'all' && { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.filterText, { color: filter === 'all' ? '#FFFFFF' : theme.colors.textSecondary }]}>
              {level}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('saved')}
            style={[styles.filterButton, filter === 'saved' && { backgroundColor: theme.colors.primary }]}
          >
            <Text style={[styles.filterText, { color: filter === 'saved' ? '#FFFFFF' : theme.colors.textSecondary }]}>
              My Vocabulary ({vocabulary.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {words.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {filter === 'saved'
                ? 'You haven\'t saved any words yet. Tap the bookmark icon to save words for review.'
                : 'No vocabulary available for this level.'}
            </Text>
          </View>
        ) : (
          words.map((word) => {
            const saved = isSaved(word.id);
            const isLearned = filter === 'saved' && 'learned' in word && word.learned;
            return (
              <Card key={word.id} style={styles.wordCard}>
                <View style={styles.wordHeader}>
                  <View style={styles.wordInfo}>
                    <View style={styles.wordRow}>
                      <Text style={[styles.word, { color: theme.colors.text }]}>
                        {word.word}
                      </Text>
                      <TouchableOpacity onPress={() => handleSpeak(word.word)} style={styles.speakButton}>
                        <Volume2 size={18} color={theme.colors.primary} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.partOfSpeech, { color: theme.colors.accent }]}>
                      {word.partOfSpeech}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleSave(word)} style={styles.saveButton}>
                    {saved ? (
                      <BookmarkCheck size={22} color={theme.colors.primary} strokeWidth={2} />
                    ) : (
                      <Bookmark size={22} color={theme.colors.textTertiary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={[styles.meaning, { color: theme.colors.textSecondary }]}>
                  {word.meaning}
                </Text>
                <View style={[styles.exampleBox, { backgroundColor: theme.colors.surfaceAlt }]}>
                  <Text style={[styles.exampleText, { color: theme.colors.text }]}>
                    {word.example}
                  </Text>
                  <TouchableOpacity onPress={() => handleSpeak(word.example)} style={styles.speakButton}>
                    <Volume2 size={16} color={theme.colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                {filter === 'saved' && (
                  <TouchableOpacity
                    onPress={() => toggleVocabLearned(word.id)}
                    style={[styles.learnedButton, { borderColor: isLearned ? theme.colors.success : theme.colors.border }]}
                  >
                    <CheckCircle2 size={16} color={isLearned ? theme.colors.success : theme.colors.textTertiary} strokeWidth={2} />
                    <Text style={[styles.learnedText, { color: isLearned ? theme.colors.success : theme.colors.textSecondary }]}>
                      {isLearned ? 'Learned' : 'Mark as Learned'}
                    </Text>
                  </TouchableOpacity>
                )}
              </Card>
            );
          })
        )}
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
  filterRow: {
    flexDirection: 'row',
    gap: 4,
    borderRadius: radius.md,
    padding: 3,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  wordCard: {
    gap: spacing.sm,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wordInfo: {
    flex: 1,
    gap: 2,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  word: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  speakButton: {
    padding: spacing.xs,
  },
  partOfSpeech: {
    fontSize: fontSize.xs,
    fontStyle: 'italic',
  },
  saveButton: {
    padding: spacing.xs,
  },
  meaning: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  flex: 1,
  flexWrap: 'wrap',
  maxWidth: '100%',
  },
  exampleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  exampleText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
    fontStyle: 'italic',
  },
  learnedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  learnedText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: fontSize.md * 1.5,
  },
});
