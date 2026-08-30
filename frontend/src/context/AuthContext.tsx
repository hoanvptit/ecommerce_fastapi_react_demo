import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import authService from '../services/auth';
import { AuthContext } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            if (authService.getToken()) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            await authService.login({ username, password });
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };
    const register = async (username: string, email: string, password: string) => {
        console.log('Registering user:', { username, email, password });
        try {
            await authService.register({ username, email, password });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};