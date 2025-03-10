'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ROLES } from '../config/permissions';

interface User {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
    name: string;
}

// Test users with permissions
const TEST_USERS = [
    {
        id: '1',
        email: 'admin@test.com',
        password: 'admin123',
        name: 'Admin User',
        roles: ['admin']
    },
    {
        id: '2',
        email: 'viewer@test.com',
        password: 'viewer123',
        name: 'Viewer User',
        roles: ['viewer']
    },
    {
        id: '3',
        email: 'manager@test.com',
        password: 'manager123',
        name: 'Manager User',
        roles: ['manager']
    }
];

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    hasPermission: (permission: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserPermissions(userRoles: string[]): string[] {
    const permissions = new Set<string>();
    
    userRoles.forEach(roleId => {
        const role = ROLES.find(r => r.id === roleId);
        if (role) {
            role.permissions.forEach(permission => permissions.add(permission));
        }
    });

    return Array.from(permissions);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Sadece ilk yüklemede localStorage kontrolü
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    parsedUser.permissions = getUserPermissions(parsedUser.roles);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error reading from localStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const foundUser = TEST_USERS.find(u => u.email === email && u.password === password);
            
            if (!foundUser) {
                throw new Error('Invalid credentials');
            }

            const { password: _, ...userWithoutPassword } = foundUser;
            const userWithPermissions = {
                ...userWithoutPassword,
                permissions: getUserPermissions(userWithoutPassword.roles)
            };
            
            localStorage.setItem('user', JSON.stringify(userWithPermissions));
            setUser(userWithPermissions);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const hasPermission = (permission: string | string[]) => {
        if (!user || !user.permissions) return false;
        
        if (Array.isArray(permission)) {
            return permission.some(p => user.permissions.includes(p));
        }
        return user.permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 