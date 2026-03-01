import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: "brotliCompress" }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    manifest: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
          "ui-vendor": ["lucide-react"],
        },
      },
    },
  },

  esbuild: {
    drop: ["console", "debugger"],
  },
  preview: {
    port: 3510,
  },
  server: {
    port: 3510,
  },
});
