import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const [heroImage, setHeroImage] = useState(
    'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&cs=tinysrgb&w=1600'
  );

  const heroFallback =
    'https://images.unsplash.com/photo-1508606572321-901ea4437077?auto=format&fit=crop&w=1200&q=80';

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      <section className="rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="p-10 lg:p-16">
            <p className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">Swim. Train. Thrive.</p>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Professional aquatic fitness for every body.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
              AquaFit Pro brings together elite swim coaching, water-based strength training, and community classes for swimmers, athletes, and fitness seekers.
              Build confidence in the pool, refine your technique, and enjoy a healthier lifestyle.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link to="/courses" className="inline-flex items-center justify-center rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-800">
                Explore Courses
              </Link>
              <Link to="/booking" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                Book a Class
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-3xl font-bold text-sky-700">30+</p>
                <p className="mt-2 text-sm text-slate-600">Weekly classes</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-3xl font-bold text-sky-700">Expert</p>
                <p className="mt-2 text-sm text-slate-600">Coaches & instructors</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5 text-center">
                <p className="text-3xl font-bold text-sky-700">All levels</p>
                <p className="mt-2 text-sm text-slate-600">Beginners to advanced</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 h-80 sm:h-[28rem] sm:-translate-x-8 sm:scale-[1.02]">
            <img
              src={heroImage}
              alt="A swimmer training in a pool"
              className="h-full w-full rounded-[2rem] object-cover"
              onError={() => setHeroImage(heroFallback)}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-8 left-6 right-6 rounded-3xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-700">AquaFit Pro highlights</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Swim sessions designed for strength, technique, and recovery.</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-slate-950/95 p-8 text-white shadow-2xl ring-1 ring-slate-900/10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Why choose us</p>
          <h2 className="mt-4 text-3xl font-bold">Built around your wellness goals.</h2>
          <p className="mt-4 text-slate-300 leading-7">
            Our programs combine professional coaching, modern pool facilities, and supportive training plans to help you move better, swim faster, and feel stronger.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Custom training plans</h3>
            <p className="mt-3 text-slate-600">From aquatic endurance sessions to low-impact water circuits, each course is tailored to your level.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Pool-focused technique</h3>
            <p className="mt-3 text-slate-600">Refine your stroke, build confidence, and reduce injury risk with expert swim coaching.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">All skill levels welcome</h3>
            <p className="mt-3 text-slate-600">Whether you're a first-timer or a competitive swimmer, we offer classes that challenge and support you.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg ring-1 ring-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Community-driven atmosphere</h3>
            <p className="mt-3 text-slate-600">Join a motivating community of members who train together, celebrate progress, and stay accountable.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200">
          <img
            src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80"
            alt="Group fitness class in a pool"
            className="h-64 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-slate-900">Group swim classes</h3>
            <p className="mt-3 text-slate-600">Engaging classes for families, adults, and kids that focus on fun, safety, and continuous progression.</p>
          </div>
        </div>

        <div className="rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200">
          <img
            src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=1200&q=80"
            alt="A trainer leading a water workout session"
            className="h-64 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-slate-900">Water fitness training</h3>
            <p className="mt-3 text-slate-600">Low-impact resistance workouts ideal for joint health, mobility, and full-body strength.</p>
          </div>
        </div>

        <div className="rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200">
          <img
            src="https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=80"
            alt="A swimmer training with a coach"
            className="h-64 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-slate-900">One-on-one coaching</h3>
            <p className="mt-3 text-slate-600">Personalized sessions designed to accelerate skill development and maximize your results.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-sky-700 px-8 py-10 text-white shadow-2xl ring-1 ring-slate-900/10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">Ready to get started?</p>
            <h2 className="mt-4 text-3xl font-bold">Take your wellness to the next level with weekly pool training.</h2>
            <p className="mt-4 max-w-2xl text-sky-100/90 leading-7">Choose your next class, reserve your spot, and begin a program built to improve endurance, strength, and confidence in the water.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Link to="/booking" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100">
              Schedule a Session
            </Link>
            <Link to="/courses" className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Browse Programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
