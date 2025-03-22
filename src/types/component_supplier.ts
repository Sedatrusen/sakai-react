export interface ComponentSupplier {
    component_supplier_id: number;
    component_id: number;
    supplier_id: number;
    component_supply_time: Date;
    is_deleted?: boolean;
} 