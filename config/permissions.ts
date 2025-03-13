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
    },
    {
        code: 'SUPPLIER_VIEW',
        name: 'View Suppliers',
        description: 'Can view supplier list'
    },
    {
        code: 'SUPPLIER_CREATE',
        name: 'Create Supplier',
        description: 'Can create new suppliers'
    },
    {
        code: 'SUPPLIER_EDIT',
        name: 'Edit Supplier',
        description: 'Can edit existing suppliers'
    },
    {
        code: 'SUPPLIER_DELETE',
        name: 'Delete Supplier',
        description: 'Can delete suppliers'
    },
    {
        code: 'SUPPLIER_IMPORT',
        name: 'Import Suppliers',
        description: 'Can import suppliers'
    },
    {
        code: 'SUPPLIER_EXPORT',
        name: 'Export Suppliers',
        description: 'Can export suppliers'
    },
    {
        code: 'BRAND_VIEW',
        name: 'View Brands',
        description: 'Can view brand list'
    },
    {
        code: 'BRAND_CREATE',
        name: 'Create Brand',
        description: 'Can create new brands'
    },
    {
        code: 'BRAND_EDIT',
        name: 'Edit Brand',
        description: 'Can edit existing brands'
    },
    {
        code: 'BRAND_DELETE',
        name: 'Delete Brand',
        description: 'Can delete brands'
    },
    {
        code: 'BRAND_IMPORT',
        name: 'Import Brands',
        description: 'Can import brands'
    },
    {
        code: 'BRAND_EXPORT',
        name: 'Export Brands',
        description: 'Can export brands'
    },
    {
        code: 'MODEL_VIEW',
        name: 'View Models',
        description: 'Can view model list'
    },
    {
        code: 'MODEL_CREATE',
        name: 'Create Model',
        description: 'Can create new models'
    },
    {
        code: 'MODEL_EDIT',
        name: 'Edit Model',
        description: 'Can edit existing models'
    },
    {
        code: 'MODEL_DELETE',
        name: 'Delete Model',
        description: 'Can delete models'
    },
    {
        code: 'MODEL_IMPORT',
        name: 'Import Models',
        description: 'Can import models'
    },
    {
        code: 'MODEL_EXPORT',
        name: 'Export Models',
        description: 'Can export models'
    },
    {
        code: 'BATCH_VIEW',
        name: 'View Batches',
        description: 'Can view batch list'
    },
    {
        code: 'BATCH_CREATE',
        name: 'Create Batch',
        description: 'Can create new batches'
    },
    {
        code: 'BATCH_EDIT',
        name: 'Edit Batch',
        description: 'Can edit existing batches'
    },
    {
        code: 'BATCH_DELETE',
        name: 'Delete Batch',
        description: 'Can delete batches'
    },
    {
        code: 'BATCH_IMPORT',
        name: 'Import Batches',
        description: 'Can import batches'
    },
    {
        code: 'BATCH_EXPORT',
        name: 'Export Batches',
        description: 'Can export batches'
    },
    {
        code: 'MACHINE_VIEW',
        name: 'View Machines',
        description: 'Can view machine list'
    },
    {
        code: 'MACHINE_CREATE',
        name: 'Create Machine',
        description: 'Can create new machines'
    },
    {
        code: 'MACHINE_EDIT',
        name: 'Edit Machine',
        description: 'Can edit existing machines'
    },
    {
        code: 'MACHINE_DELETE',
        name: 'Delete Machine',
        description: 'Can delete machines'
    },
    {
        code: 'MACHINE_IMPORT',
        name: 'Import Machines',
        description: 'Can import machines'
    },
    {
        code: 'MACHINE_EXPORT',
        name: 'Export Machines',
        description: 'Can export machines'
    }
];

// Örnek roller - gerçek uygulamada bu API'den gelecek
export const ROLES: Role[] = [
    {
        id: 'admin',
        name: 'Administrator',
        permissions: [
            'PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_EDIT', 'PRODUCT_DELETE', 'PRODUCT_IMPORT', 'PRODUCT_EXPORT',
            'SUPPLIER_VIEW', 'SUPPLIER_CREATE', 'SUPPLIER_EDIT', 'SUPPLIER_DELETE', 'SUPPLIER_IMPORT', 'SUPPLIER_EXPORT',
            'BRAND_VIEW', 'BRAND_CREATE', 'BRAND_EDIT', 'BRAND_DELETE', 'BRAND_IMPORT', 'BRAND_EXPORT',
            'MODEL_VIEW', 'MODEL_CREATE', 'MODEL_EDIT', 'MODEL_DELETE', 'MODEL_IMPORT', 'MODEL_EXPORT',
            'BATCH_VIEW', 'BATCH_CREATE', 'BATCH_EDIT', 'BATCH_DELETE', 'BATCH_IMPORT', 'BATCH_EXPORT',
            'MACHINE_VIEW', 'MACHINE_CREATE', 'MACHINE_EDIT', 'MACHINE_DELETE', 'MACHINE_IMPORT', 'MACHINE_EXPORT'
        ]
    },
    {
        id: 'manager',
        name: 'Manager',
        permissions: [
            'PRODUCT_VIEW', 'PRODUCT_EDIT', 'PRODUCT_IMPORT', 'PRODUCT_EXPORT',
            'SUPPLIER_VIEW', 'SUPPLIER_EDIT', 'SUPPLIER_IMPORT', 'SUPPLIER_EXPORT',
            'BRAND_VIEW', 'BRAND_EDIT', 'BRAND_IMPORT', 'BRAND_EXPORT',
            'MODEL_VIEW', 'MODEL_EDIT', 'MODEL_IMPORT', 'MODEL_EXPORT',
            'BATCH_VIEW', 'BATCH_EDIT', 'BATCH_IMPORT', 'BATCH_EXPORT',
            'MACHINE_VIEW', 'MACHINE_EDIT', 'MACHINE_IMPORT', 'MACHINE_EXPORT'
        ]
    },
    {
        id: 'viewer',
        name: 'Viewer',
        permissions: ['PRODUCT_VIEW', 'SUPPLIER_VIEW', 'BRAND_VIEW', 'MODEL_VIEW', 'BATCH_VIEW', 'MACHINE_VIEW']
    }
]; 