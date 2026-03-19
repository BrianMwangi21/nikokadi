"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CyberGrid, GlitchText, HolographicCard, AnimatedBackground, NairobiSkyline, PageLayout } from "./_components";

// Type definitions
interface EvidenceField {
  label: string;
  value: string;
}

interface EvidenceSignal {
  matches: string[];
  score: number;
  strong: boolean;
  excerpt: string;
  fields: EvidenceField[];
}

interface BadgeState {
  badgeUrl: string;
}

interface MintResponse {
  token: string;
}

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

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [alias, setAlias] = useState("Kadi Citizen");
  const [claim, setClaim] = useState("I showed up.");
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("INITIALIZING...");
  const [badge, setBadge] = useState<BadgeState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  async function mintBadge() {
    if (!file) {
      setError("UPLOAD REQUIRED");
      return;
    }
    if (!alias.trim() || !claim.trim()) {
      setError("FILL ALL FIELDS");
      return;
    }
    setError("");
    setBadge(null);
    setViewMode("working");
    setProgress(4);
    setStage("READING...");

    try {
      const text = await runOcr(file, (nextProgress, message) => {
        setProgress(nextProgress);
        setStage(message ? `${message.replace(/_/g, " ")}...` : "SCANNING...");
      });

      const signals = analyzeEvidence(text);

      if (!signals.strong) {
        setViewMode("form");
        setError(
          "Could not read enough voter details. Try a clearer image from verify.iebc.or.ke and make sure the name, county, constituency, ward, and polling station are visible.",
        );
        return;
      }

      setStage("MINTING...");
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
      setStage("DONE");
      setProgress(100);
      setViewMode("ready");
    } catch {
      setViewMode("form");
      setError("Mint failed. Try another screenshot or try again.");
    }
  }

  function resetFlow() {
    setViewMode("form");
    setBadge(null);
    setFile(null);
    setPreviewUrl("");
    setStage("INIT");
    setProgress(0);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#050508] text-[#e2e8f0] overflow-x-hidden relative font-[family-name:var(--font-inter)]">
      <CyberGrid />
      <AnimatedBackground />
      <NairobiSkyline />

      <PageLayout>
        {/* Main terminal interface */}
        <HolographicCard className="max-w-3xl mx-auto">
          <div className="p-3 md:p-4">

            {viewMode === "form" && (
              <div className="space-y-4">
                {/* File upload - cyber terminal style */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#ff006e] to-[#00f0ff] opacity-20 blur" />
                  <label className="relative flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-[#00f0ff]/40 bg-[#0a0a12]/80 p-6 cursor-pointer hover:border-[#00f0ff] hover:bg-[#0a0a12] transition-all group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    
                    {previewUrl ? (
                      <div className="relative">
                        <div className="absolute -inset-2 bg-[#00f0ff]/20 blur-lg" />
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="relative max-h-28 rounded border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        />
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#00ff88] text-[#0a0a12] text-[8px] font-bold uppercase">
                          SCANNED
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto mb-2 border-2 border-[#ff006e] rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#ff006e]/10" />
                          <svg className="w-7 h-7 text-[#ff006e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="font-[family-name:var(--font-space)] text-[#00f0ff] text-base tracking-wider">
                          DROP VOTER PROOF
                        </p>
                      </div>
                    )}
                    
                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#ff006e]" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#ff006e]" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#ff006e]" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#ff006e]" />
                  </label>
                </div>

                {/* Input fields - terminal style */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[#ff006e] text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#ff006e] rounded-full animate-pulse" />
                      ALIAS
                    </label>
                    <p className="text-[#475569] text-[10px] tracking-wider">How you want to be known</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff] text-sm">&gt;</span>
                      <input
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        className="w-full bg-[#0a0a12] border-2 border-[#334155] pl-8 pr-3 py-2 text-white font-[family-name:var(--font-inter)] text-sm focus:border-[#ff006e] focus:outline-none transition-colors tracking-wider"
                        placeholder="YOUR_NAME"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[#00f0ff] text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" />
                      STATEMENT
                    </label>
                    <p className="text-[#475569] text-[10px] tracking-wider">Your declaration or motto</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f0ff] text-sm">&gt;</span>
                      <input
                        value={claim}
                        onChange={(e) => setClaim(e.target.value)}
                        className="w-full bg-[#0a0a12] border-2 border-[#334155] pl-8 pr-3 py-2 text-white font-[family-name:var(--font-inter)] text-sm focus:border-[#00f0ff] focus:outline-none transition-colors tracking-wider"
                        placeholder="I_SHOWED_UP"
                      />
                    </div>
                  </div>
                </div>

                {/* Execute button */}
                <button
                  onClick={mintBadge}
                  className="group relative w-full py-3 bg-[#0a0a12] border border-[#00f0ff] overflow-hidden hover:bg-[#00f0ff]/10 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff006e] via-[#00f0ff] to-[#00ff88] opacity-0 group-hover:opacity-20 transition-opacity" />
                  <span className="relative font-[family-name:var(--font-space)] text-base text-[#00f0ff] tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" />
                    MINT BADGE
                    <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" />
                  </span>
                </button>

                {error && (
                  <div className="flex items-center gap-2 py-2 px-3 bg-[#ff006e]/10 border border-[#ff006e]">
                    <div className="w-2 h-2 bg-[#ff006e] rounded-full animate-pulse" />
                    <p className="text-[#ff006e] text-xs font-bold uppercase">{error}</p>
                  </div>
                )}
              </div>
            )}

            {viewMode === "working" && (
              <div className="text-center py-6 space-y-4">
                <div className="max-w-sm mx-auto">
                  <div className="flex justify-between text-[10px] text-[#475569] uppercase tracking-wider mb-1">
                    <span>MINTING</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-[#0a0a12] border border-[#334155] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#ff006e] via-[#00f0ff] to-[#00ff88] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <p className="text-[#00f0ff] text-xs font-bold uppercase tracking-wider">
                  {stage}
                </p>
              </div>
            )}

            {viewMode === "ready" && (
              <div className="text-center space-y-3">
                {/* Compact QR */}
                <div className="relative inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#ff006e] via-[#00f0ff] to-[#00ff88] opacity-40 blur-xl" />
                  <div className="relative bg-[#0a0a12] border-2 border-[#00f0ff] p-2">
                    <QRCodeSVG 
                      value={badge?.badgeUrl || "https://nikokadi.io"} 
                      size={140}
                      level="H"
                      bgColor="#0a0a12"
                      fgColor="#00f0ff"
                    />
                    <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-l-2 border-t-2 border-[#ff006e]" />
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-r-2 border-t-2 border-[#00ff88]" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-l-2 border-b-2 border-[#00ff88]" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-r-2 border-b-2 border-[#ff006e]" />
                  </div>
                </div>

                {/* Compact Info */}
                <div className="text-center text-xs">
                  <span className="text-[#00f0ff] font-bold">{alias}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <a
                    href={badge?.badgeUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 px-4 bg-[#ff006e] text-white font-bold text-xs uppercase text-center no-underline"
                  >
                    OPEN BADGE
                  </a>
                  <button
                    onClick={resetFlow}
                    className="w-full py-2 border border-[#475569] text-[#475569] text-xs font-bold uppercase hover:border-[#ff006e] hover:text-[#ff006e] transition-all"
                  >
                    MINT NEW
                  </button>
                </div>
              </div>
            )}
          </div>
        </HolographicCard>
      </PageLayout>
    </main>
  );
}
