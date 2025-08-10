

import React, { useState, useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useMarquees } from '../hooks/useMarquees';
import { useAdmins } from '../hooks/useAdmins';
import PostsList from './PostsList';
import ContactAdminModal from './ContactAdminModal';
import AdminFilterDropdown from './AdminFilterDropdown';
import AboutModal from './AboutModal';

interface StudentViewProps {
    onAdminLoginClick: () => void;
}

const INITIAL_POST_COUNT = 5;

const DynamicMarquee: React.FC<{ text: string }> = ({ text }) => {
    const separator = "\u00A0\u00A0•\u00A0\u00A0";

    return (
        <div className="bg-indigo-100 dark:bg-gray-700 shadow-inner overflow-hidden">
            <div className="py-2 relative flex">
                {/* The animation is applied to flex containers that each hold two copies of the text. This ensures a seamless, gapless loop. */}
                <div className="flex-shrink-0 flex items-center animate-marquee">
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 px-6 whitespace-nowrap">{text}{separator}</p>
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 px-6 whitespace-nowrap" aria-hidden="true">{text}{separator}</p>
                </div>
                 {/* This second block is a duplicate to ensure the marquee always covers the full screen width without any visible gaps during animation. */}
                <div className="flex-shrink-0 flex items-center animate-marquee" aria-hidden="true">
                     <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 px-6 whitespace-nowrap">{text}{separator}</p>
                    <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200 px-6 whitespace-nowrap" aria-hidden="true">{text}{separator}</p>
                </div>
            </div>
        </div>
    );
};


const StudentHeader: React.FC<{ onAdminLoginClick: () => void; onContactAdminClick: () => void; onAboutClick: () => void; }> = ({ onAdminLoginClick, onContactAdminClick, onAboutClick }) => (
    <header className="bg-white shadow-md sticky top-0 z-10 dark:bg-gray-800 dark:shadow-slate-700/50">
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">CampusConnect - SDHR</h1>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400 hidden sm:block">Powered by GR Solutions.</p>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4">
                 <button
                    onClick={onAboutClick}
                    className="inline-flex p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="About this site"
                    title="About this site"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                {/* Contact Admin: Icon for mobile, Text for larger screens */}
                <button
                    onClick={onContactAdminClick}
                    className="inline-flex sm:hidden p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Contact Admin"
                    title="Contact Admin"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>
                <button
                    onClick={onContactAdminClick}
                    className="hidden sm:inline-flex items-center px-3 py-2 sm:px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                    Contact Admin
                </button>

                {/* Admin Login: Icon for mobile, Text for larger screens */}
                <button
                    onClick={onAdminLoginClick}
                    className="inline-flex sm:hidden p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Admin Login"
                    title="Admin Login"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
                <button
                    onClick={onAdminLoginClick}
                    className="hidden sm:inline-flex items-center px-3 py-2 sm:px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-indigo-300 dark:hover:bg-gray-600"
                >
                    Admin Login
                </button>
            </div>
        </div>
    </header>
);

const StudentView: React.FC<StudentViewProps> = ({ onAdminLoginClick }) => {
    const { posts } = usePosts();
    const { admins } = useAdmins();
    const { marquees } = useMarquees();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
    
    const activeMarquee = marquees.length > 0 ? marquees[0] : null;

    const handleAdminFilterChange = (adminName: string) => {
        setSelectedAdmins(prev =>
            prev.includes(adminName)
                ? prev.filter(name => name !== adminName)
                : [...prev, adminName]
        );
    };

    const clearAdminFilters = () => {
        setSelectedAdmins([]);
    };

    const filteredPosts = selectedAdmins.length === 0
        ? posts
        : posts.filter(post => selectedAdmins.includes(post.author));
    
    useEffect(() => {
        setVisibleCount(INITIAL_POST_COUNT);
    }, [selectedAdmins]);

    const postsToShow = filteredPosts.slice(0, visibleCount);


    return (
        <div className="bg-gray-50 min-h-screen dark:bg-gray-900 flex flex-col">
            <div>
                <StudentHeader onAdminLoginClick={onAdminLoginClick} onContactAdminClick={() => setIsContactModalOpen(true)} onAboutClick={() => setIsAboutModalOpen(true)} />
                {activeMarquee && <DynamicMarquee text={activeMarquee.text} />}
            </div>
            <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full flex-grow">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Latest Updates</h2>
                    {admins.length > 0 && (
                         <AdminFilterDropdown 
                            admins={admins}
                            selectedAdmins={selectedAdmins}
                            onFilterChange={handleAdminFilterChange}
                            onClearFilters={clearAdminFilters}
                         />
                    )}
                 </div>
                 <div className="mb-6 p-4 rounded-md bg-blue-50 border border-blue-200 dark:bg-gray-800 dark:border-blue-900/50">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Please Note</h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                <p>Maintain discipline. All activity is monitored. Inappropriate comments will lead to an instant block and may result in loss of site access.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <PostsList 
                    posts={postsToShow} 
                    emptyMessage={
                        posts.length > 0 && filteredPosts.length === 0
                            ? {
                                title: "No updates found for the selected filters.",
                                description: "Try adjusting or clearing your filters to see more announcements."
                              }
                            : {
                                title: "No updates have been posted yet.",
                                description: "Check back later for new announcements."
                              }
                    }
                />
                {filteredPosts.length > visibleCount && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setVisibleCount(filteredPosts.length)}
                            className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Show More
                        </button>
                    </div>
                )}
            </main>
            <footer className="text-center py-4 px-4 text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} CampusConnect - SDHR. All Rights Reserved.
            </footer>
            {isContactModalOpen && (
                <ContactAdminModal onClose={() => setIsContactModalOpen(false)} />
            )}
            {isAboutModalOpen && (
                <AboutModal onClose={() => setIsAboutModalOpen(false)} />
            )}
        </div>
    );
};

export default StudentView;