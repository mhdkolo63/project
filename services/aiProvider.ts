import type { ChatRequest, ChatResponse, GrammarCheckRequest } from '@/services/aiService';
import { ChatMessage, GrammarCheckResult } from '@/types';

export interface AIProvider {
  sendMessage(data: ChatRequest): Promise<ChatResponse>;
  checkGrammar(data: GrammarCheckRequest): Promise<GrammarCheckResult>;
  getChatHistory(): Promise<ChatMessage[]>;
}

export class FeatureUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeatureUnavailableError';
  }
}
