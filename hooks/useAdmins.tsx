import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { adminsData } from '../data/admins';

interface AdminContextType {
    admins: User[];
    addAdmin: (user: User) => Promise<void>;
    removeAdmin: (email: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    // Initialize with static data, excluding passwords for security
    const [admins, setAdmins] = useState<User[]>(() => 
       adminsData.map(({ password, ...admin }) => admin)
    );

    const addAdmin = useCallback(async (user: User) => {
        if (!user.name || !user.email || !user.password) {
            throw new Error('Name, email, and password are required.');
        }
        // This only updates local state and will be lost on refresh.
        const { password, ...newUser } = user;
        setAdmins(prev => [...prev, newUser]);
    }, []);
    
    const removeAdmin = useCallback(async (email: string) => {
        // This only updates local state and will be lost on refresh.
        setAdmins(prev => prev.filter(admin => admin.email !== email));
    }, []);

    return (
        <AdminContext.Provider value={{ admins, addAdmin, removeAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmins = (): AdminContextType => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmins must be used within an AdminProvider');
    }
    return context;
};
