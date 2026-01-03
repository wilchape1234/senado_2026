import { useState } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes, useNavigate } from "react-router"; // Nota: react-router-dom es lo estándar, verifica si usas "react-router" directo

import { AllRegistroVotacion } from "./Pages/RegistroVotacion/Index";
import { CrearRegistroVotacionMasivo } from "./Pages/RegistroVotacion/Create/CrearMasivo";
import { CrearRegistroVotacion } from "./Pages/RegistroVotacion/Create/Crear";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RenderApp />}>
          {/* <Route path="registro-votacion" element={<Default />}> */}
          <Route path="registro-votacion" element={<Default />}>
            {/* <Route path="crear" element={<Default />} /> */}
            <Route path="crear" element={<CrearRegistroVotacion />} />
            <Route path="crear-masivos" element={<CrearRegistroVotacionMasivo />} />
            <Route path="actualizar" element={<Default />} />
            <Route path="eliminar" element={<Default />} />
            <Route path="ver" element={<AllRegistroVotacion />} />
            <Route path="ver/:codigo" element={<Default />} />
          </Route>
          <Route path="inicio" element={<Default />} />
          <Route path="login" element={<Default />} />
          <Route path="lideres" element={<Default />}>
            <Route path="crear" element={<Default />} />
            <Route path="editar" element={<Default />} />
            <Route path="editar/:cedula" element={<Default />} />
          </Route>
          <Route path="migracion" element={<Default />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const customBlue900 = '#1e3a8a';

function RenderApp() {
  const navigate = useNavigate();
  // Estado para controlar la visibilidad del menú lateral (Offcanvas) en móvil
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const navItems = [
    { name: 'Inicio', path: 'inicio', icon: 'pi pi-home' },
    // { name: 'Registros', path: 'registro-votacion', icon: 'pi pi-calendar-plus' },
    { name: 'Registar Votantes ', path: '/registro-votacion/crear', icon: 'pi pi-calendar-plus' },
    { name: 'Registar Votantes Masivo ', path: '/registro-votacion/crear-masivos', icon: 'pi pi-calendar-plus' },
    { name: 'Ver Votantes', path: '/registro-votacion/ver', icon: 'pi pi-calendar-plus' },
    { name: 'Lideres', path: 'lideres', icon: 'pi pi-users' },
    { name: 'Migración', path: 'migracion', icon: 'pi pi-upload' },
    // { name: 'Login', path: 'login', icon: 'pi pi-sign-in' },
  ];

  // Función para manejar la navegación desde el menú móvil
  const handleNavigation = (path: string) => {
    setSidebarVisible(false); // Cerrar el Sidebar
    navigate(path);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      {/* 1. Encabezado (Navbar) */}
      <nav
        className="navbar navbar-expand-md sticky-top shadow-sm p-3"
        style={{ backgroundColor: customBlue900 }}
      >
        <div className="container-fluid">
          {/* Título COMISOFT */}
          <span className="navbar-brand fw-bold text-white mb-0 h1">
            SENADO - 2026 G-70
          </span>

          {/* Menú de escritorio */}
          <div className="collapse navbar-collapse justify-content-end d-none d-md-flex">
            <div className="navbar-nav gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="nav-link text-white fw-medium px-2 rounded hover-effect"
                  style={{ transition: '0.2s' }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Botón de menú móvil (Toggler) */}
          <button
            style={{ border: '1px solid white' }}
            className="btn btn-outline-light d-md-none border-0"
            type="button"
            onClick={() => setSidebarVisible(true)}
            aria-label="Abrir Menú"
          >
            
            <span className="pi pi-bars fs-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
            </span>
          </button>
        </div>
      </nav>

      {/* 2. Sidebar para navegación móvil (Offcanvas de Bootstrap) */}
      <div
        className={`offcanvas offcanvas-start ${sidebarVisible ? 'show' : ''}`}
        tabIndex={-1}
        id="mobileMenu"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title text-dark">Menú Principal</h5>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={() => setSidebarVisible(false)}
            aria-label="Cerrar"
          ></button>
        </div>

        <div className="offcanvas-body p-0">
          <div className="p-3">
            <h6 className="text-muted text-uppercase small fw-bold mb-3">Navegación</h6>
            <div className="list-group list-group-flush">
              {navItems.map((item) => (
                <Link // <-- Usamos Link directo
                  key={item.name}
                  to={item.path}
                  // Aseguramos que se cierre el menú inmediatamente al hacer clic
                  onClick={() => setSidebarVisible(false)}
                  className="list-group-item list-group-item-action border-0 d-flex align-items-center py-3 rounded mb-1"
                >
                  <span className={`${item.icon} me-3 fs-5`}></span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay (Backdrop) manual para Bootstrap Offcanvas cuando se abre desde React state */}
      {sidebarVisible && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      {/* Contenido principal (Outlet) */}
      {/* flex-grow-1 hace que ocupe el espacio restante empujando el footer */}
      <main className="container-fluid flex-grow-1 my-4" style={{ minHeight: '700px' }}>
        <Outlet />
      </main>

      {/* 3. Pie de Página (Footer) */}
      <footer
        className="text-center py-3 mt-auto text-white"
        style={{ backgroundColor: customBlue900 }}
      >
        <div className="small">
          Derechos reservados a eschala 2026
        </div>
      </footer>

      {/* Estilos inline para emular el hover simple de Tailwind si no usas CSS custom */}
      <style>{`
        .hover-effect:hover {
          color: #d1d5db !important; /* gris claro al hover */
        }
      `}</style>
    </div>
  );
}

export default App;

function Default() {
  return (
    <div className="">
      <div className="alert alert-info d-none">
        VACIO

      </div>

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}