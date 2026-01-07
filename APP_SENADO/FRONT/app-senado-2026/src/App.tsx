// src/App2.tsx

import { BrowserRouter, Link, Outlet, Route, Routes, useNavigate } from "react-router";

import { IconMenu2,/*  IconUser, */ IconUserCircle, IconLogout, IconLogin } from "@tabler/icons-react";

// Importaciones de tus componentes
import { useAuth } from "./context/AuthProvider";
import LoginPage from "./Pages/Auth/LoginPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import { Incio } from "./Pages";
import { CrearRegistroVotacion } from "./Pages/RegistroVotacion/Create/Crear"; //
import { CrearRegistroVotacionMasivo } from "./Pages/RegistroVotacion/Create/CrearMasivo"; //
import { AllRegistroVotacion } from "./Pages/RegistroVotacion/index2"; //
import {
  ProtectedRoute,
  PublicRouteGuard,
  Unauthorized,
  DashboardRedirector,
  ActualizarRegistroVotacion,
  EliminarRegistroVotacion
} from "./Pages/Auth/AuthComponents"; //
import { getRole,} from "./Types/authInterfaces";
import { useState } from "react";

// ==========================================
// CONFIGURACIÓN DE MENÚ Y NAVEGACIÓN
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Principal que envuelve toda la app */}
        <Route path="/" element={<MainLayout />}>

          {/* --- RUTAS PÚBLICAS (Accesibles por todos) --- */}
          <Route index element={<DashboardRedirector />} />
          <Route path="inicio" element={<Incio />} />

          {/* Rutas de Auth (Solo para NO logueados) */}
          <Route path="login" element={<PublicRouteGuard><LoginPage /></PublicRouteGuard>} />
          <Route path="register" element={<PublicRouteGuard><RegisterPage /></PublicRouteGuard>} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* --- MÓDULO VOTACIONES (Híbrido) --- */}
          <Route path="registro-votacion">

            {/* 1. Ruta Pública: Formulario de votar */}
            <Route path="crear" element={<CrearRegistroVotacion />} />

            {/* 2. Rutas Protegidas (Requieren Login y Roles específicos) */}

            {/* Ver Votaciones: Roles 1, 2, 3 */}
            <Route path="ver" element={
              <ProtectedRoute allowedRoles={[1, 2, 3]}>
                <AllRegistroVotacion />
              </ProtectedRoute>
            } />

            {/* Crear Masivo: Roles 1, 2 */}
            <Route path="crear-masivos" element={
              <ProtectedRoute allowedRoles={[1, 2]}>
                <CrearRegistroVotacionMasivo />
              </ProtectedRoute>
            } />

            {/* Dashboard Admin: Rol 1 */}
            <Route path="admin-dashboard" element={
              <ProtectedRoute allowedRoles={[1]}>
                <ActualizarRegistroVotacion />
              </ProtectedRoute>
            } />

            <Route path="eliminar" element={
              <ProtectedRoute allowedRoles={[1]}>
                <EliminarRegistroVotacion />
              </ProtectedRoute>
            } />

          </Route>

          {/* 404 dentro del layout */}
          <Route path="*" element={<div className="text-center mt-5"><h1>404</h1><p>Página no encontrada</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export { App };

// ==========================================
// COMPONENTE DE LAYOUT Y NAVBAR
// ==========================================

function MainLayout() {
  const { user, logout } = useAuth(); //
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // const [getRol, setGetRol] = useState<RolesAuth>();

  const handleLogout = () => {
    logout();
    setSidebarVisible(false);
    navigate('/login');
  };
  console.log('Objeto User:', user);
  // --- LÓGICA DE ELEMENTOS DEL MENÚ ---
  // Definimos todos los items posibles y filtramos según el rol
  const allNavItems = [
    {
      name: 'Inicio',
      path: '/inicio',
      icon: 'ti ti-home',
      public: true // Visible para todos
    },
    {
      name: 'Registrarme para Votar',
      path: '/registro-votacion/crear',
      icon: 'ti ti-pencil',
      public: true
    },
    {
      name: 'Ver Votantes',
      path: '/registro-votacion/ver',
      icon: 'ti ti-list',
      roles: [1, 2, 3] // Solo Admins y Supervisores
    },
    {
      name: 'Carga Masiva',
      path: '/registro-votacion/crear-masivos',
      icon: 'ti ti-upload',
      roles: [1, 2] // Solo SuperAdmin y Admin
    },
    {
      name: 'Gestión Admin',
      path: '/registro-votacion/admin-dashboard',
      icon: 'ti ti-settings',
      roles: [1] // Solo SuperAdmin
    },
  ];

  // Filtro dinámico
  const visibleItems = allNavItems.filter(item => {
    if (item.public) return true; // Siempre mostrar públicos
    if (user && item.roles?.includes(user.rolId)) return true; // Mostrar si el rol coincide
    return false;
  });

  const customBlue900 = 'rgb(21,51,141)';

  // Obtener inicial para vista móvil
  const userInitial = user?.userName ? user.userName.charAt(0).toUpperCase() : '?';


  // useEffect(() => {
  //   const val = getRole(user?.rolId || 4).role
  //   setGetRol(val)

  // }, [user,logout])

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      {/* 1. NAVBAR SUPERIOR */}
      <nav
        className="navbar navbar-expand-md sticky-top shadow-sm px-3"
        style={{ backgroundColor: customBlue900, zIndex: 1040 }}
      >
        <div className="container-fluid align-items-center">

          {/* Logo / Título */}
          <Link to="/" className="navbar-brand fw-bold text-white fs-4 d-flex align-items-center gap-2">
            <span>🗳️ SENADO - 2026 G-70</span>
          </Link>

          {/* Menú Desktop (Centro/Derecha) */}
          <div className="collapse navbar-collapse justify-content-end d-none d-md-flex">
            <ul className="navbar-nav align-items-center gap-3">
              {visibleItems.map((item) => (
                <div className="navbar-nav gap-3" key={item.path}>
                  <Link
                    to={item.path}
                    className="nav-link text-white fw-medium px-2 rounded hover-effect"
                    style={{ transition: '0.2s' }}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}

              {/* Separador */}
              <div className="vr bg-white opacity-50 mx-2" style={{ height: '24px' }}></div>

              {/* Zona de Usuario Desktop */}
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-light border-0 d-flex align-items-center gap-2 dropdown-toggle"
                    type="button" data-bs-toggle="dropdown" aria-expanded="false"
                  >
                    <IconUserCircle size={24} />
                    <span className="fw-bold">{user.userName}</span>
                    <span className="badge bg-light text-primary rounded-pill ms-1">{(getRole(user?.rolId ?? 4).roleName)}</span>{/* ROLE */}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li><span className="dropdown-header">Cuenta</span></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}><IconLogout size={16} className="me-2" />Cerrar Sesión</button></li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm fw-bold">Ingresar</Link>
                  <Link to="/register" className="btn btn-light text-primary btn-sm fw-bold">Registrarse</Link>
                </div>
              )}
            </ul>
          </div>

          {/* Botón y Avatar Móvil (Derecha extrema en pantallas chicas) */}
          <div className="d-flex d-md-none align-items-center gap-3">

            {/* Si hay usuario, mostrar círculo con inicial en Móvil */}
            {user && (
              <div
                className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold shadow-sm"
                style={{ width: '35px', height: '35px', fontSize: '1.2rem', cursor: 'default' }}
                title={user.userName}
              >
                {userInitial}
              </div>
            )}

            {/* Botón Hamburguesa */}
            <button
              className="btn text-white p-0 border-0"
              onClick={() => setSidebarVisible(true)}
              aria-label="Menú"
            >
              <IconMenu2 size={32} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. SIDEBAR MÓVIL (Offcanvas custom) */}
      <div
        className={`offcanvas offcanvas-end ${sidebarVisible ? 'show' : ''}`}
        style={{ visibility: sidebarVisible ? 'visible' : 'hidden', transition: 'transform 0.3s ease-in-out' }}
        tabIndex={-1}
      >
        <div className="offcanvas-header bg-light border-bottom">
          <h5 className="offcanvas-title fw-bold text-primary">Menú Principal</h5>
          <button type="button" className="btn-close" onClick={() => setSidebarVisible(false)}></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {/* Info Usuario en Sidebar */}
          {user ? (
            <div className="alert alert-primary d-flex align-items-center gap-3 mb-4">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                {userInitial}
              </div>
              <div className="overflow-hidden">
                <div className="fw-bold text-truncate">{user.userName}</div>
                <div className="small text-muted">Rol {(getRole(user?.rolId ?? 4).roleName)}</div>
              </div>
            </div>
          ) : (
            <div className="d-grid gap-2 mb-4">
              <Link to="/login" onClick={() => setSidebarVisible(false)} className="btn btn-primary"><IconLogin size={18} className="me-2" />Iniciar Sesión</Link>
              <Link to="/register" onClick={() => setSidebarVisible(false)} className="btn btn-outline-primary">Registrarse</Link>
            </div>
          )}

          {/* Links de Navegación */}
          <div className="list-group list-group-flush mb-auto">
            {visibleItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarVisible(false)}
                className="list-group-item list-group-item-action border-0 py-3 px-2 d-flex align-items-center text-secondary"
              >
                <i className={`${item.icon} fs-4 me-3 text-primary opacity-75`}></i>
                <span className="fw-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Logout abajo del todo */}
          {user && (
            <div className="mt-4 border-top pt-3">
              <button
                onClick={handleLogout}
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <IconLogout size={20} /> Salir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop para cerrar sidebar */}
      {sidebarVisible && <div className="offcanvas-backdrop fade show" onClick={() => setSidebarVisible(false)}></div>}

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* 4. FOOTER */}
      <footer className="text-center py-3 mt-auto text-white small fw-bold" style={{ backgroundColor: customBlue900 }}>
        <div>&copy; 2026 Sistema Electoral G-70. Desarrollado por @wilchape & @eschala.</div>
      </footer>

      <style>{`
        .hover-underline:hover { text-decoration: underline !important; opacity: 0.9; }
      `}</style>
    </div>
  );
}