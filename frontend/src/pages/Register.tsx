import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

export function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                email,
                password,
            });

            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-md mx-auto mt-10 p-6 border border-slate-200 rounded-xl bg-white shadow">
            <h1 className="text-2xl font-bold text-sky-700 mb-4">Create Account</h1>

            {error && (
                <div className="mb-4 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

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
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                    />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                    <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-sky-600 text-white py-2 rounded font-semibold hover:bg-sky-700 disabled:bg-gray-400"
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-sky-600 font-medium hover:underline">
                    Log in
                </Link>
            </p>
        </section>
    );
}