export interface StageComponent {
    stage_component_id: number;
    stage_id: number;
    component_id: number;
    quantity: number;
    is_deleted: boolean;
}

export interface StageComponentCreateDTO {
    stage_component_id?: number;
    stage_id: number;
    component_id: number;
    quantity: number;
}

export interface StageComponentUpdateDTO extends StageComponentCreateDTO {
    stage_component_id: number;
} 