// vite.config.ts / vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
    watch: { usePolling: true },
    // aceite exatamente o domínio OU qualquer subdomínio via regex
    // escolha UMA das linhas abaixo (a 1ª com FQDN; a 2ª com regex):
    // allowedHosts: ['appbarbershop.whizconnect.com.br', 'localhost'],
    allowedHosts: [/\.whizconnect\.com\.br$/, 'localhost'],
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    strictPort: true,
    // MESMA regra aqui porque em prod você está usando "vite preview"
    // allowedHosts: ['appbarbershop.whizconnect.com.br', 'localhost'],
    allowedHosts: [/\.whizconnect\.com\.br$/, 'localhost'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    extensions: ['.js', '.jsx', '.json']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: { main: path.resolve(__dirname, 'index.html') }
    }
  },
  optimizeDeps: { include: ['react', 'react-dom', 'react-router-dom'] }
})
