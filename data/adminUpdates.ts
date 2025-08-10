import { AdminUpdate } from '../types';

export const adminUpdatesData: AdminUpdate[] = [
    {
        id: 'admin-update-1',
        author: 'Girish Yadav',
        content: 'Reminder: The quarterly faculty meeting is scheduled for this Friday at 3 PM in the main conference room. Please be on time.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    }
];
