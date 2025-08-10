
import React, { useEffect } from 'react';
import { DEFAULT_ADMIN } from '../constants';

interface AboutModalProps {
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <div className="p-6 sticky top-0 bg-white dark:bg-gray-800 z-10 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">About CampusConnect</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        <strong>CampusConnect - SDHR</strong> is a dedicated communication hub designed to streamline announcements and updates within our college community. 
                    </p>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Purpose</h3>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            <li>To provide a single, reliable source for official announcements.</li>
                            <li>To keep students and faculty informed about events, deadlines, and news.</li>
                            <li>To facilitate community engagement through interactive features like polls and comments.</li>
                        </ul>
                    </div>
                     <div className="space-y-2">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Site Administrator</h3>
                         <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-700/50">
                             <div className="flex-shrink-0 relative">
                                <span className={`inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600`}>
                                   <svg className="h-full w-full text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            </div>
                             <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">{DEFAULT_ADMIN.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{DEFAULT_ADMIN.email}</p>
                            </div>
                         </div>
                    </div>
                     <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                        Powered by GR Solutions.
                    </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 text-right">
                    <button type="button" onClick={onClose} className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
