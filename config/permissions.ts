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
    },
    {
        code: 'COMPONENT_VIEW',
        name: 'View Components',
        description: 'Can view component list'
    },
    {
        code: 'COMPONENT_CREATE',
        name: 'Create Component',
        description: 'Can create new components'
    },
    {
        code: 'COMPONENT_EDIT',
        name: 'Edit Component',
        description: 'Can edit existing components'
    },
    {
        code: 'COMPONENT_DELETE',
        name: 'Delete Component',
        description: 'Can delete components'
    },
    {
        code: 'COMPONENT_IMPORT',
        name: 'Import Components',
        description: 'Can import components'
    },
    {
        code: 'COMPONENT_EXPORT',
        name: 'Export Components',
        description: 'Can export components'
    },
    {
        code: 'BATCH_COMPONENT_VIEW',
        name: 'View Batch Components',
        description: 'Can view batch component list'
    },
    {
        code: 'BATCH_COMPONENT_CREATE',
        name: 'Create Batch Component',
        description: 'Can create new batch components'
    },
    {
        code: 'BATCH_COMPONENT_EDIT',
        name: 'Edit Batch Component',
        description: 'Can edit existing batch components'
    },
    {
        code: 'BATCH_COMPONENT_DELETE',
        name: 'Delete Batch Component',
        description: 'Can delete batch components'
    },
    {
        code: 'BATCH_COMPONENT_IMPORT',
        name: 'Import Batch Components',
        description: 'Can import batch components'
    },
    {
        code: 'BATCH_COMPONENT_EXPORT',
        name: 'Export Batch Components',
        description: 'Can export batch components'
    },
    {
        code: 'LOCATION_VIEW',
        name: 'View Locations',
        description: 'Can view location list'
    },
    {
        code: 'LOCATION_CREATE',
        name: 'Create Location',
        description: 'Can create new locations'
    },
    {
        code: 'LOCATION_EDIT',
        name: 'Edit Location',
        description: 'Can edit existing locations'
    },
    {
        code: 'LOCATION_DELETE',
        name: 'Delete Location',
        description: 'Can delete locations'
    },
    {
        code: 'LOCATION_IMPORT',
        name: 'Import Locations',
        description: 'Can import locations'
    },
    {
        code: 'LOCATION_EXPORT',
        name: 'Export Locations',
        description: 'Can export locations'
    },
    {
        code: 'STOCK_MOVEMENT_VIEW',
        name: 'View Stock Movements',
        description: 'Can view stock movement list'
    },
    {
        code: 'STOCK_MOVEMENT_CREATE',
        name: 'Create Stock Movement',
        description: 'Can create new stock movements'
    },
    {
        code: 'STOCK_MOVEMENT_EDIT',
        name: 'Edit Stock Movement',
        description: 'Can edit existing stock movements'
    },
    {
        code: 'STOCK_MOVEMENT_DELETE',
        name: 'Delete Stock Movement',
        description: 'Can delete stock movements'
    },
    {
        code: 'STOCK_MOVEMENT_IMPORT',
        name: 'Import Stock Movements',
        description: 'Can import stock movements'
    },
    {
        code: 'STOCK_MOVEMENT_EXPORT',
        name: 'Export Stock Movements',
        description: 'Can export stock movements'
    },
    {
        code: 'STAGE_VIEW',
        name: 'View Stages',
        description: 'Can view stage list'
    },
    {
        code: 'STAGE_CREATE',
        name: 'Create Stage',
        description: 'Can create new stages'
    },
    {
        code: 'STAGE_EDIT',
        name: 'Edit Stage',
        description: 'Can edit existing stages'
    },
    {
        code: 'STAGE_DELETE',
        name: 'Delete Stage',
        description: 'Can delete stages'
    },
    {
        code: 'STAGE_IMPORT',
        name: 'Import Stages',
        description: 'Can import stages'
    },
    {
        code: 'STAGE_EXPORT',
        name: 'Export Stages',
        description: 'Can export stages'
    },
    {
        code: 'STAGE_COMPONENT_VIEW',
        name: 'View Stage Components',
        description: 'Can view stage component list'
    },
    {
        code: 'STAGE_COMPONENT_CREATE',
        name: 'Create Stage Component',
        description: 'Can create new stage components'
    },
    {
        code: 'STAGE_COMPONENT_EDIT',
        name: 'Edit Stage Component',
        description: 'Can edit existing stage components'
    },
    {
        code: 'STAGE_COMPONENT_DELETE',
        name: 'Delete Stage Component',
        description: 'Can delete stage components'
    },
    {
        code: 'STAGE_COMPONENT_IMPORT',
        name: 'Import Stage Components',
        description: 'Can import stage components'
    },
    {
        code: 'STAGE_COMPONENT_EXPORT',
        name: 'Export Stage Components',
        description: 'Can export stage components'
    },
    {
        code: 'STAGE_GENERATED_MODEL_VIEW',
        name: 'View Stage Generated Models',
        description: 'Can view stage generated model list'
    },
    {
        code: 'STAGE_GENERATED_MODEL_CREATE',
        name: 'Create Stage Generated Model',
        description: 'Can create new stage generated models'
    },
    {
        code: 'STAGE_GENERATED_MODEL_EDIT',
        name: 'Edit Stage Generated Model',
        description: 'Can edit existing stage generated models'
    },
    {
        code: 'STAGE_GENERATED_MODEL_DELETE',
        name: 'Delete Stage Generated Model',
        description: 'Can delete stage generated models'
    },
    {
        code: 'STAGE_GENERATED_MODEL_IMPORT',
        name: 'Import Stage Generated Models',
        description: 'Can import stage generated models'
    },
    {
        code: 'STAGE_GENERATED_MODEL_EXPORT',
        name: 'Export Stage Generated Models',
        description: 'Can export stage generated models'
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
            'MACHINE_VIEW', 'MACHINE_CREATE', 'MACHINE_EDIT', 'MACHINE_DELETE', 'MACHINE_IMPORT', 'MACHINE_EXPORT',
            'COMPONENT_VIEW', 'COMPONENT_CREATE', 'COMPONENT_EDIT', 'COMPONENT_DELETE', 'COMPONENT_IMPORT', 'COMPONENT_EXPORT',
            'BATCH_COMPONENT_VIEW', 'BATCH_COMPONENT_CREATE', 'BATCH_COMPONENT_EDIT', 'BATCH_COMPONENT_DELETE', 'BATCH_COMPONENT_IMPORT', 'BATCH_COMPONENT_EXPORT',
            'LOCATION_VIEW', 'LOCATION_CREATE', 'LOCATION_EDIT', 'LOCATION_DELETE', 'LOCATION_IMPORT', 'LOCATION_EXPORT',
            'STOCK_MOVEMENT_VIEW', 'STOCK_MOVEMENT_CREATE', 'STOCK_MOVEMENT_EDIT', 'STOCK_MOVEMENT_DELETE', 'STOCK_MOVEMENT_IMPORT', 'STOCK_MOVEMENT_EXPORT',
            'STAGE_VIEW', 'STAGE_CREATE', 'STAGE_EDIT', 'STAGE_DELETE', 'STAGE_IMPORT', 'STAGE_EXPORT',
            'STAGE_COMPONENT_VIEW', 'STAGE_COMPONENT_CREATE', 'STAGE_COMPONENT_EDIT', 'STAGE_COMPONENT_DELETE', 'STAGE_COMPONENT_IMPORT', 'STAGE_COMPONENT_EXPORT',
            'STAGE_GENERATED_MODEL_VIEW', 'STAGE_GENERATED_MODEL_CREATE', 'STAGE_GENERATED_MODEL_EDIT', 'STAGE_GENERATED_MODEL_DELETE', 'STAGE_GENERATED_MODEL_IMPORT', 'STAGE_GENERATED_MODEL_EXPORT'
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
            'MACHINE_VIEW', 'MACHINE_EDIT', 'MACHINE_IMPORT', 'MACHINE_EXPORT',
            'COMPONENT_VIEW', 'COMPONENT_EDIT', 'COMPONENT_IMPORT', 'COMPONENT_EXPORT',
            'BATCH_COMPONENT_VIEW', 'BATCH_COMPONENT_EDIT', 'BATCH_COMPONENT_IMPORT', 'BATCH_COMPONENT_EXPORT',
            'LOCATION_VIEW', 'LOCATION_EDIT', 'LOCATION_IMPORT', 'LOCATION_EXPORT',
            'STOCK_MOVEMENT_VIEW', 'STOCK_MOVEMENT_CREATE', 'STOCK_MOVEMENT_EDIT', 'STOCK_MOVEMENT_IMPORT', 'STOCK_MOVEMENT_EXPORT',
            'STAGE_VIEW', 'STAGE_EDIT', 'STAGE_IMPORT', 'STAGE_EXPORT',
            'STAGE_COMPONENT_VIEW', 'STAGE_COMPONENT_EDIT', 'STAGE_COMPONENT_IMPORT', 'STAGE_COMPONENT_EXPORT',
            'STAGE_GENERATED_MODEL_VIEW', 'STAGE_GENERATED_MODEL_CREATE', 'STAGE_GENERATED_MODEL_EDIT', 'STAGE_GENERATED_MODEL_IMPORT', 'STAGE_GENERATED_MODEL_EXPORT'
        ]
    },
    {
        id: 'viewer',
        name: 'Viewer',
        permissions: [
            'PRODUCT_VIEW', 'SUPPLIER_VIEW', 'BRAND_VIEW', 'MODEL_VIEW', 
            'BATCH_VIEW', 'MACHINE_VIEW', 'COMPONENT_VIEW', 
            'BATCH_COMPONENT_VIEW', 'LOCATION_VIEW', 'STOCK_MOVEMENT_VIEW',
            'STAGE_VIEW', 'STAGE_COMPONENT_VIEW', 'STAGE_GENERATED_MODEL_VIEW'
        ]
    }
]; 