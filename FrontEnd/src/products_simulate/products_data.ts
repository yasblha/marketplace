// src/data_product.ts

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    stock_available:number;
    vendor: string;
    price: number;
    images: string[];
}

export const products: Product[] = [
    {
        _id: '1',
        name: 'Graphic Design',
        description: 'Pure honey harvested from organic farms.',
        category: 'English Department',
        stock_available: 10,
        vendor: 'HoneyVendor',
        price: 16.48,
        images: ['/src/assets/outfit1.jpg']
    },
   
];