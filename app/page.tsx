"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

type MintResponse = {
  token: string;
};

type BadgeState = {
  badgeUrl: string;
};

type EvidenceField = {
  label: string;
  value: string;
};

type EvidenceSignal = {
  matches: string[];
  score: number;
  strong: boolean;
  excerpt: string;
  fields: EvidenceField[];
};

type ViewMode = "form" | "working" | "ready";

const KEYWORDS = ["iebc", "verify", "voter", "registered", "kadi", "ballot"];

function analyzeEvidence(text: string): EvidenceSignal {
  const normalized = text.toLowerCase();
  const matches = KEYWORDS.filter((word) => normalized.includes(word));

  const fieldPatterns: Array<[string, RegExp]> = [
    ["First name", /first\s*name\s*:\s*([^\n\r]+)/i],
    ["Surname", /surname\s*:\s*([^\n\r]+)/i],
    ["County", /county\s*name\s*:\s*([^\n\r]+)/i],
    ["Constituency", /constituency\s*name\s*:\s*([^\n\r]+)/i],
    ["Ward", /ward\s*name\s*:\s*([^\n\r]+)/i],
    ["Polling centre", /polling\s*centre\s*name\s*:\s*([^\n\r]+)/i],
    ["Polling station", /polling\s*station\s*name\s*:\s*([^\n\r]+)/i],
  ];

  const fields = fieldPatterns
    .map(([label, pattern]) => {
      const match = text.match(pattern)?.[1]?.trim().replace(/\s+/g, " ");

      return match ? { label, value: match } : null;
    })
    .filter((field): field is EvidenceField => Boolean(field));

  const strong = /voter\s*found/i.test(text) || fields.length >= 3;

  return {
    matches,
    score: matches.length + fields.length,
    strong,
    excerpt: text.trim().replace(/\s+/g, " ").slice(0, 130),
    fields,
  };
}

async function runOcr(file: File, onProgress: (progress: number, message: string) => void) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      if (typeof message.progress === "number") {
        onProgress(Math.round(message.progress * 100), message.status);
      }
    },
  });

  try {
    const result = await worker.recognize(file);
    return result.data.text;
  } finally {
    await worker.terminate();
  }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [alias, setAlias] = useState("Kadi Citizen");
  const [claim, setClaim] = useState("I showed up.");
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Upload a screenshot to begin.");
  const [ocrText, setOcrText] = useState("");
  const [badge, setBadge] = useState<BadgeState | null>(null);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const evidence = useMemo(() => analyzeEvidence(ocrText), [ocrText]);
  const confidence = Math.min(99, 20 + evidence.score * 8 + evidence.fields.length * 9);

  useEffect(() => {
    if (viewMode !== "ready") return;

    const end = Date.now() + 1200;
    const colors = ["#c42d1c", "#101010", "#ff6a52", "#ead9c7"];

    const burst = () => {
      confetti({
        particleCount: 9,
        spread: 68,
        startVelocity: 46,
        ticks: 220,
        scalar: 1.05,
        origin: { x: 0.5, y: 0.28 },
        colors,
        zIndex: 9999,
      });

      if (Date.now() < end) {
        window.setTimeout(burst, 150);
      }
    };

    window.setTimeout(burst, 80);
  }, [viewMode]);

  async function mintBadge() {
    if (!file) {
      setError("Add a screenshot first.");
      return;
    }

    if (!alias.trim() || !claim.trim()) {
      setError("Add your alias and claim.");
      return;
    }

    setError("");
    setBadge(null);
    setViewMode("working");
    setProgress(4);
    setStage("Reading locally...");

    try {
      const text = await runOcr(file, (nextProgress, message) => {
        setProgress(nextProgress);
        setStage(message ? `${message.replace(/_/g, " ")}...` : "Scanning...");
      });

      setOcrText(text);
      const signals = analyzeEvidence(text);

      if (!signals.strong) {
        setViewMode("form");
        setError(
          "Could not read enough voter details from that screenshot. Try a clearer image from verify.iebc.or.ke and make sure the name, county, constituency, ward, and polling station are visible.",
        );
        return;
      }

      setStage("Minting badge...");
      const response = await fetch("/api/badge/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alias: alias.trim(),
          claim: claim.trim(),
          evidence: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mint badge.");
      }

      const data = (await response.json()) as MintResponse;
      const badgeUrl = `${window.location.origin}/verify?badge=${encodeURIComponent(data.token)}`;

      setBadge({ badgeUrl });
      setStage("Badge ready.");
      setProgress(100);
      setViewMode("ready");
    } catch {
      setViewMode("form");
      setError("Mint failed. Something went wrong while reading or signing the badge. Try another screenshot or try again in a moment.");
    }
  }

  function resetFlow() {
    setViewMode("form");
    setBadge(null);
    setFile(null);
    setPreviewUrl("");
    setOcrText("");
    setStage("Upload a screenshot to begin.");
    setProgress(0);
    setError("");
    setLinkCopied(false);
  }

  return (
    <main className="min-h-screen px-4 pb-24 pt-4 sm:px-6 md:px-8 md:pb-8 md:pt-6">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-md flex-col gap-4 md:max-w-4xl md:gap-5">
        <header className="rounded-[1.6rem] border border-black/10 bg-white/70 px-4 py-3 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[var(--paper)]">
              <Image src="/next.svg" alt="Niko Kadi" fill className="object-cover p-2 opacity-80" priority />
            </div>
            <div className="min-w-0">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                Niko Kadi
              </p>
              <p className="truncate text-sm font-medium text-[var(--ink)]">
                Make a signed participation badge.
              </p>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,247,239,0.96))] shadow-[0_28px_80px_rgba(17,17,17,0.1)]">
          <div className="border-b border-black/10 px-4 pb-4 pt-4 sm:px-5 sm:pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                  Proof of participation
                </p>
                <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-[clamp(3.2rem,13vw,5.5rem)] leading-[0.9] tracking-[0.09em] text-[var(--ink)]">
                  NIKO KADI
                </h1>
              </div>
              <div className="rounded-full border border-black/10 bg-white px-3 py-2 text-right text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/50">
                stateless<br />qr badge
              </div>
            </div>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)] md:max-w-none">
              Upload a screenshot. Mint a signed badge. Scan the QR to verify.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {["No accounts", "No db", "Open source"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/55"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5">
            {viewMode === "form" ? (
              <div className="grid gap-3">
                <a
                  href="https://verify.iebc.or.ke/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.2rem] border border-black/10 bg-white/80 px-4 py-3 text-sm leading-6 text-[var(--ink)]"
                >
                  Best screenshot source: <span className="font-semibold underline underline-offset-4">verify.iebc.or.ke</span>
                </a>

                <label
                  className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-black/15 bg-white/75 p-4 text-center transition hover:border-[var(--accent)]/35"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const dropped = event.dataTransfer.files?.[0];
                    if (dropped) setFile(dropped);
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />

                  {previewUrl ? (
                    <div className="flex w-full flex-col items-center gap-3">
                      <Image
                        src={previewUrl}
                        alt="Screenshot preview"
                        width={1200}
                        height={900}
                        unoptimized
                        className="max-h-44 w-full rounded-[1rem] border border-black/10 object-cover"
                      />
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.26em] text-black/45">
                        {file?.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                        Tap to upload
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--ink)]">
                        Add your voter proof screenshot.
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        We read it for minting, then drop it.
                      </p>
                    </>
                  )}
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                      Alias
                    </span>
                    <input
                      value={alias}
                      onChange={(event) => setAlias(event.target.value)}
                      className="rounded-[1rem] border border-black/12 bg-white px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]/50"
                      placeholder="Kadi Citizen"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/45">
                      Claim
                    </span>
                    <input
                      value={claim}
                      onChange={(event) => setClaim(event.target.value)}
                      className="rounded-[1rem] border border-black/12 bg-white px-3 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]/50"
                      placeholder="I showed up"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={mintBadge}
                  className="rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--paper)] transition hover:bg-[var(--accent)]"
                >
                  Mint badge
                </button>

                {(error || evidence.fields.length > 0) && (
                  <div className="grid gap-2 rounded-[1.2rem] border border-black/10 bg-white/80 p-3 text-xs leading-5 text-[var(--muted)]">
                    {error ? <p className="font-medium text-[var(--accent)]">{error}</p> : null}
                    {evidence.fields.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {evidence.fields.slice(0, 3).map((field) => (
                          <span
                            key={field.label}
                            className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-[var(--ink)]"
                          >
                            {field.label}: {field.value}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : viewMode === "working" ? (
              <div className="flex min-h-[420px] flex-col justify-center gap-4 px-2 py-4 text-center">
                <div className="mx-auto h-14 w-14 animate-spin rounded-full border-[3px] border-black/10 border-t-[var(--accent)]" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                    Minting
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">{stage}</p>
                </div>

                <div className="mx-auto w-full max-w-xs">
                  <div className="h-2 overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--accent-soft))] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-black/45">{progress}%</p>
                </div>

                {!!ocrText && (
                  <p className="mx-auto max-w-xs rounded-[1rem] border border-black/10 bg-white/80 px-3 py-3 text-left text-xs leading-5 text-[var(--muted)]">
                    {evidence.excerpt}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                      Badge ready
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-bebas)] text-4xl tracking-[0.08em] text-[var(--ink)]">
                      SCAN ME
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="rounded-full border border-black/10 bg-white px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--ink)]"
                  >
                    Make another
                  </button>
                </div>

                <div className="flex items-center justify-center rounded-[1.3rem] border border-black/10 bg-[var(--paper)] p-3">
                  <QRCodeSVG value={badge?.badgeUrl ?? ""} size={180} fgColor="#101010" bgColor="#ffffff" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-[1rem] border border-black/10 bg-white/80 p-3">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                      Alias
                    </p>
                    <p className="mt-1 font-semibold text-[var(--ink)]">{alias}</p>
                  </div>
                  <div className="rounded-[1rem] border border-black/10 bg-white/80 p-3">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-black/45">
                      Confidence
                    </p>
                    <p className="mt-1 font-semibold text-[var(--ink)]">{confidence}%</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    if (badge?.badgeUrl) {
                      await navigator.clipboard.writeText(badge.badgeUrl);
                      setLinkCopied(true);
                      setStage("Link copied.");
                      window.setTimeout(() => setLinkCopied(false), 1800);
                    }
                  }}
                  className="rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--paper)] transition hover:bg-[var(--accent)]"
                >
                  {linkCopied ? "Copied!" : "Copy link"}
                </button>

                <p className="text-xs leading-5 text-[var(--muted)]">
                  Use this link to verify your participation and share your badge.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-[rgba(255,247,239,0.95)] px-4 py-3 backdrop-blur-md md:static md:mt-4 md:rounded-[1.2rem] md:border md:px-6 md:py-4">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-black/55 md:max-w-4xl">
          <p className="min-w-0 truncate">No accounts. No database. Open source.</p>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/how-it-works" className="text-[var(--ink)]">
              How it works
            </Link>
            <a
              href="https://github.com/BrianMwangi21/nikokadi"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--ink)]"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
