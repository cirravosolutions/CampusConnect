
import React from 'react';
import { Post } from '../types';
import PostCard from './PostCard';

interface PostsListProps {
    posts: Post[];
    onEdit?: (post: Post) => void;
    emptyMessage?: {
        title: string;
        description: string;
    }
}

const PostsList: React.FC<PostsListProps> = ({ posts, emptyMessage, onEdit }) => {
    if (posts.length === 0) {
        return (
            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{emptyMessage?.title || 'No announcements yet.'}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{emptyMessage?.description || 'Create a new post to get started!'}</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard key={post.id} post={post} onEdit={onEdit} />
            ))}
        </div>
    );
};

export default PostsList;