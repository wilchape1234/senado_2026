// src/pages/LoginPage.tsx

import  { useState, type ChangeEvent, type FormEvent,  } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthProvider';
import { Link, useNavigate } from 'react-router';

const LoginPage = () => {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); 
    const navigate = useNavigate();

    // Fix: tipar el evento
    const handleSubmit = async (e: FormEvent) => { 
        e.preventDefault();
        setError('');

        try {
            await login(userName, password); 
            navigate('/', { replace: true });
        } catch (error) {
            // Manejo seguro de errores de Axios
            if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                setError('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.');
            } else {
                setError('Ocurrió un error al intentar iniciar sesión.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
                            
                            {/* Mensaje de error con alerta de Bootstrap */}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="userName" className="form-label">Usuario:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userName"
                                        value={userName}
                                        // Fix: tipar el evento de cambio
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Contraseña:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        // Fix: tipar el evento de cambio
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success">
                                        Entrar
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mt-3">
                                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;