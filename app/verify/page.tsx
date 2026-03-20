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

            {result.valid ? (
              /* VALID BADGE LAYOUT */
              <div className="text-center space-y-4">
                {/* Verification Result - centered header */}
                <p className="text-[#ff006e] text-[10px] font-bold tracking-[0.2em] uppercase">
                  VERIFICATION RESULT
                </p>
                
                {/* Alias ako KADI - large prominent text */}
                <div className="my-4">
                  <h2 className="font-[family-name:var(--font-space)] text-3xl md:text-4xl font-black tracking-wider text-white">
                    {result.payload.alias} <span className="text-[#00f0ff]">AKO</span> KADI
                  </h2>
                </div>
                
                {/* QR Code centered - Clean version */}
                {badgeUrl && (
                  <div className="my-6">
                    <div className="bg-[#0a0a12] border-2 border-[#00f0ff] p-2 inline-block">
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
                
                {/* VALID - green below QR */}
                <p className="text-[#00ff88] text-xl md:text-2xl font-black tracking-wider font-[family-name:var(--font-space)]">
                  VALID
                </p>
                
                {/* Verification message */}
                <p className="text-[#64748b] text-xs mt-2">
                  Badge verified. No database lookup required.
                </p>
                
                {/* Claim and Issued side by side */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#334155]">
                  <div className="bg-[#0a0a12] border border-[#334155] p-3">
                    <p className="text-[#475569] text-[9px] uppercase tracking-[0.2em] mb-1">Claim</p>
                    <p className="text-[#00f0ff] text-sm font-bold">
                      {result.payload.claim}
                    </p>
                  </div>
                  
                  <div className="bg-[#0a0a12] border border-[#334155] p-3">
                    <p className="text-[#475569] text-[9px] uppercase tracking-[0.2em] mb-1">Issued</p>
                    <p className="text-[#64748b] text-xs break-all">
                      {result.payload.issuedAt}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* INVALID BADGE LAYOUT */
              <div className="text-center py-8">
                <p className="text-[#ff006e] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  VERIFICATION RESULT
                </p>
                <h1 className="font-[family-name:var(--font-space)] text-4xl md:text-5xl font-black tracking-wider text-[#ff006e]">
                  INVALID
                </h1>
                <p className="mt-4 text-[#64748b] text-xs">
                  This badge could not be verified.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center space-y-3">
          {/* Create your own badge Button */}
          <div>
            <Link 
              href="/" 
              className="inline-block py-3 px-4 bg-[#ff006e] text-white font-bold text-xs uppercase text-center no-underline hover:bg-[#ff006e]/80 transition-colors"
            >
              Create your own badge
            </Link>
          </div>
          
          {/* Links row */}
          <div className="inline-flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-white">
            <Link href="/how-it-works" className="hover:text-[#00f0ff] transition-colors">
              HOW_IT_WORKS
            </Link>
            <span className="w-1.5 h-1.5 bg-[#334155] rounded-full" />
            <Link href="https://github.com/BrianMwangi21/nikokadi" className="hover:text-[#00f0ff] transition-colors">
              GITHUB
            </Link>
          </div>
          
          <p className="mt-2 text-[8px] text-[#334155] tracking-[0.2em]">
            {"// BUILT FOR KENYA"}
          </p>
        </footer>
      </div>
    </main>
  );
}
