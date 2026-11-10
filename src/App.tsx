/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OledTerminal } from './components/OledTerminal';
import { TerminalControls } from './components/TerminalControls';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { ChatMessage, MessageType, SystemInfo } from './types';

// Initial fixed greeting - Required: no model call on load
const INITIAL_GREETING: ChatMessage = {
  id: 'init-1',
  role: 'assistant',
  content: "Hi, I'm Saoumya's mini-me. What are you working on?",
  type: 'question',
  timestamp: '00:01',
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [questionCount, setQuestionCount] = useState<number>(1); // The initial greeting is question #1
  const [hasPlayedBack, setHasPlayedBack] = useState<boolean>(false);
  const [hasLetter, setHasLetter] = useState<boolean>(false);
  const [latestWordCount, setLatestWordCount] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDiagramOpen, setIsDiagramOpen] = useState<boolean>(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Fetch system architecture info for the (i) modal
  useEffect(() => {
    fetch('/api/info')
      .then((res) => res.json())
      .then((data) => setSystemInfo(data))
      .catch((err) => console.error('Failed to load system info', err));
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorBanner(null);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: timeStr,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            type: m.type,
          })),
          questionCount,
          hasPlayedBack,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const replyType: MessageType = data.type || 'answer';
      const replyText: string = data.text || '';
      const replyWordCount: number | undefined = data.wordCount;

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        type: replyType,
        wordCount: replyWordCount,
        timestamp: timeStr,
      };

      setMessages([...newMessages, assistantMessage]);

      if (replyType === 'question') {
        setQuestionCount((prev) => prev + 1);
      } else if (replyType === 'playback') {
        setHasPlayedBack(true);
      } else if (replyType === 'letter') {
        setHasLetter(true);
        if (replyWordCount) setLatestWordCount(replyWordCount);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorBanner(
        err.message || 'Transmission disrupted. Check connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setMessages([
      {
        ...INITIAL_GREETING,
        id: `init-${Date.now()}`,
        timestamp: '00:01',
      },
    ]);
    setQuestionCount(1);
    setHasPlayedBack(false);
    setHasLetter(false);
    setLatestWordCount(undefined);
    setErrorBanner(null);
  };

  const handleRevisionRequest = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-[#E9E7E2] text-[#1A1A1A] flex flex-col font-mono selection:bg-[#E8572A] selection:text-white">
      {/* Top Header */}
      <Header
        onOpenDiagram={() => setIsDiagramOpen(true)}
        onReset={handleStartOver}
      />

      {/* Main Terminal Desk Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* Physical Device Frame Top Plaque */}
        <div className="flex items-center justify-between text-[11px] text-[#666666] border-b border-[#CCCCCC] pb-1 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A1A]">[ + ]</span>
            <span>HARDWARE CHASSIS: DESK_OLED_REV2</span>
          </div>
          <div className="flex items-center gap-3">
            <span>MODEL: GEMINI FLASH</span>
            <span>AGENT: MINI-ME</span>
            <span className="font-bold text-[#1A1A1A]">[ + ]</span>
          </div>
        </div>

        {/* Error notification if any */}
        {errorBanner && (
          <div className="p-3 bg-[#E8572A] text-white font-mono text-xs brutalist-border flex items-center justify-between">
            <span>[ERROR]: {errorBanner}</span>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-white hover:underline uppercase font-bold text-[11px] ml-4 cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* The Black OLED Terminal Screen */}
        <OledTerminal
          messages={messages}
          isLoading={isLoading}
          onStartOver={handleStartOver}
          onRevisionRequest={handleRevisionRequest}
          hasLetter={hasLetter}
          questionCount={questionCount}
        />

        {/* Interactive Controls & Input Panel */}
        <TerminalControls
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />

        {/* Physical Device Frame Bottom Status Bar */}
        <footer className="pt-4 border-t border-[#CCCCCC] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#666666]">
          <div className="flex items-center gap-3">
            <span>UC BERKELEY // MDes JACOBS INSTITUTE</span>
            <span>•</span>
            <a
              href="https://saoumyamandhar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1A1A] font-bold hover:text-[#E8572A] underline"
            >
              saoumyamandhar.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>TRUTH SOURCE: KNOWLEDGE.MD</span>
            <span>•</span>
            <button
              onClick={() => setIsDiagramOpen(true)}
              className="text-[#E8572A] hover:underline font-bold cursor-pointer"
            >
              INSPECT RULES & ARCHITECTURE
            </button>
          </div>
        </footer>
      </main>

      {/* System Diagram Modal */}
      <SystemDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
        systemInfo={systemInfo}
        questionCount={questionCount}
        hasPlayedBack={hasPlayedBack}
        hasLetter={hasLetter}
        latestWordCount={latestWordCount}
      />
    </div>
  );
}
