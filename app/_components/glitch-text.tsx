"use client";

export function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-[#ff006e] animate-glitch-1" style={{ clipPath: 'inset(0 0 50% 0)' }}>{text}</span>
      <span className="absolute top-0 left-0 -z-10 text-[#00f0ff] animate-glitch-2" style={{ clipPath: 'inset(50% 0 0 0)' }}>{text}</span>
    </div>
  );
}
