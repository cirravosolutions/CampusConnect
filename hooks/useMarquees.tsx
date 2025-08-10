import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Marquee } from '../types';
import { marqueesData } from '../data/marquees';

interface MarqueeContextType {
    marquees: Marquee[];
    addMarquee: (text: string) => Promise<void>;
    deleteMarquee: (marqueeId: string) => Promise<void>;
}

const MarqueeContext = createContext<MarqueeContextType | undefined>(undefined);

export const MarqueeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [marquees, setMarquees] = useState<Marquee[]>(marqueesData);

    const addMarquee = useCallback(async (text: string) => {
        if (!text.trim()) {
            throw new Error("Marquee text cannot be empty.");
        }
        const newMarquee: Marquee = {
            id: crypto.randomUUID(),
            text,
            timestamp: new Date().toISOString(),
        };
        // This only updates local state and will be lost on refresh.
        setMarquees(prevMarquees => [newMarquee, ...prevMarquees]);
    }, []);

    const deleteMarquee = useCallback(async (marqueeId: string) => {
        // This only updates local state and will be lost on refresh.
        setMarquees(prevMarquees => prevMarquees.filter(m => m.id !== marqueeId));
    }, []);

    return (
        <MarqueeContext.Provider value={{ marquees, addMarquee, deleteMarquee }}>
            {children}
        </MarqueeContext.Provider>
    );
};

export const useMarquees = (): MarqueeContextType => {
    const context = useContext(MarqueeContext);
    if (context === undefined) {
        throw new Error('useMarquees must be used within a MarqueeProvider');
    }
    return context;
};
