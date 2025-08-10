
import React, { useState } from 'react';
import { useMarquees } from '../hooks/useMarquees';
import { Marquee } from '../types';

const MarqueeItem: React.FC<{ marquee: Marquee, onDelete: (id: string) => void, isActive: boolean }> = ({ marquee, onDelete, isActive }) => {
    return (
        <li className={`flex items-center justify-between p-3 rounded-md ${isActive ? 'bg-indigo-50 dark:bg-gray-700/80' : 'bg-gray-50 dark:bg-gray-700/40'}`}>
            <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${isActive ? 'font-semibold text-indigo-800 dark:text-indigo-200' : 'text-gray-600 dark:text-gray-300'}`} title={marquee.text}>{marquee.text}</p>
                <p className="text-xs text-gray-400">
                    {new Date(marquee.timestamp).toLocaleString()}
                    {isActive && <span className="ml-2 font-semibold text-green-600 dark:text-green-400">(Active)</span>}
                </p>
            </div>
            <button
                onClick={() => onDelete(marquee.id)}
                className="ml-4 p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
                title="Delete Marquee"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            </button>
        </li>
    );
}

const CreateMarqueeForm: React.FC = () => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addMarquee } = useMarquees();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await addMarquee(text);
            setSuccess('New marquee created. It is now the active announcement.');
            setText('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create marquee');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setError('');
                setSuccess('');
            }, 4000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="marquee-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Marquee Text
                </label>
                <input
                    type="text"
                    id="marquee-text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="e.g., Welcome back, students!"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400"
            >
                {isLoading ? 'Creating...' : 'Set New Marquee'}
            </button>
        </form>
    );
};


const ManageMarquee: React.FC = () => {
    const { marquees, deleteMarquee } = useMarquees();
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 space-y-6">
            <CreateMarqueeForm />
            
            {marquees.length > 0 && (
                <div className="border-t pt-4 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">History (Most Recent First)</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {marquees.map((m, index) => (
                           <MarqueeItem key={m.id} marquee={m} onDelete={deleteMarquee} isActive={index === 0} />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ManageMarquee;
