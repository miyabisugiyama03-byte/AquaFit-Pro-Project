export function About() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-sky-900 mb-4">About AquaFit Pro</h1>

            <p className="text-gray-700 max-w-3xl mb-8">
                AquaFit Pro provides structured aquatic fitness, swimming development,
                and triathlon-focused training support. Our aim is to help members build
                confidence, improve technique, and progress safely through guided classes
                and coaching.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
                    <h2 className="text-xl font-semibold text-sky-800 mb-3">
                        Our Instructors
                    </h2>
                    <p className="text-gray-700">
                        Our instructors bring experience in swim coaching, aquatic fitness,
                        and athlete development. Each session is designed to support
                        progression, safety, and confidence in the water.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
                    <h2 className="text-xl font-semibold text-sky-800 mb-3">
                        Qualifications & Experience
                    </h2>
                    <p className="text-gray-700">
                        Instructor qualifications, achievements, and specialist areas can be
                        highlighted here, including swimming instruction, triathlon coaching,
                        water safety, and fitness training.
                    </p>
                </div>
            </div>

            <section>
                <h2 className="text-2xl font-bold text-sky-900 mb-4">Gallery</h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="h-40 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-medium">
                        Class Photo
                    </div>
                    <div className="h-40 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                        Training Event
                    </div>
                    <div className="h-40 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        Pool Session
                    </div>
                </div>
            </section>
        </section>
    );
}