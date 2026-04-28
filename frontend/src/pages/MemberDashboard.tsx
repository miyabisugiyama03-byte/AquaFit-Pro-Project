import { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import type { MyBooking } from '../types/booking';
import { Link, useSearchParams } from 'react-router-dom';

export function MemberDashboard() {
    const [bookings, setBookings] = useState<MyBooking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('payment') === 'success') {
            setBookingStatus('Payment successful. Your session is confirmed.');
        }

        if (searchParams.get('payment') === 'cancelled') {
            setBookingStatus('Payment cancelled. Your booking is still pending.');
        }
    }, [searchParams]);

    useEffect(() => {
        api.get('/bookings/me')
            .then((res) => {
                setBookings(res.data);
                setLoadingBookings(false);
            })
            .catch((err) => {
                console.error(err);
                setBookingStatus('Failed to load bookings. Please try again later.');
                setLoadingBookings(false);
            });
    }, []);

    const upcomingBookings = useMemo(() => {
        return [...bookings]
            .filter((booking) => booking.status !== 'CANCELLED')
            .sort(
                (a, b) =>
                    Number(new Date(a.block.startDate)) - Number(new Date(b.block.startDate)),
            );
    }, [bookings]);

    const bookingCounts = useMemo(
        () => ({
            total: bookings.length,
            upcoming: bookings.filter((booking) => booking.status !== 'CANCELLED').length,
            paid: bookings.filter((booking) => booking.status === 'PAID').length,
            pending: bookings.filter((booking) => booking.status === 'PENDING').length,
        }),
        [bookings],
    );

    const handlePayNow = async (bookingId: number) => {
        try {
            const res = await api.post(`/payments/checkout/${bookingId}`);

            if (res.data.url) {
                window.location.assign(res.data.url);
            }
        } catch (err: any) {
            console.error(err);
            setBookingStatus(err.response?.data?.message || 'Failed to start payment.');
        }
    };

    const handleCancelBooking = async (blockId: number) => {
        if (!confirm('Cancel this booking?')) return;

        try {
            await api.delete(`/bookings/${blockId}`);
            setBookings((prev) =>
                prev.map((booking) =>
                    booking.block.id === blockId
                        ? { ...booking, status: 'CANCELLED' }
                        : booking,
                ),
            );
            setBookingStatus('Booking cancelled successfully.');
        } catch (err: any) {
            console.error(err);
            setBookingStatus(err.response?.data?.message || 'Failed to cancel booking.');
        }
    };

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <div className="rounded-[2rem] bg-gradient-to-r from-sky-700 via-cyan-600 to-slate-900 p-10 text-white shadow-2xl ring-1 ring-white/10">
                <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Member dashboard</p>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Welcome back to AquaFit Pro
                    </h1>
                    <p className="mt-4 text-base leading-7 text-cyan-100 sm:text-lg">
                        Your swimming progress, upcoming sessions, and membership essentials all in one place.
                        Stay ahead of your schedule and keep your swim plan on track.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Total bookings</p>
                            <p className="mt-4 text-3xl font-semibold">{loadingBookings ? '—' : bookingCounts.total}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Upcoming sessions</p>
                            <p className="mt-4 text-3xl font-semibold">{loadingBookings ? '—' : bookingCounts.upcoming}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Paid classes</p>
                            <p className="mt-4 text-3xl font-semibold">{loadingBookings ? '—' : bookingCounts.paid}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10">
                            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Pending payments</p>
                            <p className="mt-4 text-3xl font-semibold">{loadingBookings ? '—' : bookingCounts.pending}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                <section className="space-y-6 rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Latest activity</p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900">Your upcoming sessions</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/courses"
                                className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                            >
                                Browse classes
                            </Link>
                            <Link
                                to="/contact"
                                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Contact support
                            </Link>
                        </div>
                    </div>

                    {bookingStatus ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                            {bookingStatus}
                        </div>
                    ) : null}

                    {loadingBookings ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                            Loading bookings...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                            You have no current bookings. Explore classes to start your next swim program.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => {
                                const startDate = new Date(booking.block.startDate);
                                const endDate = new Date(booking.block.endDate);
                                return (
                                    <article
                                        key={booking.id}
                                        className="rounded-[1.75rem] border border-slate-200 p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                                                        {booking.status}
                                                    </span>
                                                    <span className="text-sm text-slate-500">
                                                        {booking.block.dayOfWeek} · {booking.block.time}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    {booking.block.course.title}
                                                </h3>

                                                <p className="text-sm leading-6 text-slate-600">
                                                    {startDate.toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}{' '}
                                                    —{' '}
                                                    {endDate.toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handlePayNow(booking.id)}
                                                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                                    >
                                                        Pay now
                                                    </button>
                                                )}
                                                {booking.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.block.id)}
                                                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Cancel booking
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <aside className="space-y-6 rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl ring-1 ring-white/10">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Member support</p>
                        <h2 className="mt-2 text-2xl font-bold">Stay on top of your plan</h2>
                    </div>

                    <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
                        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Next session</p>
                        <p className="mt-3 text-3xl font-semibold text-white">
                            {loadingBookings || upcomingBookings.length === 0
                                ? 'No upcoming class'
                                : `${upcomingBookings[0].block.course.title}`}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            {upcomingBookings.length > 0
                                ? `${upcomingBookings[0].block.dayOfWeek} at ${upcomingBookings[0].block.time}`
                                : 'Book a session to see your next swim lesson here.'}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
                        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Wellness note</p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                            Remember to arrive early, hydrate well, and review your swim goal after every session. Consistency is the fastest way to improve.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-slate-900 p-6 ring-1 ring-white/10">
                        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Quick actions</p>
                        <div className="mt-4 space-y-3">
                            <Link
                                to="/courses"
                                className="block rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 text-center transition hover:bg-slate-100"
                            >
                                Reserve a new class
                            </Link>
                            <Link
                                to="/contact"
                                className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-cyan-200 text-center transition hover:bg-white/10"
                            >
                                Ask support a question
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
