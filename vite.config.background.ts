import { defineConfig } from "vite";
import { join, resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        background: join(__dirname, "src/background/Index.tsx"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        inlineDynamicImports: true, // import構文を使用しないためのオプションです
      },
    },
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
});
