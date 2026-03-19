import { ReactNode } from "react";

export function HolographicCard({ children, className = "" }: { children: ReactNode; className?: string }) {
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
