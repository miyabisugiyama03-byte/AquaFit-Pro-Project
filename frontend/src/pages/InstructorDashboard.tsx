import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext';
import type { Course } from '../types/course';
import {
  formatSkillLevel,
  formatSessionsPerWeek,
  getBlockPrice,
} from '../utils/blockUtils';

export function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await api.get('/courses');
        setAllCourses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Instructor dashboard load failed', err);
        setError('Unable to load instructor course data at the moment.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const instructorCourses = useMemo(() => {
    if (!user) return [];

    return allCourses.filter(
        (course) =>
            course.instructor?.id === user.id ||
            course.instructor?.email.toLowerCase() === user.email.toLowerCase(),
    );
  }, [allCourses, user]);

  const totalCourses = instructorCourses.length;

  const totalBlocks = instructorCourses.reduce(
      (sum, course) => sum + course.blocks.length,
      0,
  );

  const paidEnrollments = instructorCourses.reduce(
      (sum, course) =>
          sum +
          course.blocks.reduce(
              (blockSum, block) =>
                  blockSum +
                  (block.bookings?.filter((booking) => booking.status === 'PAID')
                      .length ?? 0),
              0,
          ),
      0,
  );

  const pendingEnrollments = instructorCourses.reduce(
      (sum, course) =>
          sum +
          course.blocks.reduce(
              (blockSum, block) =>
                  blockSum +
                  (block.bookings?.filter((booking) => booking.status === 'PENDING')
                      .length ?? 0),
              0,
          ),
      0,
  );

  const nextBlocks = useMemo(() => {
    return instructorCourses
        .flatMap((course) =>
            course.blocks.map((block) => ({
              ...block,
              courseTitle: course.title,
              capacity: course.capacity,
            })),
        )
        .sort(
            (a, b) =>
                Number(new Date(a.startDate)) - Number(new Date(b.startDate)),
        )
        .slice(0, 5);
  }, [instructorCourses]);

  return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-900 via-cyan-700 to-slate-900 p-10 text-white shadow-2xl ring-1 ring-white/10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">
              Instructor HQ
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight">
              {user?.email ?? 'Instructor'} Dashboard
            </h1>

            <p className="max-w-3xl leading-7 text-slate-200">
              Manage your swim programs, monitor paid and pending enrollments,
              and keep your teaching schedule organised.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                Courses taught
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {loading ? '—' : totalCourses}
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                Active blocks
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {loading ? '—' : totalBlocks}
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                Paid enrollments
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {loading ? '—' : paidEnrollments}
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                Pending signups
              </p>
              <p className="mt-4 text-4xl font-semibold">
                {loading ? '—' : pendingEnrollments}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Your course operations
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  Teaching overview
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/courses')}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  View courses
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/create-course')}
                    className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500"
                >
                  Create course
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/create-block')}
                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-200"
                >
                  Add block
                </button>
              </div>
            </div>

            {error && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                  Loading course data…
                </div>
            ) : instructorCourses.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                  No courses are assigned to your account yet.
                </div>
            ) : (
                <div className="space-y-5">
                  {instructorCourses.map((course) => (
                      <article
                          key={course.id}
                          className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">
                              {course.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-600">
                              {course.blocks.length} block
                              {course.blocks.length !== 1 ? 's' : ''} · Capacity{' '}
                              {course.capacity}
                            </p>
                          </div>

                          <button
                              type="button"
                              onClick={() => navigate(`/edit-course/${course.id}`)}
                              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          >
                            Edit course
                          </button>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-slate-600">
                          {course.description ?? 'No description available.'}
                        </p>

                        {course.blocks.length > 0 && (
                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                              {course.blocks.map((block) => {
                                const paidCount =
                                    block.bookings?.filter(
                                        (booking) => booking.status === 'PAID',
                                    ).length ?? 0;

                                const pendingCount =
                                    block.bookings?.filter(
                                        (booking) => booking.status === 'PENDING',
                                    ).length ?? 0;

                                const remaining = course.capacity - paidCount;

                                return (
                                    <div
                                        key={block.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-4"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="font-semibold text-slate-900">
                                            {block.dayOfWeek} · {block.time}
                                          </p>

                                          <p className="mt-1 text-sm text-slate-500">
                                            {new Date(
                                                block.startDate,
                                            ).toLocaleDateString()}{' '}
                                            –{' '}
                                            {new Date(
                                                block.endDate,
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>

                                        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase text-sky-700">
                                {formatSkillLevel(block.skillLevel)}
                              </span>
                                      </div>

                                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-xl bg-slate-50 p-3">
                                          <p className="text-slate-500">Paid</p>
                                          <p className="font-semibold text-slate-900">
                                            {paidCount}
                                          </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                          <p className="text-slate-500">Pending</p>
                                          <p className="font-semibold text-slate-900">
                                            {pendingCount}
                                          </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                          <p className="text-slate-500">Spots left</p>
                                          <p className="font-semibold text-slate-900">
                                            {Math.max(remaining, 0)}
                                          </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-3">
                                          <p className="text-slate-500">Price</p>
                                          <p className="font-semibold text-slate-900">
                                            {getBlockPrice(
                                                block.startDate,
                                                block.endDate,
                                                block.sessionsPerWeek,
                                            )}
                                          </p>
                                        </div>
                                      </div>

                                      <p className="mt-3 text-xs text-slate-500">
                                        {formatSessionsPerWeek(block.sessionsPerWeek)}
                                      </p>
                                    </div>
                                );
                              })}
                            </div>
                        )}
                      </article>
                  ))}
                </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl ring-1 ring-white/10">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
                Upcoming blocks
              </p>

              <h3 className="mt-3 text-2xl font-bold">Next teaching schedule</h3>

              {loading ? (
                  <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-slate-300">
                    Loading schedule…
                  </div>
              ) : nextBlocks.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {nextBlocks.map((block) => {
                      const paidCount =
                          block.bookings?.filter(
                              (booking) => booking.status === 'PAID',
                          ).length ?? 0;

                      return (
                          <div
                              key={block.id}
                              className="rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10"
                          >
                            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">
                              {block.courseTitle}
                            </p>

                            <div className="mt-3 flex items-center justify-between gap-4">
                              <div>
                                <p className="text-lg font-semibold text-white">
                                  {block.dayOfWeek} · {block.time}
                                </p>

                                <p className="text-sm text-slate-400">
                                  {new Date(block.startDate).toLocaleDateString()}
                                </p>
                              </div>

                              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                          {paidCount}/{block.capacity}
                        </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100">
                          {formatSkillLevel(block.skillLevel)}
                        </span>

                              <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100">
                          {formatSessionsPerWeek(block.sessionsPerWeek)}
                        </span>

                              <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100">
                          {getBlockPrice(
                              block.startDate,
                              block.endDate,
                              block.sessionsPerWeek,
                          )}
                        </span>
                            </div>
                          </div>
                      );
                    })}
                  </div>
              ) : (
                  <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-slate-300">
                    No upcoming teaching blocks are scheduled yet.
                  </div>
              )}
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Instructor checklist
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4">
                  Review pending signups before class starts.
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  Check block capacity and update availability if needed.
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  Keep course descriptions and block times accurate.
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
  );
}