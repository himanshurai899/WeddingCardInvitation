import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API = '/api/admin';

// 'loading' | 'anon' | 'authed'
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    // Any API call that comes back 401 (session expired) sends the user back to the sign-in form
    const nativeFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await nativeFetch(...args);
      const url = String(args[0]?.url ?? args[0]);
      if (res.status === 401 && url.startsWith(API) && !url.startsWith(`${API}/auth/`)) setStatus('anon');
      return res;
    };
    nativeFetch(`${API}/auth/session`)
      .then((r) => r.json())
      .then((s) => {
        setConfigured(s.configured);
        setStatus(s.authenticated ? 'authed' : 'anon');
      })
      .catch(() => setStatus('anon'));
    return () => {
      window.fetch = nativeFetch;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error ?? 'Sign in failed');
    setStatus('authed');
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST' });
    setStatus('anon');
  }, []);

  return <AuthContext.Provider value={{ status, configured, login, logout }}>{children}</AuthContext.Provider>;
}
