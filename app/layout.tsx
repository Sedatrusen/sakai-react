'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { LanguageProvider } from './contexts/LanguageContext';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { metadata } from './(main)/metadata';
import { AuthProvider } from '../contexts/AuthContext';
export { metadata };

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <AuthProvider>
                        <LayoutProvider>
                            <LanguageProvider>
                                {children}
                            </LanguageProvider>
                        </LayoutProvider>
                    </AuthProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
