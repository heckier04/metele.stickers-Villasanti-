import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/drive-image': {
        target: 'https://drive.google.com',
        changeOrigin: true,
        rewrite: (path) => {
          // /drive-image?id=FILE_ID -> /uc?id=FILE_ID&export=view
          const url = new URL(path, 'http://localhost');
          const fileId = url.searchParams.get('id');
          return `/uc?id=${fileId}&export=view`;
        },
      }
    }
  }
})
