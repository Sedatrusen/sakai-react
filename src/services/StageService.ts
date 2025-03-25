import { Stage, StageCreateDTO } from '../types/stage';
import stagesData from '../data/stages.json';

class StageService {
    private static instance: StageService;
    private static stages: Stage[] = stagesData as unknown as Stage[];

    private constructor() {}

    public static getInstance(): StageService {
        if (!StageService.instance) {
            StageService.instance = new StageService();
        }
        return StageService.instance;
    }

    public static async getStages(): Promise<Stage[]> {
        return StageService.stages.filter(s => !s.is_deleted);
    }

    public static async getStage(id: number): Promise<Stage> {
        const stage = StageService.stages.find(s => s.stage_id === id && !s.is_deleted);
        if (!stage) {
            throw new Error('Stage not found');
        }
        return stage;
    }

    public static async createStage(stage: StageCreateDTO): Promise<Stage> {
        const newStage: Stage = {
            stage_id: StageService.stages.length + 1,
            stage_name: stage.stage_name,
            generated_model_id: stage.generated_model_id,
            stage_info: stage.stage_info,
            is_deleted: false
        };
        StageService.stages.push(newStage);
        return newStage;
    }

    public static async updateStage(stage: Stage): Promise<Stage> {
        const index = StageService.stages.findIndex(s => s.stage_id === stage.stage_id);
        if (index === -1) {
            throw new Error('Stage not found');
        }
        StageService.stages[index] = {
            ...StageService.stages[index],
            stage_name: stage.stage_name,
            generated_model_id: stage.generated_model_id,
            stage_info: stage.stage_info
        };
        return StageService.stages[index];
    }

    public static async deleteStage(id: number): Promise<void> {
        const index = StageService.stages.findIndex(s => s.stage_id === id);
        if (index === -1) {
            throw new Error('Stage not found');
        }
        StageService.stages[index].is_deleted = true;
    }

    public static async deleteStages(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = StageService.stages.findIndex(s => s.stage_id === id);
            if (index !== -1) {
                StageService.stages[index].is_deleted = true;
            }
        });
    }

    public static async exportStages(): Promise<Blob> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const csvContent = 'stage_id,stage_name,stage_info,generated_model_id\n' +
                    StageService.stages
                        .filter(s => !s.is_deleted)
                        .map(s => `${s.stage_id},${s.stage_name},${s.stage_info || ''},${s.generated_model_id}`)
                        .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }

    public static async importStages(file: File): Promise<void> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',');
                
                lines.slice(1).forEach(line => {
                    if (line.trim()) {
                        const values = line.split(',');
                        const stage: StageCreateDTO = {
                            stage_name: values[1],
                            stage_info: values[2],
                            generated_model_id: parseInt(values[3])
                        };
                        StageService.createStage(stage);
                    }
                });
                resolve();
            };
            reader.readAsText(file);
        });
    }
}

export default StageService; 