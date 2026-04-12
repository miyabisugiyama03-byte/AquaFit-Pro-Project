import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext.tsx';

// Define what the data looks like
interface Course {
    id: number;
    title: string;
    startDate: string;
    capacity: number;
    description: string;

    instructor: {
        id: number;
        email: string;
        role: string;
    };
}

export const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { role } = useAuth();

    // Fetch courses
    useEffect(() => {
        api.get('/courses')
            .then((response) => {
                console.log('Data received:', response.data);
                setCourses(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, []);

    // Delete course
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            await api.delete(`/courses/${id}`);
            setCourses((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete course');
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">
                🏊 Available Courses
            </h1>

            <div className="grid gap-4">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="border p-4 rounded shadow bg-white hover:bg-blue-50 transition"
                    >
                        {/* Top section */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {course.title}
                                </h2>
                                <p className="text-sm text-gray-500 mb-1">
                                    Instructor: {course.instructor?.email || 'Unknown'}
                                </p>
                            </div>

                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {course.capacity} spots
              </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 mt-2">{course.description}</p>

                        {/* Bottom section */}
                        <div className="mt-4 flex items-center justify-between gap-4">

                            <div className="text-sm text-gray-500 font-medium">
                                Starts:{' '}
                                {new Date(course.startDate).toLocaleDateString()}
                            </div>

                            <div className="flex gap-2 ml-auto">

                                {/* Book button (everyone) */}
                                <Link
                                    to={`/booking?courseId=${course.id}`}
                                    className="px-3 py-1 rounded bg-gradient-to-r from-teal-400 to-sky-500 text-white text-sm font-medium"
                                >
                                    Book
                                </Link>

                                {/* Instructor/Admin only */}
                                {(role === 'admin' || role === 'instructor') && (
                                    <>
                                        <button
                                            onClick={() =>
                                                navigate(`/edit-course/${course.id}`)
                                            }
                                            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};