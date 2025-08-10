import React, { useState, useEffect } from 'react';

interface ContactAdminModalProps {
    onClose: () => void;
}

const ContactAdminModal: React.FC<ContactAdminModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);
        setSuccess('Your query has been submitted. An admin will get back to you shortly.');
        setEmail('');
        setQuery('');
        
        // Close modal after showing success message
        setTimeout(() => {
            onClose();
        }, 3500);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-6 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">Contact Admin</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {success ? (
                     <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">Query Submitted!</h3>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <p>{success}</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email</label>
                            <input 
                                type="email" 
                                id="contact-email" 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="you@example.com"
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="contact-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description of your query</label>
                            <textarea 
                                id="contact-query" 
                                rows={5} 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                                placeholder="Please describe your question or issue in detail..." 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)} 
                                required
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t dark:border-gray-700">
                             <button type="button" onClick={onClose} className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
                            <button type="submit" disabled={isLoading} className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400">
                                {isLoading ? 'Submitting...' : 'Submit Query'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactAdminModal;