import { Poll } from '../types';

export const pollsData: Poll[] = [
  {
    id: 'poll-1',
    postId: 'post-1',
    question: 'How do you like the new portal design?',
    options: [
      { id: 'option-1-1', text: 'Love it!', votes: 15 },
      { id: 'option-1-2', text: 'It\'s okay.', votes: 5 },
      { id: 'option-1-3', text: 'Needs improvement.', votes: 2 },
    ],
  },
];
