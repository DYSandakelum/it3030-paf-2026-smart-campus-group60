import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { inferUserFromUsername, normalizeUsername } from '../../services/basicAuth';

const VALID_ACCOUNTS = new Set(['admin', 'user', 'tech']);

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    } else if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedUsername = normalizeUsername(username);

    if (!VALID_ACCOUNTS.has(normalizedUsername) || password !== 'password') {
      setError('Use admin/password, user/password, or tech/password.');
      return;
    }

    const nextUser = inferUserFromUsername(normalizedUsername);
    setLoading(true);
    setError('');
    login(nextUser, { username: normalizedUsername, password });

    window.setTimeout(() => {
      navigate(nextUser.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
      setLoading(false);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.18),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#edf7fb_45%,_#dff1f6_100%)] flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white/90 shadow-[0_24px_90px_rgba(15,23,42,0.16)] backdrop-blur sm:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between bg-slate-950 p-8 text-white sm:p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Smart Campus</p>
            <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight sm:text-5xl">
              One login, two views: campus user and admin control.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Sign in with a local account to enter the user dashboard or the admin area without the browser auth popup.
            </p>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">Admin</p>
              <p className="mt-1">Manage modules, users, and escalations.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">User</p>
              <p className="mt-1">Create tickets and track your requests.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">Technician</p>
              <p className="mt-1">Handle support and allocation tasks.</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use the campus credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15"
                placeholder="admin"
                autoComplete="username"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15"
                placeholder="password"
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in to Smart Campus'}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Demo accounts: <span className="font-medium text-slate-900">admin/password</span>, <span className="font-medium text-slate-900">user/password</span>, <span className="font-medium text-slate-900">tech/password</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;