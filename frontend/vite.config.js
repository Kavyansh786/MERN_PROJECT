import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 1512,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
