import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-50 py-16 px-6 text-center border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Get in <span className="text-primary">touch</span>
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Have a question about the project, a bug to report, or feedback to share? We'd love to hear from you.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact details</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <div>
                  <p className="font-medium text-gray-900">Project</p>
                  <p>MCA 4th Semester Major Project</p>
                  <p>Chandigarh University — 23ONMCR-753</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <div>
                  <p className="font-medium text-gray-900">Response time</p>
                  <p>We aim to respond within 2 business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">Frequently asked</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">Is this a real medical tool?</p>
                <p className="mt-0.5">No — it's an academic demo. Always consult a doctor.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Is my data private?</p>
                <p className="mt-0.5">Yes. Data is stored locally in SQLite and never shared.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Can I run this locally?</p>
                <p className="mt-0.5">Yes — clone the repo, follow the README, and run both servers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-800 text-lg mb-1">Message sent!</h3>
              <p className="text-green-700 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={set('subject')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={set('message')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white rounded-md font-medium hover:opacity-90"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
