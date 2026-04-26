import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import type { Course } from '../types/course';

export function CreateBlock() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCourseId = searchParams.get('courseId');

    const [courses, setCourses] = useState<Course[]>([]);
    const [courseId, setCourseId] = useState(preselectedCourseId || '');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/courses')
            .then((res) => setCourses(res.data))
            .catch((err) => {
                console.error(err);
                setCourses([]);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/blocks', {
                courseId: Number(courseId),
                startDate,
                endDate,
                dayOfWeek,
                time,
            });

            navigate('/courses');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create block.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Create Block</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
    <div>
        <label className="block text-sm font-medium text-gray-700">Course</label>
        <select
    value={courseId}
    onChange={(e) => setCourseId(e.target.value)}
    className="mt-1 w-full border border-slate-300 rounded p-2"
    required
    >
    <option value="">Select a course</option>
    {courses.map((course) => (
        <option key={course.id} value={course.id}>
        {course.title}
        </option>
    ))}
    </select>
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700">Start Date</label>
    <input
    type="datetime-local"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="mt-1 w-full border border-slate-300 rounded p-2"
    required
    />
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700">End Date</label>
    <input
    type="datetime-local"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="mt-1 w-full border border-slate-300 rounded p-2"
    required
    />
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700">Day of Week</label>
    <input
    type="text"
    value={dayOfWeek}
    onChange={(e) => setDayOfWeek(e.target.value)}
    className="mt-1 w-full border border-slate-300 rounded p-2"
    placeholder="Monday"
    required
    />
    </div>

    <div>
    <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
    type="text"
    value={time}
    onChange={(e) => setTime(e.target.value)}
    className="mt-1 w-full border border-slate-300 rounded p-2"
    placeholder="18:00"
    required
    />
    </div>

    {error && <p className="text-sm text-red-500">{error}</p>}

        <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
            >
            Create Block
    </button>
    </form>
    </div>
    );
    }