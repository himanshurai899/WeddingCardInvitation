import { useState } from 'react';
import { Flame } from 'lucide-react';
import { useAuth } from '@admin/lib/auth';

export function Login() {
  const { login, configured } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--ivory)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'var(--purple)' }}
          >
            <Flame size={28} color="white" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', color: 'var(--ink)', fontWeight: 700 }}>
            Vivah
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Himanshu &amp; Samiksha · Admin
          </p>
        </div>

        <div className="card p-8">
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.4rem',
              color: 'var(--ink)',
              marginBottom: '1.5rem',
              fontWeight: 600,
            }}
          >
            Sign in to continue
          </h2>

          {(error || !configured) && (
            <div role="alert" className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error || 'Admin login is not configured on the server.'}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--purple)', background: 'var(--surface)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', '--tw-ring-color': 'var(--purple)', background: 'var(--surface)', color: 'var(--ink)' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60 mt-2"
              style={{ background: 'var(--purple)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
