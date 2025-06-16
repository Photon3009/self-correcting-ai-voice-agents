export interface Analysis {
  negotiationScore: number;
  relevanceScore: number;
  flaws: string[];
  improvedInstructions: string;
  reasoning: string;
}

export interface TranscriptEntry {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
}

// Web Speech API type definitions
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}