
import React from 'react';
import { useComments } from '../hooks/useComments';
import AddCommentForm from './AddCommentForm';
import CommentItem from './CommentItem';

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { getCommentsForPost } = useComments();
    const comments = getCommentsForPost(postId);

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t dark:border-gray-700">
            <AddCommentForm postId={postId} />
            <div className="mt-6 space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
                ) : (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
