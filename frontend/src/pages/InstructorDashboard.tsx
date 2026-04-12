import { useNavigate } from 'react-router-dom';

export function InstructorDashboard() {
    const navigate = useNavigate();

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">
                Instructor Dashboard
            </h1>

            <div className="grid gap-4">

                <button
                    onClick={() => navigate('/courses')}
                    className="p-4 bg-white shadow rounded hover:bg-blue-50"
                >
                    View All Courses
                </button>

                <button
                    onClick={() => navigate('/create-course')}
                    className="p-4 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Create New Course
                </button>

            </div>
        </div>
    );
}