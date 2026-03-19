import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type Role = 'member' | 'instructor' | 'admin';

export function Login() {
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: replace with real backend auth and token handling
    setRole(selectedRole);

    if (selectedRole === 'member') navigate('/member');
    else if (selectedRole === 'instructor') navigate('/instructor');
    else if (selectedRole === 'admin') navigate('/admin');
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

        <label className="block text-sm font-medium text-gray-700">
          Role
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="mt-1 w-full border border-slate-300 rounded p-2"
          >
            <option value="member">Member</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded font-semibold hover:bg-sky-700"
        >
          Log in (mock)
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3">This is a mock login page created for frontend navigation. Replace with real backend auth later.</p>
    </section>
  );
}
