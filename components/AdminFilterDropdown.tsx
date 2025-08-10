
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface AdminFilterDropdownProps {
    admins: User[];
    selectedAdmins: string[];
    onFilterChange: (adminName: string) => void;
    onClearFilters: () => void;
}

const AdminFilterDropdown: React.FC<AdminFilterDropdownProps> = ({ admins, selectedAdmins, onFilterChange, onClearFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const activeFilterCount = selectedAdmins.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    activeFilterCount > 0 
                        ? 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filter
                {activeFilterCount > 0 && (
                    <span className="ml-2 bg-white text-indigo-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700 z-20">
                    <div className="py-1">
                        <div className="px-4 py-2 flex justify-between items-center border-b dark:border-gray-700">
                             <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filter by Admin</p>
                             {activeFilterCount > 0 && (
                                <button onClick={onClearFilters} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    Clear
                                </button>
                             )}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {admins.map(admin => (
                                <label key={admin.email} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedAdmins.includes(admin.name)}
                                        onChange={() => onFilterChange(admin.name)}
                                    />
                                    <span className="ml-3">{admin.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFilterDropdown;
