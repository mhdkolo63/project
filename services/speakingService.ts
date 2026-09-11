import { supabase } from './supabase';
import type {
  EnglishLevel,
  SpeakingFeedback,
  SpeakingConversationTurn,
} from '@/types';

export interface SpeakingFeedbackRequest {
  transcription: string;
  userLevel: EnglishLevel;
  practicePrompt: string;
  category: string;
}

export interface SpeakingConversationRequest {
  userMessage: string;
  userLevel: EnglishLevel;
  conversationHistory: SpeakingConversationTurn[];
  category: string;
  turnNumber: number;
}

export interface SpeakingConversationResponse {
  reply: string;
  shouldGiveFeedback: boolean;
  feedback?: SpeakingFeedback;
}

export const speakingService = {
  async getFeedback(
    data: SpeakingFeedbackRequest
  ): Promise<SpeakingFeedback> {
    const { data: result, error } = await supabase.functions.invoke(
      'speaking-feedback',
      {
        body: data,
      }
    );

    if (error) {
      throw new Error(error.message || 'Unable to get speaking feedback.');
    }

    if (!result) {
      throw new Error('No speaking feedback was returned.');
    }

    return result as SpeakingFeedback;
  },

  async getConversationReply(
    data: SpeakingConversationRequest
  ): Promise<SpeakingConversationResponse> {
    const { data: result, error } = await supabase.functions.invoke(
      'speaking-conversation',
      {
        body: data,
      }
    );

    if (error) {
      throw new Error(
        error.message || 'Unable to get speaking conversation reply.'
      );
    }

    if (!result) {
      throw new Error('No conversation reply was returned.');
    }

    return result as SpeakingConversationResponse;
  },
};
