import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext.tsx';
import type { Course, Block } from '../types/course';

const mockCourses: Course[] = [
  {
    id: 101,
    title: 'Aqua Essentials: Beginner Swim Confidence',
    description:
      'A supportive entry-level course for new swimmers. Focus on water confidence, breathing rhythm, and foundational stroke technique in a small-group setting.',
    capacity: 12,
    createdAt: '2026-04-01T08:00:00.000Z',
    isActive: true,
    instructor: { id: 11, email: 'coach.emma@aquafitpro.com', role: 'instructor' },
    blocks: [
      {
        id: 1001,
        courseId: 101,
        startDate: '2026-05-06T00:00:00.000Z',
        endDate: '2026-05-27T00:00:00.000Z',
        dayOfWeek: 'Monday',
        time: '6:00 PM',
        bookings: [
          { id: 1, userId: 101, blockId: 1001, status: 'PAID', createdAt: '2026-04-18T12:00:00.000Z' },
          { id: 2, userId: 102, blockId: 1001, status: 'PAID', createdAt: '2026-04-18T12:05:00.000Z' },
        ],
      },
    ],
  },
  {
    id: 102,
    title: 'Technique Tune-Up: Stroke Refinement',
    description:
      'Perfect your freestyle and backstroke with focused swim drills, video feedback, and coaching cues designed to improve efficiency, body position, and speed.',
    capacity: 10,
    createdAt: '2026-03-28T08:00:00.000Z',
    isActive: true,
    instructor: { id: 12, email: 'coach.jordan@aquafitpro.com', role: 'instructor' },
    blocks: [
      {
        id: 1002,
        courseId: 102,
        startDate: '2026-05-09T00:00:00.000Z',
        endDate: '2026-05-30T00:00:00.000Z',
        dayOfWeek: 'Thursday',
        time: '7:30 PM',
        bookings: [
          { id: 3, userId: 103, blockId: 1002, status: 'PAID', createdAt: '2026-04-19T09:30:00.000Z' },
        ],
      },
    ],
  },
  {
    id: 103,
    title: 'AquaFit Strength Circuit',
    description:
      'A dynamic water-based fitness course that combines resistance training, core conditioning, and interval drills to build strength while protecting joints.',
    capacity: 14,
    createdAt: '2026-04-05T08:00:00.000Z',
    isActive: true,
    instructor: { id: 13, email: 'coach.mia@aquafitpro.com', role: 'instructor' },
    blocks: [
      {
        id: 1003,
        courseId: 103,
        startDate: '2026-05-04T00:00:00.000Z',
        endDate: '2026-05-25T00:00:00.000Z',
        dayOfWeek: 'Saturday',
        time: '9:00 AM',
        bookings: [
          { id: 4, userId: 104, blockId: 1003, status: 'PAID', createdAt: '2026-04-20T10:15:00.000Z' },
          { id: 5, userId: 105, blockId: 1003, status: 'PAID', createdAt: '2026-04-20T10:20:00.000Z' },
          { id: 6, userId: 106, blockId: 1003, status: 'PENDING', createdAt: '2026-04-20T10:25:00.000Z' },
        ],
      },
    ],
  },
];

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
        const received = Array.isArray(response.data) && response.data.length > 0 ? response.data : mockCourses;
        setCourses(received);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setCourses(mockCourses);
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
      setStatus('Booking created successfully.');
    } catch (err: any) {
      console.error(err);
      setStatus(err.response?.data?.message || 'Booking failed.');
    }
  };

  const getPaidCount = (block: Block) =>
    (block.bookings ?? []).filter((b) => b.status === 'PAID').length;

  const displayedCourses = useMemo(() => {
    return courses.length > 0 ? courses : mockCourses;
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
              Explore a curated collection of swim and water fitness programs with expert instructors, structured sessions, and flexible booking blocks.
              Whether you are starting your first lessons or sharpening competitive skills, AquaFit Pro has a course built for you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="#course-list"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-100"
              >
                View Featured Courses
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15"
              >
                Book a Class
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/10 p-8 ring-1 ring-white/10 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-200">Course highlights</p>
            <ul className="mt-6 space-y-4">
              {courseHighlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">✓</span>
                  <span className="text-slate-100">{item}</span>
                </li>
              ))}
            </ul>
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
            <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Featured swim programs</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Select a course and reserve your next block.</h2>
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            Mock course options are included for discovery, so you can explore the full program lineup before booking.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {displayedCourses.map((course) => (
            <article key={course.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-sky-700 via-cyan-600 to-slate-900 px-6 py-6 text-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-sky-200">{course.instructor?.email ?? 'AquaFit coach'}</p>
                    <h3 className="mt-3 text-2xl font-semibold">{course.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                    Capacity {course.capacity}
                  </span>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8">
                <p className="text-sm leading-7 text-slate-600">{course.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.blocks.slice(0, 2).map((block) => {
                    const paidCount = getPaidCount(block);
                    const remaining = course.capacity - paidCount;
                    const isFull = remaining <= 0;

                    return (
                      <div key={block.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-semibold text-slate-900">{block.dayOfWeek} · {block.time}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {new Date(block.startDate).toLocaleDateString()} – {new Date(block.endDate).toLocaleDateString()}
                        </p>
                        <p className="mt-3 text-sm text-slate-600">
                          {paidCount} / {course.capacity} booked · {Math.max(remaining, 0)} spots left
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

                {course.blocks.length === 0 && (
                  <p className="mt-4 text-sm text-slate-500">No active booking blocks are available for this course yet.</p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">Professional coaching</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">Pool-based training</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-700">Small groups</span>
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
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl ring-1 ring-slate-900/20">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Why AquaFit Pro</p>
          <h2 className="mt-4 text-3xl font-bold">A complete pool experience</h2>
          <p className="mt-4 text-slate-300 leading-7">
            Our courses are built to support every level, from swim confidence to performance training. Enjoy expert coaching, focused progress, and a welcoming training community.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Dedicated progress tracking</h3>
            <p className="mt-3 text-slate-600">
              Track each block, celebrate milestones, and move steadily toward stronger, smarter swimming.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Modern pool facilities</h3>
            <p className="mt-3 text-slate-600">
              Train in a safe, clean environment with equipment and water exercises designed for optimal results.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Flexible scheduling</h3>
            <p className="mt-3 text-slate-600">
              Choose a block that fits your week, with evening and weekend sessions to match busy lifestyles.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Supportive coaching style</h3>
            <p className="mt-3 text-slate-600">
              Our instructors deliver clear feedback and inclusive coaching for every swimmer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};