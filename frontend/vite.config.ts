/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
const deps = require("./package.json").dependencies;
import federation from "@originjs/vite-plugin-federation";
import path from "path";

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
        name: "developer-assistant",
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
        "/api": {
          target:
            "https://dev-assist-services.530fd7c8e80241b2a4ca.centralindia.aksapp.io",
          changeOrigin: true,
        },
      },
    },
  });
};