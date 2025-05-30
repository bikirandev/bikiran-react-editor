import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "test", // Keep example as the root directory
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "build"), // Explicitly set build directory
    emptyOutDir: true, // Ensure old files are removed before rebuilding
    rollupOptions: {
      input: path.resolve(__dirname, "test/index.html"), // Ensure correct entry file
    },
  },
  publicDir: path.resolve(__dirname, "test/public"), // Ensure public assets are copied
});
