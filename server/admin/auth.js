import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// One admin account, set in the env: Login_UserName and Login_Password (same names locally and on Vercel).
const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 24 * 7;

const creds = () => ({ user: process.env.Login_UserName ?? '', pass: process.env.Login_Password ?? '' });
export const authConfigured = () => {
  const { user, pass } = creds();
  return Boolean(user && pass);
};

// Hash both sides first so the comparison is constant-time whatever the lengths
const sha = (s) => createHash('sha256').update(s).digest();
const same = (a, b) => timingSafeEqual(sha(a), sha(b));

export const checkLogin = (user, pass) => {
  const c = creds();
  // &, not &&: always evaluate both so timing doesn't reveal which one was wrong
  return authConfigured() && same(String(user ?? ''), c.user) & same(String(pass ?? ''), c.pass) ? c.user : null;
};

// Sessions are signed with a key derived from the credentials, so changing the password signs everyone out.
// Set ADMIN_SESSION_SECRET to use a separate key instead.
const sign = (data) => {
  const { user, pass } = creds();
  const key = process.env.ADMIN_SESSION_SECRET || `vivah-admin:${user}:${pass}`;
  return createHmac('sha256', key).update(data).digest('base64url');
};

const cookieFlags = (req) => {
  const secure = req.headers['x-forwarded-proto'] === 'https' || process.env.VERCEL ? '; Secure' : '';
  return `Path=/api/admin; HttpOnly; SameSite=Strict${secure}`;
};

export const sessionCookie = (req, user) => {
  const body = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  return `${COOKIE}=${body}.${sign(body)}; Max-Age=${MAX_AGE}; ${cookieFlags(req)}`;
};

export const clearCookie = (req) => `${COOKIE}=; Max-Age=0; ${cookieFlags(req)}`;

// Returns the signed-in username, or null
export const readSession = (req) => {
  if (!authConfigured()) return null;
  const raw = /(?:^|;\s*)admin_session=([^;]+)/.exec(req.headers.cookie ?? '')?.[1];
  const [body, sig] = (raw ?? '').split('.');
  if (!body || !sig || !same(sig, sign(body))) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(body, 'base64url').toString());
    return exp > Date.now() && u === creds().user ? u : null;
  } catch {
    return null;
  }
};
