import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApiMiddleware } from './server/apiMiddleware.js'

// Load .env into process.env for the Node server process (Node 20.6+ /
// process.loadEnvFile). This makes ANTHROPIC_API_KEY available server-side
// WITHOUT exposing it to the client bundle. Ignored if no .env file exists.
try {
  process.loadEnvFile('.env')
} catch {
  /* no .env file — rely on the shell environment */
}

// Serves the secure Claude endpoint from the same Node process that runs the
// dev/preview server, so `npm run dev` alone gives a working backend.
function claudeApiPlugin() {
  return {
    name: 'claude-api-middleware',
    configureServer(server) {
      server.middlewares.use(createApiMiddleware())
    },
    configurePreviewServer(server) {
      server.middlewares.use(createApiMiddleware())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), claudeApiPlugin()],
  // Production preview server (used by `npm run start` on hosts like Render).
  // Binds all interfaces on the platform-provided $PORT and allows the host's
  // dynamic domain. The Claude API middleware runs here too (configurePreviewServer),
  // so the API key stays server-side.
  preview: {
    host: true, // 0.0.0.0 — required for Render/Railway/Fly to detect the port
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true, // accept the platform's *.onrender.com (etc.) hostname
  },
})
