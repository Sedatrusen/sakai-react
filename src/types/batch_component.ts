import { Batch } from './batch';
import { Component } from './component';

export interface BatchComponent {
    batch_component_id: number;
    qr_code: string;
    batch_id: number;
    component_id: number;
    expiration_date: Date;
    total_quantity: number;
    used_quantity: number;
    remaining_quantity: number;
    price: number;
    location_id: number;
    state_id: number;
    is_deleted: boolean;
    displayName?: string;
    
    // İlişkili veriler
    batch?: Batch;
    component?: Component;
}

export interface BatchComponentCreateDTO {
    batch_id: number;
    component_id: number;
    expiration_date: Date;
    total_quantity: number;
    used_quantity: number;
    remaining_quantity: number;
    price: number;
    location_id: number;
    state_id: number;
}

export interface BatchComponentWithRelations extends BatchComponent {
    batch: Batch;
    component: Component;
} 