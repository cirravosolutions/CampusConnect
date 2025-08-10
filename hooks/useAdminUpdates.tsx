
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AdminUpdate } from '../types';
import { useAuth } from './useAuth';
import { adminUpdatesData } from '../data/adminUpdates';

interface AdminUpdateContextType {
    adminUpdates: AdminUpdate[];
    addAdminUpdate: (content: string) => Promise<void>;
    deleteAdminUpdate: (updateId: string) => Promise<void>;
}

const AdminUpdateContext = createContext<AdminUpdateContextType | undefined>(undefined);

export const AdminUpdateProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [adminUpdates, setAdminUpdates] = useState<AdminUpdate[]>(() => 
        (adminUpdatesData || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
    const { currentUser, isSuperAdmin } = useAuth();


    const addAdminUpdate = useCallback(async (content: string): Promise<void> => {
        if (!isSuperAdmin || !currentUser) {
            throw new Error("You do not have permission to post admin updates.");
        }
        
        const newUpdate: AdminUpdate = {
            id: crypto.randomUUID(),
            author: currentUser.name,
            content,
            timestamp: new Date().toISOString(),
        };

        // This only updates local state and will be lost on refresh.
        // Prepending the new update keeps the list sorted.
        setAdminUpdates(prev => [newUpdate, ...prev]);
    }, [isSuperAdmin, currentUser]);

    const deleteAdminUpdate = useCallback(async (updateId: string): Promise<void> => {
        if (!isSuperAdmin) {
            throw new Error("You do not have permission to delete admin updates.");
        }

        // This only updates local state and will be lost on refresh.
        setAdminUpdates(prev => prev.filter(u => u.id !== updateId));
    }, [isSuperAdmin]);

    return (
        <AdminUpdateContext.Provider value={{ adminUpdates, addAdminUpdate, deleteAdminUpdate }}>
            {children}
        </AdminUpdateContext.Provider>
    );
};

export const useAdminUpdates = (): AdminUpdateContextType => {
    const context = useContext(AdminUpdateContext);
    if (context === undefined) {
        throw new Error('useAdminUpdates must be used within an AdminUpdateProvider');
    }
    return context;
};
