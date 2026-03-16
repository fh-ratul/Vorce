import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const isGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(form);
      const destination = user.role === 'admin' ? '/admin' : location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl glass-panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-gold">Access</p>
        <h1 className="mt-4 font-display text-5xl uppercase text-ivory">Return To VORCE</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
            />
          </label>
          <label className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
            />
          </label>
          <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold disabled:opacity-50">
            {submitting ? 'Entering...' : 'Login'}
          </button>
        </form>
        {isGithubPages && (
          <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-xs uppercase tracking-[0.15em] text-ivory/70">
            Demo admin: admin@vorce.com / admin123
          </div>
        )}
        <p className="mt-6 text-sm text-ivory/60">
          No account yet? <Link to="/register" className="text-gold">Register here</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
