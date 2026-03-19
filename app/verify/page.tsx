import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import ConfettiBurst from "./confetti-burst";
import { verifyBadgeToken } from "../_lib/badge";
import { CyberGrid, GlitchText, AnimatedBackground, NairobiSkyline } from "../_components";

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
      <CyberGrid />
      <AnimatedBackground />
      <NairobiSkyline />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-4 md:pt-6 pb-4">
        {/* Header */}
        <header className="text-center mb-4">
          <div className="inline-flex items-center gap-4">
            <div className="w-3 h-12 bg-gradient-to-b from-[#00f0ff] to-transparent animate-pulse" />
            <Link href="/" className="text-center cursor-pointer hover:opacity-80 transition-opacity">
              <GlitchText 
                text="NIKO KADI" 
                className="font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider"
              />
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
                        size={140}
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
          <div className="inline-flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-white">
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
