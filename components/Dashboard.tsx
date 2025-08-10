

import React, { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import Header from './Header';
import CreatePost from './CreatePost';
import PostsList from './PostsList';
import EditPostModal from './EditPostModal';
import ManageMarquee from './ManageMarquee';
import AdminManagement from './AdminManagement';
import CreateAdminUpdate from './CreateAdminUpdate';
import AdminUpdatesFeed from './AdminUpdatesFeed';
import { Post } from '../types';

const INITIAL_POST_COUNT = 5;

const Dashboard: React.FC = () => {
    const { posts } = usePosts();
    const { isSuperAdmin } = useAuth();
    const [postToEdit, setPostToEdit] = useState<Post | null>(null);
    const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);

    const postsToShow = posts.slice(0, visibleCount);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="max-w-7xl mx-auto p-4 sm:py-6 sm:px-6 lg:px-8 flex-grow w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         <AdminUpdatesFeed />
                         <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Updates Feed</h2>
                            <PostsList 
                                posts={postsToShow} 
                                onEdit={(post) => setPostToEdit(post)}
                                emptyMessage={{
                                    title: "The updates feed is empty.",
                                    description: "Use the 'Create Announcement' form to post an update."
                                }}
                            />
                         </div>
                        {posts.length > visibleCount && (
                            <div className="text-center">
                                <button
                                    onClick={() => setVisibleCount(posts.length)}
                                    className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Show More
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        {isSuperAdmin && <CreateAdminUpdate />}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Create Announcement</h2>
                            <CreatePost />
                        </div>
                         <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Manage Marquee</h2>
                            <ManageMarquee />
                        </div>
                        {isSuperAdmin && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Manage Admins</h2>
                                <AdminManagement />
                            </div>
                        )}
                    </div>
                </div>
            </main>
             <footer className="text-center py-4 px-4 text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} CampusConnect - SDHR. All Rights Reserved.
            </footer>
            {postToEdit && (
                <EditPostModal 
                    post={postToEdit}
                    onClose={() => setPostToEdit(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;