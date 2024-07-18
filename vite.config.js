import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

const __filename = import.meta.url;
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {  },
      include: '**/*.svg'
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
