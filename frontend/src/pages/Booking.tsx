import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api'; //axios instance (with token)

interface Course {
  id: number;
  title: string;
}

export function Booking() {
  const [searchParams] = useSearchParams();
  const preCourseId = searchParams.get('courseId');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
      preCourseId ? Number(preCourseId) : null
  );
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/courses')
        .then(res => setCourses(res.data))
        .catch(() => setCourses([]));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourseId) {
      return setStatus('Please select a course');
    }

    setLoading(true);

    try {
      await api.post(`/bookings/course/${selectedCourseId}`);
      setStatus('✅ Booking successful!');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setStatus('❌ You must be logged in');
      } else {
        setStatus('❌ Booking failed (maybe full or already booked)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-sky-800 mb-4">
            Book a Course
          </h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course
              </label>
              <select
                  value={selectedCourseId ?? ''}
                  onChange={(e) =>
                      setSelectedCourseId(
                          e.target.value ? Number(e.target.value) : null
                      )
                  }
                  className="mt-1 block w-full rounded border px-3 py-2"
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                ))}
              </select>
            </div>

            <button
                disabled={loading}
                className="px-4 py-2 rounded bg-gradient-to-r from-teal-500 to-sky-600 text-white font-semibold"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>

            {status && (
                <div className="text-sm text-gray-700">{status}</div>
            )}
          </form>
        </div>
      </section>
  );
}