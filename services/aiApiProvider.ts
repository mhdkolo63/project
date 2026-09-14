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
    console.log('AI CHAT REQUEST:', data);

    const { data: result, error } = await supabase.functions.invoke(
      'ai-chat',
      {
        body: data,
      }
    );

    if (error) {
      console.error('AI CHAT ERROR:', error);
      throw new Error(
        `AI chat function error: ${error.message || 'Unable to send AI message.'}`
      );
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
    console.log('GRAMMAR REQUEST:', data);

    const { data: result, error } = await supabase.functions.invoke(
      'ai-grammar-check',
      {
        body: {
          text: data.text,
          userLevel: data.userLevel,
        },
      }
    );

    if (error) {
      console.error('GRAMMAR FUNCTION ERROR:', error);
      throw new Error(
        `Grammar function error: ${
          error.message || 'Unable to check grammar.'
        }`
      );
    }

    if (!result) {
      console.error('GRAMMAR EMPTY RESPONSE:', result);
      throw new Error('Grammar function returned no data.');
    }

    console.log('GRAMMAR RESPONSE:', result);

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
      console.error('AI CHAT HISTORY ERROR:', error);
      throw new Error(
        error.message || 'Unable to load chat history.'
      );
    }

    return (result || []) as ChatMessage[];
  },
};
