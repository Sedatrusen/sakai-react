import { GeneratedModel } from './generated_model';

export interface Stage {
    stage_id: number;
    stage_name: string;
    generated_model_id: number;
    stage_info?: string;
    is_deleted: boolean;
}

export interface StageCreateDTO {
    stage_name: string;
    generated_model_id: number;
    stage_info?: string;
}

export interface StageUpdateDTO extends StageCreateDTO {
    stage_id: number;
} 