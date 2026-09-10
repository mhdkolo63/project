import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Mic, Square, RotateCcw, Play, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { spacing, fontSize, fontWeight, radius } from '@/constants/layout';
import { speechRecognitionService, RealtimeRecognizer } from '@/services/speechRecognitionService';

export type RecorderState = 'idle' | 'requesting' | 'recording' | 'processing' | 'ready' | 'error';

interface SpeakingRecorderProps {
  onTranscription: (text: string) => void;
  onRecordingChange?: (recording: boolean) => void;
  disabled?: boolean;
}

export function SpeakingRecorder({ onTranscription, onRecordingChange, disabled = false }: SpeakingRecorderProps) {
  const { theme } = useTheme();
  const [state, setState] = useState<RecorderState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const recognizerRef = useRef<RealtimeRecognizer | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recognizerRef.current?.abort();
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startRecording = async () => {
    if (disabled || state === 'recording' || state === 'processing') return;
    setError(null);
    setTranscript('');
    setElapsedSeconds(0);
    setState('requesting');

    if (Platform.OS === 'web' && speechRecognitionService.isRealtimeAvailable()) {
      const recognizer = speechRecognitionService.createRealtimeRecognizer('en-US');
      if (!recognizer) {
        setState('error');
        setError('Speech recognition is not available in this browser. You can still record and connect a speech service later.');
        return;
      }

      recognizerRef.current = recognizer;
      recognizer.onstart = () => {
        setState('recording');
        onRecordingChange?.(true);
        timerRef.current = setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
      };
      recognizer.onresult = (event) => {
        let combined = '';
        for (let index = 0; index < event.results.length; index += 1) {
          combined += event.results[index][0].transcript;
        }
        setTranscript(combined.trim());
      };
      recognizer.onerror = (event) => {
        clearTimer();
        setState('error');
        onRecordingChange?.(false);
        setError(event.error === 'not-allowed' ? 'Microphone permission was denied. Please allow microphone access and try again.' : 'We could not hear your voice. Please check your microphone and try again.');
      };
      recognizer.onend = () => {
        clearTimer();
        onRecordingChange?.(false);
        setState((current) => current === 'recording' ? 'ready' : current);
      };

      try {
        recognizer.start();
      } catch {
        clearTimer();
        setState('error');
        setError('We could not start the microphone. Please try again.');
      }
      return;
    }

    setState('error');
    setError('Live speech recognition is not available on this device yet. Recording is ready for a speech-to-text provider to be connected.');
  };

  const stopRecording = () => {
    recognizerRef.current?.stop();
  };

  const cancelRecording = () => {
    recognizerRef.current?.abort();
    clearTimer();
    setElapsedSeconds(0);
    setTranscript('');
    setState('idle');
    onRecordingChange?.(false);
  };

  const useTranscript = () => {
    if (!transcript.trim()) {
      setState('error');
      setError('We could not find any words in that recording. Please try speaking for a little longer.');
      return;
    }
    onTranscription(transcript.trim());
    setState('processing');
  };

  const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <View style={styles.wrapper}>
      {state === 'recording' && (
        <View style={[styles.recordingBanner, { backgroundColor: theme.colors.errorSoft }]}>
          <View style={[styles.recordingDot, { backgroundColor: theme.colors.error }]} />
          <Text style={[styles.recordingText, { color: theme.colors.error }]}>Recording...</Text>
          <Text style={[styles.timer, { color: theme.colors.error }]}>{formatTime(elapsedSeconds)}</Text>
        </View>
      )}

      {state === 'idle' || state === 'requesting' || state === 'error' ? (
        <TouchableOpacity
          onPress={startRecording}
          activeOpacity={0.85}
          disabled={disabled || state === 'requesting'}
          style={[styles.startButton, { backgroundColor: theme.colors.primary }, (disabled || state === 'requesting') && styles.disabled]}
        >
          <View style={styles.micCircle}>
            <Mic size={34} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.startText}>{state === 'requesting' ? 'Requesting microphone...' : 'Start Speaking'}</Text>
        </TouchableOpacity>
      ) : null}

      {state === 'recording' ? (
        <View style={styles.recordingActions}>
          <TouchableOpacity onPress={cancelRecording} activeOpacity={0.8} style={[styles.secondaryButton, { borderColor: theme.colors.border }]}>
            <RotateCcw size={18} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.secondaryText, { color: theme.colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopRecording} activeOpacity={0.8} style={[styles.stopButton, { backgroundColor: theme.colors.error }]}>
            <Square size={18} color="#FFFFFF" strokeWidth={2} fill="#FFFFFF" />
            <Text style={styles.stopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {state === 'processing' ? (
        <View style={[styles.processingCard, { backgroundColor: theme.colors.primarySoft }]}>
          <Text style={[styles.processingTitle, { color: theme.colors.primary }]}>Preparing your feedback...</Text>
          <Text style={[styles.processingText, { color: theme.colors.textSecondary }]}>Your transcription is ready to review below.</Text>
        </View>
      ) : null}

      {state === 'ready' ? (
        <View style={styles.readySection}>
          <View style={[styles.replayBox, { backgroundColor: theme.colors.surfaceAlt }]}>
            <Play size={18} color={theme.colors.primary} strokeWidth={2} />
            <Text style={[styles.replayText, { color: theme.colors.textSecondary }]}>Recording captured</Text>
            <Text style={[styles.timer, { color: theme.colors.text }]}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <TouchableOpacity onPress={useTranscript} activeOpacity={0.8} style={[styles.useButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.useButtonText}>Review My Answer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={startRecording} activeOpacity={0.8} style={styles.tryAgainButton}>
            <Text style={[styles.tryAgainText, { color: theme.colors.primary }]}>Record Again</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: theme.colors.errorSoft }]}>
          <AlertCircle size={18} color={theme.colors.error} strokeWidth={2} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.md },
  startButton: { minHeight: 160, borderRadius: radius.xxl, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  disabled: { opacity: 0.65 },
  micCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  startText: { color: '#FFFFFF', fontSize: fontSize.lg, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
  recordingBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
  recordingDot: { width: 10, height: 10, borderRadius: 5 },
  recordingText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, flex: 1 },
  timer: { fontSize: fontSize.md, fontWeight: fontWeight.bold, fontVariant: ['tabular-nums'] },
  recordingActions: { flexDirection: 'row', gap: spacing.sm },
  secondaryButton: { flex: 1, minHeight: 48, borderWidth: 1, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  secondaryText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  stopButton: { flex: 1, minHeight: 48, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  stopText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  processingCard: { padding: spacing.md, borderRadius: radius.md, gap: spacing.xs },
  processingTitle: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  processingText: { fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
  readySection: { gap: spacing.sm },
  replayBox: { minHeight: 48, borderRadius: radius.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  replayText: { flex: 1, fontSize: fontSize.sm },
  useButton: { minHeight: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  useButtonText: { color: '#FFFFFF', fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  tryAgainButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  tryAgainText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
  errorText: { flex: 1, fontSize: fontSize.sm, lineHeight: fontSize.sm * 1.4 },
});
