import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The admin portal lives at /admin (admin/index.html) and its API at /api/admin (api/admin/[...path].js).
// On Vercel the API is a function; here the same handler is mounted on the dev and preview servers.
const adminDev = () => {
  const mount = (server, load) => {
    // Vercel reads .env itself; Vite only exposes VITE_* to the client, so load the rest into process.env
    const env = loadEnv(server.config.mode, process.cwd(), '')
    for (const [k, v] of Object.entries(env)) process.env[k] ??= v
    server.middlewares.use(async (req, res, next) => {
      const path = req.url.split('?')[0]
      if (path.startsWith('/api/admin/')) {
        try {
          await (await load()).default(req, res)
        } catch (e) {
          console.error(e)
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(e.message ?? e) }))
        }
      } else {
        // /admin and /admin/<page> are the admin app; real files (/admin/src/..., assets) pass through
        if ((path === '/admin' || path.startsWith('/admin/')) && !/\.\w+$/.test(path)) req.url = '/admin/index.html'
        next()
      }
    })
  }
  return {
    name: 'admin-dev',
    configureServer: (server) => mount(server, () => server.ssrLoadModule('/api/admin/[...path].js')),
    configurePreviewServer: (server) => mount(server, () => import('./api/admin/[...path].js')),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), adminDev()],
  resolve: { alias: { '@admin': fileURLToPath(new URL('./admin/src', import.meta.url)) } },
  build: {
    rollupOptions: {
      input: { main: 'index.html', admin: 'admin/index.html' },
    },
  },
})
