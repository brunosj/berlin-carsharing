import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $components: path.resolve('./src/components'),
      $data: path.resolve('./src/data'),
      $assets: path.resolve('./src/assets'),
      $types: path.resolve('./src/types'),
    },
  },
});
