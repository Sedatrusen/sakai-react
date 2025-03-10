'use client';

import Layout from '../../layout/layout';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { LanguageProvider } from '../../app/contexts/LanguageContext';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <AuthProvider>
            <LanguageProvider>
                <ProtectedRoute>
                    <Layout>{children}</Layout>
                </ProtectedRoute>
            </LanguageProvider>
        </AuthProvider>
    );
}
