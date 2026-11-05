import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" lets the built site work from localhost:3000 and from a GitHub Pages sub-path
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:3000" },
  },
});
