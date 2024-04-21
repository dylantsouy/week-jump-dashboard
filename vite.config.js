import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'
import svgr from 'vite-plugin-svgr'
import EnvironmentPlugin from 'vite-plugin-environment'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(),  EnvironmentPlugin('all')],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['@mui/material/Tooltip'],
  },
  base: './',
  prettier: {
    configFile: './.prettierrc.json',
  },
  build: {
    assetsDir: 'src/assets',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";` // 如果有全局的 SCSS 變數，可以在這裡引入
      }
    }
  },
});
