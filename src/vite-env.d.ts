/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly CANISTER_ID_TOKEN1: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}