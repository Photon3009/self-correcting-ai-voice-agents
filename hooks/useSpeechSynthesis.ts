import { useRef, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speak = (text: string, isMuted: boolean = false) => {
    if (synthRef.current && !isMuted) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      setTimeout(() => {
        if (synthRef.current && !isMuted) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
          
          utterance.onstart = () => console.log('Speech started');
          utterance.onend = () => console.log('Speech ended');
          utterance.onerror = (e) => console.error('Speech error:', e);
          
          synthRef.current.speak(utterance);
        }
      }, 500); // Small delay to ensure smooth speech
    }
  };

  const cancel = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return { speak, cancel };
};
