'use client';

import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    };

    if (!user) {
        return (
            <div className="p-4">
                <Card>
                    <h2>Welcome to the App</h2>
                    <p>Please log in to continue</p>
                    <Button label="Go to Login" onClick={() => router.push('/auth/login')} />
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="grid">
                <div className="col-12">
                    <Card>
                        <div className="flex justify-content-between align-items-center">
                            <h2>Welcome, {user.name}!</h2>
                            <Button label="Logout" onClick={handleLogout} severity="danger" />
                        </div>
                        <p className="text-gray-600">Your roles: {user.roles.join(', ')}</p>
                    </Card>
                </div>

                {/* Admin Only Section */}
                <div className="col-12 md:col-4">
                    <ProtectedRoute 
                        roles="admin"
                        fallback={
                            <Card className="surface-ground">
                                <h3>Admin Panel</h3>
                                <p>You need admin access to view this content</p>
                            </Card>
                        }
                    >
                        <Card className="bg-green-100">
                            <h3>Admin Panel</h3>
                            <p>This content is only visible to admins</p>
                            <Button label="Admin Action" className="p-button-success" />
                        </Card>
                    </ProtectedRoute>
                </div>

                {/* Manager Only Section */}
                <div className="col-12 md:col-4">
                    <ProtectedRoute 
                        roles="manager"
                        fallback={
                            <Card className="surface-ground">
                                <h3>Manager Dashboard</h3>
                                <p>You need manager access to view this content</p>
                            </Card>
                        }
                    >
                        <Card className="bg-blue-100">
                            <h3>Manager Dashboard</h3>
                            <p>This content is only visible to managers</p>
                            <Button label="Manager Action" className="p-button-info" />
                        </Card>
                    </ProtectedRoute>
                </div>

                {/* Viewer Section */}
                <div className="col-12 md:col-4">
                    <ProtectedRoute 
                        roles="viewer"
                        fallback={
                            <Card className="surface-ground">
                                <h3>Viewer Content</h3>
                                <p>You need viewer access to view this content</p>
                            </Card>
                        }
                    >
                        <Card className="bg-yellow-100">
                            <h3>Viewer Content</h3>
                            <p>This content is visible to all logged-in users</p>
                            <Button label="View Details" className="p-button-warning" />
                        </Card>
                    </ProtectedRoute>
                </div>
            </div>
        </div>
    );
} 