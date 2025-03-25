export interface GeneratedModel {
    generated_model_id: number;
    generated_model_name: string;
    generated_model_info?: string;
    generated_model_type_id: number;
    is_deleted: boolean;
}

export interface GeneratedModelCreateDTO {
    generated_model_name: string;
    generated_model_info?: string;
    generated_model_type_id: number;
}

export interface GeneratedModelUpdateDTO extends GeneratedModelCreateDTO {
    generated_model_id: number;
} 