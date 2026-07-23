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
})
