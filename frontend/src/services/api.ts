import axios from 'axios';
import { Product, Category } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    const response = await api.get(`/categories/${categoryId}/products`);
    return response.data;
};