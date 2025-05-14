import { LoginCredentials, AuthResponse, User } from '../types/auth';
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = 'http://localhost:8000';

// Create an axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to handle token refresh
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried the request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
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

const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            // Create URLSearchParams to match OAuth2 form data format
            const formData = new URLSearchParams();
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);
            
            const response = await api.post('/users/login', formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            const { access_token, refresh_token } = response.data;
            
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.detail || 'Login failed');
            }
            throw error;
        }
    },

    async getCurrentUser(): Promise<User> {
        try {
            const response = await api.get('/users/me');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.detail || 'Failed to fetch user');
            }
            throw error;
        }
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
};

export default authService;