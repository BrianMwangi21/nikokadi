import Link from "next/link";
import ConfettiBurst from "./confetti-burst";
import { verifyBadgeToken } from "../_lib/badge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VerifyProps = {
  searchParams?: Promise<{
    badge?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyProps) {
  const params = (await searchParams) ?? {};
  const token = typeof params.badge === "string" ? params.badge : "";
  const result = token ? verifyBadgeToken(token) : { valid: false as const };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 md:px-8 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-xl flex-col justify-center gap-4">
        <Link
          href="/"
          className="w-fit rounded-full border border-black/10 bg-white/70 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--ink)] backdrop-blur-md"
        >
          Make your own
        </Link>

        <section className="badge-pop relative overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,247,239,0.96))] p-5 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
          {result.valid ? <ConfettiBurst /> : null}

          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
            Scan result
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-6xl tracking-[0.08em] text-[var(--ink)]">
            {result.valid ? "VALID" : "REJECTED"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {result.valid
              ? "This badge is signed and verifies without a database lookup. Nice one — the confetti is for you."
              : "This token could not be verified."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-black/10 bg-white/80 p-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                Alias
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                {result.valid ? result.payload.alias : "Unknown"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-black/10 bg-white/80 p-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                Claim
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                {result.valid ? result.payload.claim : "Not available"}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-[1.2rem] border border-black/10 bg-white/80 p-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
              Issued
            </p>
            <p className="mt-1 break-all text-sm font-medium text-[var(--ink)]">
              {result.valid ? result.payload.issuedAt : "Not available"}
            </p>
          </div>

          {result.valid ? (
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.26em] text-[var(--accent)]">
              Badge unlocked.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
