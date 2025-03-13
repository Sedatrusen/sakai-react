import { Product } from '../types/product';
import { Supplier } from '../types/supplier';
import { Brand } from '../types/brand';
import { Model } from '../types/model';
import productsData from '../data/products.json';
import suppliersData from '../data/suppliers.json';
import brandsData from '../data/brands.json';
import modelsData from '../data/models.json';

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
    private products: Product[] = productsData.products;
    private suppliers: Supplier[] = suppliersData.suppliers;
    private brands: Brand[] = brandsData.brands;
    private models: Model[] = modelsData.models;

    async getProducts(): Promise<Product[]> {
        return this.products.filter(product => !product.is_deleted);
    }

    async getProduct(id: number): Promise<Product> {
        const product = this.products.find(p => p.product_id === id && !p.is_deleted);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(product: ProductCreateDTO): Promise<Product> {
        const newProduct: Product = {
            product_id: Math.max(...this.products.map(p => p.product_id)) + 1,
            ...product,
            is_deleted: false
        };
        this.products.push(newProduct);
        return newProduct;
    }

    async updateProduct(product: ProductUpdateDTO): Promise<Product> {
        const index = this.products.findIndex(p => p.product_id === product.product_id);
        if (index === -1) {
            throw new Error('Product not found');
        }
        this.products[index] = { ...this.products[index], ...product };
        return this.products[index];
    }

    async deleteProduct(id: number): Promise<void> {
        const index = this.products.findIndex(p => p.product_id === id);
        if (index === -1) {
            throw new Error('Product not found');
        }
        this.products[index].is_deleted = true;
    }

    async deleteProducts(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = this.products.findIndex(p => p.product_id === id);
            if (index !== -1) {
                this.products[index].is_deleted = true;
            }
        });
    }

    async importProducts(file: File): Promise<void> {
        // Mock implementation
        console.log('Importing products from file:', file.name);
    }

    async exportProducts(): Promise<Blob> {
        // Mock implementation
        const csv = this.products
            .filter(p => !p.is_deleted)
            .map(p => `${p.product_id},${p.name},${p.description},${p.supplier_id},${p.brand_id},${p.model_id}`)
            .join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }

    // İlişkili verileri getirmek için yardımcı metodlar
    async getSuppliers(): Promise<Supplier[]> {
        return this.suppliers.filter(supplier => !supplier.is_deleted);
    }

    async getBrands(): Promise<Brand[]> {
        return this.brands.filter(brand => !brand.is_deleted);
    }

    async getModels(): Promise<Model[]> {
        return this.models.filter(model => !model.is_deleted);
    }
}

export default new ProductService(); 