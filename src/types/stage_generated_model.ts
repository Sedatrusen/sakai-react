export interface StageGeneratedModel {
    stage_generated_model_id: number;
    stage_id: number;
    generated_model_id: number;
    quantity: number;
    is_deleted: boolean;
}

export interface StageGeneratedModelCreateDTO {
    stage_id: number;
    generated_model_id: number;
    quantity: number;
}

export interface StageGeneratedModelUpdateDTO extends StageGeneratedModelCreateDTO {
    stage_generated_model_id: number;
} 