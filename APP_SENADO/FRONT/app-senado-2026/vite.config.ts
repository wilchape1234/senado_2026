import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    basicSsl({
            name: 'test',
      /** custom trust domains */
      domains: ['*.custom.com'],
    }),
  ],
  server: {
    // https:true,
    host: true, // Escucha en todas las direcciones (incluyendo la IP de tu red)
    open: true  // Abre el navegador automáticamente al iniciar
  }
})
