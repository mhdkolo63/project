import { DailyChallenge } from '@/types';

export const dailyChallenges: DailyChallenge[] = [
  {
    id: 'dc-1',
    type: 'sentence-correction',
    question: 'Correct this sentence: "He go to school yesterday."',
    correctAnswer: 'He went to school yesterday.',
    explanation: 'The past tense of "go" is "went." Since the sentence refers to "yesterday," we use the simple past tense.',
  },
  {
    id: 'dc-2',
    type: 'sentence-correction',
    question: 'Correct this sentence: "She don\'t like coffee."',
    correctAnswer: "She doesn't like coffee.",
    explanation: 'With he/she/it, we use "doesn\'t" instead of "don\'t."',
  },
  {
    id: 'dc-3',
    type: 'sentence-correction',
    question: 'Correct this sentence: "I have went to school."',
    correctAnswer: 'I have gone to school.',
    explanation: 'Use "gone" (past participle) with "have," not "went" (simple past).',
  },
  {
    id: 'dc-4',
    type: 'sentence-correction',
    question: 'Correct this sentence: "There is many books on the table."',
    correctAnswer: 'There are many books on the table.',
    explanation: '"Books" is plural, so we use "are" instead of "is."',
  },
  {
    id: 'dc-5',
    type: 'sentence-correction',
    question: 'Correct this sentence: "I am agree with you."',
    correctAnswer: 'I agree with you.',
    explanation: '"Agree" is a verb, not an adjective. We don\'t use "am" before it.',
  },
  {
    id: 'dc-6',
    type: 'sentence-correction',
    question: 'Correct this sentence: "Where you are going?"',
    correctAnswer: 'Where are you going?',
    explanation: 'In questions, the verb "are" comes before the subject "you."',
  },
  {
    id: 'dc-7',
    type: 'sentence-correction',
    question: 'Correct this sentence: "I have 20 years old."',
    correctAnswer: 'I am 20 years old.',
    explanation: 'We use "am" for age, not "have." In English, we say "I am 20 years old."',
  },
];
