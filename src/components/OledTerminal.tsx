import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { LetterCard } from './LetterCard';

interface OledTerminalProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onStartOver: () => void;
  onRevisionRequest: (prompt: string) => void;
  hasLetter: boolean;
  questionCount: number;
}

export const OledTerminal: React.FC<OledTerminalProps> = ({
  messages,
  isLoading,
  onStartOver,
  onRevisionRequest,
  hasLetter,
  questionCount,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="bg-[#0B0B0B] text-[#EDEDED] brutalist-border brutalist-shadow-lg p-4 sm:p-6 flex flex-col h-[520px] sm:h-[580px] relative overflow-hidden font-mono">
      {/* Screen Bezel Header / Hardware Status */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#222222] text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-[#E8572A] inline-block"></span>
            <span className="w-2 h-2 bg-[#333333] inline-block"></span>
          </div>
          <span className="text-[#888888] font-mono tracking-wider text-[11px]">
            OLED_DISP // CHAT_STREAM
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-[#666666] hidden sm:inline">
            PROTOCOL: JSON_TYPED
          </span>
          <span className="bg-[#181818] px-2 py-0.5 border border-[#333333] text-[#AAAAAA]">
            Q_COUNT: <strong className="text-white">{questionCount}/3</strong>
          </span>
          <span className="text-emerald-500 font-bold hidden xs:inline flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 inline-block animate-ping"></span>
            ONLINE
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-5 pr-2 oled-scrollbar select-text"
      >
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isLetter = msg.type === 'letter';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isAssistant ? 'items-start' : 'items-end'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1.5 text-[11px] text-[#888888]">
                {isAssistant ? (
                  <span className="text-[#E8572A] font-bold tracking-wider flex items-center gap-1">
                    <span className="text-white font-mono">( o o )</span> MINI-ME
                  </span>
                ) : (
                  <span className="text-[#AAAAAA] font-bold tracking-wider">
                    [ &gt;_ ] VISITOR
                  </span>
                )}
                <span>•</span>
                <span className="text-[#555555]">{msg.timestamp}</span>

                {isAssistant && msg.type && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-[#1A1A1A] border border-[#333333] text-[#999999] uppercase">
                    {msg.type}
                  </span>
                )}
              </div>

              {/* Message Body */}
              <div
                className={`max-w-[94%] sm:max-w-[85%] text-xs sm:text-sm leading-relaxed p-3.5 border ${
                  isAssistant
                    ? isLetter
                      ? 'bg-[#121212] border-[#E8572A] text-white w-full'
                      : 'bg-[#141414] border-[#2A2A2A] text-[#F0EFEA]'
                    : 'bg-[#1E1E1E] border-[#444444] text-[#FFFFFF]'
                }`}
              >
                {/* Regular text content */}
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* If this is a letter message, display the dedicated letter card underneath */}
                {isLetter && (
                  <LetterCard
                    letterText={msg.content}
                    wordCount={msg.wordCount}
                    onStartOver={onStartOver}
                    onRevisionRequest={onRevisionRequest}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Typing State */}
        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-[#888888]">
              <span className="text-[#E8572A] font-bold flex items-center gap-1">
                <span className="text-white font-mono">( o o )</span> MINI-ME
              </span>
              <span>•</span>
              <span className="text-[#555555]">PROCESSING</span>
            </div>
            <div className="bg-[#141414] border border-[#2A2A2A] text-[#E8572A] text-xs sm:text-sm px-4 py-3 flex items-center gap-2">
              <span>( o o ) thinking</span>
              <span className="terminal-cursor"></span>
            </div>
          </div>
        )}
      </div>

      {/* Screen Bezel Bottom Info */}
      <div className="pt-3 mt-2 border-t border-[#1C1C1C] flex flex-wrap items-center justify-between text-[10px] text-[#555555]">
        <span>DISPLAY: RETRO_OLED 128x64 EMULATION</span>
        <span>NO EMOJI // NO GRADIENTS // BRUTALIST DESK</span>
      </div>
    </div>
  );
};
