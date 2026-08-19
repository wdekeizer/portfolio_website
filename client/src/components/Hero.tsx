export function Hero() {
  return (
    <section id="home" className="border-b border-slate-800">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 lg:grid-cols-[1.3fr_1fr] lg:py-28">
        <div>
          <span className="mb-6 block h-1 w-14 bg-indigo-400" />
          <h1 className="text-4xl font-bold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            I&apos;m William, a
            <br />
            Software Engineer
          </h1>
          <p className="mt-6 max-w-md text-slate-400">
            I build web apps end-to-end — React frontends, typed APIs, and the databases behind
            them.
          </p>

          <a
            href="#projects"
            aria-label="Scroll to projects"
            className="mt-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white transition hover:bg-indigo-400"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="flex flex-col gap-8">
          <div className="border-b border-slate-800 pb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              About me
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              I&apos;m a software engineer who enjoys turning ideas into working products, from
              backend APIs to polished UI.
            </p>
            <a
              href="#contact"
              className="mt-3 inline-block text-sm font-semibold text-slate-100 underline underline-offset-4 hover:text-indigo-400"
            >
              Get in touch →
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              My work
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              A selection of projects I&apos;ve built, spanning full-stack apps, tools, and
              experiments.
            </p>
            <a
              href="#projects"
              className="mt-3 inline-block text-sm font-semibold text-slate-100 underline underline-offset-4 hover:text-indigo-400"
            >
              Browse projects →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
