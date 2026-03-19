"use client";

import Link from "next/link";
import { CyberGrid, GlitchText, AnimatedBackground, NairobiSkyline } from "../_components";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#050508] text-[#e2e8f0] overflow-x-hidden relative font-[family-name:var(--font-inter)]">
      <CyberGrid />
      <AnimatedBackground />
      <NairobiSkyline />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-4 md:pt-6 pb-4">
        {/* Header - Same as homepage and verify */}
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

        {/* Description */}
        <div className="text-center mb-3 space-y-1">
          <p className="text-[#ff006e] text-[10px] font-bold tracking-[0.2em] uppercase">
            SYSTEM DOCUMENTATION
          </p>
          <p className="text-[#64748b] text-xs tracking-wide">
            Upload a screenshot. Mint a signed badge. Scan the QR to verify.
          </p>
        </div>

        {/* Main card */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] via-[#ff006e] to-[#00ff88] opacity-30 blur transition duration-500" />
          <div className="relative bg-[#0a0a12] border border-[#00f0ff]/50 p-3 md:p-4">
            
            {/* Description */}
            <div className="mb-4 pb-4 border-b border-[#00f0ff]/30">
              <p className="text-[#64748b] text-sm leading-7">
                This app is a stateless badge issuer. It does not save screenshots, accounts, or a voter database.
              </p>
            </div>

            {/* Steps */}
            <div className="grid gap-3">
              {[
                ["01", "Upload", "You drop a screenshot into the page."],
                ["02", "Read", "OCR checks the text for voter-registration signals."],
                ["03", "Mint", "A signed badge token is created with no stored profile."],
                ["04", "Scan", "The QR opens the verification page and checks the signature."],
              ].map(([step, title, copy]) => (
                <div key={title} className="relative bg-[#0a0a12] border border-[#334155] p-3 hover:border-[#00f0ff]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-[#ff006e] text-sm font-bold font-[family-name:var(--font-space)] tracking-wider">
                      {step}
                    </span>
                    <div className="flex-1">
                      <p className="text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] mb-1">
                        {title}
                      </p>
                      <p className="text-[#64748b] text-sm">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Open source section */}
            <div className="mt-4 grid md:grid-cols-2 gap-4 border-t border-[#334155] pt-4">
              <div>
                <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  Open Source
                </p>
                <p className="text-[#64748b] text-sm">
                  Open source for people to pick apart, check the code, and see how it works.
                </p>
              </div>
              <div>
                <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  Repository
                </p>
                <a
                  href="https://github.com/BrianMwangi21/nikokadi"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 border border-[#00f0ff] text-[#00f0ff] text-xs font-bold uppercase tracking-wider hover:bg-[#00f0ff] hover:text-[#0a0a12] transition-all"
                >
                  VIEW_CODE
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Same as others */}
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
