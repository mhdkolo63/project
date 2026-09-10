import { PlacementQuestion } from '@/types';

export const placementQuestions: PlacementQuestion[] = [
  // Beginner questions
  { id: 'pq-1', question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 'goes', level: 'Beginner' },
  { id: 'pq-2', question: 'I ___ a book yesterday.', options: ['read', 'reading', 'reads', 'will read'], correctAnswer: 'read', level: 'Beginner' },
  { id: 'pq-3', question: 'What is the opposite of "happy"?', options: ['sad', 'angry', 'tired', 'excited'], correctAnswer: 'sad', level: 'Beginner' },
  { id: 'pq-4', question: 'Choose the correct sentence:', options: ['He are my friend.', 'He is my friend.', 'He am my friend.', 'He be my friend.'], correctAnswer: 'He is my friend.', level: 'Beginner' },
  { id: 'pq-5', question: 'I have ___ apple in my bag.', options: ['a', 'an', 'the', 'some'], correctAnswer: 'an', level: 'Beginner' },
  { id: 'pq-6', question: 'What does "enormous" mean?', options: ['very small', 'very large', 'very fast', 'very slow'], correctAnswer: 'very large', level: 'Beginner' },
  // Intermediate questions
  { id: 'pq-7', question: 'By the time we arrived, the movie ___.', options: ['started', 'has started', 'had started', 'was starting'], correctAnswer: 'had started', level: 'Intermediate' },
  { id: 'pq-8', question: 'Choose the correct sentence:', options: ['I have went there.', 'I have gone there.', 'I have go there.', 'I have going there.'], correctAnswer: 'I have gone there.', level: 'Intermediate' },
  { id: 'pq-9', question: 'She ___ study harder if she wants to pass.', options: ['should', 'shall', 'will', 'would'], correctAnswer: 'should', level: 'Intermediate' },
  { id: 'pq-10', question: 'What does "reluctant" mean?', options: ['eager to do something', 'unwilling to do something', 'unable to do something', 'capable of doing something'], correctAnswer: 'unwilling to do something', level: 'Intermediate' },
  { id: 'pq-11', question: 'Choose the correct conditional: "If I ___ rich, I would travel the world."', options: ['am', 'was', 'were', 'will be'], correctAnswer: 'were', level: 'Intermediate' },
  { id: 'pq-12', question: 'The meeting ___ for two hours.', options: ['lasted', 'has lasted', 'had been lasting', 'was lasting'], correctAnswer: 'lasted', level: 'Intermediate' },
  { id: 'pq-13', question: 'Choose the correct sentence:', options: ['She don\'t like coffee.', 'She doesn\'t likes coffee.', 'She doesn\'t like coffee.', 'She not like coffee.'], correctAnswer: 'She doesn\'t like coffee.', level: 'Intermediate' },
  // Advanced questions
  { id: 'pq-14', question: 'Had I known about the issue, I ___ it differently.', options: ['would handle', 'would have handled', 'will handle', 'handled'], correctAnswer: 'would have handled', level: 'Advanced' },
  { id: 'pq-15', question: 'Not only ___ the report, but he also presented it brilliantly.', options: ['he wrote', 'did he write', 'he did write', 'wrote he'], correctAnswer: 'did he write', level: 'Advanced' },
  { id: 'pq-16', question: 'The committee recommended that the proposal ___.', options: ['is approved', 'be approved', 'will be approved', 'approves'], correctAnswer: 'be approved', level: 'Advanced' },
  { id: 'pq-17', question: 'What does "ubiquitous" mean?', options: ['rare and unusual', 'present everywhere', 'completely hidden', 'extremely dangerous'], correctAnswer: 'present everywhere', level: 'Advanced' },
  { id: 'pq-18', question: 'Choose the correct sentence:', options: ['Scarcely had I arrived when the phone rang.', 'Scarcely I had arrived when the phone rang.', 'Scarcely did I arrived when the phone rang.', 'Scarcely I arrived when the phone rang.'], correctAnswer: 'Scarcely had I arrived when the phone rang.', level: 'Advanced' },
  { id: 'pq-19', question: 'Despite ___ hard, he didn\'t succeed.', options: ['working', 'he worked', 'he works', 'to work'], correctAnswer: 'working', level: 'Advanced' },
  { id: 'pq-20', question: 'The professor\'s lecture was so ___ that students struggled to follow.', options: ['lucid', 'obscure', 'concise', 'brief'], correctAnswer: 'obscure', level: 'Advanced' },
];
