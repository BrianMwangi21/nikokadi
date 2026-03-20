"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  badgeUrl: string;
}

export function CopyLinkButton({ badgeUrl }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (!badgeUrl) return;
    
    try {
      await navigator.clipboard.writeText(badgeUrl);
      setCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <button
      onClick={copyLink}
      className={`w-full py-3 px-4 border font-bold text-xs uppercase transition-all ${
        copied
          ? "bg-[#00ff88] border-[#00ff88] text-[#0a0a12]"
          : "bg-[#0a0a12] border-[#ff006e] text-[#ff006e] hover:bg-[#ff006e] hover:text-white"
      }`}
    >
      {copied ? "COPIED" : "Copy Link to share with others"}
    </button>
  );
}
