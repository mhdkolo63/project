import { ListeningExercise, EnglishLevel } from '@/types';

export const listeningExercises: ListeningExercise[] = [
  {
    id: 'listening-1',
    title: 'At the Coffee Shop',
    level: 'Beginner',
    description: 'A simple conversation between a customer and a barista.',
    audioText:
      "Barista: Good morning! Welcome to Sunny Cafe. What would you like to order today?\n\nCustomer: Hi! Can I have a medium latte, please?\n\nBarista: Sure! Would you like it hot or iced?\n\nCustomer: Hot, please. And can I also get a blueberry muffin?\n\nBarista: Of course. That will be six dollars and fifty cents.\n\nCustomer: Here you go. Thank you!\n\nBarista: Thank you! Have a great day!",
    estimatedMinutes: 3,
    xpReward: 50,
    comprehensionQuestions: [
      {
        id: 'l1-q1',
        question: 'What did the customer order?',
        options: ['A cold latte and a muffin', 'A hot latte and a blueberry muffin', 'A coffee and a croissant', 'An iced tea and a cookie'],
        correctAnswer: 'A hot latte and a blueberry muffin',
        explanation: 'The customer asked for a medium hot latte and a blueberry muffin.',
      },
      {
        id: 'l1-q2',
        question: 'How much did the customer pay?',
        options: ['Five dollars', 'Six dollars and fifty cents', 'Seven dollars', 'Four dollars and twenty-five cents'],
        correctAnswer: 'Six dollars and fifty cents',
        explanation: 'The barista said the total was six dollars and fifty cents.',
      },
      {
        id: 'l1-q3',
        question: 'What is the name of the cafe?',
        options: ['Blue Sky Cafe', 'Morning Cafe', 'Sunny Cafe', 'Central Perk'],
        correctAnswer: 'Sunny Cafe',
        explanation: 'The barista said "Welcome to Sunny Cafe."',
      },
      {
        id: 'l1-q4',
        question: 'How did the barista greet the customer?',
        options: ['Hello there!', 'Good morning!', 'Hey, what do you want?', 'Welcome back!'],
        correctAnswer: 'Good morning!',
        explanation: 'The barista opened with "Good morning! Welcome to Sunny Cafe."',
      },
    ],
  },
  {
    id: 'listening-2',
    title: 'Making Weekend Plans',
    level: 'Beginner',
    description: 'Two friends talk about what to do on Saturday.',
    audioText:
      "Mike: Hey Sarah, do you have any plans for Saturday?\n\nSarah: Not yet. What are you thinking?\n\nMike: I was thinking we could go to the park and have a picnic.\n\nSarah: That sounds fun! What time?\n\nMike: How about eleven in the morning? We can bring some sandwiches and fruit.\n\nSarah: Perfect. I will bring some juice too.\n\nMike: Great! Let us meet at the park entrance.\n\nSarah: Sounds good. See you on Saturday!",
    estimatedMinutes: 3,
    xpReward: 50,
    comprehensionQuestions: [
      {
        id: 'l2-q1',
        question: 'What did Mike suggest doing on Saturday?',
        options: ['Going to the movies', 'Going to a restaurant', 'Having a picnic at the park', 'Going shopping'],
        correctAnswer: 'Having a picnic at the park',
        explanation: 'Mike suggested they go to the park and have a picnic.',
      },
      {
        id: 'l2-q2',
        question: 'What time did they agree to meet?',
        options: ['Nine in the morning', 'Eleven in the morning', 'One in the afternoon', 'Three in the afternoon'],
        correctAnswer: 'Eleven in the morning',
        explanation: 'Mike suggested meeting at eleven in the morning.',
      },
      {
        id: 'l2-q3',
        question: 'What did Sarah say she would bring?',
        options: ['Sandwiches', 'Fruit', 'Juice', 'Cookies'],
        correctAnswer: 'Juice',
        explanation: 'Sarah said "I will bring some juice too."',
      },
      {
        id: 'l2-q4',
        question: 'Where did they decide to meet?',
        options: ['At the bus stop', 'At the park entrance', 'At Mike\'s house', 'At the coffee shop'],
        correctAnswer: 'At the park entrance',
        explanation: 'Mike said "Let us meet at the park entrance."',
      },
    ],
  },
  {
    id: 'listening-3',
    title: 'Job Interview Tips',
    level: 'Intermediate',
    description: 'A career advisor gives tips for a successful job interview.',
    audioText:
      "Advisor: So, you have a job interview next week. Let me share a few important tips.\n\nFirst, always arrive at least ten minutes early. This shows you are punctual and respect their time.\n\nSecond, dress professionally. Even if the company has a casual culture, it is better to be slightly overdressed for the interview.\n\nThird, research the company beforehand. Learn about their products, values, and recent news. This will help you answer questions and show genuine interest.\n\nFourth, prepare questions to ask them. At the end of the interview, they will ask if you have any questions. Saying no makes you seem uninterested.\n\nFinally, send a thank-you email within twenty-four hours after the interview. This leaves a positive impression and sets you apart from other candidates.",
    estimatedMinutes: 4,
    xpReward: 50,
    comprehensionQuestions: [
      {
        id: 'l3-q1',
        question: 'How early should you arrive for a job interview?',
        options: ['At least five minutes early', 'At least ten minutes early', 'At least fifteen minutes early', 'Exactly on time'],
        correctAnswer: 'At least ten minutes early',
        explanation: 'The advisor said to arrive at least ten minutes early to show punctuality.',
      },
      {
        id: 'l3-q2',
        question: 'What should you do before the interview?',
        options: ['Buy new clothes', 'Research the company', 'Call the interviewer', 'Practice your handshake'],
        correctAnswer: 'Research the company',
        explanation: 'The advisor recommended researching the company, including their products, values, and recent news.',
      },
      {
        id: 'l3-q3',
        question: 'What happens if you say you have no questions at the end?',
        options: ['It is fine and normal', 'It makes you seem uninterested', 'They will hire you immediately', 'You lose the job automatically'],
        correctAnswer: 'It makes you seem uninterested',
        explanation: 'The advisor said that saying no to having questions makes you seem uninterested.',
      },
      {
        id: 'l3-q4',
        question: 'When should you send a thank-you email?',
        options: ['Before the interview', 'Within one hour after', 'Within twenty-four hours after', 'One week later'],
        correctAnswer: 'Within twenty-four hours after',
        explanation: 'The advisor said to send a thank-you email within twenty-four hours after the interview.',
      },
      {
        id: 'l3-q5',
        question: 'What does the advisor say about dressing?',
        options: ['Always wear jeans', 'Dress professionally, even if the culture is casual', 'Wear what you want', 'Copy what the employees wear'],
        correctAnswer: 'Dress professionally, even if the culture is casual',
        explanation: 'The advisor said it is better to be slightly overdressed for the interview.',
      },
    ],
  },
  {
    id: 'listening-4',
    title: 'The Impact of Remote Work',
    level: 'Advanced',
    description: 'A business podcast discusses how remote work changes company culture.',
    audioText:
      "Host: Welcome back to Business Forward. Today we are discussing how remote work is reshaping company culture. With me is Dr. Lisa Chen, an organizational psychologist. Dr. Chen, what are the biggest challenges?\n\nDr. Chen: Thank you for having me. The most significant challenge is maintaining a sense of connection. When employees work from home, they lose those spontaneous interactions, the so-called water cooler moments, that often lead to innovation and collaboration.\n\nHost: So how can companies address this?\n\nDr. Chen: It requires intentionality. Companies need to create structured opportunities for informal interaction, such as virtual coffee breaks or team-building sessions. But they also need to be mindful of video call fatigue. Not every interaction needs to be a scheduled video meeting.\n\nHost: What about productivity? Are remote workers actually more productive?\n\nDr. Chen: Studies show a nuanced picture. Productivity often increases for individual tasks that require deep focus. However, collaborative creative work can suffer. The key is finding the right balance, perhaps through a hybrid approach where employees come together a few days each week.\n\nHost: That is fascinating. Do you think remote work is here to stay?\n\nDr. Chen: Absolutely. But I think the future is hybrid. The companies that will thrive are the ones that embrace flexibility while being deliberate about preserving their culture and fostering collaboration.",
    estimatedMinutes: 5,
    xpReward: 50,
    comprehensionQuestions: [
      {
        id: 'l4-q1',
        question: 'What does Dr. Chen say is the biggest challenge of remote work?',
        options: ['Lower productivity', 'Higher costs', 'Maintaining a sense of connection', 'Finding office space'],
        correctAnswer: 'Maintaining a sense of connection',
        explanation: 'Dr. Chen said the most significant challenge is maintaining a sense of connection without spontaneous interactions.',
      },
      {
        id: 'l4-q2',
        question: 'What does Dr. Chen mean by "water cooler moments"?',
        options: ['Formal meetings', 'Spontaneous interactions that lead to innovation', 'Breaks for drinking water', 'Arguments between employees'],
        correctAnswer: 'Spontaneous interactions that lead to innovation',
        explanation: 'Dr. Chen described water cooler moments as spontaneous interactions that often lead to innovation and collaboration.',
      },
      {
        id: 'l4-q3',
        question: 'What does Dr. Chen say about productivity for remote workers?',
        options: ['It always decreases', 'It always increases', 'It increases for individual tasks but collaborative work can suffer', 'There is no difference'],
        correctAnswer: 'It increases for individual tasks but collaborative work can suffer',
        explanation: 'Dr. Chen said productivity often increases for individual deep-focus tasks, but collaborative creative work can suffer.',
      },
      {
        id: 'l4-q4',
        question: 'What solution does Dr. Chen suggest for the future?',
        options: ['Fully remote work', 'Fully in-office work', 'A hybrid approach', 'Hiring more managers'],
        correctAnswer: 'A hybrid approach',
        explanation: 'Dr. Chen said the future is hybrid and that companies should embrace flexibility while preserving culture.',
      },
      {
        id: 'l4-q5',
        question: 'What does Dr. Chen say companies need to be mindful of?',
        options: ['Office temperature', 'Video call fatigue', 'Internet speed', 'Employee salaries'],
        correctAnswer: 'Video call fatigue',
        explanation: 'Dr. Chen warned that companies need to be mindful of video call fatigue, as not every interaction needs to be a scheduled video meeting.',
      },
    ],
  },
  {
    id: 'listening-5',
    title: 'Climate Change and Coastal Cities',
    level: 'Advanced',
    description: 'A documentary excerpt about rising sea levels and urban planning.',
    audioText:
      "Narrator: Coastal cities around the world are facing an unprecedented threat from rising sea levels. In the past decade alone, sea levels have risen by approximately three point three millimeters per year, a rate that has been steadily accelerating.\n\nEngineer Maria Santos: Here in this city, we are constructing what we call living seawalls. These are not just barriers, they incorporate natural ecosystems like oyster reefs and mangrove roots, which actually grow and adapt over time, unlike concrete walls which deteriorate.\n\nNarrator: But some argue that adaptation is not enough. Dr. James Wilson, a climate policy expert, believes we need to address the root cause.\n\nDr. Wilson: We cannot simply build our way out of this crisis. Infrastructure adaptation is necessary, yes, but without aggressive reductions in greenhouse gas emissions, we are merely treating symptoms while the disease worsens.\n\nNarrator: The debate between adaptation and mitigation continues. Meanwhile, city planners are exploring innovative solutions, from floating neighborhoods to elevated transit systems, attempting to reconcile urban life with an increasingly volatile natural world.",
    estimatedMinutes: 5,
    xpReward: 50,
    comprehensionQuestions: [
      {
        id: 'l5-q1',
        question: 'How much have sea levels been rising per year in the past decade?',
        options: ['About one millimeter', 'About three point three millimeters', 'About ten millimeters', 'About half a millimeter'],
        correctAnswer: 'About three point three millimeters',
        explanation: 'The narrator stated sea levels have risen approximately three point three millimeters per year.',
      },
      {
        id: 'l5-q2',
        question: 'What is unique about the "living seawalls" Maria Santos describes?',
        options: ['They are made entirely of concrete', 'They incorporate natural ecosystems that grow and adapt', 'They are temporary structures', 'They are built underwater'],
        correctAnswer: 'They incorporate natural ecosystems that grow and adapt',
        explanation: 'Maria Santos explained that living seawalls incorporate oyster reefs and mangrove roots that grow and adapt, unlike concrete walls.',
      },
      {
        id: 'l5-q3',
        question: 'What does Dr. Wilson believe is essential beyond adaptation?',
        options: ['Building more seawalls', 'Aggressive reductions in greenhouse gas emissions', 'Moving cities inland', 'Abandoning coastal areas'],
        correctAnswer: 'Aggressive reductions in greenhouse gas emissions',
        explanation: 'Dr. Wilson said without aggressive reductions in greenhouse gas emissions, we are merely treating symptoms.',
      },
      {
        id: 'l5-q4',
        question: 'What does Dr. Wilson mean by "treating symptoms while the disease worsens"?',
        options: ['Building infrastructure without addressing the root cause', 'Building hospitals near the coast', 'Treating patients for waterborne diseases', 'Ignoring the problem entirely'],
        correctAnswer: 'Building infrastructure without addressing the root cause',
        explanation: 'Dr. Wilson used this metaphor to say that adapting infrastructure without reducing emissions only treats symptoms, not the underlying cause.',
      },
      {
        id: 'l5-q5',
        question: 'What innovative solutions are city planners exploring?',
        options: ['Only concrete walls', 'Floating neighborhoods and elevated transit systems', 'Underground cities', 'Abandoning all coastal development'],
        correctAnswer: 'Floating neighborhoods and elevated transit systems',
        explanation: 'The narrator mentioned floating neighborhoods and elevated transit systems as innovative solutions being explored.',
      },
    ],
  },
  {
    id: 'listening-6',
    title: 'Booking a Hotel Room',
    level: 'Beginner',
    description: 'A phone call to book a hotel room for the weekend.',
    audioText:
      "Receptionist: Grand Hotel, how can I help you?\n\nCaller: Hi, I would like to book a room for this weekend, please.\n\nReceptionist: Certainly. What type of room would you like? We have standard rooms and deluxe rooms.\n\nCaller: What is the difference?\n\nReceptionist: A standard room has one bed and a city view. A deluxe room has two beds, a balcony, and a garden view.\n\nCaller: I will take the deluxe room. How much is it per night?\n\nReceptionist: The deluxe room is one hundred and twenty dollars per night. How many nights will you be staying?\n\nCaller: Just two nights, Friday and Saturday.\n\nReceptionist: Great. Can I have your name, please?\n\nCaller: Yes, it is Tom Wilson.\n\nReceptionist: Thank you, Mr. Wilson. Your booking is confirmed for Friday and Saturday. Check-in is at three p.m.",
    estimatedMinutes: 3,
    xpReward: 50,
    comprehensionQuestions: [
      {
        id: 'l6-q1',
        question: 'What type of room did the caller book?',
        options: ['A standard room', 'A deluxe room', 'A suite', 'A single room'],
        correctAnswer: 'A deluxe room',
        explanation: 'The caller chose the deluxe room after hearing about its features.',
      },
      {
        id: 'l6-q2',
        question: 'How much does the deluxe room cost per night?',
        options: ['One hundred dollars', 'One hundred and twenty dollars', 'One hundred and fifty dollars', 'Two hundred dollars'],
        correctAnswer: 'One hundred and twenty dollars',
        explanation: 'The receptionist said the deluxe room is one hundred and twenty dollars per night.',
      },
      {
        id: 'l6-q3',
        question: 'How many nights will the caller stay?',
        options: ['One night', 'Two nights', 'Three nights', 'A full week'],
        correctAnswer: 'Two nights',
        explanation: 'The caller said they would stay for two nights, Friday and Saturday.',
      },
      {
        id: 'l6-q4',
        question: 'What time is check-in?',
        options: ['Two p.m.', 'Three p.m.', 'Noon', 'Four p.m.'],
        correctAnswer: 'Three p.m.',
        explanation: 'The receptionist confirmed that check-in is at three p.m.',
      },
    ],
  },
];

export function getListeningByLevel(level: EnglishLevel): ListeningExercise[] {
  return listeningExercises.filter((e) => e.level === level);
}

export function getListeningById(id: string): ListeningExercise | undefined {
  return listeningExercises.find((e) => e.id === id);
}
