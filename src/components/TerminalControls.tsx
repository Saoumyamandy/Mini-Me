import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface TerminalControlsProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SAMPLE_PROJECTS = [
  'A tool that helps hospitals schedule nurses',
  'Enterprise data platform needing a canvas component system',
  'Carbon credit marketplace needing 0-to-1 stakeholder mapping',
  'Human-AI interface study on developer trust in agent tools',
];

export const TerminalControls: React.FC<TerminalControlsProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSampleClick = (sample: string) => {
    if (isLoading || disabled) return;
    onSendMessage(sample);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col sm:flex-row border-2 border-[#1A1A1A] bg-white brutalist-shadow">
          <div className="flex-1 flex items-start p-2.5">
            <span className="text-[#E8572A] font-bold text-sm px-2 select-none pt-1">
              &gt;
            </span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              rows={2}
              placeholder="Tell mini-me about your product, role, or project..."
              className="w-full bg-transparent text-[#1A1A1A] text-xs sm:text-sm font-mono placeholder-[#888888] focus:outline-none resize-none pt-1 leading-relaxed"
            />
          </div>

          <div className="p-2 sm:border-l-2 border-[#1A1A1A] bg-[#E9E7E2] flex items-center justify-between sm:justify-center gap-2">
            <span className="text-[10px] text-[#777777] hidden md:inline px-1">
              [ENTER TO TRANSMIT]
            </span>
            <button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
              className={`px-4 py-2 text-xs font-bold font-mono tracking-wider uppercase border-2 border-[#1A1A1A] transition-all brutalist-btn flex items-center gap-1.5 cursor-pointer ${
                input.trim() && !isLoading
                  ? 'bg-[#E8572A] text-white hover:bg-[#d04b20]'
                  : 'bg-[#DDD9D0] text-[#888888] border-[#999999] cursor-not-allowed opacity-75'
              }`}
            >
              <span>TRANSMIT</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Quick Prompt Starters for Visitors */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
        <span className="text-[#666666] font-bold text-[11px] whitespace-nowrap">
          SAMPLE INPUTS:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_PROJECTS.map((sample) => (
            <button
              key={sample}
              onClick={() => handleSampleClick(sample)}
              disabled={isLoading || disabled}
              className="px-2 py-1 bg-white hover:bg-[#E9E7E2] text-[#1A1A1A] border border-[#1A1A1A] text-[11px] hover:border-[#E8572A] transition-colors brutalist-btn cursor-pointer text-left truncate max-w-full"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
