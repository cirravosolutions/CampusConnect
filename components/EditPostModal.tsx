import React, { useState, useCallback, useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { Post, Media } from '../types';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB - A more realistic limit for PHP uploads

interface EditPostModalProps {
    post: Post;
    onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [media, setMedia] = useState<Media[]>(post.media);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updatePost } = usePosts();

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
    
    const handleRemoveMedia = (item: Media) => {
        setMedia(media.filter(m => (m.url || m.dataUrl) !== (item.url || item.dataUrl)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        setIsLoading(true);
        try {
            await updatePost(post.id, { title, content, media });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update post');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg lg:max-w-2xl max-h-full overflow-y-auto dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-6 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Announcement</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="edit-post-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="edit-post-title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    
                    <div>
                        <label htmlFor="edit-post-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                        <textarea id="edit-post-content" rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder="Add text for the announcement..." value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach Media</label>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Note: Server file size limit is 10MB per file.</p>
                        <input id={`edit-file-upload-${post.id}`} type="file" multiple className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-900/50 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900/70" onChange={(e) => e.target.files && handleFile(e.target.files)} />
                        {media.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                                {media.map(m => (
                                    <div key={m.url || m.dataUrl} className="relative group">
                                        {m.type.startsWith('image/') ? (
                                            <img src={m.url || m.dataUrl} alt={m.name} className="h-20 w-full object-cover rounded-md" />
                                        ) : (
                                            <div className="h-20 w-full rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" /><path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" onClick={() => handleRemoveMedia(m)} className="text-white"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                        <p className="text-xs truncate ... mt-1 dark:text-gray-400" title={m.name}>{m.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    
                    <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t dark:border-gray-700">
                         <button type="button" onClick={onClose} className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={isLoading} className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;
