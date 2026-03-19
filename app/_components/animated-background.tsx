"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#ff006e]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}
