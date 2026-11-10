import React, { useState } from 'react';
import { X, Cpu, Code2, Database, ShieldCheck, FileText } from 'lucide-react';
import { SystemInfo } from '../types';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemInfo: SystemInfo | null;
  questionCount: number;
  hasPlayedBack: boolean;
  hasLetter: boolean;
  latestWordCount?: number;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({
  isOpen,
  onClose,
  systemInfo,
  questionCount,
  hasPlayedBack,
  hasLetter,
  latestWordCount,
}) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'rules' | 'knowledge'>('diagram');
  const [knowledgeText, setKnowledgeText] = useState<string>('');
  const [loadingKnowledge, setLoadingKnowledge] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTabChange = async (tab: 'diagram' | 'rules' | 'knowledge') => {
    setActiveTab(tab);
    if (tab === 'knowledge' && !knowledgeText) {
      setLoadingKnowledge(true);
      try {
        const res = await fetch('/api/knowledge');
        const data = await res.json();
        setKnowledgeText(data.content || 'No knowledge content loaded.');
      } catch (e) {
        setKnowledgeText('Error loading knowledge file.');
      } finally {
        setLoadingKnowledge(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#E9E7E2] text-[#1A1A1A] w-full max-w-4xl max-h-[92vh] flex flex-col brutalist-border brutalist-shadow-lg overflow-hidden animate-in fade-in duration-150">
        {/* Terminal Header */}
        <div className="bg-[#1A1A1A] text-[#E9E7E2] px-4 py-3 flex items-center justify-between border-b-2 border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="text-[#E8572A] font-bold text-sm tracking-wider font-mono">SYS_ARCH // </span>
            <h2 className="font-heading text-base sm:text-lg tracking-tight uppercase">SYSTEM ARCHITECTURE DIAGRAM</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-[#E8572A] text-white hover:bg-white hover:text-[#1A1A1A] transition-colors brutalist-btn cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b-2 border-[#1A1A1A] bg-[#DDD9D0] text-xs font-mono font-bold">
          <button
            onClick={() => handleTabChange('diagram')}
            className={`px-4 py-2.5 uppercase transition-colors cursor-pointer border-r-2 border-[#1A1A1A] ${
              activeTab === 'diagram' ? 'bg-[#E9E7E2] text-[#E8572A] shadow-inner' : 'hover:bg-[#CCC7BC]'
            }`}
          >
            System Diagram
          </button>
          <button
            onClick={() => handleTabChange('rules')}
            className={`px-4 py-2.5 uppercase transition-colors cursor-pointer border-r-2 border-[#1A1A1A] ${
              activeTab === 'rules' ? 'bg-[#E9E7E2] text-[#E8572A]' : 'hover:bg-[#CCC7BC]'
            }`}
          >
            Truth & Boundaries Rules
          </button>
          <button
            onClick={() => handleTabChange('knowledge')}
            className={`px-4 py-2.5 uppercase transition-colors cursor-pointer ${
              activeTab === 'knowledge' ? 'bg-[#E9E7E2] text-[#E8572A]' : 'hover:bg-[#CCC7BC]'
            }`}
          >
            Knowledge File (Source of Truth)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 oled-scrollbar font-mono text-xs sm:text-sm">
          {activeTab === 'diagram' && (
            <>
              {/* Live Status Bar */}
              <div className="bg-[#1A1A1A] text-[#E9E7E2] p-3.5 brutalist-border flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-none bg-[#E8572A] inline-block animate-pulse"></span>
                  <span className="font-bold text-[#E8572A]">CURRENT SESSION TELEMETRY:</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  <span>
                    QUESTIONS ASKED: <strong className="text-white">{questionCount} / 3</strong>
                  </span>
                  <span>
                    PLAYBACK CONFIRMED: <strong className={hasPlayedBack ? 'text-emerald-400' : 'text-amber-400'}>{hasPlayedBack ? 'YES' : 'PENDING'}</strong>
                  </span>
                  <span>
                    LETTER PRODUCED: <strong className={hasLetter ? 'text-emerald-400' : 'text-amber-400'}>{hasLetter ? 'YES' : 'NO'}</strong>
                  </span>
                  {latestWordCount !== undefined && (
                    <span>
                      WORD CAP AUDIT: <strong className={latestWordCount <= 50 ? 'text-emerald-400' : 'text-[#E8572A]'}>{latestWordCount} / 50 words</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Data Flow Diagram Card */}
              <div className="border-2 border-[#1A1A1A] bg-white p-4 brutalist-shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-2 font-mono">
                  Runtime Execution Pipeline
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#E9E7E2] border border-[#1A1A1A]">
                    <div className="font-bold text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#E8572A]" /> 1. INPUT DATA
                    </div>
                    <p className="text-[#444444] text-[11px] leading-relaxed">
                      System instructions + verbatim knowledge.md + conversation transcript. No external hallucinations permitted.
                    </p>
                  </div>
                  <div className="p-3 bg-[#E9E7E2] border border-[#1A1A1A]">
                    <div className="font-bold text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#E8572A]" /> 2. GEMINI FLASH
                    </div>
                    <p className="text-[#444444] text-[11px] leading-relaxed">
                      Evaluates project context, asks up to 3 gap-filling questions, formulates playback summary, synthesizes tailored letter.
                    </p>
                  </div>
                  <div className="p-3 bg-[#E9E7E2] border border-[#1A1A1A]">
                    <div className="font-bold text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E8572A]" /> 3. CODE ENFORCER
                    </div>
                    <p className="text-[#444444] text-[11px] leading-relaxed">
                      Strict state machine interceptor: forces playback after 3 questions, blocks letters before playback, audits 50-word cap.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Core Responsibilities Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: What the Code Decides */}
                <div className="border-2 border-[#1A1A1A] bg-white p-4 brutalist-shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-[#1A1A1A]">
                    <Code2 className="w-4 h-4 text-[#E8572A]" />
                    <h3 className="font-heading text-xs tracking-tight uppercase text-[#1A1A1A]">
                      WHAT CODE CONTROLS
                    </h3>
                  </div>
                  <ul className="space-y-3 flex-1 text-xs text-[#222222]">
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">1. Zero-Call Fixed Greeting</strong>
                      "Hi, I'm Saoumya's mini-me. What are you working on?" rendered instantly on load without LLM latency.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">2. Question Counter (Max 3)</strong>
                      After 3 questions from mini-me, code forces model into Stage 4 (Playback) instead of asking further.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">3. Playback Verification Gate</strong>
                      If model emits a letter before user confirms playback, code intercepts and enforces playback first.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">4. 50-Word Cap Enforcement</strong>
                      If a letter runs over 50 words, code programmatically demands a one-shot shortening pass.
                    </li>
                    <li>
                      <strong className="block text-[#1A1A1A] font-bold">5. UI Action Controls</strong>
                      Direct portfolio link, Copy button, Contact Saoumya trigger, and Start Over reset state.
                    </li>
                  </ul>
                </div>

                {/* Column 2: What the Model Decides */}
                <div className="border-2 border-[#1A1A1A] bg-white p-4 brutalist-shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-[#1A1A1A]">
                    <Cpu className="w-4 h-4 text-[#E8572A]" />
                    <h3 className="font-heading text-xs tracking-tight uppercase text-[#1A1A1A]">
                      WHAT MODEL DECIDES
                    </h3>
                  </div>
                  <ul className="space-y-3 flex-1 text-xs text-[#222222]">
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">1. Gap-Filling Questions</strong>
                      Formulates 1-to-3 follow-ups (under 12 words) focusing on product, stuck points, and needed help.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">2. Playback Synthesis</strong>
                      Condenses visitor's project need into a single sentence and asks: "Did I get that right?".
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">3. Tailored Fit Letter</strong>
                      Picks 1-2 real proof points from knowledge file (Ericsson firewall 50% drop, Site Simulator, etc.) matching their need.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">4. Project Starting Point</strong>
                      Proposes concrete first move on visitor's challenge (e.g. "she'd start with the nurses").
                    </li>
                    <li>
                      <strong className="block text-[#1A1A1A] font-bold">5. Honest Not-a-Fit Calls</strong>
                      Immediately states if work requires production coding or outside expertise, refusing to oversell.
                    </li>
                  </ul>
                </div>

                {/* Column 3: What the Model is Given */}
                <div className="border-2 border-[#1A1A1A] bg-white p-4 brutalist-shadow-sm flex flex-col">
                  <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-[#1A1A1A]">
                    <Database className="w-4 h-4 text-[#E8572A]" />
                    <h3 className="font-heading text-xs tracking-tight uppercase text-[#1A1A1A]">
                      WHAT MODEL IS GIVEN
                    </h3>
                  </div>
                  <ul className="space-y-3 flex-1 text-xs text-[#222222]">
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">1. System Instructions</strong>
                      Word-for-word identity, punchy/direct personality, prohibited phrases, flow stages, and strict truth rules.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">2. Knowledge File (knowledge.md)</strong>
                      Complete verified facts: 4 years at Ericsson, C40 Special Mention, Offsetgo MVP, Berkeley MDes, XAI toolkit.
                    </li>
                    <li className="pb-2 border-b border-[#E9E7E2]">
                      <strong className="block text-[#1A1A1A] font-bold">3. Chat Transcript History</strong>
                      Every visitor message and mini-me turn so far, maintaining tight multi-turn context.
                    </li>
                    <li>
                      <strong className="block text-[#1A1A1A] font-bold">4. Strict JSON Schema</strong>
                      Structured contract: type ("question" | "playback" | "letter" | "answer" | "not_a_fit") + text.
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'rules' && (
            <div className="bg-white border-2 border-[#1A1A1A] p-5 space-y-4 brutalist-shadow-sm text-xs leading-relaxed">
              <h3 className="font-heading text-sm text-[#1A1A1A] uppercase border-b-2 border-[#1A1A1A] pb-2">
                CRITICAL TRUTH & BOUNDARY RULES ENFORCED
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#E8572A] font-mono text-xs uppercase">Verified Truth Constraints</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-[#333333]">
                    <li><strong>4 Years at Ericsson:</strong> Never more (Jul 2022 to Jul 2026). Earlier internship is separate.</li>
                    <li><strong>Projected Figures:</strong> 78%, 75%, and 30% figures must always be cited as "projected".</li>
                    <li><strong>59% Metric:</strong> Means users "found it faster" (self-reported), not a benchmarked speedup.</li>
                    <li><strong>50% Ticket Drop:</strong> From the firewall request tool redesign Saoumya led; do not attribute to a generic team.</li>
                    <li><strong>Accessibility:</strong> Built from Ericsson's accessible color palette and base components.</li>
                    <li><strong>Agent Veil:</strong> "Building" it and "designing a study" at UC Berkeley. No results yet.</li>
                    <li><strong>No Production Code:</strong> Saoumya does not write production code; she prototypes with AI tools.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-[#E8572A] font-mono text-xs uppercase">Strict Operational Boundaries</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-[#333333]">
                    <li><strong>Hand Off to Saoumya:</strong> Availability, start dates, salary/rates, visas/work authorization, references, interview scheduling.</li>
                    <li><strong>No Private Data:</strong> Never share phone numbers or personal email addresses.</li>
                    <li><strong>No Comparisons:</strong> Never compare her to other candidates or critique other people.</li>
                    <li><strong>Never Pretend:</strong> Mini-Me is the knowledgeable friend who speaks for her, never Saoumya herself.</li>
                    <li><strong>Portfolio Link:</strong> All fit letters and contact paths lead to <span className="underline font-bold">saoumyamandhar.com</span>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="bg-[#0B0B0B] text-[#EDEDED] border-2 border-[#1A1A1A] p-4 brutalist-shadow-sm font-mono text-xs">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#333333]">
                <span className="text-[#E8572A] font-bold">FILE: /knowledge.md</span>
                <span className="text-[#888888] text-[11px]">Strict Ground Truth Source</span>
              </div>
              {loadingKnowledge ? (
                <div className="py-8 text-center text-[#888888]">Loading knowledge.md from server...</div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed max-h-[50vh] overflow-y-auto oled-scrollbar pr-2 text-[#E2E2E2]">
                  {knowledgeText}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#E9E7E2] px-4 py-3 border-t-2 border-[#1A1A1A] flex items-center justify-between text-xs font-mono">
          <span className="text-[#666666]">MINI-ME TERMINAL DESK // DESIGNED FOR SAOUMYA MANDHAR</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1A1A1A] text-white font-bold hover:bg-[#E8572A] transition-colors brutalist-btn cursor-pointer"
          >
            DISMISS [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
