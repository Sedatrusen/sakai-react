export interface Batch {
    batch_id: number;
    product_id: number;
    batch_number: string;
    manufacture_date: Date;
    expiration_date: Date;
    total_quantity: number;
    used_quantity: number;
    remaining_quantity: number;
    price: number;
    is_deleted: boolean;
}

export interface BatchCreateDTO extends Omit<Batch, 'batch_id' | 'is_deleted'> {}
export interface BatchUpdateDTO extends Batch {}

const dummyBatches: Batch[] = [
    {
        batch_id: 1,
        product_id: 1,
        batch_number: 'B001',
        manufacture_date: new Date('2024-01-01'),
        expiration_date: new Date('2025-01-01'),
        total_quantity: 1000,
        used_quantity: 200,
        remaining_quantity: 800,
        price: 150.50,
        is_deleted: false
    },
    {
        batch_id: 2,
        product_id: 2,
        batch_number: 'B002',
        manufacture_date: new Date('2024-02-01'),
        expiration_date: new Date('2025-02-01'),
        total_quantity: 500,
        used_quantity: 100,
        remaining_quantity: 400,
        price: 200.75,
        is_deleted: false
    },
    {
        batch_id: 3,
        product_id: 1,
        batch_number: 'B003',
        manufacture_date: new Date('2024-03-01'),
        expiration_date: new Date('2025-03-01'),
        total_quantity: 750,
        used_quantity: 50,
        remaining_quantity: 700,
        price: 175.25,
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
                const csvContent = 'batch_id,product_id,batch_number,manufacture_date,expiration_date,total_quantity,used_quantity,remaining_quantity,price\n' +
                    dummyBatches
                        .filter(b => !b.is_deleted)
                        .map(b => `${b.batch_id},${b.product_id},${b.batch_number},${b.manufacture_date.toISOString()},${b.expiration_date.toISOString()},${b.total_quantity},${b.used_quantity},${b.remaining_quantity},${b.price}`)
                        .join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }
}

export default new BatchService(); 