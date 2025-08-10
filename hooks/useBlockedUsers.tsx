import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { blockedUsersData } from '../data/blockedUsers';

interface BlockedUsersContextType {
    blockedUsers: string[];
    blockUser: (name: string) => Promise<void>;
    isUserBlocked: (name: string) => boolean;
}

const BlockedUsersContext = createContext<BlockedUsersContextType | undefined>(undefined);

export const BlockedUsersProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [blockedUsers, setBlockedUsers] = useState<string[]>(blockedUsersData);
    const { currentUser } = useAuth();

    const blockUser = useCallback(async (name: string) => {
        if (!currentUser) {
            throw new Error('You must be an admin to block users.');
        }
        if (!name || blockedUsers.map(u => u.toLowerCase()).includes(name.toLowerCase())) return;

        // This only updates local state and will be lost on refresh.
        setBlockedUsers(prev => [...prev, name]);
    }, [currentUser, blockedUsers]);

    const isUserBlocked = useCallback((name: string): boolean => {
        if (!name) return false;
        const lowerCaseName = name.toLowerCase();
        return blockedUsers.some(blocked => blocked.toLowerCase() === lowerCaseName);
    }, [blockedUsers]);

    return (
        <BlockedUsersContext.Provider value={{ blockedUsers, blockUser, isUserBlocked }}>
            {children}
        </BlockedUsersContext.Provider>
    );
};

export const useBlockedUsers = (): BlockedUsersContextType => {
    const context = useContext(BlockedUsersContext);
    if (context === undefined) {
        throw new Error('useBlockedUsers must be used within a BlockedUsersProvider');
    }
    return context;
};
