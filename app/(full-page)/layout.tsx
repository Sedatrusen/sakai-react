'use client';
import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';
import { AuthProvider } from '../../contexts/AuthContext';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'PrimeReact Sakai',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <AuthProvider>
            <React.Fragment>
                {children}
                <AppConfig simple />
            </React.Fragment>
        </AuthProvider>
    );
}
