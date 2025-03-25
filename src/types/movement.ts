import { BatchComponent } from './batch_component';

export type MovementType = 'Kullanım' | 'Tüketim' | 'Tedarik' | 'Hurda';

export interface Movement {
    movement_id: number;
    batch_component_id: number;
    serial_number: string;
    movement_type: MovementType;
    quantity: number;
    movement_date: Date;
    description: string;
    created_at: Date;
    updated_at: Date | undefined;
}

export interface MovementCreateDTO {
    movement_id?: number;
    batch_component_id: number;
    serial_number: string;
    movement_type: MovementType;
    quantity: number;
    movement_date: Date;
    description: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface MovementWithRelations extends Movement {
    batch_component: BatchComponent;
} 