"use client";

import { useState, useEffect, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

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

// REAL OCR function using tesseract.js
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

// Animated grid component
function CyberGrid() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-[#00f0ff]/10"
          style={{ top: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
      {/* Vertical lines */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-[#00f0ff]/10"
          style={{ left: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
      {/* Animated scan line */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent animate-scan" />
    </div>
  );
}

// Holographic card effect
function HolographicCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Holographic sheen */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f0ff] via-[#ff006e] to-[#00ff88] opacity-30 group-hover:opacity-75 blur transition duration-500" />
      <div className="relative bg-[#0a0a12] border border-[#00f0ff]/50">
        {children}
      </div>
    </div>
  );
}

// Glitch text component
function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-[#ff006e] animate-glitch-1" style={{ clipPath: 'inset(0 0 50% 0)' }}>{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-[#00f0ff] animate-glitch-2" style={{ clipPath: 'inset(50% 0 0 0)' }}>{text}</span>
    </div>
  );
}

export default function NeonNairobi() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [alias, setAlias] = useState("Kadi Citizen");
  const [claim, setClaim] = useState("I showed up.");
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("INITIALIZING...");
  const [ocrText, setOcrText] = useState("");
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

  const evidence = useMemo(() => analyzeEvidence(ocrText), [ocrText]);
  const confidence = Math.min(99, 20 + evidence.score * 8 + evidence.fields.length * 9);

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

      setOcrText(text);
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
    setOcrText("");
    setStage("INIT");
    setProgress(0);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#050508] text-[#e2e8f0] overflow-x-hidden relative font-[family-name:var(--font-inter)]">
      <CyberGrid />
      
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ff006e]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar skyline silhouette */}
      <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-20">
        <svg className="w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 1000 100">
          <path d="M0,100 L0,60 L20,60 L20,40 L40,40 L40,70 L60,70 L60,30 L80,30 L80,80 L100,80 L100,50 L120,50 L120,65 L140,65 L140,45 L160,45 L160,75 L180,75 L180,55 L200,55 L200,85 L220,85 L220,35 L240,35 L240,70 L260,70 L260,60 L280,60 L280,40 L300,40 L300,80 L320,80 L320,50 L340,50 L340,65 L360,65 L360,45 L380,45 L380,75 L400,75 L400,55 L420,55 L420,85 L440,85 L440,35 L460,35 L460,70 L480,70 L480,60 L500,60 L500,40 L520,40 L520,80 L540,80 L540,50 L560,50 L560,65 L580,65 L580,45 L600,45 L600,75 L620,75 L620,55 L640,55 L640,85 L660,85 L660,35 L680,35 L680,70 L700,70 L700,60 L720,60 L720,40 L740,40 L740,80 L760,80 L760,50 L780,50 L780,65 L800,65 L800,45 L820,45 L820,75 L840,75 L840,55 L860,55 L860,85 L880,85 L880,35 L900,35 L900,70 L920,70 L920,60 L940,60 L940,40 L960,40 L960,80 L980,80 L980,50 L1000,50 L1000,100 Z" fill="#1e293b" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-4 md:py-6">
        {/* Header */}
        <header className="text-center mb-4">
          <div className="inline-flex items-center gap-4">
            <div className="w-3 h-12 bg-gradient-to-b from-[#00f0ff] to-transparent animate-pulse" />
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.href = '/'}>
              <GlitchText 
                text="NIKO KADI" 
                className="font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider"
              />
            </div>
            <div className="w-3 h-12 bg-gradient-to-b from-[#00f0ff] to-transparent animate-pulse" />
          </div>
        </header>

        {/* Description text */}
        <div className="text-center mb-3 space-y-1">
          <p className="text-[#ff006e] text-[10px] font-bold tracking-[0.2em] uppercase">
            PROOF OF PARTICIPATION
          </p>
          <p className="text-[#64748b] text-xs tracking-wide">
            Upload a screenshot. Mint a signed badge. Scan the QR to verify.
          </p>
          <p className="text-[#00f0ff] text-[10px] tracking-wider">
            Best source: <a href="https://verify.iebc.or.ke/" target="_blank" rel="noreferrer" className="underline hover:text-[#ff006e] transition-colors">verify.iebc.or.ke</a>
          </p>
        </div>

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

                {evidence.fields.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {evidence.fields.slice(0, 3).map((field) => (
                      <span 
                        key={field.label}
                        className="px-2 py-1 bg-[#00ff88]/10 border border-[#00ff88] text-[#00ff88] text-[9px] uppercase"
                      >
                        {field.label}
                      </span>
                    ))}
                  </div>
                )}

                {evidence.fields.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {evidence.fields.slice(0, 3).map((field) => (
                      <span 
                        key={field.label}
                        className="px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88] text-[#00ff88] text-[10px] uppercase tracking-wider rounded"
                      >
                        {field.label}: {field.value}
                      </span>
                    ))}
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

        {/* Footer terminal */}
        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-[#475569]">
            <Link href="/how-it-works" className="hover:text-[#00f0ff] transition-colors">
              HOW_IT_WORKS
            </Link>
            <span className="w-1.5 h-1.5 bg-[#334155] rounded-full" />
            <Link href="https://github.com/BrianMwangi21/nikokadi" className="hover:text-[#00f0ff] transition-colors">
              GITHUB
            </Link>
          </div>
          <p className="mt-2 text-[8px] text-[#334155] tracking-[0.2em]">
            // BUILT FOR KENYA
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100vh); }
        }
        @keyframes scan-vertical {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-scan-vertical {
          animation: scan-vertical 2s linear infinite;
        }
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite;
        }
      `}</style>
    </main>
  );
}
