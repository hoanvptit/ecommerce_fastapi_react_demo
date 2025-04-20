export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category_id: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}