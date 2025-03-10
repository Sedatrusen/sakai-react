'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string | string[];
    fallback?: ReactNode;
}

const ProtectedRoute = ({ children, roles, fallback = null }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user && !pathname?.startsWith('/auth/')) {
                // Kullanıcı giriş yapmamışsa ve auth sayfasında değilse
                router.replace('/auth/login');
            } else if (user && pathname?.startsWith('/auth/')) {
                // Kullanıcı giriş yapmışsa ve auth sayfasındaysa
                router.replace('/');
            }
        }
    }, [loading, user, pathname, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Auth sayfalarında değilse ve kullanıcı giriş yapmamışsa
    if (!user && !pathname?.startsWith('/auth/')) {
        return null;
    }

    // Rol kontrolü - eğer roles prop'u varsa
    if (roles && user) {
        const hasRequiredRole = Array.isArray(roles)
            ? roles.some(role => user.roles.includes(role))
            : user.roles.includes(roles);

        if (!hasRequiredRole) {
            return fallback;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute; 