
import React, { useState } from 'react';
import { Poll } from '../types';
import { usePolls } from '../hooks/usePolls';

interface PollDisplayProps {
    poll: Poll;
}

const PollDisplay: React.FC<PollDisplayProps> = ({ poll }) => {
    const { getUserVote, castVote } = usePolls();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const userVote = getUserVote(poll.id);
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    const handleVote = async () => {
        if (!selectedOption) return;
        setIsLoading(true);
        setError('');
        try {
            await castVote(poll.id, selectedOption);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cast vote.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    if (userVote) {
        // Results View
        return (
            <div className="p-4 sm:p-6 border-t dark:border-gray-700">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{poll.question}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Total Votes: {totalVotes}</p>
                <div className="space-y-3">
                    {poll.options.map(option => {
                        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                        const isUserChoice = option.id === userVote;
                        return (
                            <div key={option.id}>
                                <div className="flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span className={isUserChoice ? 'font-bold text-indigo-700 dark:text-indigo-300' : ''}>{option.text}</span>
                                    <span className={isUserChoice ? 'font-bold' : ''}>{percentage.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                                    <div className={`${isUserChoice ? 'bg-indigo-600' : 'bg-gray-400'} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Voting View
    return (
         <div className="p-4 sm:p-6 border-t dark:border-gray-700">
            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{poll.question}</h4>
            <div className="space-y-3 my-4">
                {poll.options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => setSelectedOption(option.id)}
                        className={`w-full text-left p-3 border rounded-lg flex items-center gap-3 transition-colors ${selectedOption === option.id ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500 dark:bg-indigo-900/50 dark:border-indigo-500' : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-700'}`}
                    >
                         <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selectedOption === option.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                           {selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                         </div>
                         <span className="font-medium text-gray-800 dark:text-gray-200">{option.text}</span>
                    </button>
                ))}
            </div>
             {error && <p className="text-sm text-red-500 text-center mb-2">{error}</p>}
            <button
                onClick={handleVote}
                disabled={!selectedOption || isLoading}
                className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 dark:disabled:text-gray-400"
            >
                {isLoading ? 'Voting...' : 'Vote'}
            </button>
        </div>
    );
};

export default PollDisplay;
