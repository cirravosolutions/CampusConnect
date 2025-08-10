import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { User } from '../types';
import { DEFAULT_ADMIN } from '../constants';
import { adminsData } from '../data/admins';

interface AuthContextType {
    currentUser: User | null;
    isSuperAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_SESSION_KEY = 'college_hub_user_session';

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const admins = useMemo(() => adminsData, []);

    useEffect(() => {
        setIsLoading(true);
        try {
            const sessionData = sessionStorage.getItem(AUTH_SESSION_KEY);
            if (sessionData) {
                const user = JSON.parse(sessionData);
                if (user && user.email) {
                    setCurrentUser(user);
                    setIsSuperAdmin(user.email === DEFAULT_ADMIN.email);
                }
            }
        } catch (error) {
            console.error("Failed to parse session data", error);
            setCurrentUser(null);
            setIsSuperAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        // This is a mock implementation for a static site.
        // In a real app, never handle auth this way on the client.
        const user = admins.find(admin => admin.email === email && admin.password === password);
        
        if (user) {
            const { password, ...userToStore } = user; // Exclude password from stored object
            setCurrentUser(userToStore);
            setIsSuperAdmin(userToStore.email === DEFAULT_ADMIN.email);
            sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(userToStore));
        } else {
            throw new Error('Invalid credentials or server error.');
        }
    }, [admins]);

    const logout = useCallback(async () => {
        setCurrentUser(null);
        setIsSuperAdmin(false);
        sessionStorage.removeItem(AUTH_SESSION_KEY);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-400">Loading Application...</div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isSuperAdmin, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
