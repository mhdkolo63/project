import { featureFlags } from '@/constants/featureFlags';
import { ChatMessage, GrammarCheckResult } from '@/types';
import { FeatureUnavailableError } from '@/services/aiProvider';
import type { AIProvider } from '@/services/aiProvider';
import { aiApiProvider } from '@/services/aiApiProvider';
import { AppConfig } from '@/constants/config';

export type ConversationMode = 'free' | 'grammar' | 'business' | 'interview' | 'travel' | 'daily';

export interface ChatRequest {
  message: string;
  userLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  conversationHistory: { role: 'user' | 'ai'; text: string }[];
  mode?: ConversationMode;
}

export interface ChatResponse {
  reply: string;
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
    naturalAlternative?: string;
  };
}

export interface GrammarCheckRequest {
  text: string;
  userLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}
let provider: AIProvider | null = aiApiProvider;


export const aiService = {
  setProvider(nextProvider: AIProvider): void {
    provider = nextProvider;
  },

  isAvailable(): boolean {
    return provider !== null;
  },

  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    if (!featureFlags.aiEnabled || !provider) {
      throw new FeatureUnavailableError('AI Tutor is currently unavailable.');
    }
    return provider.sendMessage(data);
  },

  async checkGrammar(data: GrammarCheckRequest): Promise<GrammarCheckResult> {
    if (!featureFlags.aiGrammarEnabled || !provider) {
      throw new FeatureUnavailableError('AI grammar checking is currently unavailable.');
    }
    return provider.checkGrammar(data);
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    if (!featureFlags.aiEnabled || !provider) {
      throw new FeatureUnavailableError('AI Tutor history is currently unavailable.');
    }
    return provider.getChatHistory();
  },
};
