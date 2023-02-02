import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "portfolio-web",
  root: "./",
  build: { outDir: "dist" },
  // publicDir: "/",
});
