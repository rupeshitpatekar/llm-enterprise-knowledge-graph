/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
const deps = require("./package.json").dependencies;
import federation from "@originjs/vite-plugin-federation";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
const manifestConfig = require("./manifest.json");

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      federation({
        name: "neural-quartet",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            eager: true,
          },
          "react-dom": {
            singleton: true,
            eager: true,
          },
        },
      }),
      VitePWA({
        manifest: manifestConfig,
        workbox: {
          maximumFileSizeToCacheInBytes: 1024 * 5 * 1000,
        },
      }),
    ],
    preview: {
      host: "localhost",
      port: 8902,
      strictPort: true,
    },
    build: {
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
    server: {
      port: 8902,
      strictPort: true,
      proxy: {
        "/services": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  });
};
