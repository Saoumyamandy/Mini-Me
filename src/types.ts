export type MessageType = 'question' | 'playback' | 'letter' | 'answer' | 'not_a_fit';

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  type?: MessageType;
  wordCount?: number;
  timestamp: string;
}

export interface SystemInfo {
  appName: string;
  designer: string;
  model: string;
  codeControls: {
    feature: string;
    detail: string;
  }[];
  modelControls: {
    action: string;
    detail: string;
  }[];
  modelInputs: {
    input: string;
    detail: string;
  }[];
}
