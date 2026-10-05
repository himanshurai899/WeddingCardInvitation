import { authConfigured, checkLogin, clearCookie, readSession, sessionCookie } from './auth.js';
import { prisma } from './db.js';
import { WEDDING_ID } from './http.js';
import { routes } from './routes/index.js';
import { seedDatabase } from './seed.js';

const json = (res, status, body, headers = {}) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks);
  // Vercel may already have parsed the body
  return raw.length || req.body === undefined ? raw : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
};

const matchRoute = (segments) => {
  for (const [pattern, mod] of routes) {
    const parts = pattern.split('/');
    if (parts.length !== segments.length) continue;
    const params = {};
    if (parts.every((p, i) => (p.startsWith(':') ? (params[p.slice(1)] = decodeURIComponent(segments[i])) : p === segments[i]))) {
      return { mod, params };
    }
  }
  return null;
};

// A brand-new database has no wedding row, which every other route needs. Seed it once, like Vivah did on startup.
let seeded;
const ensureSeeded = () => (seeded ??= prisma.wedding.findUnique({ where: { id: WEDDING_ID } }).then((w) => w ?? seedDatabase()).catch((e) => {
  seeded = undefined;
  throw e;
}));

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api\/admin\/?/, '').replace(/\/$/, '');
  const method = req.method ?? 'GET';

  // Cookies are SameSite=Strict; also refuse cross-site writes outright
  const origin = req.headers.origin;
  if (method !== 'GET' && origin && origin.replace(/^https?:\/\//, '') !== req.headers.host) return json(res, 403, { error: 'Forbidden' });

  if (path === 'auth/session') {
    return json(res, 200, { authenticated: Boolean(readSession(req)), configured: authConfigured() });
  }
  if (path === 'auth/logout' && method === 'POST') return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie(req) });
  if (path === 'auth/login' && method === 'POST') {
    if (!authConfigured()) return json(res, 503, { error: 'Admin login is not configured (set Login_UserName and Login_Password).' });
    let body = {};
    try {
      body = JSON.parse((await readBody(req)).toString() || '{}');
    } catch { /* falls through to invalid */ }
    const user = checkLogin(body.username, body.password);
    if (!user) {
      await new Promise((r) => setTimeout(r, 500)); // slow down guessing
      return json(res, 401, { error: 'Invalid username or password.' });
    }
    return json(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(req, user) });
  }

  if (!readSession(req)) return json(res, 401, { error: 'Not signed in' });
  if (!process.env.DATABASE_URL) return json(res, 503, { error: 'Database is not configured (set DATABASE_URL).' });

  const found = matchRoute(path.split('/'));
  if (!found) return json(res, 404, { error: 'Not found' });
  const fn = found.mod[method];
  if (!fn) return json(res, 405, { error: 'Method not allowed' });

  try {
    await ensureSeeded();
    const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(req);
    const request = new Request(url, { method, headers: req.headers, body: body?.length ? body : undefined });
    const response = await fn(request, { params: Promise.resolve(found.params) });
    res.statusCode = response.status;
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.setHeader('Cache-Control', 'no-store');
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    console.error(e);
    json(res, 500, { error: e instanceof Error ? e.message : 'Internal server error' });
  }
}
