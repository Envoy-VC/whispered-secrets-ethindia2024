/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_HUDDLE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
