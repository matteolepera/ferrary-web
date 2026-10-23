/**
 * Variabili d'ambiente disponibili nel frontend (devono iniziare con VITE_).
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
