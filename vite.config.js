import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import environment from "vite-plugin-environment";
import path from "node:path";

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  const rootPath = path.resolve(__dirname, "../../");
  process.env = { 
    ...process.env, 
    ...loadEnv(mode, rootPath, "CANISTER_"),
    ...loadEnv(mode, rootPath, "DFX_")
  };
  
  return defineConfig({
    build: {
      emptyOutDir: true,
      chunkSizeWarningLimit: 1600,
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8080",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      environment("all", { prefix: "CANISTER_", defineOn: "import.meta.env" }),
      environment("all", { prefix: "DFX_" }),
    ],
    resolve: {
      alias: [
        {
          find: "declarations",
          replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
        },
      ],
    },
    define: {
      'process.env': '{}', // This is to avoid the error 'process is not defined
      global: "globalThis",
    },
  })
};
