"use client";

import Link from "next/link";
import { GlitchText } from "./glitch-text";

interface PageLayoutProps {
  children: React.ReactNode;
  showDescription?: boolean;
  footerLinks?: Array<{ href: string; label: string }>;
}

export function PageLayout({ children, showDescription = true, footerLinks }: PageLayoutProps) {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-4 md:py-6">
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

      {/* Description */}
      {showDescription && (
        <div className="text-center mb-3 space-y-1">
          <p className="text-[#ff006e] text-[10px] font-bold tracking-[0.2em] uppercase">
            PROOF OF PARTICIPATION
          </p>
          <p className="text-[#64748b] text-xs tracking-wide">
            Upload a screenshot. Mint a signed badge. Scan the QR to verify.
          </p>
          <p className="text-[#00f0ff] text-[10px] tracking-wider">
            Best source for screenshot: <a href="https://verify.iebc.or.ke/" target="_blank" rel="noreferrer" className="underline decoration-1 underline-offset-2 hover:text-[#ff006e] transition-colors">verify.iebc.or.ke</a>
          </p>
        </div>
      )}

      {/* Main content */}
      {children}

      {/* Footer */}
      <footer className="mt-6 text-center">
        <div className="inline-flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase text-white">
          {(footerLinks || [
            { href: "/how-it-works", label: "HOW_IT_WORKS" },
            { href: "https://github.com/BrianMwangi21/nikokadi", label: "GITHUB" }
          ]).map((link, i, arr) => (
            <span key={link.href} className="inline-flex items-center gap-4">
              <Link href={link.href} className="hover:text-[#00f0ff] transition-colors">
                {link.label}
              </Link>
              {i < arr.length - 1 && <span className="w-1.5 h-1.5 bg-[#334155] rounded-full" />}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[8px] text-[#334155] tracking-[0.2em]">
          // BUILT FOR KENYA
        </p>
      </footer>
    </div>
  );
}
