import { BatchComponent, BatchComponentCreateDTO, BatchComponentWithRelations } from '../types/batch_component';
import batchComponentData from '../data/batch_component.json';

// JSON'dan gelen verileri uygun tiplere çeviriyoruz
const dummyBatchComponents: BatchComponent[] = batchComponentData.batch_components.map(bc => ({
    ...bc,
    expiration_date: new Date(bc.expiration_date),
    batch: bc.batch ? {
        ...bc.batch,
        batch_qr: Buffer.from(bc.batch.batch_qr, 'base64'),
        created_at: new Date(bc.batch.created_at)
    } : undefined,
    component: bc.component
}));

class BatchComponentService {
    getBatchComponents(): Promise<BatchComponent[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const components = dummyBatchComponents.map(bc => ({
                    ...bc,
                    displayName: `${bc.batch?.batch_number} - ${bc.component?.name}`
                }));
                resolve([...components]);
            }, 500);
        });
    }

    getBatchComponent(id: number): Promise<BatchComponent | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dummyBatchComponents.find(bc => bc.batch_component_id === id));
            }, 500);
        });
    }

    getBatchComponentsByBatchId(batchId: number): Promise<BatchComponent[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dummyBatchComponents.filter(bc => bc.batch_id === batchId));
            }, 500);
        });
    }

    getBatchComponentsByComponentId(componentId: number): Promise<BatchComponent[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dummyBatchComponents.filter(bc => bc.component_id === componentId));
            }, 500);
        });
    }

    createBatchComponent(batchComponent: BatchComponentCreateDTO): Promise<BatchComponent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newBatchComponent: BatchComponent = {
                    ...batchComponent,
                    batch_component_id: Math.max(...dummyBatchComponents.map(bc => bc.batch_component_id)) + 1,
                    qr_code: `BC${String(Math.max(...dummyBatchComponents.map(bc => bc.batch_component_id)) + 1).padStart(3, '0')}-QR`,
                    is_deleted: false
                };
                dummyBatchComponents.push(newBatchComponent);
                resolve(newBatchComponent);
            }, 500);
        });
    }

    updateBatchComponent(batchComponent: BatchComponent): Promise<BatchComponent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyBatchComponents.findIndex(bc => bc.batch_component_id === batchComponent.batch_component_id);
                if (index !== -1) {
                    dummyBatchComponents[index] = batchComponent;
                    resolve(batchComponent);
                } else {
                    reject(new Error('Batch Component not found'));
                }
            }, 500);
        });
    }

    deleteBatchComponent(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyBatchComponents.findIndex(bc => bc.batch_component_id === id);
                if (index !== -1) {
                    dummyBatchComponents[index].is_deleted = true;
                    resolve();
                } else {
                    reject(new Error('Batch Component not found'));
                }
            }, 500);
        });
    }

    deleteBatchComponents(ids: number[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                ids.forEach(id => {
                    const batchComponent = dummyBatchComponents.find(bc => bc.batch_component_id === id);
                    if (batchComponent) {
                        batchComponent.is_deleted = true;
                    }
                });
                resolve();
            }, 500);
        });
    }

    updateBatchComponentQuantity(id: number, usedQuantity: number): Promise<BatchComponent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const batchComponent = dummyBatchComponents.find(bc => bc.batch_component_id === id);
                if (batchComponent) {
                    batchComponent.used_quantity = usedQuantity;
                    batchComponent.remaining_quantity = batchComponent.total_quantity - usedQuantity;
                    resolve(batchComponent);
                } else {
                    reject(new Error('Batch Component not found'));
                }
            }, 500);
        });
    }

    updateBatchComponentLocation(id: number, locationId: number): Promise<BatchComponent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const batchComponent = dummyBatchComponents.find(bc => bc.batch_component_id === id);
                if (batchComponent) {
                    batchComponent.location_id = locationId;
                    resolve(batchComponent);
                } else {
                    reject(new Error('Batch Component not found'));
                }
            }, 500);
        });
    }

    updateBatchComponentState(id: number, stateId: number): Promise<BatchComponent> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const batchComponent = dummyBatchComponents.find(bc => bc.batch_component_id === id);
                if (batchComponent) {
                    batchComponent.state_id = stateId;
                    resolve(batchComponent);
                } else {
                    reject(new Error('Batch Component not found'));
                }
            }, 500);
        });
    }

    importBatchComponents(file: File): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    exportBatchComponents(): Promise<Blob> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const csvContent = 'batch_component_id,qr_code,batch_id,component_id,expiration_date,total_quantity,used_quantity,remaining_quantity,price,location_id,state_id\n' +
                    dummyBatchComponents
                        .filter(bc => !bc.is_deleted)
                        .map(bc => `${bc.batch_component_id},${bc.qr_code},${bc.batch_id},${bc.component_id},${bc.expiration_date},${bc.total_quantity},${bc.used_quantity},${bc.remaining_quantity},${bc.price},${bc.location_id},${bc.state_id}`)
                        .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }
}

export default new BatchComponentService(); 