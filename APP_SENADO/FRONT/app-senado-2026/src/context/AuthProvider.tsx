// src/context/AuthProvider.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Importamos los tipos corregidos

import { jwtDecode } from 'jwt-decode'; // Para decodificar el token
import type { AuthContextType, AuthUser } from '../Types/authInterfaces';

// Definir el contexto con un valor inicial de 'undefined' (para el hook)
// Esto resuelve el error 2322 (Context not assignable to null)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función auxiliar para configurar Axios con el token
// Fix: Error 7006 (token) -> Tipado explícito
const setAuthHeader = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

const PORT = 3000;
const API_AUTH_ENDPOINT = `http://localhost:${PORT}/api/v1/auth/login`;

// Función para obtener los datos del usuario del payload del JWT
const getAuthUserFromToken = (token: string): AuthUser | null => {
    try {
        // Asegúrate de que el payload coincida con lo que generaste en NestJS
        const payload: { sub: number, username: string, rolId: number } = jwtDecode(token);

        return {
            userId: payload.sub,
            userName: payload.username,
            rolId: payload.rolId,
        };
    } catch (error) {
        console.error("Error decodificando el token:", error);
        return null;
    }
}

// Fix: Error 7031 (children) -> Tipado de las props
export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    // Fix: Error 2345 (User|null) -> Usar AuthUser | null
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(true);

    // --- EFECTO 1: Cargar la sesión al montar el componente ---
    useEffect(() => {
        if (token) {
            setAuthHeader(token);
            const authUser = getAuthUserFromToken(token);

            if (authUser) {
                // Fix: Error 2353 (Objeto literal incorrecto) -> Usamos el AuthUser decodificado
                setUser(authUser);
            } else {
                setToken(null); // Token inválido o expirado, lo limpiamos.
            }
        }
        setIsLoading(false);
    }, []);

    // --- EFECTO 2: Persistencia del Token ---
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setAuthHeader(token);
        } else {
            localStorage.removeItem('token');
            setAuthHeader(null);
        }
    }, [token]);

    // --- FUNCIÓN DE LOGIN ---
    // Fix: Error 7006 (username, password) -> Tipado explícito
    const login = async (username: string, password: string): Promise<any> => {
        const response = await axios.post(API_AUTH_ENDPOINT, {
            username,
            password,
        });

        const newToken: string = response.data.access_token;
        setToken(newToken);

        const authUser = getAuthUserFromToken(newToken);
        if (authUser) {
            // Fix: Error 2345 (Argumento de tipo '{}') -> Usamos el objeto decodificado
            setUser(authUser);
        } else {
            setToken(null);
            throw new Error("Token de sesión inválido después de un login exitoso.");
        }

        return response.data;
    };

    // --- FUNCIÓN DE LOGOUT ---
    const logout = () => {
        setToken(null);
        // Fix: Error 2345 (Argumento de tipo 'null') -> Permitido por el tipo AuthUser | null
        setUser(null);
    };

    if (isLoading) {
        return <div>Cargando sesión...</div>;
    }

    const value: AuthContextType = { user, token, isLoading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook para usar la autenticación (con chequeo de contexto)
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }

    return context;
};