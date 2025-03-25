import { Movement, MovementCreateDTO, MovementType } from '../types/movement';
import movementsData from '../data/movements.json';

class MovementService {
    getMovements(): Promise<Movement[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const movements = movementsData.movements.map(m => ({
                    ...m,
                    movement_type: m.movement_type as MovementType,
                    movement_date: new Date(m.movement_date),
                    created_at: new Date(m.created_at),
                    updated_at: m.updated_at ? new Date(m.updated_at) : undefined
                }));
                resolve(movements);
            }, 500);
        });
    }

    getMovement(id: number): Promise<Movement> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const movement = movementsData.movements.find(m => m.movement_id === id);
                if (movement) {
                    resolve({
                        ...movement,
                        movement_type: movement.movement_type as MovementType,
                        movement_date: new Date(movement.movement_date),
                        created_at: new Date(movement.created_at),
                        updated_at: movement.updated_at ? new Date(movement.updated_at) : undefined
                    });
                } else {
                    reject(new Error('Movement not found'));
                }
            }, 500);
        });
    }

    createMovement(movement: MovementCreateDTO): Promise<Movement> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newMovement: Movement = {
                    ...movement,
                    movement_id: Math.max(...movementsData.movements.map(m => m.movement_id)) + 1,
                    created_at: new Date(),
                    updated_at: undefined
                };
                movementsData.movements.push({
                    ...newMovement,
                    movement_date: newMovement.movement_date.toISOString(),
                    created_at: newMovement.created_at.toISOString(),
                    updated_at: null
                });
                resolve(newMovement);
            }, 500);
        });
    }

    updateMovement(movement: Movement): Promise<Movement> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = movementsData.movements.findIndex(m => m.movement_id === movement.movement_id);
                if (index !== -1) {
                    const updatedMovement = {
                        ...movement,
                        updated_at: new Date()
                    };
                    movementsData.movements[index] = {
                        ...updatedMovement,
                        movement_date: updatedMovement.movement_date.toISOString(),
                        created_at: updatedMovement.created_at.toISOString(),
                        updated_at: null
                    };
                    resolve(updatedMovement);
                } else {
                    reject(new Error('Movement not found'));
                }
            }, 500);
        });
    }

    deleteMovement(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = movementsData.movements.findIndex(m => m.movement_id === id);
                if (index !== -1) {
                    movementsData.movements.splice(index, 1);
                    resolve();
                } else {
                    reject(new Error('Movement not found'));
                }
            }, 500);
        });
    }

    deleteMovements(ids: number[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                movementsData.movements = movementsData.movements.filter(m => !ids.includes(m.movement_id));
                resolve();
            }, 500);
        });
    }

    importMovements(file: File): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // CSV dosyasını işleme mantığı burada olacak
                resolve();
            }, 500);
        });
    }

    exportMovements(): Promise<Blob> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // CSV oluşturma mantığı burada olacak
                const csv = 'movement_id,batch_component_id,serial_number,movement_type,quantity,movement_date,description\n';
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                resolve(blob);
            }, 500);
        });
    }
}

export default new MovementService(); 