"use client";

import Link from "next/link";

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

// Animated grid component
function CyberGrid() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-[#00f0ff]/10" style={{ top: `${i * 7}%` }} />
      ))}
      {[...Array(15)].map((_, i) => (
        <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-[#00f0ff]/10" style={{ left: `${i * 7}%` }} />
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#050508] text-[#e2e8f0] overflow-x-hidden relative font-[family-name:var(--font-inter)]">
      <CyberGrid />
      
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ff006e]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-4">
            <div className="w-3 h-16 bg-gradient-to-b from-[#00f0ff] to-transparent animate-pulse" />
            <div className="text-center">
              <GlitchText 
                text="NIKO KADI" 
                className="font-[family-name:var(--font-space)] text-5xl md:text-6xl font-black tracking-wider"
              />
            </div>
            <div className="w-3 h-16 bg-gradient-to-b from-[#00f0ff] to-transparent animate-pulse" />
          </div>
          <p className="text-[#ff006e] text-xs font-bold tracking-[0.3em] uppercase mt-4">
            SYSTEM DOCUMENTATION
          </p>
        </header>

        {/* Main card */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] via-[#ff006e] to-[#00ff88] opacity-30 blur transition duration-500" />
          <div className="relative bg-[#0a0a12] border border-[#00f0ff]/50 p-6 md:p-8">
            
            {/* Description */}
            <div className="mb-6 pb-4 border-b border-[#00f0ff]/30">
              <p className="text-[#64748b] text-sm leading-7">
                This app is a stateless badge issuer. It does not save screenshots, accounts, or a voter database.
              </p>
            </div>

            {/* Steps */}
            <div className="grid gap-4">
              {[
                ["01", "Upload", "You drop a screenshot into the page."],
                ["02", "Read", "OCR checks the text for voter-registration signals."],
                ["03", "Mint", "A signed badge token is created with no stored profile."],
                ["04", "Scan", "The QR opens the verification page and checks the signature."],
              ].map(([step, title, copy]) => (
                <div key={title} className="relative bg-[#0a0a12] border border-[#334155] p-4 hover:border-[#00f0ff]/50 transition-colors">
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
            <div className="mt-6 grid md:grid-cols-2 gap-4 border-t border-[#334155] pt-6">
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

        {/* Footer */}
        <footer className="text-center">
          <div className="inline-flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase text-[#475569]">
            <Link href="/" className="hover:text-[#00f0ff] transition-colors">
              &lt; RETURN_TO_SYSTEM
            </Link>
            <span className="w-2 h-2 bg-[#334155] rounded-full" />
            <Link href="https://github.com/BrianMwangi21/nikokadi" className="hover:text-[#00f0ff] transition-colors">
              GITHUB_REPO
            </Link>
          </div>
          <p className="mt-4 text-[8px] text-[#334155] tracking-[0.3em]">
            // SYSTEM BUILT FOR THE FUTURE OF KENYA
          </p>
        </footer>
      </div>

      <style jsx global>{`
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
        .animate-glitch-1 { animation: glitch-1 0.3s infinite; }
        .animate-glitch-2 { animation: glitch-2 0.3s infinite; }
      `}</style>
    </main>
  );
}
