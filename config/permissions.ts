export interface Permission {
    code: string;
    name: string;
    description: string;
}

export interface Role {
    id: string;
    name: string;
    permissions: string[];  // permission codes
}

// Örnek izinler - gerçek uygulamada bu API'den gelecek
export const PERMISSIONS: Permission[] = [
    {
        code: 'PRODUCT_VIEW',
        name: 'View Products',
        description: 'Can view product list'
    },
    {
        code: 'PRODUCT_CREATE',
        name: 'Create Product',
        description: 'Can create new products'
    },
    {
        code: 'PRODUCT_EDIT',
        name: 'Edit Product',
        description: 'Can edit existing products'
    },
    {
        code: 'PRODUCT_DELETE',
        name: 'Delete Product',
        description: 'Can delete products'
    },
    {
        code: 'PRODUCT_IMPORT',
        name: 'Import Products',
        description: 'Can import products'
    },
    {
        code: 'PRODUCT_EXPORT',
        name: 'Export Products',
        description: 'Can export products'
    }
];

// Örnek roller - gerçek uygulamada bu API'den gelecek
export const ROLES: Role[] = [
    {
        id: 'admin',
        name: 'Administrator',
        permissions: ['PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_EDIT', 'PRODUCT_DELETE', 'PRODUCT_IMPORT', 'PRODUCT_EXPORT']
    },
    {
        id: 'manager',
        name: 'Manager',
        permissions: ['PRODUCT_VIEW', 'PRODUCT_EDIT', 'PRODUCT_IMPORT', 'PRODUCT_EXPORT']
    },
    {
        id: 'viewer',
        name: 'Viewer',
        permissions: ['PRODUCT_VIEW']
    }
]; 