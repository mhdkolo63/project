import { VocabWord } from '@/types';

export const vocabularyData: VocabWord[] = [
  // Beginner
  { id: 'vocab-1', word: 'abandon', meaning: 'to leave something behind or give it up', example: 'They had to abandon the car in the snow.', partOfSpeech: 'verb', level: 'Beginner' },
  { id: 'vocab-2', word: 'benefit', meaning: 'an advantage or something good', example: 'Exercise has many benefits for your health.', partOfSpeech: 'noun', level: 'Beginner' },
  { id: 'vocab-3', word: 'communicate', meaning: 'to share or exchange information', example: 'We communicate through email every day.', partOfSpeech: 'verb', level: 'Beginner' },
  { id: 'vocab-4', word: 'decision', meaning: 'a choice you make about something', example: 'It was a difficult decision to make.', partOfSpeech: 'noun', level: 'Beginner' },
  { id: 'vocab-5', word: 'essential', meaning: 'extremely important or necessary', example: 'Water is essential for life.', partOfSpeech: 'adjective', level: 'Beginner' },
  { id: 'vocab-6', word: 'improve', meaning: 'to make or become better', example: 'I want to improve my English skills.', partOfSpeech: 'verb', level: 'Beginner' },
  { id: 'vocab-7', word: 'journey', meaning: 'the act of traveling from one place to another', example: 'The journey from London to Paris takes two hours.', partOfSpeech: 'noun', level: 'Beginner' },
  { id: 'vocab-8', word: 'necessary', meaning: 'needed or required', example: 'It is necessary to wear a seatbelt in the car.', partOfSpeech: 'adjective', level: 'Beginner' },
  { id: 'vocab-9', word: 'opportunity', meaning: 'a chance to do something', example: 'This job is a great opportunity for me.', partOfSpeech: 'noun', level: 'Beginner' },
  { id: 'vocab-10', word: 'practice', meaning: 'to do something repeatedly to get better', example: 'You need to practice speaking English every day.', partOfSpeech: 'verb', level: 'Beginner' },
  // Intermediate
  { id: 'vocab-11', word: 'accomplish', meaning: 'to succeed in completing something', example: 'She accomplished her goal of running a marathon.', partOfSpeech: 'verb', level: 'Intermediate' },
  { id: 'vocab-12', word: 'consequence', meaning: 'a result or effect of an action', example: 'The consequence of not studying was failing the exam.', partOfSpeech: 'noun', level: 'Intermediate' },
  { id: 'vocab-13', word: 'demonstrate', meaning: 'to show clearly that something is true', example: 'The experiment demonstrates how gravity works.', partOfSpeech: 'verb', level: 'Intermediate' },
  { id: 'vocab-14', word: 'emphasize', meaning: 'to give special importance to something', example: 'The teacher emphasized the importance of punctuality.', partOfSpeech: 'verb', level: 'Intermediate' },
  { id: 'vocab-15', word: 'fundamental', meaning: 'forming the base, from which everything else develops', example: 'Trust is fundamental to any good relationship.', partOfSpeech: 'adjective', level: 'Intermediate' },
  { id: 'vocab-16', word: 'genuine', meaning: 'real and exactly what it appears to be', example: 'Her smile was genuine, not forced.', partOfSpeech: 'adjective', level: 'Intermediate' },
  { id: 'vocab-17', word: 'hesitate', meaning: 'to pause before doing something because you are unsure', example: 'Don\'t hesitate to ask if you need help.', partOfSpeech: 'verb', level: 'Intermediate' },
  { id: 'vocab-18', word: 'influence', meaning: 'the power to affect how someone or something develops', example: 'My teacher had a big influence on my career choice.', partOfSpeech: 'noun', level: 'Intermediate' },
  { id: 'vocab-19', word: 'perspective', meaning: 'a particular way of viewing things', example: 'Try to see the situation from her perspective.', partOfSpeech: 'noun', level: 'Intermediate' },
  { id: 'vocab-20', word: 'sufficient', meaning: 'enough for a particular purpose', example: 'We don\'t have sufficient information to make a decision.', partOfSpeech: 'adjective', level: 'Intermediate' },
  // Advanced
  { id: 'vocab-21', word: 'ambiguous', meaning: 'having more than one possible meaning', example: 'His answer was deliberately ambiguous.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-22', word: 'coherent', meaning: 'logical, consistent, and easy to understand', example: 'She presented a coherent argument for the proposal.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-23', word: 'diligent', meaning: 'showing careful and persistent effort in work', example: 'He is a diligent student who never misses a deadline.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-24', word: 'eloquent', meaning: 'fluent and persuasive in speaking or writing', example: 'Her eloquent speech moved the entire audience.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-25', word: 'feasible', meaning: 'possible to do easily or conveniently', example: 'Is it feasible to complete the project by Friday?', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-26', word: 'inherent', meaning: 'existing as a natural part of something', example: 'There are inherent risks in any investment.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-27', word: 'meticulous', meaning: 'showing great attention to detail; very careful', example: 'She is meticulous about keeping her records organized.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-28', word: 'prevalent', meaning: 'widespread or common at a particular time', example: 'This disease is prevalent in tropical regions.', partOfSpeech: 'adjective', level: 'Advanced' },
  { id: 'vocab-29', word: 'substantiate', meaning: 'to provide evidence to prove something is true', example: 'Can you substantiate your claims with data?', partOfSpeech: 'verb', level: 'Advanced' },
  { id: 'vocab-30', word: 'versatile', meaning: 'able to adapt to many different functions or activities', example: 'She is a versatile musician who plays several instruments.', partOfSpeech: 'adjective', level: 'Advanced' },
];

export function getVocabByLevel(level: string): VocabWord[] {
  return vocabularyData.filter((w) => w.level === level);
}
