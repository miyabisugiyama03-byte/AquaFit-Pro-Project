import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import type { Course, SessionsPerWeek, SkillLevel } from '../types/course';

function getBlockWeeks(startDate: string, endDate: string) {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const diff = end.getTime() - start.getTime();

    if (diff <= 0) return 0;

    return Math.max(1, Math.ceil(diff / millisecondsPerWeek));
}

function getBlockPrice(startDate: string, endDate: string, sessions: SessionsPerWeek) {
    const weeks = getBlockWeeks(startDate, endDate);

    if (weeks === 0) return '—';

    if (sessions === 'TWO') {
        return `€${weeks * 2 * 13}`;
    }

    return `€${weeks * 15}`;
}

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
    const [skillLevel, setSkillLevel] = useState<SkillLevel>('BEGINNER');
    const [sessionsPerWeek, setSessionsPerWeek] =
        useState<SessionsPerWeek>('ONE');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const weeks = getBlockWeeks(startDate, endDate);
    const price = getBlockPrice(startDate, endDate, sessionsPerWeek);

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

        if (new Date(endDate) <= new Date(startDate)) {
            setError('End date must be after start date.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/blocks', {
                courseId: Number(courseId),
                startDate,
                endDate,
                dayOfWeek,
                time,
                skillLevel,
                sessionsPerWeek,
            });

            navigate('/courses');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create block.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">Create Block</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Course
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Day of Week
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700">
                        Time
                    </label>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                        placeholder="18:00"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Skill Level
                    </label>
                    <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                        required
                    >
                        <option value="BEGINNER">Beginner</option>
                        <option value="IMPROVER">Improver</option>
                        <option value="DEVELOPMENT">Development</option>
                        <option value="ADVANCED">Advanced</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Sessions Per Week
                    </label>
                    <select
                        value={sessionsPerWeek}
                        onChange={(e) =>
                            setSessionsPerWeek(e.target.value as SessionsPerWeek)
                        }
                        className="mt-1 w-full border border-slate-300 rounded p-2"
                        required
                    >
                        <option value="ONE">1 session/week - €15 per session</option>
                        <option value="TWO">2 sessions/week - €13 per session</option>
                    </select>
                </div>

                <div className="rounded bg-sky-50 border border-sky-100 p-3 text-sm text-sky-800">
                    <p className="font-semibold">Estimated block price: {price}</p>
                    {weeks > 0 && (
                        <p className="mt-1 text-xs">
                            {weeks} week{weeks === 1 ? '' : 's'} ·{' '}
                            {sessionsPerWeek === 'TWO'
                                ? '2 sessions/week at €13 per session'
                                : '1 session/week at €15 per session'}
                        </p>
                    )}
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
                >
                    {loading ? 'Creating...' : 'Create Block'}
                </button>
            </form>
        </div>
    );
}