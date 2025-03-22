import { Component } from '../types/component';
import { Model } from '../types/model';
import componentsData from '../data/component.json';
import modelsData from '../data/models.json';

export interface ComponentCreateDTO {
    name: string;
    description: string;
    component_img: string;
    model_id: number;
    stok_critical_level: number;
    stok_crirical_level_type_id: number;
    optimum_sayi: number;
}

export interface ComponentUpdateDTO extends ComponentCreateDTO {
    component_id: number;
}

class ComponentService {
    private components: Component[] = componentsData.components;
    private models: Model[] = modelsData.models;

    async getComponents(): Promise<Component[]> {
        return this.components.filter(component => !component.is_deleted);
    }

    async getComponent(id: number): Promise<Component> {
        const component = this.components.find(c => c.component_id === id && !c.is_deleted);
        if (!component) {
            throw new Error('Component not found');
        }
        return component;
    }

    async createComponent(component: ComponentCreateDTO): Promise<Component> {
        const newComponent: Component = {
            component_id: Math.max(...this.components.map(c => c.component_id)) + 1,
            ...component,
            is_deleted: false
        };
        this.components.push(newComponent);
        return newComponent;
    }

    async updateComponent(component: ComponentUpdateDTO): Promise<Component> {
        const index = this.components.findIndex(c => c.component_id === component.component_id);
        if (index === -1) {
            throw new Error('Component not found');
        }
        this.components[index] = { ...this.components[index], ...component };
        return this.components[index];
    }

    async deleteComponent(id: number): Promise<void> {
        const index = this.components.findIndex(c => c.component_id === id);
        if (index === -1) {
            throw new Error('Component not found');
        }
        this.components[index].is_deleted = true;
    }

    async deleteComponents(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = this.components.findIndex(c => c.component_id === id);
            if (index !== -1) {
                this.components[index].is_deleted = true;
            }
        });
    }

    async importComponents(file: File): Promise<void> {
        // Mock implementation
        console.log('Importing components from file:', file.name);
    }

    async exportComponents(): Promise<Blob> {
        // Mock implementation
        const csv = this.components
            .filter(c => !c.is_deleted)
            .map(c => `${c.component_id},${c.name},${c.description},${c.component_img},${c.model_id},${c.stok_critical_level},${c.stok_crirical_level_type_id},${c.optimum_sayi}`)
            .join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }

    // İlişkili verileri getirmek için yardımcı metodlar
    async getModels(): Promise<Model[]> {
        return this.models.filter(model => !model.is_deleted);
    }
}

const componentService = new ComponentService();
export default componentService; 