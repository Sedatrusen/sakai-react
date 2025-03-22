import { Supplier } from '../types/supplier';
import { SupplierInfo } from '../types/supplier_info';
import suppliersData from '../data/suppliers.json';
import supplierInfosData from '../data/supplier_info.json';

export interface ContactInfo {
    type: string;
    value: string;
}

export interface SupplierCreateDTO {
    name: string;
    contact_infos?: ContactInfo[];
}

export interface SupplierUpdateDTO extends SupplierCreateDTO {
    supplier_id: number;
}

class SupplierService {
    private suppliers: Supplier[] = suppliersData.suppliers;
    private supplierInfos: SupplierInfo[] = supplierInfosData.supplier_infos;

    async getSuppliers(): Promise<Supplier[]> {
        return this.suppliers.filter(supplier => !supplier.is_deleted);
    }

    async getSupplierInfo(supplierId: number): Promise<SupplierInfo | undefined> {
        return this.supplierInfos.find(info => info.supplier_id === supplierId && !info.is_deleted);
    }

    async getSupplierInfos(supplierId: number): Promise<SupplierInfo[]> {
        return this.supplierInfos.filter(info => info.supplier_id === supplierId && !info.is_deleted);
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
        this.suppliers[index] = { ...this.suppliers[index], ...supplier };
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
        // Mock implementation
        console.log('Importing suppliers from file:', file.name);
    }

    async exportSuppliers(): Promise<Blob> {
        // Mock implementation
        const csv = this.suppliers
            .filter(s => !s.is_deleted)
            .map(s => `${s.supplier_id},${s.name}`)
            .join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }

    async updateSupplierInfo(info: SupplierInfo): Promise<SupplierInfo> {
        const index = this.supplierInfos.findIndex(i => i.supplier_info_id === info.supplier_info_id);
        if (index === -1) {
            throw new Error('Supplier info not found');
        }
        this.supplierInfos[index] = { ...this.supplierInfos[index], ...info };
        return this.supplierInfos[index];
    }

    async deleteSupplierInfo(infoId: number): Promise<void> {
        const index = this.supplierInfos.findIndex(i => i.supplier_info_id === infoId);
        if (index === -1) {
            throw new Error('Supplier info not found');
        }
        this.supplierInfos[index].is_deleted = true;
    }
}

const supplierService = new SupplierService();
export default supplierService; 