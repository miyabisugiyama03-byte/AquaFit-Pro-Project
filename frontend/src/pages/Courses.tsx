import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext.tsx';
import type { Course, Block } from '../types/course';

import {
  formatSkillLevel,
  formatSessionsPerWeek,
  getBlockPrice,
} from '../utils/blockUtils';

const courseHighlights = [
  'Expert swim coaching with weekly progress checks',
  'Small groups keep each session focused and personal',
  'Programs built for technique, endurance, and recovery',
  'Flexible blocks for busy schedules',
];



export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    api
        .get('/courses')
        .then((response) => {
          setCourses(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
          setStatus('Failed to load courses.');
          setCourses([]);
        })
        .finally(() => {
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
      setStatus('Booking created successfully. Go to your member dashboard to complete payment.');
    } catch (err: any) {
      console.error(err);
      setStatus(err.response?.data?.message || 'Booking failed.');
    }
  };

  const getPaidCount = (block: Block) =>
      (block.bookings ?? []).filter((b) => b.status === 'PAID').length;

  const totalBlocks = useMemo(() => {
    return courses.reduce((total, course) => total + course.blocks.length, 0);
  }, [courses]);

  if (loading) {
    return <div className="p-10">Loading courses…</div>;
  }

  return (
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 px-8 py-12 text-white shadow-2xl ring-1 ring-slate-800">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div>
              <p className="inline-flex rounded-full bg-sky-200/15 px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-sky-100">
                Choose your next swim course
              </p>

              <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">
                Professional aquatic training designed for every swimmer.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Explore swim and water fitness programs with expert instructors,
                structured sessions, skill levels, and flexible booking blocks.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                    href="#course-list"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100"
                >
                  View Courses
                </a>

                {isAuthenticated && (
                    <Link
                        to="/member"
                        className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
                    >
                      My Bookings
                    </Link>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/10 p-8 ring-1 ring-white/10 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-200">
                Course highlights
              </p>

              <ul className="mt-6 space-y-4">
                {courseHighlights.map((item) => (
                    <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                    ✓
                  </span>
                      <span className="text-slate-100">{item}</span>
                    </li>
                ))}
              </ul>

              <div className="mt-8 rounded-3xl bg-white/10 p-4 text-sm text-slate-100">
                {courses.length} active courses · {totalBlocks} active blocks
              </div>
            </div>
          </div>
        </section>

        {status && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
              {status}
            </div>
        )}

        <section id="course-list" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">
                Swim programs
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Select a course and reserve your next block.
              </h2>
            </div>

            <p className="max-w-xl text-sm text-slate-600">
              Prices are based on weekly session frequency. Bookings begin as
              pending and are secured after payment.
            </p>
          </div>

          {courses.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow">
                <h3 className="text-xl font-semibold text-slate-900">
                  No courses available yet
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Please check back later for upcoming AquaFit Pro blocks.
                </p>
              </div>
          ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                {courses.map((course) => (
                    <article
                        key={course.id}
                        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="bg-gradient-to-r from-sky-700 via-cyan-600 to-slate-900 px-6 py-6 text-white">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-sky-200">
                              {course.instructor?.email ?? 'AquaFit coach'}
                            </p>

                            <h3 className="mt-3 text-2xl font-semibold">
                              {course.title}
                            </h3>
                          </div>

                          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                      Capacity {course.capacity}
                    </span>
                        </div>
                      </div>

                      <div className="px-6 py-6 sm:px-8">
                        <p className="text-sm leading-7 text-slate-600">
                          {course.description || 'No description provided.'}
                        </p>

                        {course.blocks.length === 0 ? (
                            <p className="mt-4 text-sm text-slate-500">
                              No active booking blocks are available for this course yet.
                            </p>
                        ) : (
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                              {course.blocks.map((block) => {
                                const paidCount = getPaidCount(block);
                                const remaining = course.capacity - paidCount;
                                const isFull = remaining <= 0;

                                return (
                                    <div
                                        key={block.id}
                                        className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                      <p className="font-semibold text-slate-900">
                                        {block.dayOfWeek} · {block.time}
                                      </p>

                                      <p className="mt-2 text-sm text-slate-600">
                                        {new Date(block.startDate).toLocaleDateString()} –{' '}
                                        {new Date(block.endDate).toLocaleDateString()}
                                      </p>

                                      <p className="mt-2 text-sm text-slate-600">
                                        Level: {formatSkillLevel(block.skillLevel)}
                                      </p>

                                      <p className="mt-1 text-sm font-semibold text-sky-700">
                                        {formatSessionsPerWeek(block.sessionsPerWeek)} ·{' '}
                                        {getBlockPrice(block.startDate, block.endDate, block.sessionsPerWeek)}
                                      </p>

                                      <p className="mt-3 text-sm text-slate-600">
                                        {paidCount} / {course.capacity} booked ·{' '}
                                        {Math.max(remaining, 0)} spots left
                                      </p>

                                      <button
                                          onClick={() => handleBookBlock(block.id)}
                                          disabled={isFull}
                                          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-300"
                                      >
                                        {isFull ? 'Full' : 'Reserve Spot'}
                                      </button>
                                    </div>
                                );
                              })}
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">
                      Professional coaching
                    </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">
                      Pool-based training
                    </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">
                      Small groups
                    </span>
                        </div>
                      </div>

                      {(role === 'admin' || role === 'instructor') && (
                          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
                            <div className="flex flex-wrap gap-3">
                              <button
                                  onClick={() => navigate(`/edit-course/${course.id}`)}
                                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                              >
                                Edit Course
                              </button>

                              <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                              >
                                Remove Course
                              </button>

                              <Link
                                  to={`/create-block?courseId=${course.id}`}
                                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                Add Block
                              </Link>
                            </div>
                          </div>
                      )}
                    </article>
                ))}
              </div>
          )}
        </section>
      </main>
  );
};