import { apiRequest } from '@/services/api';
import type { AIProvider } from '@/services/aiProvider';
import type { ChatRequest, ChatResponse, GrammarCheckRequest } from '@/services/aiService';
import { ChatMessage, GrammarCheckResult } from '@/types';

export const aiApiProvider: AIProvider = {
  sendMessage(data: ChatRequest): Promise<ChatResponse> {
    return apiRequest<ChatResponse>('/ai/chat', { method: 'POST', body: data });
  },

  checkGrammar(data: GrammarCheckRequest): Promise<GrammarCheckResult> {
    return apiRequest<GrammarCheckResult>('/ai/grammar-check', { method: 'POST', body: data });
  },

  getChatHistory(): Promise<ChatMessage[]> {
    return apiRequest<ChatMessage[]>('/ai/history');
  },
};
