import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext.tsx';
import type { Course, Block } from '../types/course';

export const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);

    const navigate = useNavigate();
    const { role, isAuthenticated } = useAuth();

    useEffect(() => {
        api.get('/courses')
            .then((response) => {
                setCourses(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                setLoading(false);
            });
    }, []);

    const handleDeleteCourse = async (id: number) => {
        if (!confirm('Are you sure you want to deactivate this course?')) return;

        try {
            await api.delete(`/courses/${id}`);
            setCourses((prev) => prev.filter((course) => course.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to remove course');
        }
    };

    const handleBookBlock = async (blockId: number) => {
        setStatus(null);

        if (!isAuthenticated) {
            setStatus('You must be logged in to book a block.');
            return;
        }

        try {
            await api.post(`/bookings/${blockId}`);
            setStatus('Booking created successfully.');
        } catch (err: any) {
            console.error(err);
            setStatus(err.response?.data?.message || 'Booking failed.');
        }
    };

    const getPaidCount = (block: Block) =>
        (block.bookings ?? []).filter((b) => b.status === 'PAID').length;

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    return (
        <div className="p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">
                🏊 Available Courses
            </h1>

            {status && (
                <div className="mb-4 rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {status}
                </div>
            )}

            <div className="grid gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="border p-5 rounded shadow bg-white hover:bg-blue-50 transition"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {course.title}
                                </h2>
                                <p className="text-sm text-gray-500 mb-1">
                                    Instructor: {course.instructor?.email ?? 'Unassigned'}
                                </p>
                            </div>

                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Capacity: {course.capacity}
              </span>
                        </div>

                        <p className="text-gray-700 mt-3">
                            {course.description || 'No description provided.'}
                        </p>

                        <div className="mt-5">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Scheduled Blocks
                            </h3>

                            {course.blocks.length === 0 ? (
                                <p className="text-sm text-gray-500">No blocks scheduled yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {course.blocks.map((block) => {
                                        const paidCount = getPaidCount(block);
                                        const remaining = course.capacity - paidCount;
                                        const isFull = remaining <= 0;

                                        return (
                                            <div
                                                key={block.id}
                                                className="rounded border border-slate-200 p-3 bg-slate-50"
                                            >
                                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {block.dayOfWeek} at {block.time}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {new Date(block.startDate).toLocaleDateString()} -{' '}
                                                            {new Date(block.endDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {paidCount} / {course.capacity} booked · {Math.max(remaining, 0)} spots left
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleBookBlock(block.id)}
                                                            disabled={isFull}
                                                            className="px-3 py-1 rounded bg-gradient-to-r from-teal-400 to-sky-500 text-white text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                        >
                                                            {isFull ? 'Full' : 'Book Block'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {(role === 'admin' || role === 'instructor') && (
                            <div className="mt-4 flex gap-2 flex-wrap">
                                <button
                                    onClick={() => navigate(`/edit-course/${course.id}`)}
                                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                                >
                                    Edit Course
                                </button>

                                <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                                >
                                    Remove Course
                                </button>

                                <Link
                                    to={`/create-block?courseId=${course.id}`}
                                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded"
                                >
                                    Add Block
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};