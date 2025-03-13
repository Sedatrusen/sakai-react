import { Model } from '../types/model';
import modelsData from '../data/models.json';

export interface ModelCreateDTO {
    brand_id: number;
    name: string;
    model_name: string;
}

export interface ModelUpdateDTO extends ModelCreateDTO {
    model_id: number;
}

class ModelService {
    private models: Model[] = modelsData.models;

    async getModels(): Promise<Model[]> {
        return this.models.filter(model => !model.is_deleted);
    }

    async getModelsByBrand(brandId: number): Promise<Model[]> {
        return this.models.filter(model => model.brand_id === brandId && !model.is_deleted);
    }

    async getModel(id: number): Promise<Model> {
        const model = this.models.find(m => m.model_id === id && !m.is_deleted);
        if (!model) {
            throw new Error('Model not found');
        }
        return model;
    }

    async createModel(model: ModelCreateDTO): Promise<Model> {
        const newModel: Model = {
            model_id: Math.max(...this.models.map(m => m.model_id)) + 1,
            brand_id: model.brand_id,
            name: model.name,
            is_deleted: false
        };
        this.models.push(newModel);
        return newModel;
    }

    async updateModel(model: ModelUpdateDTO): Promise<Model> {
        const index = this.models.findIndex(m => m.model_id === model.model_id);
        if (index === -1) {
            throw new Error('Model not found');
        }
        this.models[index] = {
            ...this.models[index],
            brand_id: model.brand_id,
            name: model.name
        };
        return this.models[index];
    }

    async deleteModel(id: number): Promise<void> {
        const index = this.models.findIndex(m => m.model_id === id);
        if (index === -1) {
            throw new Error('Model not found');
        }
        this.models[index].is_deleted = true;
    }

    async deleteModels(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = this.models.findIndex(m => m.model_id === id);
            if (index !== -1) {
                this.models[index].is_deleted = true;
            }
        });
    }

    async importModels(file: File): Promise<void> {
        const text = await file.text();
        const rows = text.split('\n').slice(1); // Skip header row
        rows.forEach(row => {
            if (row.trim()) {
                const [brand_id, name] = row.split(',');
                const newModel: Model = {
                    model_id: Math.max(...this.models.map(m => m.model_id)) + 1,
                    brand_id: parseInt(brand_id),
                    name: name.trim(),
                    is_deleted: false
                };
                this.models.push(newModel);
            }
        });
    }

    async exportModels(): Promise<Blob> {
        const csv = [
            ['brand_id', 'name'],
            ...this.models
                .filter(m => !m.is_deleted)
                .map(m => [m.brand_id, m.name])
        ].map(row => row.join(',')).join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }
}

export default new ModelService(); 