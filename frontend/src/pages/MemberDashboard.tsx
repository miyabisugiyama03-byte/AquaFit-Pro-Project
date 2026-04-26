import { useEffect, useState } from 'react';
import api from '../api/api';
import type { MyBooking } from '../types/booking';
import { Link } from 'react-router-dom';

export function MemberDashboard() {
    const [bookings, setBookings] = useState<MyBooking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [bookingStatus, setBookingStatus] = useState<string | null>(null);

    useEffect(() => {
        api.get('/bookings/me')
            .then((res) => {
                setBookings(res.data);
                setLoadingBookings(false);
            })
            .catch((err) => {
                console.error(err);
                setBookingStatus('Failed to load bookings.');
                setLoadingBookings(false);
            });
    }, []);

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
            setBookingStatus(
                err.response?.data?.message || 'Failed to cancel booking.',
            );
        }
    };

    return (
        <section className="max-w-6xl mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-sky-900">Member Dashboard</h2>
            <p className="mt-3 text-gray-700">
                Only members can access this page. Here you can track your booked
                sessions, view personal progress, and manage your membership profile.
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
                <Link
                    to="/courses"
                    className="px-4 py-2 rounded bg-sky-600 text-white font-semibold hover:bg-sky-700"
                >
                    Browse Courses
                </Link>
            </div>

            <section className="mt-10">
                <h3 className="text-2xl font-bold text-sky-800 mb-4">My Bookings</h3>

                {bookingStatus && (
                    <div className="mb-4 rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        {bookingStatus}
                    </div>
                )}

                {loadingBookings ? (
                    <p className="text-gray-600">Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <div className="rounded border border-slate-200 bg-white p-4 shadow">
                        <p className="text-gray-600">You have no bookings yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="border rounded p-4 shadow bg-white"
                            >
                                <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">
                                            {booking.block.course.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {booking.block.dayOfWeek} at {booking.block.time}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.block.startDate).toLocaleDateString()} -{' '}
                                            {new Date(booking.block.endDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Status:{' '}
                                            <span className="font-medium">{booking.status}</span>
                                        </p>
                                    </div>

                                    {booking.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => handleCancelBooking(booking.block.id)}
                                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </section>
    );
}