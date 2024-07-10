// src/data_product.ts

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
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
        vendor: 'HoneyVendor',
        price: 16.48,
        images: ['/src/assets/outfit1.jpg']
    },
    // {
    //     _id: '2',
    //     name: 'Graphic Design',
    //     description: 'Pure honey harvested from organic farms.',
    //     category: 'English Department',
    //     vendor: 'HoneyVendor',

        
    //     price: 16.48,
    //     images: ['/src/assets/outfit2.jpg']
    // },
    // {
    //     _id: '3',
    //     name: 'Graphic Design',
    //     description: 'Pure honey harvested from organic farms.',
    //     category: 'English Department',
    //     vendor: 'HoneyVendor',
    //     price: 16.48,
    //     images: ['/src/assets/outfit3.jpg']
    // },
    // {
    //     _id: '4',
    //     name: 'Graphic Design',
    //     description: 'Pure honey harvested from organic farms.',
    //     category: 'English Department',
    //     vendor: 'HoneyVendor',
    //     price: 16.48,
    //     images: ['/src/assets/outfit4.jpg']
    // }
];
