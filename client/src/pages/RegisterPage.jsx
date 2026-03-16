import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-xl glass-panel rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-gold">Initiate</p>
        <h1 className="mt-4 font-display text-5xl uppercase text-ivory">Create Your Access</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {[
            { key: 'name', type: 'text' },
            { key: 'email', type: 'email' },
            { key: 'password', type: 'password' },
          ].map((field) => (
            <label key={field.key} className="block text-sm uppercase tracking-[0.18em] text-ivory/60">
              {field.key}
              <input
                type={field.type}
                required
                value={form[field.key]}
                onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                className="mt-2 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-ivory"
              />
            </label>
          ))}
          <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center rounded-full border border-gold bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black hover:bg-transparent hover:text-gold disabled:opacity-50">
            {submitting ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-sm text-ivory/60">
          Already inside? <Link to="/login" className="text-gold">Login here</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
