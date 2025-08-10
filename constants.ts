import { User } from './types';

export const DEFAULT_ADMIN: User = {
    name: 'Girish Yadav',
    email: 'yadavgirish406@gmail.com',
    password: '749928',
};

// Only keeping keys for data that remains client-side
export const LOCAL_STORAGE_KEYS = {
    COMMENTER_NAME: 'college_hub_commenter_name',
};
