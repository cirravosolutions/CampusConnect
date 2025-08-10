import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Comment } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { useBlockedUsers } from './useBlockedUsers';
import { useAuth } from './useAuth';
import { commentsData } from '../data/comments';

interface CommentContextType {
    comments: Comment[];
    getCommentsForPost: (postId: string) => Comment[];
    addComment: (postId: string, authorName: string, content: string) => Promise<void>;
    reportComment: (commentId: string, reporterName: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    unreportComment: (commentId: string) => Promise<void>;
    deleteCommentsForPost: (postId: string) => Promise<void>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [comments, setComments] = useState<Comment[]>(commentsData);
    const { isUserBlocked } = useBlockedUsers();
    const { currentUser } = useAuth();

    const getCommentsForPost = useCallback((postId: string) => {
        return comments.filter(c => c.postId === postId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [comments]);

    const addComment = useCallback(async (postId: string, authorName: string, content: string): Promise<void> => {
        if (!authorName.trim() || !content.trim()) {
            throw new Error("Name and comment cannot be empty.");
        }
        if (isUserBlocked(authorName)) {
            throw new Error(`The user "${authorName}" has been blocked from commenting.`);
        }

        const newComment: Comment = {
            id: crypto.randomUUID(),
            postId,
            authorName: authorName.trim(),
            content: content.trim(),
            timestamp: new Date().toISOString(),
            reports: [],
        };
        
        // This only updates local state and will be lost on refresh.
        setComments(prev => [...prev, newComment]);
        localStorage.setItem(LOCAL_STORAGE_KEYS.COMMENTER_NAME, authorName.trim());

    }, [isUserBlocked]);

    const reportComment = useCallback(async (commentId: string, reporterName: string): Promise<void> => {
        if (!reporterName) {
            throw new Error("You must provide your name in the comment form before reporting.");
        }
        
        // This only updates local state and will be lost on refresh.
        setComments(prev => prev.map(c => 
            c.id === commentId 
                ? { ...c, reports: [...c.reports, reporterName] }
                : c
        ));
    }, []);
    
    const deleteComment = useCallback(async (commentId: string): Promise<void> => {
        if (!currentUser) {
            throw new Error("You must be an admin to delete comments.");
        }
        
        // This only updates local state and will be lost on refresh.
        setComments(prev => prev.filter(c => c.id !== commentId));
    }, [currentUser]);

    const unreportComment = useCallback(async (commentId: string): Promise<void> => {
        if (!currentUser) {
            throw new Error("You must be an admin to clear reports.");
        }
        
        // This only updates local state and will be lost on refresh.
        setComments(prev => prev.map(c => 
            c.id === commentId 
                ? { ...c, reports: [] } 
                : c
        ));
    }, [currentUser]);

    const deleteCommentsForPost = useCallback(async (postId: string) => {
        // This only updates local state and will be lost on refresh.
        setComments(prev => prev.filter(c => c.postId !== postId));
    }, []);
    
    return (
        <CommentContext.Provider value={{ comments, getCommentsForPost, addComment, reportComment, deleteComment, unreportComment, deleteCommentsForPost }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useComments = (): CommentContextType => {
    const context = useContext(CommentContext);
    if (context === undefined) {
        throw new Error('useComments must be used within a CommentProvider');
    }
    return context;
};
