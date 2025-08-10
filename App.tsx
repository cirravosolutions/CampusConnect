import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AdminProvider } from './hooks/useAdmins';
import { PostProvider } from './hooks/usePosts';
import { MarqueeProvider } from './hooks/useMarquees';
import { ThemeProvider } from './hooks/useTheme';
import { CommentProvider } from './hooks/useComments';
import { BlockedUsersProvider } from './hooks/useBlockedUsers';
import { PollProvider } from './hooks/usePolls';
import { AdminUpdateProvider } from './hooks/useAdminUpdates';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentView from './components/StudentView';

const AppContent: React.FC = () => {
    const { currentUser } = useAuth();
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    if (currentUser) {
        return <Dashboard />;
    }

    if (showAdminLogin) {
        return <Login onCancelLogin={() => setShowAdminLogin(false)} />;
    }

    return <StudentView onAdminLoginClick={() => setShowAdminLogin(true)} />;
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BlockedUsersProvider>
                    <AdminProvider>
                        <AdminUpdateProvider>
                             <MarqueeProvider>
                                <PostProvider>
                                    <PollProvider>
                                        <CommentProvider>
                                            <AppContent />
                                        </CommentProvider>
                                    </PollProvider>
                                </PostProvider>
                            </MarqueeProvider>
                        </AdminUpdateProvider>
                    </AdminProvider>
                </BlockedUsersProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
