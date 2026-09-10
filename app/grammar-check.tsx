import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, BookOpen, CheckCircle2, XCircle, Sparkles, AlertCircle, RefreshCw, Lightbulb } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { GrammarCheckResult } from '@/types';
import { aiService } from '@/services/aiService';

const sampleSentences = [
  'I goed to school yesterday.',
  "She don't like food.",
  'I have went there.',
  'He are my friend.',
];

export default function GrammarCheckScreen() {
  const { theme } = useTheme();
  const { user } = useApp();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userLevel = user?.englishLevel || 'Beginner';

  const handleCheck = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await aiService.checkGrammar({
        text: trimmed,
        userLevel,
      });
      setResult(response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [input, loading, userLevel]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleCheck();
  }, [handleCheck]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerTitleRow}>
            <BookOpen size={20} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Check My English</Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Type a sentence to check your grammar
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.inputSection}>
            <TextInput
              style={[styles.textInput, { color: theme.colors.text, backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
              placeholder="Type your sentence here..."
              placeholderTextColor={theme.colors.textTertiary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={300}
              editable={!loading}
            />
            <Button
              label="Check Grammar"
              onPress={handleCheck}
              loading={loading}
              disabled={!input.trim() || loading}
              fullWidth
              icon={<Sparkles size={18} color="#FFFFFF" strokeWidth={2} />}
            />
          </Card>

          <View style={styles.samplesRow}>
            <Text style={[styles.samplesLabel, { color: theme.colors.textSecondary }]}>
              Try these examples:
            </Text>
            <View style={styles.samples}>
              {sampleSentences.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setInput(s)}
                  style={[styles.sampleChip, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  <Text style={[styles.sampleText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error && (
            <Card style={[styles.errorCard, { borderColor: theme.colors.error, backgroundColor: theme.colors.errorSoft }]}>
              <View style={styles.errorHeader}>
                <AlertCircle size={22} color={theme.colors.error} strokeWidth={2} />
                <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
                  AI Service Error
                </Text>
              </View>
              <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
                {error}
              </Text>
              <TouchableOpacity
                onPress={handleRetry}
                activeOpacity={0.8}
                style={[styles.retryButton, { borderColor: theme.colors.error }]}
              >
                <RefreshCw size={14} color={theme.colors.error} strokeWidth={2} />
                <Text style={[styles.retryText, { color: theme.colors.error }]}>Try Again</Text>
              </TouchableOpacity>
            </Card>
          )}

          {result && !error && (
            <View style={styles.resultSection}>
              {/* Original Sentence */}
              <Card style={styles.resultCard}>
                <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
                  📝 Original Sentence
                </Text>
                <Text style={[styles.resultText, { color: theme.colors.text }]}>
                  {result.original}
                </Text>
              </Card>

              {result.isCorrect ? (
                <Card style={[styles.resultCard, { borderColor: theme.colors.success, borderWidth: 2 }]}>
                  <View style={styles.resultHeader}>
                    <CheckCircle2 size={24} color={theme.colors.success} strokeWidth={2} />
                    <Text style={[styles.resultTitle, { color: theme.colors.success }]}>
                      Correct!
                    </Text>
                  </View>
                  <Text style={[styles.resultText, { color: theme.colors.text }]}>
                    {result.corrected}
                  </Text>
                  {result.explanation ? (
                    <View style={[styles.explanationBox, { backgroundColor: theme.colors.successSoft }]}>
                      <Text style={[styles.explanationText, { color: theme.colors.success }]}>
                        {result.explanation}
                      </Text>
                    </View>
                  ) : null}
                  {result.suggestion ? (
                    <View style={[styles.suggestionBox, { backgroundColor: theme.colors.primarySoft }]}>
                      <View style={styles.suggestionHeader}>
                        <Lightbulb size={16} color={theme.colors.primary} strokeWidth={2} />
                        <Text style={[styles.suggestionLabel, { color: theme.colors.primary }]}>
                          Better Alternative
                        </Text>
                      </View>
                      <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                        {result.suggestion}
                      </Text>
                    </View>
                  ) : null}
                </Card>
              ) : (
                <>
                  {/* Mistakes Found */}
                  {result.mistakes.length > 0 && (
                    <Card style={[styles.resultCard, { borderColor: theme.colors.error, borderWidth: 2 }]}>
                      <View style={styles.resultHeader}>
                        <XCircle size={24} color={theme.colors.error} strokeWidth={2} />
                        <Text style={[styles.resultTitle, { color: theme.colors.error }]}>
                          Mistakes Found ({result.mistakes.length})
                        </Text>
                      </View>
                      {result.mistakes.map((mistake, i) => (
                        <View key={i} style={[styles.mistakeItem, { borderBottomColor: theme.colors.border }]}>
                          <View style={styles.mistakeRow}>
                            <Text style={[styles.mistakeOriginal, { color: theme.colors.error }]}>
                              ❌ {mistake.original}
                            </Text>
                            <Text style={[styles.mistakeCorrection, { color: theme.colors.success }]}>
                              ✅ {mistake.correction}
                            </Text>
                          </View>
                          <Text style={[styles.mistakeExplanation, { color: theme.colors.textSecondary }]}>
                            📚 {mistake.explanation}
                          </Text>
                        </View>
                      ))}
                    </Card>
                  )}

                  {/* Corrected Sentence */}
                  <Card style={[styles.resultCard, { borderColor: theme.colors.success, borderWidth: 2 }]}>
                    <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>
                      ✅ Corrected Sentence
                    </Text>
                    <Text style={[styles.resultText, { color: theme.colors.success, fontWeight: fontWeight.semibold }]}>
                      {result.corrected}
                    </Text>
                  </Card>

                  {/* Explanation */}
                  {result.explanation ? (
                    <Card style={[styles.resultCard, { backgroundColor: theme.colors.primarySoft }]}>
                      <Text style={[styles.resultLabel, { color: theme.colors.primary }]}>
                        📚 Explanation
                      </Text>
                      <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                        {result.explanation}
                      </Text>
                    </Card>
                  ) : null}

                  {/* Suggestion */}
                  {result.suggestion ? (
                    <Card style={[styles.resultCard, { backgroundColor: theme.colors.accent + '20' }]}>
                      <View style={styles.suggestionHeader}>
                        <Lightbulb size={18} color={theme.colors.accent} strokeWidth={2} />
                        <Text style={[styles.resultLabel, { color: theme.colors.accent }]}>
                          💡 Natural Alternative
                        </Text>
                      </View>
                      <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                        {result.suggestion}
                      </Text>
                    </Card>
                  ) : null}
                </>
              )}
            </View>
          )}
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
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
    marginTop: 2,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
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
  headerSubtitle: {
    fontSize: fontSize.sm,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  inputSection: {
    gap: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    minHeight: 80,
    maxHeight: 120,
    lineHeight: fontSize.md * 1.5,
  },
  samplesRow: {
    gap: spacing.sm,
  },
  samplesLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  samples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sampleChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    maxWidth: '100%',
  },
  sampleText: {
    fontSize: fontSize.xs,
  },
  errorCard: {
    borderWidth: 2,
    gap: spacing.sm,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  errorText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
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
  resultSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  resultCard: {
    gap: spacing.sm,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  resultLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  resultText: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
  mistakeItem: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  mistakeRow: {
    gap: 4,
  },
  mistakeOriginal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * 1.4,
  },
  mistakeCorrection: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * 1.4,
  },
  mistakeExplanation: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.5,
  },
  explanationBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: 4,
  },
  explanationText: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
  },
  suggestionBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  suggestionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  suggestionText: {
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.5,
  },
});
