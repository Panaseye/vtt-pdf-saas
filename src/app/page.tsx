import Link from 'next/link';

export default function HomePage() {
  return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl space-y-10">
          {/* Hero */}
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
              Internal tool · Early prototype
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
              Turn VTT & PDF files into clean, editable text.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl">
              This is your personal SaaS shell on top of a private n8n worker.
              Upload subtitle or PDF files, let the backend clean and extract the
              content, then copy or edit the result directly in the browser.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                  href="/process"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition-colors"
              >
                Open the processor
              </Link>
              <span className="text-xs text-slate-500">
              Powered by Next.js + n8n worker · running on your Mac mini.
            </span>
            </div>
          </section>

          {/* Info cards */}
          <section className="grid gap-4 sm:grid-cols-3 text-xs text-slate-300">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-slate-100">File types</p>
              <p className="text-slate-400">
                Accepts <span className="font-mono text-emerald-400">.vtt</span>,{' '}
                <span className="font-mono text-emerald-400">.srt</span>,{' '}
                <span className="font-mono text-emerald-400">.txt</span>, and{' '}
                <span className="font-mono text-emerald-400">.pdf</span>.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-slate-100">Architecture</p>
              <p className="text-slate-400">
                Browser &rarr; Next.js API &rarr; n8n worker &rarr; cleaned text
                &rarr; back to browser.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <p className="font-semibold text-slate-100">Next steps</p>
              <p className="text-slate-400">
                Add auth, per-user job history, and billing on top of this shell
                to turn it into a real SaaS.
              </p>
            </div>
          </section>
        </div>
      </main>
  );
}
