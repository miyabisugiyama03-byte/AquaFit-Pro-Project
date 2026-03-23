import { Link } from 'react-router-dom';

export function NotAuthorized() {
  return (
    <section className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-red-600">Not Authorized</h2>
      <p className="mt-4 text-gray-700">You do not have permission to view this page with your current role.</p>
      <Link to="/" className="mt-6 inline-block px-5 py-3 rounded-md bg-sky-600 text-white">Go Back Home</Link>
    </section>
  );
}
