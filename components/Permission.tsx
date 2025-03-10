'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PermissionProps {
    permissionKey: string;
    children: ReactNode;
}

export const Permission = ({ permissionKey, children }: PermissionProps) => {
    const { hasPermission } = useAuth();

    if (!hasPermission(permissionKey)) {
        return null;
    }

    return <>{children}</>;
};

// Hook for checking permissions in functions/conditions
export const usePermission = () => {
    const { hasPermission } = useAuth();

    const checkPermission = (permissionKey: string | string[]) => {
        return hasPermission(permissionKey);
    };

    return { checkPermission };
}; 