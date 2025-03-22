export interface Batch {
    batch_id: number;
    supplier_id: number;
    batch_number: string;
    batch_qr: Buffer;
    total_quantity: number;
    price: number;
    currency_id: number;
    current_rate: number;
    is_deleted: boolean;
}

export interface BatchCreateDTO extends Omit<Batch, 'batch_id' | 'is_deleted'> {}
export interface BatchUpdateDTO extends Batch {}

const dummyBatches: Batch[] = [
    {
        batch_id: 1,
        supplier_id: 1,
        batch_number: 'BATCH-001',
        batch_qr: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
        total_quantity: 100,
        price: 1500.50,
        currency_id: 1,
        current_rate: 31.25,
        is_deleted: false
    },
    {
        batch_id: 2,
        supplier_id: 2,
        batch_number: 'BATCH-002',
        batch_qr: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
        total_quantity: 200,
        price: 2500.75,
        currency_id: 2,
        current_rate: 1.05,
        is_deleted: false
    },
    {
        batch_id: 3,
        supplier_id: 3,
        batch_number: 'BATCH-003',
        batch_qr: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
        total_quantity: 150,
        price: 1800.25,
        currency_id: 1,
        current_rate: 31.45,
        is_deleted: false
    }
];

class BatchService {
    getBatches(): Promise<Batch[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...dummyBatches]);
            }, 500);
        });
    }

    getBatch(id: number): Promise<Batch | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(dummyBatches.find(b => b.batch_id === id));
            }, 500);
        });
    }

    createBatch(batch: BatchCreateDTO): Promise<Batch> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newBatch: Batch = {
                    ...batch,
                    batch_id: Math.max(...dummyBatches.map(b => b.batch_id)) + 1,
                    is_deleted: false
                };
                dummyBatches.push(newBatch);
                resolve(newBatch);
            }, 500);
        });
    }

    updateBatch(batch: BatchUpdateDTO): Promise<Batch> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyBatches.findIndex(b => b.batch_id === batch.batch_id);
                if (index !== -1) {
                    dummyBatches[index] = batch;
                    resolve(batch);
                } else {
                    reject(new Error('Batch not found'));
                }
            }, 500);
        });
    }

    deleteBatch(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = dummyBatches.findIndex(b => b.batch_id === id);
                if (index !== -1) {
                    dummyBatches[index].is_deleted = true;
                    resolve();
                } else {
                    reject(new Error('Batch not found'));
                }
            }, 500);
        });
    }

    deleteBatches(ids: number[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                ids.forEach(id => {
                    const batch = dummyBatches.find(b => b.batch_id === id);
                    if (batch) {
                        batch.is_deleted = true;
                    }
                });
                resolve();
            }, 500);
        });
    }

    importBatches(file: File): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    exportBatches(): Promise<Blob> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const csvContent = 'batch_id,supplier_id,batch_number,total_quantity,price,currency_id,current_rate\n' +
                    dummyBatches
                        .filter(b => !b.is_deleted)
                        .map(b => `${b.batch_id},${b.supplier_id},${b.batch_number},${b.total_quantity},${b.price},${b.currency_id},${b.current_rate}`)
                        .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }
}

export default new BatchService(); 