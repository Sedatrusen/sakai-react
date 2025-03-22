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