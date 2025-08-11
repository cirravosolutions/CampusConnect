import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { User } from '../types';
import { DEFAULT_ADMIN } from '../constants';
import { API_ENDPOINTS } from '../src/config/api';

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
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            if (data.success && data.user) {
                setCurrentUser(data.user);
                setIsSuperAdmin(data.user.email === DEFAULT_ADMIN.email);
                sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(data.user));
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }, []);

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
