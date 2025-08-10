import { User } from '../types';
import { DEFAULT_ADMIN } from '../constants';

export const adminsData: User[] = [
  { ...DEFAULT_ADMIN },
  { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password123' },
];
