import React from 'react';
import { Info, RotateCcw, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenDiagram: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDiagram, onReset }) => {
  return (
    <header className="border-b-2 border-[#1A1A1A] bg-[#E9E7E2] py-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title and Identification */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl tracking-tight text-[#1A1A1A] uppercase">
              MINI-ME
            </h1>
            <span className="bg-[#1A1A1A] text-[#E8572A] font-mono text-[11px] font-bold px-2 py-0.5 border border-[#1A1A1A]">
              DESK TERMINAL // MM-01
            </span>
          </div>
          <p className="font-mono text-xs text-[#555555] max-w-md">
            Speaking for product designer <a href="https://saoumyamandhar.com" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] font-bold underline hover:text-[#E8572A]">Saoumya Mandhar</a>. Finds what you need, agrees on the gap, writes a 50-word fit letter.
          </p>
        </div>

        {/* Action Controls & Info Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Info Button (i) */}
          <button
            onClick={onOpenDiagram}
            className="flex items-center gap-2 px-3 py-2 bg-[#E8572A] hover:bg-[#d04b20] text-white font-mono text-xs font-bold border-2 border-[#1A1A1A] brutalist-shadow-sm brutalist-btn cursor-pointer transition-transform"
            title="Open System Architecture Diagram"
            aria-label="System Architecture Diagram"
          >
            <Info className="w-4 h-4" />
            <span className="tracking-wider uppercase font-bold">( i ) SYSTEM DIAGRAM</span>
          </button>

          {/* Start Over Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#DDD9D0] text-[#1A1A1A] font-mono text-xs font-bold border-2 border-[#1A1A1A] brutalist-shadow-sm brutalist-btn cursor-pointer transition-transform"
            title="Start Over with a fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline uppercase">RESET</span>
          </button>

          {/* Direct Portfolio Link */}
          <a
            href="https://saoumyamandhar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white hover:bg-[#DDD9D0] text-[#1A1A1A] border-2 border-[#1A1A1A] brutalist-shadow-sm brutalist-btn cursor-pointer transition-transform"
            title="Visit saoumyamandhar.com"
            aria-label="Visit Portfolio"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
