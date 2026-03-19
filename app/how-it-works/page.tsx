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
            
            {/* What is Niko Kadi */}
            <div className="mb-4 pb-4 border-b border-[#00f0ff]/30">
              <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                What is Niko Kadi?
              </p>
              <p className="text-[#64748b] text-sm leading-6">
                Niko Kadi is a digital badge system that lets you prove you are a registered voter — without exposing your personal information. 
                Think of it as a digital "I Voted" sticker, but one that actually proves you registered, not just that you voted.
              </p>
            </div>

            {/* How It Works Steps */}
            <div className="mb-4 pb-4 border-b border-[#00f0ff]/30">
              <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                How It Works (The 4 Steps)
              </p>
              
              <div className="grid gap-3">
                {/* Step 1 */}
                <div className="relative bg-[#0a0a12] border border-[#334155] p-3 hover:border-[#00f0ff]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-[#ff006e] text-sm font-bold font-[family-name:var(--font-space)] tracking-wider shrink-0">
                      01
                    </span>
                    <div className="flex-1">
                      <p className="text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] mb-1">
                        Upload Your Proof
                      </p>
                      <p className="text-[#64748b] text-sm leading-5">
                        Go to <a href="https://verify.iebc.or.ke" target="_blank" rel="noreferrer" className="text-[#00f0ff] underline underline-offset-2 decoration-1 decoration-[#ff006e] hover:text-[#ff006e] transition-colors">verify.iebc.or.ke</a> and check your voter registration. 
                        When you see the title <span className="text-[#00ff88]">Voter found! Details as below:</span> with your details, take a screenshot. 
                        Upload that screenshot here. <span className="text-[#ff006e]">Only the screenshot with the "Voter Found" page works.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative bg-[#0a0a12] border border-[#334155] p-3 hover:border-[#00f0ff]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-[#ff006e] text-sm font-bold font-[family-name:var(--font-space)] tracking-wider shrink-0">
                      02
                    </span>
                    <div className="flex-1">
                      <p className="text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] mb-1">
                        OCR Reads Your Screenshot
                      </p>
                      <p className="text-[#64748b] text-sm leading-5">
                        Our system uses OCR (Optical Character Recognition) to read the text in your screenshot. 
                        It looks for specific voter-registration keywords like "IEBC", "voter found", "polling station", and your personal details. 
                        We do not save your screenshot — it is processed instantly and then discarded.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative bg-[#0a0a12] border border-[#334155] p-3 hover:border-[#00f0ff]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-[#ff006e] text-sm font-bold font-[family-name:var(--font-space)] tracking-wider shrink-0">
                      03
                    </span>
                    <div className="flex-1">
                      <p className="text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] mb-1">
                        Mint Your Badge
                      </p>
                      <p className="text-[#64748b] text-sm leading-5">
                        If the screenshot is valid (shows "Voter Found" with your details), we create a cryptographically signed badge. 
                        This badge contains your chosen name/alias, your statement, and a summary of the proof (not the full screenshot). 
                        <span className="text-[#00ff88]">No database stores your data.</span> The badge is a self-contained token that can be verified by anyone.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative bg-[#0a0a12] border border-[#334155] p-3 hover:border-[#00f0ff]/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-[#ff006e] text-sm font-bold font-[family-name:var(--font-space)] tracking-wider shrink-0">
                      04
                    </span>
                    <div className="flex-1">
                      <p className="text-[#00f0ff] text-xs font-bold uppercase tracking-[0.2em] mb-1">
                        Verify Anywhere
                      </p>
                      <p className="text-[#64748b] text-sm leading-5">
                        Your badge has a QR code. Anyone can scan it to see your verification page. 
                        The page checks the cryptographic signature to confirm the badge is real — no database lookup needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust & Security */}
            <div className="mb-4 pb-4 border-b border-[#00f0ff]/30">
              <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Trust & Security (Why You Can Trust This)
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#00ff88] text-lg">✓</span>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">No Database</p>
                    <p className="text-[#64748b] text-sm">We do not store your screenshots, name, ID number, or any personal data. The badge is stateless — it proves itself through math, not through a database lookup.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-[#00ff88] text-lg">✓</span>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">Open Source</p>
                    <p className="text-[#64748b] text-sm">All code is public on GitHub. Anyone can audit it, verify it works as claimed, or even run their own copy. No hidden tricks.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-[#00ff88] text-lg">✓</span>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">Cryptographic Signing</p>
                    <p className="text-[#64748b] text-sm">Every badge is signed with HMAC-SHA256. The signature can be verified mathematically. A fake badge cannot pass verification.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-[#00ff88] text-lg">✓</span>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">IEBC Official Source</p>
                    <p className="text-[#64748b] text-sm">We only accept screenshots from verify.iebc.or.ke — the official IEBC voter verification portal. This ensures the proof comes from the official source, not a photoshopped image.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Data Is In The Badge */}
            <div className="mb-4 pb-4 border-b border-[#00f0ff]/30">
              <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                What Data Is Stored In Your Badge?
              </p>
              <p className="text-[#64748b] text-sm leading-6">
                Your badge contains: (1) Your chosen alias/name, (2) Your statement/motto, (3) A score showing how many voter keywords were detected, (4) A timestamp of when it was created, and (5) A cryptographic signature. 
                <span className="text-[#ff006e]">It does NOT contain your ID number, polling station details, or the full screenshot.</span> The badge is designed to prove you registered while protecting your privacy.
              </p>
            </div>

            {/* Built For Transparency */}
            <div className="mb-4 pb-4 border-b border-[#334155]">
              <p className="text-[#ff006e] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                Built For Transparency
              </p>
              <p className="text-[#64748b] text-sm leading-6">
                In a world where trust must be earned, not assumed, this system is designed to be verifiable by anyone. 
                The entire codebase is open source — no hidden logic, no secret processes. The cryptographic signatures use standard, 
                well-documented algorithms that mathematicians worldwide have verified. You do not need to trust the creators; 
                you can audit the code yourself, verify the signatures independently, and understand exactly how every part works. 
                Your badge cannot be forged, cannot be censored, and cannot be deleted — it is mathematical proof, not a database entry.
              </p>
            </div>

            {/* Open source section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#00f0ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  Open Source
                </p>
                <p className="text-[#64748b] text-sm">
                  The code is open for anyone to audit, verify, and improve. Check the GitHub repository to see exactly how it works.
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
