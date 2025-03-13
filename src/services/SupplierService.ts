import { Supplier } from '../types/supplier';
import suppliersData from '../data/suppliers.json';

export interface SupplierCreateDTO {
    name: string;
    contact_info: string;
}

export interface SupplierUpdateDTO extends SupplierCreateDTO {
    supplier_id: number;
}

class SupplierService {
    private suppliers: Supplier[] = suppliersData.suppliers;

    async getSuppliers(): Promise<Supplier[]> {
        return this.suppliers.filter(supplier => !supplier.is_deleted);
    }

    async getSupplier(id: number): Promise<Supplier> {
        const supplier = this.suppliers.find(s => s.supplier_id === id && !s.is_deleted);
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return supplier;
    }

    async createSupplier(supplier: SupplierCreateDTO): Promise<Supplier> {
        const newSupplier: Supplier = {
            supplier_id: Math.max(...this.suppliers.map(s => s.supplier_id)) + 1,
            ...supplier,
            is_deleted: false
        };
        this.suppliers.push(newSupplier);
        return newSupplier;
    }

    async updateSupplier(supplier: SupplierUpdateDTO): Promise<Supplier> {
        const index = this.suppliers.findIndex(s => s.supplier_id === supplier.supplier_id);
        if (index === -1) {
            throw new Error('Supplier not found');
        }
        this.suppliers[index] = {
            ...this.suppliers[index],
            ...supplier
        };
        return this.suppliers[index];
    }

    async deleteSupplier(id: number): Promise<void> {
        const index = this.suppliers.findIndex(s => s.supplier_id === id);
        if (index === -1) {
            throw new Error('Supplier not found');
        }
        this.suppliers[index].is_deleted = true;
    }

    async deleteSuppliers(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = this.suppliers.findIndex(s => s.supplier_id === id);
            if (index !== -1) {
                this.suppliers[index].is_deleted = true;
            }
        });
    }

    async importSuppliers(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csv = e.target?.result as string;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');
                    
                    // Skip header row and process each line
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        
                        const values = line.split(',');
                        const supplier: SupplierCreateDTO = {
                            name: values[1] || '',
                            contact_info: values[2] || ''
                        };
                        
                        this.createSupplier(supplier);
                    }
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    async exportSuppliers(): Promise<Blob> {
        const headers = ['supplier_id', 'name', 'contact_info'];
        const csv = [
            headers.join(','),
            ...this.suppliers
                .filter(s => !s.is_deleted)
                .map(s => [
                    s.supplier_id,
                    s.name,
                    s.contact_info.replace(/\n/g, '; ')
                ].join(','))
        ].join('\n');
        
        return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    }
}

export default new SupplierService(); 