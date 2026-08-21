declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;

  onstart: (() => void) | null;

  onresult: (
    (event: SpeechRecognitionEvent) => void
  ) | null;

  onerror: (
    (event: SpeechRecognitionErrorEvent) => void
  ) | null;

  onend: (() => void) | null;
}

export {};