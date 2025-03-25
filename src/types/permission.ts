export type PermissionKey = 
    | 'MOVEMENT_VIEW'
    | 'MOVEMENT_CREATE'
    | 'MOVEMENT_EDIT'
    | 'MOVEMENT_DELETE'
    | 'MOVEMENT_IMPORT'
    | 'MOVEMENT_EXPORT'
    | 'STAGE_COMPONENT_VIEW'
    | 'STAGE_COMPONENT_CREATE'
    | 'STAGE_COMPONENT_EDIT'
    | 'STAGE_COMPONENT_DELETE'
    | 'STAGE_COMPONENT_IMPORT'
    | 'STAGE_COMPONENT_EXPORT'
    | 'STAGE_GENERATED_MODEL_VIEW'
    | 'STAGE_GENERATED_MODEL_CREATE'
    | 'STAGE_GENERATED_MODEL_EDIT'
    | 'STAGE_GENERATED_MODEL_DELETE'
    | 'STAGE_GENERATED_MODEL_IMPORT'
    | 'STAGE_GENERATED_MODEL_EXPORT';

export const PERMISSIONS: Record<PermissionKey, string> = {
    MOVEMENT_VIEW: 'Stok Hareketleri Görüntüleme',
    MOVEMENT_CREATE: 'Stok Hareketi Oluşturma',
    MOVEMENT_EDIT: 'Stok Hareketi Düzenleme',
    MOVEMENT_DELETE: 'Stok Hareketi Silme',
    MOVEMENT_IMPORT: 'Stok Hareketi İçe Aktarma',
    MOVEMENT_EXPORT: 'Stok Hareketi Dışa Aktarma',
    STAGE_COMPONENT_VIEW: 'Aşama Bileşenleri Görüntüleme',
    STAGE_COMPONENT_CREATE: 'Aşama Bileşeni Oluşturma',
    STAGE_COMPONENT_EDIT: 'Aşama Bileşeni Düzenleme',
    STAGE_COMPONENT_DELETE: 'Aşama Bileşeni Silme',
    STAGE_COMPONENT_IMPORT: 'Aşama Bileşeni İçe Aktarma',
    STAGE_COMPONENT_EXPORT: 'Aşama Bileşeni Dışa Aktarma',
    STAGE_GENERATED_MODEL_VIEW: 'Aşama Üretilen Model Görüntüleme',
    STAGE_GENERATED_MODEL_CREATE: 'Aşama Üretilen Model Oluşturma',
    STAGE_GENERATED_MODEL_EDIT: 'Aşama Üretilen Model Düzenleme',
    STAGE_GENERATED_MODEL_DELETE: 'Aşama Üretilen Model Silme',
    STAGE_GENERATED_MODEL_IMPORT: 'Aşama Üretilen Model İçe Aktarma',
    STAGE_GENERATED_MODEL_EXPORT: 'Aşama Üretilen Model Dışa Aktarma'
}; 