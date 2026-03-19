"use client";

export function CyberGrid({ lineCount = 20 }: { lineCount?: number }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {[...Array(lineCount)].map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-[#00f0ff]/10"
          style={{ top: `${i * (100 / lineCount)}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
      {/* Vertical lines */}
      {[...Array(lineCount)].map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-[#00f0ff]/10"
          style={{ left: `${i * (100 / lineCount)}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
      {/* Animated scan line */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent animate-scan" />
    </div>
  );
}
