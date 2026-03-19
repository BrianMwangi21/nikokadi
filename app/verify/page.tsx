import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
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
  const badgeUrl = token ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/verify?badge=${encodeURIComponent(token)}` : "";

  return (
    <main className="min-h-screen bg-[#050508] text-[#e2e8f0] overflow-x-hidden relative font-[family-name:var(--font-inter)]">
      {/* Background grid with scan line */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Horizontal lines */}
        {[...Array(20)].map((_, i) => (
          <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-[#00f0ff]/10" style={{ top: `${i * 5}%` }} />
        ))}
        {/* Vertical lines */}
        {[...Array(20)].map((_, i) => (
          <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-[#00f0ff]/10" style={{ left: `${i * 5}%` }} />
        ))}
        {/* Animated scan line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent animate-scan" />
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ff006e]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navbar skyline silhouette */}
      <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-20">
        <svg className="w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 1000 100">
          <path d="M0,100 L0,60 L20,60 L20,40 L40,40 L40,70 L60,70 L60,30 L80,30 L80,80 L100,80 L100,50 L120,50 L120,65 L140,65 L140,45 L160,45 L160,75 L180,75 L180,55 L200,55 L200,85 L220,85 L220,35 L240,35 L240,70 L260,70 L260,60 L280,60 L280,40 L300,40 L300,80 L320,80 L320,50 L340,50 L340,65 L360,65 L360,45 L380,45 L380,75 L400,75 L400,55 L420,55 L420,85 L440,85 L440,35 L460,35 L460,70 L480,70 L480,60 L500,60 L500,40 L520,40 L520,80 L540,80 L540,50 L560,50 L560,65 L580,65 L580,45 L600,45 L600,75 L620,75 L620,55 L640,55 L640,85 L660,85 L660,35 L680,35 L680,70 L700,70 L700,60 L720,60 L720,40 L740,40 L740,80 L760,80 L760,50 L780,50 L780,65 L800,65 L800,45 L820,45 L820,75 L840,75 L840,55 L860,55 L860,85 L880,85 L880,35 L900,35 L900,70 L920,70 L920,60 L940,60 L940,40 L960,40 L960,80 L980,80 L980,50 L1000,50 L1000,100 Z" fill="#1e293b" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-4 md:pt-6 pb-4">
        {/* Header - Same as homepage */}
        <header className="text-center mb-4">
          <div className="inline-flex items-center gap-4">
            <div className="w-3 h-12 bg-gradient-to-b from-[#00f0ff] to-transparent animate-pulse" />
            <Link href="/" className="text-center cursor-pointer hover:opacity-80 transition-opacity">
              <div className="relative">
                <span className="relative z-10 font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider text-white">
                  NIKO KADI
                </span>
                <span className="absolute top-0 left-0 -z-10 font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider text-[#ff006e] animate-glitch-1" style={{ clipPath: 'inset(0 0 50% 0)' }}>
                  NIKO KADI
                </span>
                <span className="absolute top-0 left-0 -z-10 font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider text-[#00f0ff] animate-glitch-2" style={{ clipPath: 'inset(50% 0 0 0)' }}>
                  NIKO KADI
                </span>
              </div>
            </Link>
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
        </div>

        {/* Main card */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] via-[#ff006e] to-[#00ff88] opacity-30 blur transition duration-500" />
          <div className="relative bg-[#0a0a12] border border-[#00f0ff]/50 p-3 md:p-4">
            
            {result.valid ? <ConfettiBurst /> : null}

            {/* Result Section with QR */}
            <div className="mb-4 pb-4 border-b border-[#334155]">
              <p className="text-[#ff006e] text-[10px] font-bold tracking-[0.2em] uppercase">
                VERIFICATION RESULT
              </p>
              
              <div className="flex items-center justify-between gap-4 mt-2">
                <h1 className={`font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider ${result.valid ? 'text-[#00ff88]' : 'text-[#ff006e]'}`}>
                  {result.valid ? "VALID" : "INVALID"}
                </h1>
                
                {result.valid && badgeUrl && (
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#ff006e] to-[#00f0ff] opacity-30 blur" />
                    <div className="relative bg-[#0a0a12] border border-[#00f0ff] p-1">
                      <QRCodeSVG 
                        value={badgeUrl} 
                        size={80}
                        level="H"
                        bgColor="#0a0a12"
                        fgColor="#00f0ff"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <p className="mt-2 text-[#64748b] text-xs">
                {result.valid
                  ? "Badge verified. No database lookup required."
                  : "This badge could not be verified."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="bg-[#0a0a12] border border-[#334155] p-2">
                <p className="text-[#475569] text-[9px] uppercase tracking-[0.2em]">Alias</p>
                <p className="text-[#00f0ff] text-sm font-bold">
                  {result.valid ? result.payload.alias : "Unknown"}
                </p>
              </div>
              
              <div className="bg-[#0a0a12] border border-[#334155] p-2">
                <p className="text-[#475569] text-[9px] uppercase tracking-[0.2em]">Claim</p>
                <p className="text-[#00f0ff] text-sm font-bold">
                  {result.valid ? result.payload.claim : "Not available"}
                </p>
              </div>
              
              <div className="bg-[#0a0a12] border border-[#334155] p-2">
                <p className="text-[#475569] text-[9px] uppercase tracking-[0.2em]">Issued</p>
                <p className="text-[#64748b] text-xs break-all">
                  {result.valid ? result.payload.issuedAt : "Not available"}
                </p>
              </div>
            </div>

            {result.valid ? (
              <p className="mt-3 text-[#00ff88] text-xs font-bold uppercase tracking-wider">
                VERIFICATION COMPLETE
              </p>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-[#475569]">
            <Link href="/" className="hover:text-[#00f0ff] transition-colors">
              CREATE_BADGE
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
    </main>
  );
}
