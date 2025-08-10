
import React, { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { useBlockedUsers } from '../hooks/useBlockedUsers';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const { currentUser } = useAuth();
    const { reportComment, deleteComment, unreportComment } = useComments();
    const { blockUser, isUserBlocked } = useBlockedUsers();
    
    const [reportError, setReportError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const commenterName = localStorage.getItem(LOCAL_STORAGE_KEYS.COMMENTER_NAME);
    const hasReported = commenterName ? comment.reports.includes(commenterName) : false;
    const isAuthorBlocked = isUserBlocked(comment.authorName);
    const isReportedByAny = comment.reports.length > 0;
    const date = new Date(comment.timestamp);

    const handleReport = async () => {
        setIsProcessing(true);
        try {
            await reportComment(comment.id, commenterName || '');
        } catch (error) {
            setReportError(error instanceof Error ? error.message : 'Could not report.');
            setTimeout(() => setReportError(''), 3000);
        }
        setIsProcessing(false);
    };

    const handleBlock = async () => {
        if (window.confirm(`Are you sure you want to block "${comment.authorName}"? They will no longer be able to comment.`)) {
            setIsProcessing(true);
            await blockUser(comment.authorName);
            setIsProcessing(false);
        }
    };
    
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to permanently delete this comment by "${comment.authorName}"?`)) {
            setIsProcessing(true);
            await deleteComment(comment.id);
            // Component will unmount, no need to set processing to false.
        }
    };
    
    const handleClearReports = async () => {
        setIsProcessing(true);
        await unreportComment(comment.id);
        setIsProcessing(false);
    };

    return (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </span>
            </div>
            <div className="flex-1">
                <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{comment.authorName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {date.toLocaleDateString()}
                    </span>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>

                <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-xs">
                    {/* Student/User Actions */}
                    {!currentUser && !hasReported && !isAuthorBlocked && (
                         <button disabled={isProcessing} onClick={handleReport} className="font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 disabled:opacity-50">Report</button>
                    )}
                    {!currentUser && hasReported && !isAuthorBlocked && (
                        <span className="font-medium text-yellow-600 dark:text-yellow-500">Reported</span>
                    )}

                    {/* Admin Actions */}
                    {currentUser && (
                        <>
                            {isReportedByAny && !isAuthorBlocked && (
                                <button disabled={isProcessing} onClick={handleClearReports} className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50">Clear Reports</button>
                            )}
                            {!isAuthorBlocked && (
                                 <button disabled={isProcessing} onClick={handleBlock} className="font-medium text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400 disabled:opacity-50">Block User</button>
                            )}
                             <button disabled={isProcessing} onClick={handleDelete} className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 disabled:opacity-50">Delete</button>
                        </>
                    )}
                    
                    {isAuthorBlocked && (
                        <span className="font-bold text-red-600 dark:text-red-500 flex items-center gap-1">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a9 9 0 100 18 9 9 0 000-18zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                             User Blocked
                        </span>
                    )}
                </div>

                {reportError && <p className="text-xs text-red-500 mt-1">{reportError}</p>}

                {currentUser && isReportedByAny && !isAuthorBlocked && (
                    <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.001-1.742 3.001H4.42c-1.522 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        Reported by {comment.reports.length} user{comment.reports.length > 1 ? 's' : ''}.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
