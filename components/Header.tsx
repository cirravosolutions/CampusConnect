import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { logout, currentUser } = useAuth();

    return (
        <header className="bg-white shadow-md dark:bg-gray-800 dark:shadow-slate-700/50">
            <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">CampusConnect - SDHR</h1>
                    {currentUser && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome, {currentUser.name}</p>}
                </div>
                <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <button
                        onClick={logout}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label="Logout"
                        title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;