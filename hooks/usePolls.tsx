
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Poll, PollOption } from '../types';
import { pollsData } from '../data/polls';

interface VotedPolls {
    [pollId: string]: string; // pollId -> optionId
}

interface PollContextType {
    polls: Poll[];
    getPollForPost: (postId: string) => Poll | undefined;
    getUserVote: (pollId: string) => string | undefined;
    castVote: (pollId: string, optionId: string) => Promise<void>;
    addPoll: (postId: string, question: string, options: string[]) => Promise<void>;
    deletePollForPost: (postId: string) => Promise<void>;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

const VOTED_POLLS_STORAGE_KEY = 'college_hub_voted_polls';

export const PollProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [polls, setPolls] = useState<Poll[]>(pollsData);
    const [votedPolls, setVotedPolls] = useState<VotedPolls>({});
    
    useEffect(() => {
        // Load user's past votes from local storage
        try {
            const storedVotes = localStorage.getItem(VOTED_POLLS_STORAGE_KEY);
            setVotedPolls(storedVotes ? JSON.parse(storedVotes) : {});
        } catch (error) {
            console.error("Failed to parse voted polls from local storage", error);
            setVotedPolls({});
        }
    }, []);

    const getPollForPost = useCallback((postId: string) => polls.find(p => p.postId === postId), [polls]);
    const getUserVote = useCallback((pollId: string) => votedPolls[pollId], [votedPolls]);

    const persistVotes = (votes: VotedPolls) => {
        localStorage.setItem(VOTED_POLLS_STORAGE_KEY, JSON.stringify(votes));
    };

    const castVote = useCallback(async (pollId: string, optionId: string): Promise<void> => {
        // This only updates local state. Vote counts will reset on refresh.
        setPolls(prevPolls => prevPolls.map(p => {
            if (p.id === pollId) {
                return {
                    ...p,
                    options: p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
                };
            }
            return p;
        }));
        
        // But we persist which option the user voted for.
        const newVotedPolls = { ...votedPolls, [pollId]: optionId };
        setVotedPolls(newVotedPolls);
        persistVotes(newVotedPolls);
    }, [votedPolls]);

    const addPoll = useCallback(async (postId: string, question: string, optionsTexts: string[]) => {
        const newPoll: Poll = {
            id: crypto.randomUUID(),
            postId,
            question,
            options: optionsTexts.map((text): PollOption => ({
                id: crypto.randomUUID(),
                text,
                votes: 0,
            })),
        };
        setPolls(prev => [...prev, newPoll]);
    }, []);

    const deletePollForPost = useCallback(async (postId: string) => {
        setPolls(prev => prev.filter(p => p.postId !== postId));
    }, []);
    
    return (
        <PollContext.Provider value={{ polls, getPollForPost, getUserVote, castVote, addPoll, deletePollForPost }}>
            {children}
        </PollContext.Provider>
    );
};

export const usePolls = (): PollContextType => {
    const context = useContext(PollContext);
    if (context === undefined) throw new Error('usePolls must be used within a PollProvider');
    return context;
};
