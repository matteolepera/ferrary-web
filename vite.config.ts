/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Le stesse regole per il server di sviluppo e per l'anteprima del sito finale
const apiProxy = {
  '/api': 'http://localhost:8000',
  '/sanctum': 'http://localhost:8000',
  '/docs': 'http://localhost:8000',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // "@/" punta sempre alla cartella src
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // In sviluppo Vite inoltra al backend le chiamate all'API:
    // il browser parla con un solo indirizzo, anche dal telefono
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // Nei test non c'è il proxy: l'API simulata da MSW risponde a questo indirizzo
    env: { VITE_API_URL: 'http://localhost:8000' },
  },
})
