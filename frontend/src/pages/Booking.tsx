import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import type { Course, Block } from '../types/course';

export function Booking() {
  const [searchParams] = useSearchParams();
  const preBlockId = searchParams.get('blockId');

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(
      preBlockId ? Number(preBlockId) : null,
  );
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const flattenedBlocks: Array<{ courseTitle: string; block: Block }> =
      courses.flatMap((course) =>
          course.blocks.map((block) => ({
            courseTitle: course.title,
            block,
          })),
      );

  useEffect(() => {
    api.get('/courses')
        .then((res) => setCourses(res.data))
        .catch((err) => {
          console.error(err);
          setCourses([]);
        });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBlockId) {
      setStatus('Please select a block.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await api.post(`/bookings/${selectedBlockId}`);
      setStatus('Booking successful.');
    } catch (err: any) {
      console.error(err);
      setStatus(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-sky-800 mb-4">Book a Block</h2>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Block
              </label>
              <select
                  value={selectedBlockId ?? ''}
                  onChange={(e) =>
                      setSelectedBlockId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="mt-1 block w-full rounded border px-3 py-2"
              >
                <option value="">Select a block</option>
                {flattenedBlocks.map(({ courseTitle, block }) => (
                    <option key={block.id} value={block.id}>
                      {courseTitle} — {block.dayOfWeek} {block.time} (
                      {new Date(block.startDate).toLocaleDateString()} -{' '}
                      {new Date(block.endDate).toLocaleDateString()})
                    </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                  disabled={loading}
                  className="px-4 py-2 rounded bg-gradient-to-r from-teal-500 to-sky-600 text-white font-semibold"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
              {status && <div className="text-sm text-gray-700">{status}</div>}
            </div>
          </form>
        </div>
      </section>
  );
}