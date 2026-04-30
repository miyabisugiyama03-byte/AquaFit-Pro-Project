export function OpeningHours() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-sky-900 mb-6">Opening Hours</h1>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
                    <h2 className="text-xl font-semibold text-sky-800 mb-4">
                        Weekly Schedule
                    </h2>

                    <ul className="space-y-3 text-gray-700">
                        <li className="flex justify-between">
                            <span>Monday</span>
                            <span>7:00 AM - 9:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Tuesday</span>
                            <span>7:00 AM - 9:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Wednesday</span>
                            <span>7:00 AM - 9:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Thursday</span>
                            <span>7:00 AM - 9:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Friday</span>
                            <span>7:00 AM - 8:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Saturday</span>
                            <span>8:00 AM - 6:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Sunday</span>
                            <span>9:00 AM - 5:00 PM</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <img
                        src="/images/opening-hours-pool.jpg"
                        alt="Swimming pool opening hours"
                        className="w-full rounded-xl shadow object-cover"
                    />
                </div>
            </div>
        </section>
    );
}