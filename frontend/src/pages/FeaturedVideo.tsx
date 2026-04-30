export function FeaturedVideo() {
    return (
        <section className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-sky-900 mb-4">
                Featured Swimming Video
            </h1>

            <p className="text-gray-700 mb-6 max-w-3xl">
                Watch our latest featured video for swimming technique, training tips,
                and AquaFit Pro learning support. This video can be updated every two
                months to keep content fresh for members.
            </p>

            <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
                <iframe
                    className="w-full aspect-video rounded-lg"
                    src="https://www.youtube.com/embed/VIDEO_ID_HERE"
                    title="Featured AquaFit Pro video"
                    allowFullScreen
                />
            </div>

            <p className="text-sm text-gray-500 mt-4">
                Video content is updated regularly to support learning and progression.
            </p>
        </section>
    );
}