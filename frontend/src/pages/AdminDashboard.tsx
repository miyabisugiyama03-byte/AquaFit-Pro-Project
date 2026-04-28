import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Course } from '../types/course';

interface UserSummary {
  id: number;
  email: string;
  role: string;
}

const summaryCards = [
  {
    title: 'Manage courses',
    description: 'Add new swim programs, update schedules, or deactivate legacy classes.',
    button: 'Go to courses',
    action: '/courses',
    style: 'bg-slate-900 text-white hover:bg-slate-800',
  },
  {
    title: 'Create new course',
    description: 'Launch a new program with instructor details, capacity, and swim blocks.',
    button: 'Create course',
    action: '/create-course',
    style: 'bg-cyan-600 text-white hover:bg-cyan-500',
  },
  {
    title: 'Add course block',
    description: 'Build new weekly blocks to fill your seasonal schedule.',
    button: 'Create block',
    action: '/create-block',
    style: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [coursesResponse, usersResponse] = await Promise.all([
          api.get('/courses'),
          api.get('/users'),
        ]);

        setCourses(Array.isArray(coursesResponse.data) ? coursesResponse.data : []);
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
      } catch (err) {
        console.error('Admin dashboard load failed', err);
        setError('Unable to load dashboard data right now.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalCourses = courses.length;
  const activeCourses = courses.filter((course) => course.isActive !== false).length;
  const instructorCount = new Set(courses.map((course) => course.instructor?.id).filter(Boolean)).size;
  const memberCount = users.filter((user) => user.role.toLowerCase() === 'member').length;
  const adminCount = users.filter((user) => user.role.toLowerCase() === 'admin').length;
  const pendingSeats = courses.reduce(
    (total, course) =>
      total +
      course.blocks.reduce(
        (blockTotal, block) =>
          blockTotal +
          (block.bookings?.filter((booking) => booking.status === 'PENDING').length ?? 0),
        0,
      ),
    0,
  );
  const bookedSeats = courses.reduce(
    (total, course) =>
      total +
      course.blocks.reduce(
        (blockTotal, block) =>
          blockTotal +
          (block.bookings?.filter((booking) => booking.status === 'PAID').length ?? 0),
        0,
      ),
    0,
  );

  const recentCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
      .slice(0, 3);
  }, [courses]);

  return (
    <div className="px-6 py-10 mx-auto max-w-7xl">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 p-10 text-white shadow-2xl ring-1 ring-white/10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-200">Admin dashboard</p>
          <h1 className="text-4xl font-extrabold tracking-tight">AquaFit Pro Control Center</h1>
          <p className="max-w-3xl text-slate-200 leading-7">
            Review membership trends, course health, and operational priorities from one place. Use this dashboard to keep your swim programs on schedule and responsive to member demand.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-200">Total courses</p>
            <p className="mt-4 text-4xl font-semibold">{loading ? '—' : totalCourses}</p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-200">Active courses</p>
            <p className="mt-4 text-4xl font-semibold">{loading ? '—' : activeCourses}</p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-200">Total members</p>
            <p className="mt-4 text-4xl font-semibold">{loading ? '—' : memberCount}</p>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-200">Instructors</p>
            <p className="mt-4 text-4xl font-semibold">{loading ? '—' : instructorCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Operational summary</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Current program health</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {summaryCards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => navigate(card.action)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition ${card.style}`}
                >
                  {card.button}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Booked seats</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '–' : bookedSeats}</p>
              <p className="mt-2 text-sm text-slate-600">Paid bookings across all available blocks.</p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pending spots</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '–' : pendingSeats}</p>
              <p className="mt-2 text-sm text-slate-600">Pending registrations that may convert into revenue.</p>
            </article>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin users</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '–' : adminCount}</p>
              <p className="mt-2 text-sm text-slate-600">Users with privileged site management access.</p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Member growth</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? '–' : users.length}</p>
              <p className="mt-2 text-sm text-slate-600">Total registered users in the system.</p>
            </article>
          </div>
        </section>

        <aside className="space-y-6 rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl ring-1 ring-white/10">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Quick snapshot</p>
            <h3 className="mt-3 text-2xl font-bold">Latest course launches</h3>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-slate-300">Loading recent courses…</div>
            ) : recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div key={course.id} className="rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Course</p>
                      <h4 className="mt-2 text-xl font-semibold text-white">{course.title}</h4>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                      Cap {course.capacity}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{course.description ?? 'No description available.'}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                    <span>{course.instructor?.email ?? 'Unassigned instructor'}</span>
                    <span className="before:mr-2 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-slate-500">
                      {course.blocks.length} block{course.blocks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-900 p-5 text-slate-300">No recent courses available.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}