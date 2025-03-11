import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface Product {
    product_id: number;
    name: string;
    description: string;
    supplier_id: number;
    brand_id: number;
    model_id: number;
    is_deleted: boolean;
}

export interface ProductCreateDTO {
    name: string;
    description: string;
    supplier_id: number;
    brand_id: number;
    model_id: number;
}

export interface ProductUpdateDTO extends ProductCreateDTO {
    product_id: number;
}

class ProductService {
    async getProducts(): Promise<Product[]> {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    }

    async getProduct(id: number): Promise<Product> {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    }

    async createProduct(product: ProductCreateDTO): Promise<Product> {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    }

    async updateProduct(product: ProductUpdateDTO): Promise<Product> {
        const response = await axios.put(`${API_URL}/products/${product.product_id}`, product);
        return response.data;
    }

    async deleteProduct(id: number): Promise<void> {
        await axios.delete(`${API_URL}/products/${id}`);
    }

    async deleteProducts(ids: number[]): Promise<void> {
        await axios.post(`${API_URL}/products/batch-delete`, { ids });
    }

    async importProducts(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`${API_URL}/products/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    async exportProducts(): Promise<Blob> {
        const response = await axios.get(`${API_URL}/products/export`, {
            responseType: 'blob',
        });
        return response.data;
    }
}

export default new ProductService(); 