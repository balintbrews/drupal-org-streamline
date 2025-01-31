import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: 'index',
    },
  },
});
