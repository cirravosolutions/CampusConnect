import React, { useState, useCallback } from 'react';
import { usePosts } from '../hooks/usePosts';
import { usePolls } from '../hooks/usePolls';
import { Media } from '../types';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB - a realistic server limit

const PollCreator: React.FC<{
    question: string;
    setQuestion: (q: string) => void;
    options: string[];
    setOptions: (o: string[]) => void;
    onClose: () => void;
}> = ({ question, setQuestion, options, setOptions, onClose }) => {
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 10) { // Max 10 options
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) { // Min 2 options
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200">Create Poll</h4>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Remove Poll">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div>
                <label htmlFor="poll-question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Poll Question</label>
                <input type="text" id="poll-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="e.g., What's for lunch?" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required={true}/>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input type="text" value={option} onChange={e => handleOptionChange(index, e.target.value)} placeholder={`Option ${index + 1}`} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required={true} />
                        <button type="button" onClick={() => removeOption(index)} disabled={options.length <= 2} className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-red-900/50">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addOption} disabled={options.length >= 10} className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50">
                + Add Option
            </button>
        </div>
    );
};

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<Media[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addPost } = usePosts();
    const { addPoll } = usePolls();
    
    // Poll State
    const [showPollCreator, setShowPollCreator] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);

    const resetPollState = useCallback(() => {
        setShowPollCreator(false);
        setPollQuestion('');
        setPollOptions(['', '']);
    }, []);

    const handleFile = useCallback((files: FileList) => {
        setError('');
        
        Array.from(files).forEach(file => {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setError(`File '${file.name}' exceeds 10MB and will be ignored.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const newMediaItem: Media = {
                    dataUrl: reader.result as string,
                    name: file.name,
                    type: file.type,
                };
                setMedia(currentMedia => [...currentMedia, newMediaItem]);
            };
            reader.onerror = () => setError(`Failed to read file: ${file.name}`);
            reader.readAsDataURL(file);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        
        const isPollDataValid = showPollCreator && pollQuestion.trim() && pollOptions.every(o => o.trim());

        try {
            const newPost = await addPost(title, content, media);

            if (isPollDataValid) {
                await addPoll(newPost.id, pollQuestion.trim(), pollOptions.map(o => o.trim()));
            }

            setSuccess('Announcement created successfully!');
            setTitle('');
            setContent('');
            setMedia([]);
            resetPollState();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create announcement');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
        }
    };

    const handleRemoveMedia = (mediaItem: Media) => {
        setMedia(media.filter(m => m.dataUrl !== mediaItem.dataUrl));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Announcement Title
                    </label>
                    <input
                        type="text"
                        id="post-title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="e.g., Weekly Updates"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Content
                    </label>
                    <textarea
                        id="post-content"
                        rows={5}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        placeholder="Add text for the announcement..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach Media</label>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Note: Server file size limit is 10MB per file.</p>
                    <input
                        id={`file-upload-create`}
                        type="file"
                        multiple
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900/70"
                        onChange={(e) => e.target.files && handleFile(e.target.files)}
                    />
                    {media.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                            {media.map(m => (
                                <div key={m.dataUrl} className="relative group">
                                    {m.type.startsWith('image/') ? (
                                        <img src={m.dataUrl} alt={m.name} className="h-20 w-full object-cover rounded-md" />
                                    ) : (
                                        <div className="h-20 w-full rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" /><path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button type="button" onClick={() => handleRemoveMedia(m)} className="text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <p className="text-xs truncate ... mt-1 dark:text-gray-400" title={m.name}>{m.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Poll Section */}
                 {showPollCreator ? (
                    <PollCreator
                        question={pollQuestion}
                        setQuestion={setPollQuestion}
                        options={pollOptions}
                        setOptions={setPollOptions}
                        onClose={resetPollState}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowPollCreator(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" /></svg>
                        Add Poll
                    </button>
                )}


                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400"
                >
                    {isLoading ? 'Posting...' : 'Post Announcement'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
