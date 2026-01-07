// src/pages/RegisterPage.tsx

import { useState, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import type { AuthFormState } from '../../Types/authInterfaces';
import { Link,  useNavigate } from 'react-router';

// Importar la interfaz

let host = window.location.hostname.includes('localhost') ? 'localhost' : window.location.hostname
const RegisterPage = () => {
    // Usar la interfaz para tipar el estado
    const [formData, setFormData] = useState<AuthFormState>({
        userName: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const PORT = 3000
    const REGISTER_URL = `http://${host}:${PORT}/api/v1/user/register`;

    // Fix: tipar el evento
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Fix: tipar el evento
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await axios.post(REGISTER_URL, formData);

            setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errMsg = err.response?.data?.message || 'Error desconocido al registrar.';
                setError(errMsg);
            } else {
                setError('Ocurrió un error inesperado.');
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Registro de Nuevo Usuario</h2>
                            
                            {/* Mensajes de feedback con alertas de Bootstrap */}
                            {message && (
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            )}
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
                                        value={formData.userName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Contraseña:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Registrarse
                                    </button>
                                </div>
                            </form>
                            <p className="text-center mt-3">
                                ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;