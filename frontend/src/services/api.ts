import axios, { AxiosInstance } from 'axios';
import authService from './auth';
import { Product, Category } from '../types';

const API_URL = 'http://localhost:8000';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried the request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = authService.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to refresh the token
                const response = await axios.post(`${API_URL}/users/refresh`, {
                    refresh_token: refreshToken
                });

                const { access_token, refresh_token } = response.data;

                // Store the new tokens
                localStorage.setItem('token', access_token);
                localStorage.setItem('refreshToken', refresh_token);

                // Update the failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, logout the user
                authService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

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

export default api;