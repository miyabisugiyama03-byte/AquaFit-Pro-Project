import { type FormEvent, useState } from 'react';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please enter your name, email, and a short message.');
      return;
    }

    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({ name, email, message, at: new Date().toISOString() });
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <section className="rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-10 lg:p-14">
            <p className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">Contact & Support</p>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Reach AquaFit Pro for membership, training, or pool inquiries.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Our team is ready to answer questions about classes, coaching packages, facility access, and private swim sessions. Contact us today to schedule a consultation or learn more about our pool-based fitness programs.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Phone</h2>
                <p className="mt-3 text-sm text-slate-600">+1 (555) 012-3456</p>
                <p className="mt-2 text-sm text-slate-500">Mon–Fri, 8:00 AM – 6:00 PM</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Email</h2>
                <p className="mt-3 text-sm text-slate-600">hello@aquafitpro.com</p>
                <p className="mt-2 text-sm text-slate-500">We typically respond within one business day.</p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-2xl ring-1 ring-slate-900/10">
              <h2 className="text-xl font-semibold">Visit the pool</h2>
              <p className="mt-3 text-slate-300 leading-7">AquaFit Pro Swim Center, 145 Waterway Drive, Poolside City, CA 90210</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Facility Hours</p>
                  <p className="mt-2 text-sm text-slate-200">Mon–Fri: 6:00 AM – 9:00 PM</p>
                  <p className="text-sm text-slate-200">Sat–Sun: 7:00 AM – 5:00 PM</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Class Booking</p>
                  <p className="mt-2 text-sm text-slate-200">Reserve your spot for group lessons, water fitness, or private coaching.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 sm:p-10">
            <div className="rounded-[2rem] bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Send a message</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">Let's talk about your next swim session.</h2>
                </div>
              </div>

              {sent && (
                <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                  Thanks — your message has been recorded. We will follow up shortly.
                </div>
              )}

              {error ? (
                <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{error}</div>
              ) : null}

              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Full name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email address</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    type="email"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">How can we help?</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 h-40 resize-none"
                    placeholder="Tell us about your goals, questions, or the service you’re looking for."
                  />
                </label>

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">Message length: {message.length} / 500</p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
