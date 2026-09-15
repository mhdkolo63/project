export interface DailyChallengeVocabActivity {
  type: 'vocabulary';
  word: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DailyChallengeGrammarActivity {
  type: 'grammar';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DailyChallengeSpeakingActivity {
  type: 'speaking';
  prompt: string;
  instructions: string;
  tips: string[];
}

export type DailyChallengeActivity =
  | DailyChallengeVocabActivity
  | DailyChallengeGrammarActivity
  | DailyChallengeSpeakingActivity;

export const DAILY_CHALLENGE_XP = 30;

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

const vocabActivities: DailyChallengeVocabActivity[] = [
  {
    type: 'vocabulary',
    word: 'abandon',
    options: ['to keep something safe', 'to leave something behind', 'to find something new', 'to repair something'],
    correctAnswer: 'to leave something behind',
    explanation: '"Abandon" means to leave something behind or give it up completely.',
  },
  {
    type: 'vocabulary',
    word: 'benefit',
    options: ['a problem or issue', 'an advantage or something good', 'a type of food', 'a place to stay'],
    correctAnswer: 'an advantage or something good',
    explanation: '"Benefit" means an advantage or something good that comes from an action.',
  },
  {
    type: 'vocabulary',
    word: 'essential',
    options: ['not important', 'extremely important or necessary', 'somewhat useful', 'rarely needed'],
    correctAnswer: 'extremely important or necessary',
    explanation: '"Essential" means extremely important or necessary — something you cannot do without.',
  },
  {
    type: 'vocabulary',
    word: 'opportunity',
    options: ['a danger', 'a chance to do something', 'a type of problem', 'a feeling of fear'],
    correctAnswer: 'a chance to do something',
    explanation: '"Opportunity" means a chance to do something, especially something good.',
  },
  {
    type: 'vocabulary',
    word: 'improve',
    options: ['to make worse', 'to make or become better', 'to stay the same', 'to stop completely'],
    correctAnswer: 'to make or become better',
    explanation: '"Improve" means to make or become better than before.',
  },
  {
    type: 'vocabulary',
    word: 'genuine',
    options: ['fake or false', 'real and exactly what it appears to be', 'very old', 'very cheap'],
    correctAnswer: 'real and exactly what it appears to be',
    explanation: '"Genuine" means real, authentic, and exactly what it appears to be.',
  },
  {
    type: 'vocabulary',
    word: 'sufficient',
    options: ['too much', 'not enough', 'enough for a particular purpose', 'exactly one'],
    correctAnswer: 'enough for a particular purpose',
    explanation: '"Sufficient" means enough for a particular purpose — not too little, not too much.',
  },
];

const grammarActivities: DailyChallengeGrammarActivity[] = [
  {
    type: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['He play football every Sunday.', 'He plays football every Sunday.', 'He playing football every Sunday.', 'He plaies football every Sunday.'],
    correctAnswer: 'He plays football every Sunday.',
    explanation: 'With he/she/it, we add -s to the verb: "play" becomes "plays."',
  },
  {
    type: 'grammar',
    question: 'Fill in the blank: "Yesterday, I ___ to the store."',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 'went',
    explanation: 'The past tense of "go" is "went." Since the sentence says "yesterday," we use the simple past.',
  },
  {
    type: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['She don\'t like coffee.', 'She doesn\'t likes coffee.', 'She doesn\'t like coffee.', 'She not like coffee.'],
    correctAnswer: 'She doesn\'t like coffee.',
    explanation: 'With he/she/it, use "doesn\'t" and the base verb without -s: "She doesn\'t like."',
  },
  {
    type: 'grammar',
    question: 'Fill in the blank: "I have ___ to Paris twice."',
    options: ['went', 'gone', 'go', 'going'],
    correctAnswer: 'gone',
    explanation: 'Use "gone" (past participle) with "have," not "went" (simple past).',
  },
  {
    type: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['There is many books on the table.', 'There are many books on the table.', 'There be many books on the table.', 'There many books on the table.'],
    correctAnswer: 'There are many books on the table.',
    explanation: '"Books" is plural, so we use "are" instead of "is."',
  },
  {
    type: 'grammar',
    question: 'Fill in the blank: "If I ___ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'will be'],
    correctAnswer: 'were',
    explanation: 'In the second conditional (hypothetical), we use "were" for all subjects: "If I were rich."',
  },
  {
    type: 'grammar',
    question: 'Choose the correct sentence:',
    options: ['I am agree with you.', 'I agree with you.', 'I am agreeing with you.', 'I do agree with you.'],
    correctAnswer: 'I agree with you.',
    explanation: '"Agree" is a verb, not an adjective. We don\'t use "am" before it.',
  },
];

const speakingActivities: DailyChallengeSpeakingActivity[] = [
  {
    type: 'speaking',
    prompt: 'Introduce yourself in two sentences.',
    instructions: 'Say your name, where you are from, and one thing you like to do. Keep it to exactly two sentences.',
    tips: ['Use "My name is..." or "I am..."', 'Mention where you live', 'Add one hobby or interest'],
  },
  {
    type: 'speaking',
    prompt: 'Describe your daily routine in three sentences.',
    instructions: 'Talk about what you do in the morning, afternoon, and evening. Use the present simple tense.',
    tips: ['Use phrases like "I wake up at..."', 'Mention your main activities', 'Use time expressions like "in the morning"'],
  },
  {
    type: 'speaking',
    prompt: 'Talk about your favorite food in two sentences.',
    instructions: 'Name your favorite food and explain why you like it in two sentences.',
    tips: ['Start with "My favorite food is..."', 'Explain why you like it', 'Use describing words like "delicious" or "tasty"'],
  },
  {
    type: 'speaking',
    prompt: 'Describe a place you want to visit in two sentences.',
    instructions: 'Name a place you would like to visit and say why. Keep it to two sentences.',
    tips: ['Use "I would like to visit..."', 'Give a reason for your choice', 'Be specific about the place'],
  },
  {
    type: 'speaking',
    prompt: 'Talk about something you are good at in two sentences.',
    instructions: 'Describe a skill or talent you have and how you developed it.',
    tips: ['Start with "I am good at..."', 'Mention how you learned or practiced it', 'Keep it to two sentences'],
  },
];

export function getDailyChallengeActivities(): [DailyChallengeVocabActivity, DailyChallengeGrammarActivity, DailyChallengeSpeakingActivity] {
  const dayIndex = getDayIndex();
  const vocab = vocabActivities[dayIndex % vocabActivities.length];
  const grammar = grammarActivities[dayIndex % grammarActivities.length];
  const speaking = speakingActivities[dayIndex % speakingActivities.length];
  return [vocab, grammar, speaking];
}

export function getDailyChallengeDate(): string {
  return new Date().toISOString().split('T')[0];
}
