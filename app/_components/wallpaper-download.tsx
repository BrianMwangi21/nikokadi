"use client";

import { useState } from "react";

interface WallpaperDownloadProps {
  alias: string;
  badgeUrl: string;
}

export function WallpaperDownload({ alias, badgeUrl }: WallpaperDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWallpaper = async () => {
    setIsGenerating(true);
    
    try {
      // Import QRCode library dynamically
      const QRCode = await import('qrcode');
      
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(badgeUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#00f0ff',
          light: '#0a0a12'
        },
        errorCorrectionLevel: 'H'
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, 1080, 1920);

      // Holographic border
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, '#00f0ff');
      gradient.addColorStop(0.5, '#ff006e');
      gradient.addColorStop(1, '#00ff88');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 1040, 1880);

      // Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 80px monospace';
      ctx.fillText('NIKO KADI', 540, 150);

      ctx.fillStyle = '#ff006e';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('PROOF OF PARTICIPATION', 540, 200);

      // Main text - Alias
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 100px sans-serif';
      ctx.fillText((alias || 'Huyu').toUpperCase(), 540, 450);

      // AKO
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText('AKO', 540, 550);

      // KADI
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText('KADI', 540, 680);

      // Load and draw QR code
      const qrImage = new Image();
      qrImage.onload = () => {
        // Draw QR centered
        ctx.drawImage(qrImage, 290, 800, 500, 500);
        
        // Border around QR
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(290, 800, 500, 500);

        // Instructions
        ctx.fillStyle = '#64748b';
        ctx.font = '32px sans-serif';
        ctx.fillText('Scan to verify this badge', 540, 1380);

        // URL
        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 40px monospace';
        ctx.fillText('nikokadike.vercel.app', 540, 1680);

        ctx.fillStyle = '#475569';
        ctx.font = '24px monospace';
        ctx.fillText('// BUILT FOR KENYA', 540, 1730);

        // Download
        const link = document.createElement('a');
        link.download = `niko-kadi-wallpaper-${(alias || 'huyu').toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        setIsGenerating(false);
      };
      qrImage.src = qrDataUrl;
      
    } catch (error) {
      console.error('Failed to generate wallpaper:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-4 border-t border-[#334155]">
      <button
        onClick={generateWallpaper}
        disabled={isGenerating}
        className="w-full py-3 px-4 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] font-bold text-xs uppercase hover:bg-[#00f0ff] hover:text-[#0a0a12] transition-all disabled:opacity-50"
      >
        {isGenerating ? 'GENERATING...' : 'DOWNLOAD AS WALLPAPER'}
      </button>
      <p className="text-[#64748b] text-[10px] text-center mt-2">
        1080×1920 PNG • Perfect for phone wallpaper
      </p>
    </div>
  );
}
