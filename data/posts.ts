import { Post } from '../types';

export const postsData: Post[] = [
  {
    id: 'post-1',
    title: 'Welcome to the New CampusConnect!',
    author: 'Girish Yadav',
    content: 'We are thrilled to launch the new CampusConnect portal. This will be your go-to source for all official announcements, updates, and events. Explore the new features and let us know what you think!',
    media: [],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-2',
    title: 'Mid-Term Exam Schedule',
    author: 'Jane Smith',
    content: 'The schedule for the upcoming mid-term examinations has been released. Please find the attached document for details. All students are advised to check their respective dates and timings.',
    media: [
      {
        url: 'https://example.com/exam_schedule.pdf',
        name: 'exam_schedule.pdf',
        type: 'application/pdf',
      },
    ],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-3',
    title: 'Annual Sports Day Photos',
    author: 'Jane Smith',
    content: 'Here are some highlights from our Annual Sports Day. It was a fantastic event with great participation. Congratulations to all the winners!',
    media: [
        {
            url: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=2070&auto=format&fit=crop',
            name: 'sports_day_1.jpg',
            type: 'image/jpeg',
        },
        {
            url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop',
            name: 'sports_day_2.jpg',
            type: 'image/jpeg',
        }
    ],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
