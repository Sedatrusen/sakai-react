import { StageGeneratedModel, StageGeneratedModelCreateDTO } from '../types/stage_generated_model';
import stageGeneratedModelsData from '../data/stage_generated_models.json';

class StageGeneratedModelService {
    private static instance: StageGeneratedModelService;
    private static stageGeneratedModels: StageGeneratedModel[] = stageGeneratedModelsData as unknown as StageGeneratedModel[];

    private constructor() {}

    public static getInstance(): StageGeneratedModelService {
        if (!StageGeneratedModelService.instance) {
            StageGeneratedModelService.instance = new StageGeneratedModelService();
        }
        return StageGeneratedModelService.instance;
    }

    public static async getStageGeneratedModels(): Promise<StageGeneratedModel[]> {
        return StageGeneratedModelService.stageGeneratedModels.filter(sgm => !sgm.is_deleted);
    }

    public static async getStageGeneratedModel(id: number): Promise<StageGeneratedModel> {
        const stageGeneratedModel = StageGeneratedModelService.stageGeneratedModels.find(sgm => sgm.stage_generated_model_id === id && !sgm.is_deleted);
        if (!stageGeneratedModel) {
            throw new Error('Stage generated model not found');
        }
        return stageGeneratedModel;
    }

    public static async createStageGeneratedModel(stageGeneratedModel: StageGeneratedModelCreateDTO): Promise<StageGeneratedModel> {
        const newStageGeneratedModel: StageGeneratedModel = {
            stage_generated_model_id: StageGeneratedModelService.stageGeneratedModels.length + 1,
            stage_id: stageGeneratedModel.stage_id,
            generated_model_id: stageGeneratedModel.generated_model_id,
            quantity: stageGeneratedModel.quantity,
            is_deleted: false
        };
        StageGeneratedModelService.stageGeneratedModels.push(newStageGeneratedModel);
        return newStageGeneratedModel;
    }

    public static async updateStageGeneratedModel(stageGeneratedModel: StageGeneratedModel): Promise<StageGeneratedModel> {
        const index = StageGeneratedModelService.stageGeneratedModels.findIndex(sgm => sgm.stage_generated_model_id === stageGeneratedModel.stage_generated_model_id);
        if (index === -1) {
            throw new Error('Stage generated model not found');
        }
        StageGeneratedModelService.stageGeneratedModels[index] = {
            ...StageGeneratedModelService.stageGeneratedModels[index],
            stage_id: stageGeneratedModel.stage_id,
            generated_model_id: stageGeneratedModel.generated_model_id,
            quantity: stageGeneratedModel.quantity
        };
        return StageGeneratedModelService.stageGeneratedModels[index];
    }

    public static async deleteStageGeneratedModel(id: number): Promise<void> {
        const index = StageGeneratedModelService.stageGeneratedModels.findIndex(sgm => sgm.stage_generated_model_id === id);
        if (index === -1) {
            throw new Error('Stage generated model not found');
        }
        StageGeneratedModelService.stageGeneratedModels[index].is_deleted = true;
    }

    public static async deleteStageGeneratedModels(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = StageGeneratedModelService.stageGeneratedModels.findIndex(sgm => sgm.stage_generated_model_id === id);
            if (index !== -1) {
                StageGeneratedModelService.stageGeneratedModels[index].is_deleted = true;
            }
        });
    }

    public static async exportStageGeneratedModels(): Promise<Blob> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const csvContent = 'stage_generated_model_id,stage_id,generated_model_id,quantity\n' +
                    StageGeneratedModelService.stageGeneratedModels
                        .filter(sgm => !sgm.is_deleted)
                        .map(sgm => `${sgm.stage_generated_model_id},${sgm.stage_id},${sgm.generated_model_id},${sgm.quantity}`)
                        .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }

    public static async importStageGeneratedModels(file: File): Promise<void> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',');
                
                lines.slice(1).forEach(line => {
                    if (line.trim()) {
                        const values = line.split(',');
                        const stageGeneratedModel: StageGeneratedModelCreateDTO = {
                            stage_id: parseInt(values[1]),
                            generated_model_id: parseInt(values[2]),
                            quantity: parseInt(values[3])
                        };
                        StageGeneratedModelService.createStageGeneratedModel(stageGeneratedModel);
                    }
                });
                resolve();
            };
            reader.readAsText(file);
        });
    }
}

export default StageGeneratedModelService; 