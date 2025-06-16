import { useRef, useEffect, useCallback } from 'react';
import { TranscriptEntry,SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/app/types';

interface UseSpeechRecognitionProps {
  onTranscript: (transcript: string) => void;
  isConnected: boolean;
}

export const useSpeechRecognition = ({ onTranscript, isConnected }: UseSpeechRecognitionProps) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionClass) {
        recognitionRef.current = new SpeechRecognitionClass();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          // Clear existing timeout
          if (speechTimeoutRef.current) {
            clearTimeout(speechTimeoutRef.current);
          }
          
          // If we have final transcript, process it
          if (finalTranscript.trim()) {
            onTranscript(finalTranscript.trim());
          }
          
          // Set timeout for interim results (in case final is not triggered)
          if (interimTranscript.trim()) {
            speechTimeoutRef.current = setTimeout(() => {
              if (interimTranscript.trim()) {
                onTranscript(interimTranscript.trim());
              }
            }, 2000); // Wait 2 seconds for final result
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          
          // Restart recognition if it stops unexpectedly
          if (isConnected && event.error !== 'aborted') {
            setTimeout(() => {
              if (isConnected && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch (e) {
                  console.log('Recognition restart failed:', e);
                }
              }
            }, 1000);
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          
          // Restart recognition if still connected
          if (isConnected && isListeningRef.current) {
            setTimeout(() => {
              if (isConnected && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                  console.log('Speech recognition restarted');
                } catch (e) {
                  console.log('Recognition restart failed:', e);
                }
              }
            }, 500);
          }
        };
      } else {
        console.warn('Speech Recognition not supported in this browser');
      }
    }
  }, [isConnected, onTranscript]);

  const startRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        isListeningRef.current = true;
        console.log('Speech recognition started');
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      isListeningRef.current = false;
    }
  }, []);

  return {
    startRecognition,
    stopRecognition,
    isSupported: !!recognitionRef.current
  };
};