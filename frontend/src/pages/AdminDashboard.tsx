import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-red-700 mb-6">
                 Admin Dashboard
            </h1>

            <div className="grid gap-4">

                <button
                    onClick={() => navigate('/courses')}
                    className="p-4 bg-white shadow rounded hover:bg-red-50"
                >
                    Manage Courses
                </button>

                <button
                    onClick={() => navigate('/create-course')}
                    className="p-4 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Create Course
                </button>

                <button
                    onClick={() => navigate('/users')}
                    className="p-4 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                    Manage Users
                </button>

            </div>
        </div>
    );
}