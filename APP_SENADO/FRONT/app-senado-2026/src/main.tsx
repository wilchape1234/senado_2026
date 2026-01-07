// main.tsx

import { createRoot } from 'react-dom/client'
import './index.css'
// 1. Importa el CSS (si usas NPM)
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. Importa el JS Bundle (que incluye Popper)
import 'bootstrap/dist/js/bootstrap.bundle.min';
// NOTA: Si importaste 'bootstrap' en tu código React para activar los componentes
// import 'bootstrap' 
// ^ Si usas el import anterior, debes asegurarte de que también importaste el CSS.

import { AuthProvider } from './context/AuthProvider.tsx';
import React from 'react';
// import App from './App.tsx';
import { App2 } from './App2.tsx';


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App2 />
    </AuthProvider>
  </React.StrictMode>,
)