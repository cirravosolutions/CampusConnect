import { Comment } from '../types';

export const commentsData: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorName: 'StudentA',
    content: 'This looks great! Very easy to use.',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    reports: [],
  },
  {
    id: 'comment-2',
    postId: 'post-2',
    authorName: 'StudentB',
    content: 'Thanks for the schedule!',
    timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    reports: [],
  },
  {
    id: 'comment-3',
    postId: 'post-1',
    authorName: 'StudentC',
    content: 'Awesome!',
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    reports: [],
  },
];
