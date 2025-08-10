
import React from 'react';
import { useAdminUpdates } from '../hooks/useAdminUpdates';
import { useAuth } from '../hooks/useAuth';
import { AdminUpdate } from '../types';

const AdminUpdateCard: React.FC<{ update: AdminUpdate; onDelete: (id: string) => void; canDelete: boolean }> = ({ update, onDelete, canDelete }) => {
    const date = new Date(update.timestamp);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this internal update?")) {
            onDelete(update.id);
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-sm dark:bg-gray-800 dark:border-yellow-900/50 flex items-start gap-4">
             <div className="flex-shrink-0 mt-1">
                <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">Update from {update.author}</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">
                            {date.toLocaleString()}
                        </p>
                    </div>
                    {canDelete && (
                         <button
                            onClick={handleDelete}
                            className="p-1 rounded-full text-yellow-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
                            title="Delete Update"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{update.content}</p>
            </div>
        </div>
    );
};


const AdminUpdatesFeed: React.FC = () => {
    const { adminUpdates, deleteAdminUpdate } = useAdminUpdates();
    const { isSuperAdmin } = useAuth();
    
    if (adminUpdates.length === 0) {
        return null; // Don't show anything if there are no updates
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 12.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Internal Admin Updates
            </h2>
            <div className="space-y-4">
                {adminUpdates.map(update => (
                    <AdminUpdateCard 
                        key={update.id} 
                        update={update}
                        onDelete={deleteAdminUpdate}
                        canDelete={isSuperAdmin}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminUpdatesFeed;
