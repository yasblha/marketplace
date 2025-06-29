interface ImportMetaEnv {
    readonly VITE_APP_API_URL: string;
    readonly VITE_STRIPE_PUBLIC_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}