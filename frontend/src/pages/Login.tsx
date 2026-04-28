import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/api';

export function Login() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);

      const role = user.role.toLowerCase();
      setRole(role);

      if (role === 'admin') navigate('/admin');
      else if (role === 'instructor') navigate('/instructor');
      else navigate('/member');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-1/2">
          <div className="inline-flex rounded-full bg-cyan-600/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            AquaFit Pro login
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Secure access for swimmers, instructors, and pool staff.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Sign in to manage your training schedule, book swim sessions, and keep your membership details up to date. AquaFit Pro makes pool fitness simple, secure, and beautifully designed.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
              <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">For members</p>
              <p className="mt-4 text-lg font-semibold text-white">View classes, manage bookings, and stay on track.</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10">
              <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">For instructors</p>
              <p className="mt-4 text-lg font-semibold text-white">Access client sessions, schedules, and coaching tools.</p>
            </div>
          </div>
        </div>

        <div className="lg:w-[45%]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 shadow-2xl ring-1 ring-white/10">
            <div className="bg-slate-900/95 px-8 py-8 sm:px-10">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-400">Account access</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to your AquaFit account</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Enter your credentials to continue to the pool dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8 sm:px-10">
              <div>
                <label className="block text-sm font-semibold text-slate-200">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-3 block w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-semibold text-slate-200">Password</label>
                  <span className="text-sm text-slate-500">Minimum 8 characters</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 block w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter your password"
                />
              </div>

              {error ? (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
              >
                Sign in
              </button>

              <p className="text-center text-sm text-slate-500">
                New to AquaFit? <span className="font-semibold text-white">Contact us</span> to start your membership.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}