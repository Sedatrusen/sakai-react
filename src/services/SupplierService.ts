import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Supplier {
    supplier_id: number;
    name: string;
    contact_info: string;
    is_deleted: boolean;
}

export interface SupplierCreateDTO {
    name: string;
    contact_info: string;
}

export interface SupplierUpdateDTO extends SupplierCreateDTO {
    supplier_id: number;
}

class SupplierService {
    async getSuppliers(): Promise<Supplier[]> {
        const response = await axios.get(`${API_URL}/suppliers`);
        return response.data;
    }

    async getSupplier(id: number): Promise<Supplier> {
        const response = await axios.get(`${API_URL}/suppliers/${id}`);
        return response.data;
    }

    async createSupplier(supplier: SupplierCreateDTO): Promise<Supplier> {
        const response = await axios.post(`${API_URL}/suppliers`, supplier);
        return response.data;
    }

    async updateSupplier(supplier: SupplierUpdateDTO): Promise<Supplier> {
        const response = await axios.put(`${API_URL}/suppliers/${supplier.supplier_id}`, supplier);
        return response.data;
    }

    async deleteSupplier(id: number): Promise<void> {
        await axios.delete(`${API_URL}/suppliers/${id}`);
    }

    async deleteSuppliers(ids: number[]): Promise<void> {
        await axios.post(`${API_URL}/suppliers/batch-delete`, { ids });
    }

    async importSuppliers(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`${API_URL}/suppliers/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async exportSuppliers(): Promise<Blob> {
        const response = await axios.get(`${API_URL}/suppliers/export`, {
            responseType: 'blob',
        });
        return response.data;
    }
}

export default new SupplierService(); 