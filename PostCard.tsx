import React, { useState } from 'react';
import { Post, Media } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';
import { useComments } from '../hooks/useComments';
import { useAdmins } from '../hooks/useAdmins';
import { DEFAULT_ADMIN } from '../constants';
import { usePolls } from '../hooks/usePolls';
import CommentSection from './CommentSection';
import PollDisplay from './PollDisplay';

const CONTENT_TRUNCATE_LENGTH = 250;

const MediaGallery: React.FC<{ media: Media[] }> = ({ media }) => {
    if (media.length === 0) return null;
    return (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {media.map((m) => {
                const mediaUrl = m.url || m.dataUrl;
                if (!mediaUrl) return null;
                
                if (m.type.startsWith('image/')) {
                    return (
                        <a key={mediaUrl} href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block">
                            <img src={mediaUrl} alt={m.name} title={m.name} className="rounded-lg object-cover h-40 w-full bg-gray-100 hover:opacity-90 transition-opacity dark:bg-gray-700" />
                        </a>
                    );
                }
                if (m.type.startsWith('video/')) {
                    return (
                        <div key={mediaUrl} className="h-40 w-full">
                             <video controls src={mediaUrl} title={m.name} className="rounded-lg h-full w-full bg-black object-contain">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    );
                }
                return (
                    <a href={mediaUrl} download={m.name} key={mediaUrl} title={`Download ${m.name}`} className="block h-40 w-full p-3 border rounded-md bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm4 10a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2v-2z" clipRule="evenodd" />
                        </svg>
                        <p className="mt-2 text-xs font-medium text-gray-700 truncate w-full dark:text-gray-300">{m.name}</p>
                        <span className="text-xs text-indigo-600 font-semibold dark:text-indigo-400">Download</span>
                    </a>
                );
            })}
        </div>
    );
};


const PostCard: React.FC<{ post: Post; onEdit?: (post: Post) => void }> = ({ post, onEdit }) => {
    const { author, title, content, media, timestamp } = post;
    const { currentUser } = useAuth();
    const { deletePost } = usePosts();
    const { getCommentsForPost } = useComments();
    const { admins } = useAdmins();
    const { getPollForPost } = usePolls();

    const date = new Date(timestamp);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const postAuthorAdmin = admins.find(admin => admin.name === author);
    const isSuperAdminPost = postAuthorAdmin?.email === DEFAULT_ADMIN.email;
    const isAdminPost = !!postAuthorAdmin;

    const authorRingClass = isSuperAdminPost
        ? 'ring-2 ring-offset-2 ring-yellow-400 dark:ring-offset-gray-800'
        : isAdminPost
        ? 'ring-2 ring-offset-2 ring-indigo-400 dark:ring-offset-gray-800'
        : '';


    const hasLongContent = content.length > CONTENT_TRUNCATE_LENGTH;
    const commentsForPost = getCommentsForPost(post.id);
    const pollForPost = getPollForPost(post.id);
    
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to permanently delete the post "${post.title}"? This will also delete all associated comments and polls.`)) {
            setIsDeleting(true);
            try {
                await deletePost(post.id);
            } catch (error) {
                alert(error instanceof Error ? error.message : "Failed to delete post.");
                setIsDeleting(false);
            }
        }
    };


    return (
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 transition-opacity ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 relative">
                            <span className={`inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 ${authorRingClass}`}>
                               <svg className="h-full w-full text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                     {currentUser && onEdit && (
                         <div className="flex items-center space-x-1">
                            <button
                                onClick={() => onEdit(post)}
                                disabled={isDeleting}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                aria-label="Edit post"
                                title="Edit post"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-100 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                aria-label="Delete post"
                                title="Delete post"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                         </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>

                {content && (
                    <div className="mt-3 text-gray-700 dark:text-gray-300 space-y-2">
                        <p className="whitespace-pre-wrap">
                            {hasLongContent && !isExpanded ? `${content.substring(0, CONTENT_TRUNCATE_LENGTH)}...` : content}
                        </p>
                        {hasLongContent && (
                             <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                )}
                
                <MediaGallery media={media} />
            </div>

            {pollForPost && <PollDisplay poll={pollForPost} />}

            <div className="border-t dark:border-gray-700">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="w-full text-left px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700/50"
                >
                   <div className="flex justify-between items-center">
                       <span>{showComments ? 'Hide Comments' : `Show Comments (${commentsForPost.length})`}</span>
                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showComments ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                   </div>
                </button>
                {showComments && <CommentSection postId={post.id} />}
            </div>
        </div>
    );
};

export default PostCard;
