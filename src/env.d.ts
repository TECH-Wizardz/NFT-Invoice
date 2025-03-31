/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PINATA_JWT: string
  readonly VITE_PINATA_API_KEY: string
  readonly VITE_PINATA_API_SECRET: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 