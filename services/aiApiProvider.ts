import { supabase } from './supabase';
import type { AIProvider } from './aiProvider';
import type {
  ChatRequest,
  ChatResponse,
  GrammarCheckRequest,
} from './aiService';
import type { ChatMessage, GrammarCheckResult } from '@/types';

export const aiApiProvider: AIProvider = {
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const { data: result, error } = await supabase.functions.invoke(
      'ai-chat',
      {
        body: data,
      }
    );

    if (error) {
  console.error('AI CHAT ERROR:', error);
  throw new Error(error.message || 'Unable to send AI message.');
}
    if (!result) {
  console.error('AI CHAT EMPTY RESPONSE:', result);
  throw new Error('No response was returned by the AI.');
}

console.log('AI CHAT RESPONSE:', result);
    return result as ChatResponse;
  },

  async checkGrammar(
    data: GrammarCheckRequest
  ): Promise<GrammarCheckResult> {
    const { data: result, error } = await supabase.functions.invoke(
      'ai-grammar-check',
      {
        body: data,
      }
    );

    if (error) {
      throw new Error(error.message || 'Unable to check grammar.');
    }

    if (!result) {
      throw new Error('No grammar result was returned.');
    }

    return result as GrammarCheckResult;
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    const { data: result, error } = await supabase.functions.invoke(
      'ai-chat-history',
      {
        body: {},
      }
    );

    if (error) {
      throw new Error(error.message || 'Unable to load chat history.');
    }

    return (result || []) as ChatMessage[];
  },
};
