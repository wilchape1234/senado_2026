export interface User {
    userId: number;
    rolId: number | null;
    userName: string;
    email: string;
    password: string;
}

// src/Types/authInterfaces.ts

// 1. Interfaz para los datos del usuario DESPUÉS de la autenticación
// (Los datos que se guardarán en el estado de React)
export interface AuthUser {
    userId: number;
    rolId: number; // Suponemos que un usuario autenticado siempre tendrá un rol definido
    userName: string;
}

// 2. Interfaz para el valor completo del AuthContext
// Esto resuelve el error de asignación de 'null' en createContext
export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<any>;
    logout: () => void;
}

// 3. Interfaz para el estado de los formularios de registro/login
export interface AuthFormState {
    userName: string;
    email: string;
    password: string;
}