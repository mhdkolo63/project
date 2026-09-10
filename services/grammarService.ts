import { EnglishLevel, GrammarCheckResult } from '@/types';
import { featureFlags } from '@/constants/featureFlags';
import { FeatureUnavailableError } from '@/services/aiProvider';
import { aiService } from '@/services/aiService';

export interface GrammarCheckInput {
  text: string;
  userLevel: EnglishLevel;
}

export const grammarService = {
  isAvailable(): boolean {
    return featureFlags.aiGrammarEnabled && aiService.isAvailable();
  },

  async check(input: GrammarCheckInput): Promise<GrammarCheckResult> {
    if (!this.isAvailable()) {
      throw new FeatureUnavailableError('AI grammar checking is currently unavailable.');
    }
    return aiService.checkGrammar(input);
  },
};
