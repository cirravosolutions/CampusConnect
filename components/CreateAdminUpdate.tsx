
import React, { useState } from 'react';
import { useAdminUpdates } from '../hooks/useAdminUpdates';

const CreateAdminUpdate: React.FC = () => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addAdminUpdate } = useAdminUpdates();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await addAdminUpdate(content);
            setSuccess('Update posted successfully!');
            setContent('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to post update.');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:border-yellow-900/50">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-4">Post Update for Admins</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="admin-update-content" className="sr-only">Update Content</label>
                    <textarea
                        id="admin-update-content"
                        rows={4}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="Write an internal update for faculty and admins..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-400 dark:bg-yellow-700 dark:hover:bg-yellow-600 dark:disabled:bg-yellow-500"
                >
                    {isLoading ? 'Posting...' : 'Post Internal Update'}
                </button>
            </form>
        </div>
    );
};

export default CreateAdminUpdate;
