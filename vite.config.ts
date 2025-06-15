import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      "styled-system": path.resolve(__dirname, './styled-system'),
    },
  },
})
