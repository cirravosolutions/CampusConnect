
import React, { useState, useEffect } from 'react';
import { useComments } from '../hooks/useComments';
import { useBlockedUsers } from '../hooks/useBlockedUsers';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface AddCommentFormProps {
    postId: string;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { addComment } = useComments();
    const { isUserBlocked } = useBlockedUsers();

    useEffect(() => {
        // Load the user's name from storage to pre-fill the form
        const savedName = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMENTER_NAME);
        if (savedName) {
            setName(savedName);
        }
    }, []);

    const isBlocked = isUserBlocked(name.trim());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isBlocked) {
            setError(`User "${name.trim()}" is blocked from commenting.`);
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await addComment(postId, name, content);
            setContent(''); // Clear content field on success
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post comment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="comment-name" className="sr-only">Your Name</label>
                    <input
                        id="comment-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                <div className="flex-grow-[3]">
                    <label htmlFor="comment-content" className="sr-only">Your Comment</label>
                    <input
                        id="comment-content"
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add a public comment..."
                        className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
            </div>
             {error && <p className="text-sm text-red-500">{error}</p>}
             {isBlocked && !error && <p className="text-sm text-red-500">The name "{name.trim()}" is blocked.</p>}
            <div className="flex justify-end gap-2">
                 <button 
                    type="submit" 
                    disabled={isLoading || isBlocked || !name.trim() || !content.trim()}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 dark:disabled:text-gray-400"
                >
                    {isLoading ? 'Posting...' : 'Comment'}
                </button>
            </div>
        </form>
    );
};

export default AddCommentForm;
