import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Mail, RotateCcw, Sparkles } from 'lucide-react';

interface LetterCardProps {
  letterText: string;
  wordCount?: number;
  onStartOver: () => void;
  onRevisionRequest?: (prompt: string) => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  letterText,
  wordCount,
  onStartOver,
  onRevisionRequest,
}) => {
  const [copied, setCopied] = useState(false);

  // Calculate words if not passed
  const calculatedWords = wordCount ?? letterText.trim().split(/\s+/).filter(Boolean).length;
  const isWithinCap = calculatedWords <= 50;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="mt-4 border-2 border-[#E8572A] bg-[#141414] text-[#F0EFEA] p-4 sm:p-5 brutalist-shadow-sm font-mono relative">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2A2A2A] text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#E8572A] text-white font-bold px-2 py-0.5 text-[11px] uppercase tracking-wider">
            FIT MEMO
          </span>
          <span className="text-[#888888] hidden sm:inline text-[11px]">PROJECT-MATCHED DISPATCH</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#888888]">WORD CAP:</span>
          <span className={`font-bold px-1.5 py-0.5 border ${
            isWithinCap 
              ? 'border-emerald-600/60 bg-emerald-950/40 text-emerald-400' 
              : 'border-[#E8572A] bg-red-950/40 text-[#E8572A]'
          }`}>
            {calculatedWords} / 50 WORDS
          </span>
        </div>
      </div>

      {/* Main Letter Body */}
      <div className="text-xs sm:text-sm leading-relaxed text-[#EDEDED] whitespace-pre-wrap select-text selection:bg-[#E8572A] selection:text-white py-1">
        {letterText}
      </div>

      {/* Primary Actions Grid */}
      <div className="mt-4 pt-3 border-t border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#222222] hover:bg-[#333333] text-white border border-[#444444] text-xs font-bold transition-all brutalist-btn cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#E8572A]" />}
          {copied ? 'COPIED TO CLIPBOARD' : 'COPY LETTER'}
        </button>

        <a
          href="https://saoumyamandhar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2 bg-[#E8572A] hover:bg-[#d04b20] text-white border border-[#E8572A] text-xs font-bold transition-all brutalist-btn cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>CONTACT SAOUMYA</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>

        <button
          onClick={onStartOver}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-transparent hover:bg-[#222222] text-[#888888] hover:text-white border border-[#333333] text-xs font-bold transition-all brutalist-btn cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>START OVER</span>
        </button>
      </div>

      {/* Direct Portfolio Link row */}
      <div className="mt-3 pt-2 border-t border-[#222222] flex flex-wrap items-center justify-between text-[11px] text-[#888888]">
        <span>PORTFOLIO ARCHIVE:</span>
        <a
          href="https://saoumyamandhar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E8572A] hover:underline font-bold inline-flex items-center gap-1"
        >
          https://saoumyamandhar.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Stage 6 Revision Quick Selectors */}
      {onRevisionRequest && (
        <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
          <div className="text-xs text-[#E8572A] font-bold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Want it sharper, more about research, or aimed at someone else?</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Sharper & Shorter', prompt: 'Make it sharper and shorter' },
              { label: 'More About Research', prompt: 'Make it more about her research methods and studies' },
              { label: 'More Technical Systems', prompt: 'Focus more on technical systems, data, and tooling' },
              { label: 'Aimed at Leadership', prompt: 'Tune this letter aimed at executive leadership' },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => onRevisionRequest(option.prompt)}
                className="px-2.5 py-1.5 bg-[#1F1F1F] hover:bg-[#E8572A] hover:text-white text-[#CCCCCC] border border-[#444444] text-[11px] font-mono transition-colors cursor-pointer brutalist-btn"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
