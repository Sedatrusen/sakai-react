import { Brand } from '../types/brand';
import brandsData from '../data/brands.json';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface BrandCreateDTO {
    brand_name: string;
}

export interface BrandUpdateDTO extends BrandCreateDTO {
    brand_id: number;
}

class BrandService {
    private brands: Brand[] = brandsData.brands;

    async getBrands(): Promise<Brand[]> {
        return this.brands.filter(brand => !brand.is_deleted);
    }

    async getBrand(id: number): Promise<Brand> {
        const brand = this.brands.find(b => b.brand_id === id && !b.is_deleted);
        if (!brand) {
            throw new Error('Brand not found');
        }
        return brand;
    }

    async createBrand(brand: BrandCreateDTO): Promise<Brand> {
        const newBrand: Brand = {
            brand_id: Math.max(...this.brands.map(b => b.brand_id)) + 1,
            brand_name: brand.brand_name,
            is_deleted: false
        };
        this.brands.push(newBrand);
        return newBrand;
    }

    async updateBrand(brand: BrandUpdateDTO): Promise<Brand> {
        const index = this.brands.findIndex(b => b.brand_id === brand.brand_id);
        if (index === -1) {
            throw new Error('Brand not found');
        }
        this.brands[index] = {
            ...this.brands[index],
            brand_name: brand.brand_name
        };
        return this.brands[index];
    }

    async deleteBrand(id: number): Promise<void> {
        const index = this.brands.findIndex(b => b.brand_id === id);
        if (index === -1) {
            throw new Error('Brand not found');
        }
        this.brands[index].is_deleted = true;
    }

    async deleteBrands(ids: number[]): Promise<void> {
        ids.forEach(id => {
            const index = this.brands.findIndex(b => b.brand_id === id);
            if (index !== -1) {
                this.brands[index].is_deleted = true;
            }
        });
    }

    async importBrands(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csv = e.target?.result as string;
                    const lines = csv.split('\n');
                    const headers = lines[0].split(',');
                    
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        
                        const values = line.split(',');
                        const brand: BrandCreateDTO = {
                            brand_name: values[1]
                        };
                        
                        this.createBrand(brand);
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

    async exportBrands(): Promise<Blob> {
        const csv = this.brands
            .filter(b => !b.is_deleted)
            .map(b => `${b.brand_id},${b.brand_name}`)
            .join('\n');
        return new Blob([csv], { type: 'text/csv' });
    }
}

export default new BrandService(); 