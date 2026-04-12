import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import api from '../api/api';

export function Login() {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      const { access_token, user } = res.data;

      //Save JWT
      localStorage.setItem('token', access_token);

      //Set role from backend
      const role = user.role.toLowerCase();
      setRole(role);

      //Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'instructor') navigate('/instructor');
      else navigate('/member');

    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  return (
      <section className="max-w-md mx-auto mt-8 p-6 border border-slate-200 rounded-xl bg-white shadow">
        <h1 className="text-2xl font-bold text-sky-700 mb-4">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded p-2"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Password
            <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-slate-300 rounded p-2"
            />
          </label>



          {error && (
              <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded font-semibold hover:bg-sky-700"
          >
            Log in
          </button>
        </form>
      </section>
  );
}