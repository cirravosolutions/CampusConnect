import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            // The pre-load script in index.html handles the migration.
            // This just needs to read the result from localStorage.
            const storedTheme = localStorage.getItem('theme');
            // Only if the stored theme is explicitly 'dark', use it.
            if (storedTheme === 'dark') {
                return 'dark';
            }
            // For all other cases ('light', null, invalid), default to light.
            return 'light';
        } catch (error) {
            // If localStorage is inaccessible, default to light.
            return 'light';
        }
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // The class is already set by the pre-load script. This effect keeps
        // the class in sync with React state and handles changes from the toggle button.
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};