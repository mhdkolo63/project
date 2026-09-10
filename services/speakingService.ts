import { apiRequest } from './api';
import { EnglishLevel, SpeakingFeedback, SpeakingConversationTurn } from '@/types';

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
  async getFeedback(data: SpeakingFeedbackRequest): Promise<SpeakingFeedback> {
    return apiRequest<SpeakingFeedback>('/ai/speaking-feedback', {
      method: 'POST',
      body: data,
    });
  },

  async getConversationReply(data: SpeakingConversationRequest): Promise<SpeakingConversationResponse> {
    return apiRequest<SpeakingConversationResponse>('/ai/speaking-conversation', {
      method: 'POST',
      body: data,
    });
  },
};
