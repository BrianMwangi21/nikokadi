import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 md:px-8 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col gap-4">
        <header className="rounded-[1.6rem] border border-black/10 bg-white/70 px-4 py-3 backdrop-blur-md md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                How it works
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-bebas)] text-5xl tracking-[0.08em] text-[var(--ink)]">
                NIKO KADI
              </h1>
            </div>
            <Link
              href="/"
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--ink)]"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,247,239,0.95))] p-5 shadow-[0_24px_70px_rgba(17,17,17,0.08)] md:p-6">
          <p className="text-sm leading-7 text-[var(--muted)]">
            This app is a stateless badge issuer. It does not save screenshots, accounts, or a voter
            database.
          </p>

          <div className="mt-5 grid gap-3">
            {[
              ["1", "Upload", "You drop a screenshot into the page."],
              ["2", "Read", "OCR checks the text for voter-registration signals."],
              ["3", "Mint", "A signed badge token is created with no stored profile."],
              ["4", "Scan", "The QR opens the verification page and checks the signature."],
            ].map(([step, title, copy]) => (
              <div key={title} className="rounded-[1.3rem] border border-black/10 bg-white/80 p-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Step {step}
                </p>
                <p className="mt-1 text-base font-semibold text-[var(--ink)]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 rounded-[1.3rem] border border-black/10 bg-white/80 p-4 text-sm text-[var(--muted)] md:grid-cols-2">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                Open source
              </p>
              <p className="mt-2 leading-6">
                Open source for people to pick apart, check the code, and see how it works.
              </p>
            </div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                Link
              </p>
              <a
                href="https://github.com/BrianMwangi21/nikokadi"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ink)]"
              >
                View the code
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
