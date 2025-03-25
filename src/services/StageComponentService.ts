import { StageComponent, StageComponentCreateDTO, StageComponentUpdateDTO } from '../types/stage_component';
import stageComponentsData from '../data/stage_components.json';

class StageComponentService {
    private static instance: StageComponentService;
    private stageComponents: StageComponent[] = [];

    private constructor() {
        this.stageComponents = stageComponentsData.stage_components;
    }

    public static getInstance(): StageComponentService {
        if (!StageComponentService.instance) {
            StageComponentService.instance = new StageComponentService();
        }
        return StageComponentService.instance;
    }

    async getStageComponents(): Promise<StageComponent[]> {
        return this.stageComponents.filter(sc => !sc.is_deleted);
    }

    async getStageComponentsByStageId(stageId: number): Promise<StageComponent[]> {
        return this.stageComponents.filter(sc => sc.stage_id === stageId && !sc.is_deleted);
    }

    async getStageComponent(id: number): Promise<StageComponent> {
        const stageComponent = this.stageComponents.find(sc => sc.stage_component_id === id && !sc.is_deleted);
        if (!stageComponent) {
            throw new Error('Stage Component not found');
        }
        return stageComponent;
    }

    async createStageComponent(stageComponent: StageComponentCreateDTO): Promise<StageComponent> {
        const newStageComponent: StageComponent = {
            ...stageComponent,
            stage_component_id: this.getNextId(),
            is_deleted: false
        };
        this.stageComponents.push(newStageComponent);
        return newStageComponent;
    }

    async updateStageComponent(stageComponent: StageComponentUpdateDTO): Promise<StageComponent> {
        const index = this.stageComponents.findIndex(sc => sc.stage_component_id === stageComponent.stage_component_id);
        if (index === -1) {
            throw new Error('Stage Component not found');
        }
        this.stageComponents[index] = {
            ...this.stageComponents[index],
            ...stageComponent
        };
        return this.stageComponents[index];
    }

    async deleteStageComponent(id: number): Promise<void> {
        const index = this.stageComponents.findIndex(sc => sc.stage_component_id === id);
        if (index === -1) {
            throw new Error('Stage Component not found');
        }
        this.stageComponents[index].is_deleted = true;
    }

    async deleteStageComponents(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = this.stageComponents.findIndex(sc => sc.stage_component_id === id);
            if (index !== -1) {
                this.stageComponents[index].is_deleted = true;
            }
        });
    }

    async importStageComponents(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    const rows = text.split('\n').filter(row => row.trim());
                    const headers = rows[0].split(',');
                    
                    const stageComponents: StageComponent[] = rows.slice(1).map(row => {
                        const values = row.split(',');
                        const stageComponent: any = {};
                        headers.forEach((header, index) => {
                            stageComponent[header.trim()] = values[index].trim();
                        });
                        return stageComponent;
                    });

                    this.stageComponents = stageComponents;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    async exportStageComponents(): Promise<Blob> {
        const headers = ['stage_component_id', 'stage_id', 'component_id', 'quantity'];
        const rows = this.stageComponents
            .filter(sc => !sc.is_deleted)
            .map(sc => headers.map(header => sc[header as keyof StageComponent]).join(','));
        
        const csv = [headers.join(','), ...rows].join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }

    private getNextId(): number {
        const maxId = Math.max(...this.stageComponents.map(sc => sc.stage_component_id), 0);
        return maxId + 1;
    }
}

export default StageComponentService.getInstance(); 