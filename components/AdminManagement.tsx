
import React, { useState } from 'react';
import { useAdmins } from '../hooks/useAdmins';
import { DEFAULT_ADMIN } from '../constants';

const AddAdminForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addAdmin } = useAdmins();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await addAdmin({ name, email, password });
            setSuccess('Admin added successfully!');
            setName('');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add admin');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="new-admin-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Admin Name
                </label>
                <input
                    type="text"
                    id="new-admin-name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="new-admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Admin Email
                </label>
                <input
                    type="email"
                    id="new-admin-email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="new-admin-password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                </label>
                <input
                    type="password"
                    id="new-admin-password"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 dark:disabled:bg-gray-400"
            >
                {isLoading ? 'Adding...' : 'Add Admin'}
            </button>
        </form>
    );
};


const AdminList: React.FC = () => {
    const { admins, removeAdmin } = useAdmins();

    const handleRemove = async (email: string, name: string) => {
        if (window.confirm(`Are you sure you want to remove admin "${name}"? This action cannot be undone.`)) {
            try {
                await removeAdmin(email);
            } catch (error) {
                alert(error instanceof Error ? error.message : 'An error occurred.');
            }
        }
    };

    return (
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Existing Admins</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {admins.map(admin => (
                    <li key={admin.email} className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-700/40">
                         <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{admin.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {admin.email}
                                {admin.email === DEFAULT_ADMIN.email && <span className="ml-2 font-semibold text-green-600 dark:text-green-400">(Super Admin)</span>}
                            </p>
                        </div>
                        {admin.email !== DEFAULT_ADMIN.email && (
                            <button
                                onClick={() => handleRemove(admin.email, admin.name)}
                                className="ml-4 p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
                                title="Remove Admin"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

const AdminManagement: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 space-y-6">
            <AddAdminForm />
            
            <div className="border-t pt-4 dark:border-gray-700">
                <AdminList />
            </div>
        </div>
    );
};

export default AdminManagement;
