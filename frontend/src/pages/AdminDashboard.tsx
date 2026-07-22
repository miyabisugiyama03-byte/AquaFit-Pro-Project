import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { Course } from '../types/course';
import type { CurrentUser } from '../types/user';


const summaryCards = [
  {
    button: 'Go to courses',
    action: '/courses',
    style: 'bg-slate-900 text-white hover:bg-slate-800',
  },
  {
    button: 'Create course',
    action: '/create-course',
    style: 'bg-cyan-600 text-white hover:bg-cyan-500',
  },
  {
    button: 'Create block',
    action: '/create-block',
    style: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  },
];

function formatEuro(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function roleBadge(role: string) {
  const normalized = role.toUpperCase();

  if (normalized === 'ADMIN') return 'bg-rose-100 text-rose-700';
  if (normalized === 'INSTRUCTOR') return 'bg-indigo-100 text-indigo-700';
  return 'bg-emerald-100 text-emerald-700';
}

export function AdminDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [creditStatus, setCreditStatus] = useState<string | null>(null);
  const [addingCredit, setAddingCredit] = useState(false);

  const [roleUserId, setRoleUserId] = useState('');
  const [newRole, setNewRole] = useState('MEMBER');
  const [roleStatus, setRoleStatus] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);

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
  const memberCount = users.filter((user) => user.role.toLowerCase() === 'member').length;
  const adminCount = users.filter((user) => user.role.toLowerCase() === 'admin').length;
  const instructorCount = users.filter((user) => user.role.toLowerCase() === 'instructor').length;

  const pendingSeats = courses.reduce(
      (total, course) =>
          total +
          course.blocks.reduce(
              (blockTotal, block) =>
                  blockTotal + (block.bookings?.filter((booking) => booking.status === 'PENDING').length ?? 0),
              0,
          ),
      0,
  );

  const bookedSeats = courses.reduce(
      (total, course) =>
          total +
          course.blocks.reduce(
              (blockTotal, block) =>
                  blockTotal + (block.bookings?.filter((booking) => booking.status === 'PAID').length ?? 0),
              0,
          ),
      0,
  );

  const totalCreditCents = users.reduce(
      (total, user) => total + (user.creditBalanceCents ?? 0),
      0,
  );

  const recentCourses = useMemo(() => {
    return [...courses]
        .sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)))
        .slice(0, 3);
  }, [courses]);

  const memberUsers = useMemo(() => {
    return users.filter((user) => user.role.toLowerCase() === 'member');
  }, [users]);

  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreditStatus(null);

    const amountInEuro = Number(creditAmount);
    const userId = Number(selectedUserId);

    if (!userId) {
      setCreditStatus('Please select a member.');
      return;
    }

    if (!amountInEuro || amountInEuro <= 0) {
      setCreditStatus('Please enter a valid credit amount.');
      return;
    }

    const amountCents = Math.round(amountInEuro * 100);
    setAddingCredit(true);

    try {
      const res = await api.patch(`/users/${userId}/credit`, { amountCents });

      setUsers((prev) =>
          prev.map((user) =>
              user.id === userId
                  ? { ...user, creditBalanceCents: res.data.creditBalanceCents }
                  : user,
          ),
      );

      setCreditAmount('');
      setCreditStatus(`Added ${formatEuro(amountCents)} credit successfully.`);
    } catch (err: any) {
      console.error(err);
      setCreditStatus(err.response?.data?.message || 'Failed to add credit.');
    } finally {
      setAddingCredit(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoleStatus(null);

    const userId = Number(roleUserId);

    if (!userId) {
      setRoleStatus('Please select a user.');
      return;
    }

    setUpdatingRole(true);

    try {
      const res = await api.patch(`/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((prev) =>
          prev.map((user) =>
              user.id === userId ? { ...user, role: res.data.role } : user,
          ),
      );

      setRoleStatus('User role updated successfully.');
    } catch (err: any) {
      console.error(err);
      setRoleStatus(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-sky-900 p-10 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-200">
            Admin dashboard
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            AquaFit Pro Control Center
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-200">
            Manage users, credits, courses, booking activity, and operational priorities from one place.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['Total courses', totalCourses],
              ['Active courses', activeCourses],
              ['Members', memberCount],
              ['Instructors', instructorCount],
              ['Member credit', formatEuro(totalCreditCents)],
            ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-200">{label}</p>
                  <p className="mt-4 text-3xl font-semibold">{loading ? '—' : value}</p>
                </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                    Operational summary
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Current program health
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {summaryCards.map((card) => (
                      <button
                          key={card.button}
                          type="button"
                          onClick={() => navigate(card.action)}
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition ${card.style}`}
                      >
                        {card.button}
                      </button>
                  ))}
                </div>
              </div>

              {error && (
                  <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {error}
                  </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Booked seats</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {loading ? '–' : bookedSeats}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Paid bookings across available blocks.
                  </p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Pending spots</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {loading ? '–' : pendingSeats}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Pending registrations awaiting payment.
                  </p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin users</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {loading ? '–' : adminCount}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Users with privileged access.
                  </p>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Registered users</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {loading ? '–' : users.length}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Total user accounts.
                  </p>
                </article>
              </div>
            </div>

            <section className="rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Credit management
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Add credit to a member
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Credit is automatically applied before Stripe payment.
              </p>

              <form
                  onSubmit={handleAddCredit}
                  className="mt-6 grid gap-4 md:grid-cols-[1.4fr_0.8fr_auto] md:items-end"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700">Member</label>
                  <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select member</option>
                    {memberUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email} — {formatEuro(user.creditBalanceCents ?? 0)}
                        </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Credit amount (€)
                  </label>
                  <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      placeholder="50.00"
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  />
                </div>

                <button
                    type="submit"
                    disabled={addingCredit}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {addingCredit ? 'Adding...' : 'Add credit'}
                </button>
              </form>

              {creditStatus && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {creditStatus}
                  </div>
              )}
            </section>

            <section className="rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Role management
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Assign user roles
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Promote users to instructor or admin, or return them to member access.
              </p>

              <form
                  onSubmit={handleUpdateRole}
                  className="mt-6 grid gap-4 md:grid-cols-[1.4fr_0.8fr_auto] md:items-end"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700">User</label>
                  <select
                      value={roleUserId}
                      onChange={(e) => setRoleUserId(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email} — {user.role}
                        </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">New role</label>
                  <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <button
                    type="submit"
                    disabled={updatingRole}
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {updatingRole ? 'Updating...' : 'Update role'}
                </button>
              </form>

              {roleStatus && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    {roleStatus}
                  </div>
              )}
            </section>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
                Latest launches
              </p>
              <h3 className="mt-3 text-2xl font-bold">Recent courses</h3>

              <div className="mt-6 space-y-4">
                {loading ? (
                    <p className="text-slate-300">Loading recent courses…</p>
                ) : recentCourses.length > 0 ? (
                    recentCourses.map((course) => (
                        <div key={course.id} className="rounded-3xl bg-slate-900 p-5 ring-1 ring-white/10">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                                Course
                              </p>
                              <h4 className="mt-2 text-lg font-semibold text-white">
                                {course.title}
                              </h4>
                            </div>

                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                        Cap {course.capacity}
                      </span>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-slate-300">
                            {course.description ?? 'No description available.'}
                          </p>

                          <div className="mt-4 text-sm text-slate-400">
                            {course.instructor?.email ?? 'Unassigned instructor'} ·{' '}
                            {course.blocks.length} block{course.blocks.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                    ))
                ) : (
                    <p className="rounded-3xl bg-slate-900 p-5 text-slate-300">
                      No recent courses available.
                    </p>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                User snapshot
              </p>
              <div className="mt-5 space-y-3">
                {users.slice(0, 6).map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {user.email}
                        </p>
                        <p className="text-xs text-slate-500">
                          Credit: {formatEuro(user.creditBalanceCents ?? 0)}
                        </p>
                      </div>

                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadge(user.role)}`}>
                    {user.role}
                  </span>
                    </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
  );
}