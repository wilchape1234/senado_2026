// src/Pages/Auth/AuthComponents.tsx
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthProvider";

// Define a dónde va cada rol cuando hace login
export const getDashboardPathByRolId = (rolId: number): string => {
  switch (rolId) {
    case 1: // Super-Admin
    case 2: // Admin
      return '/registro-votacion/ver'; 
    case 3: // Supervisor
      return '/registro-votacion/ver'; 
    case 4: // Estándar
    default:
      return '/inicio';
  }
};

// Componente: Redirecciona si YA estás logueado (para Login/Register)
export const PublicRouteGuard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) return null; // O un spinner

    if (user) {
        return <Navigate to={getDashboardPathByRolId(user.rolId)} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

// Componente: Protege rutas privadas
export const ProtectedRoute: React.FC<React.PropsWithChildren<{ allowedRoles?: number[] }>> = ({ allowedRoles, children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div>Cargando...</div>;

    // 1. Si no hay usuario, mandar a Login guardando la ubicación intento
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Si hay usuario pero no tiene el rol
    if (allowedRoles && !allowedRoles.includes(user.rolId)) {
        return <Unauthorized />;
    }

    return children ? <>{children}</> : <Outlet />; 
};

export const Unauthorized = () => (
    <div className="container mt-5 text-center">
        <div className="alert alert-danger shadow-sm">
            <h2 className="alert-heading">🚫 Acceso Restringido</h2>
            <p>No tienes los permisos necesarios (Rol insuficiente) para ver esta sección.</p>
            <Link to="/inicio" className="btn btn-outline-danger mt-2">Volver al Inicio</Link>
        </div>
    </div>
);

// Placeholder para redirigir la raíz "/"
export const DashboardRedirector: React.FC = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to={getDashboardPathByRolId(user.rolId)} replace />;
    }
    return <Navigate to="/inicio" replace />; 
};

// ... exportar ActualizarRegistroVotacion, EliminarRegistroVotacion, etc. igual que antes
export const ActualizarRegistroVotacion = () => <div className="alert alert-info">Panel de Actualización</div>;
export const EliminarRegistroVotacion = () => <div className="alert alert-danger">Panel de Eliminación</div>;
export const VotacionPlaceholder = () => <div className="text-center p-5"><h3>Sistema de Votaciones</h3><p>Seleccione una opción del menú</p></div>;