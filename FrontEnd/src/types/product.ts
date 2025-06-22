export interface Product {
    id: string | number;
    _id?: string; // Pour la rétrocompatibilité
    name: string;
    description: string;
    category: string;
    brand: string;
    price: number | string;
    sale_price?: number | string | null;
    is_on_sale?: boolean;
    stock_available: number;
    stock_total?: number;
    status?: string;
    images: string[];
    image?: string | string[]; // Pour la compatibilité avec l'ancien format
    created_at?: string;
    updated_at?: string;
    category_id?: number | null;
}

export interface ProductForm {
    name: string;
    description: string;
    category: string;
    brand: string;
    price: string | number;
    stock_available: string | number;
    images?: FileList | File[] | string[];
    status?: string;
    is_on_sale?: boolean;
    sale_price?: string | number | null;
    category_id?: number | null;
}

export interface SearchCriteria {
    name?: string;
    description?: string;
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    onSale?: boolean;
    inStock?: boolean;
}
