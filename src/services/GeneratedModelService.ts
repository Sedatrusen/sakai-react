import { GeneratedModel, GeneratedModelCreateDTO } from '../types/generated_model';
import generatedModelsData from '../data/generated_models.json';

class GeneratedModelService {
    private static instance: GeneratedModelService;
    private static generatedModels: GeneratedModel[] = generatedModelsData as unknown as GeneratedModel[];

    private constructor() {}

    public static getInstance(): GeneratedModelService {
        if (!GeneratedModelService.instance) {
            GeneratedModelService.instance = new GeneratedModelService();
        }
        return GeneratedModelService.instance;
    }

    public static async getGeneratedModels(): Promise<GeneratedModel[]> {
        return GeneratedModelService.generatedModels.filter(gm => !gm.is_deleted);
    }

    public static async getGeneratedModel(id: number): Promise<GeneratedModel> {
        const generatedModel = GeneratedModelService.generatedModels.find(gm => gm.generated_model_id === id && !gm.is_deleted);
        if (!generatedModel) {
            throw new Error('Generated model not found');
        }
        return generatedModel;
    }

    public static async createGeneratedModel(generatedModel: GeneratedModelCreateDTO): Promise<GeneratedModel> {
        const newGeneratedModel: GeneratedModel = {
            generated_model_id: GeneratedModelService.generatedModels.length + 1,
            generated_model_name: generatedModel.generated_model_name,
            generated_model_info: generatedModel.generated_model_info,
            generated_model_type_id: generatedModel.generated_model_type_id,
            is_deleted: false
        };
        GeneratedModelService.generatedModels.push(newGeneratedModel);
        return newGeneratedModel;
    }

    public static async updateGeneratedModel(generatedModel: GeneratedModel): Promise<GeneratedModel> {
        const index = GeneratedModelService.generatedModels.findIndex(gm => gm.generated_model_id === generatedModel.generated_model_id);
        if (index === -1) {
            throw new Error('Generated model not found');
        }
        GeneratedModelService.generatedModels[index] = {
            ...GeneratedModelService.generatedModels[index],
            generated_model_name: generatedModel.generated_model_name,
            generated_model_info: generatedModel.generated_model_info
        };
        return GeneratedModelService.generatedModels[index];
    }

    public static async deleteGeneratedModel(id: number): Promise<void> {
        const index = GeneratedModelService.generatedModels.findIndex(gm => gm.generated_model_id === id);
        if (index === -1) {
            throw new Error('Generated model not found');
        }
        GeneratedModelService.generatedModels[index].is_deleted = true;
    }

    public static async deleteGeneratedModels(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = GeneratedModelService.generatedModels.findIndex(gm => gm.generated_model_id === id);
            if (index !== -1) {
                GeneratedModelService.generatedModels[index].is_deleted = true;
            }
        });
    }

    public static async importGeneratedModels(file: File): Promise<void> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',');
                
                lines.slice(1).forEach(line => {
                    if (line.trim()) {
                        const values = line.split(',');
                        const generatedModel: GeneratedModelCreateDTO = {
                            generated_model_name: values[1],
                            generated_model_info: values[2],
                            generated_model_type_id: parseInt(values[3])
                        };
                        GeneratedModelService.createGeneratedModel(generatedModel);
                    }
                });
                resolve();
            };
            reader.readAsText(file);
        });
    }

    public static async exportGeneratedModels(): Promise<Blob> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const csvContent = 'generated_model_id,generated_model_name,generated_model_info,generated_model_type_id\n' +
                    GeneratedModelService.generatedModels
                        .filter(gm => !gm.is_deleted)
                        .map(gm => `${gm.generated_model_id},${gm.generated_model_name},${gm.generated_model_info || ''},${gm.generated_model_type_id}`)
                        .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }
}

export default GeneratedModelService; 