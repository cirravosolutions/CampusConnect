import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Post, Media } from '../types';
import { useAuth } from './useAuth';
import { postsData } from '../data/posts';

interface PostContextType {
    posts: Post[];
    addPost: (title: string, content: string, media: Media[]) => Promise<Post>;
    updatePost: (postId: string, updatedData: { title: string; content: string; media: Media[] }) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [posts, setPosts] = useState<Post[]>(postsData);
    const { currentUser } = useAuth();

    const addPost = useCallback(async (title: string, content: string, media: Media[]): Promise<Post> => {
        if (!currentUser?.name) {
            throw new Error("No authenticated user to create a post.");
        }
        if (!title.trim()) {
            throw new Error("Announcement must have a title.");
        }
        if (!content.trim() && media.length === 0) {
            throw new Error("Announcement must have content or a media file.");
        }
        
        const newPost: Post = {
            id: crypto.randomUUID(),
            author: currentUser.name,
            timestamp: new Date().toISOString(),
            title,
            content,
            media
        };

        // This only updates local state and will be lost on refresh.
        setPosts(prevPosts => [newPost, ...prevPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        return newPost;
    }, [currentUser]);

    const updatePost = useCallback(async (postId: string, updatedData: { title: string; content: string; media: Media[] }): Promise<void> => {
         if (!currentUser?.name) {
            throw new Error("No authenticated user to update a post.");
        }
        if (!updatedData.title.trim()) {
            throw new Error("Announcement must have a title.");
        }
        if (!updatedData.content.trim() && updatedData.media.length === 0) {
            throw new Error("Announcement must have content or a media file.");
        }
        
        // This only updates local state and will be lost on refresh.
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId 
                ? { ...p, ...updatedData, timestamp: new Date().toISOString() } 
                : p
        ));
    }, [currentUser]);

    const deletePost = useCallback(async (postId: string): Promise<void> => {
        if (!currentUser) {
            throw new Error("Authentication required to delete posts.");
        }
        
        // This only updates local state and will be lost on refresh.
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));

    }, [currentUser]);


    return (
        <PostContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = (): PostContextType => {
    const context = useContext(PostContext);
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};
