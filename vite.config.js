import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from '@vitejs/plugin-react';
import path from 'path';


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
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
});
