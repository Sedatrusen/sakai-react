'use client';

import React from 'react';
import { Permission, usePermission } from '../../../components/Permission';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

export default function UsersPage() {
    const { checkPermission } = usePermission();

    // Example data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Banned' },
    ];

    const actionTemplate = (rowData: any) => {
        return (
            <div className="flex gap-2">
                <Permission permissionKey="USER_UPDATE">
                    <Button 
                        icon="pi pi-pencil" 
                        className="p-button-rounded p-button-success" 
                        onClick={() => console.log('Edit user:', rowData.id)} 
                    />
                </Permission>

                <Permission permissionKey="USER_DELETE">
                    <Button 
                        icon="pi pi-trash" 
                        className="p-button-rounded p-button-danger" 
                        onClick={() => console.log('Delete user:', rowData.id)} 
                    />
                </Permission>

                <Permission permissionKey="SUSPECT_BANNED_UPDATE">
                    <Button 
                        icon="pi pi-ban" 
                        className="p-button-rounded p-button-warning" 
                        onClick={() => console.log('Ban user:', rowData.id)} 
                    />
                </Permission>
            </div>
        );
    };

    return (
        <div className="p-4">
            <Card>
                <div className="flex justify-content-between align-items-center mb-4">
                    <h2>Users Management</h2>
                    
                    <Permission permissionKey="USER_CREATE">
                        <Button 
                            label="Create User" 
                            icon="pi pi-plus" 
                            onClick={() => console.log('Create new user')} 
                        />
                    </Permission>
                </div>

                {/* Conditional rendering using hook */}
                {checkPermission('USER_VIEW') && (
                    <DataTable value={users} responsiveLayout="scroll">
                        <Column field="name" header="Name" />
                        <Column field="email" header="Email" />
                        <Column field="status" header="Status" />
                        <Column body={actionTemplate} header="Actions" />
                    </DataTable>
                )}
            </Card>
        </div>
    );
} 