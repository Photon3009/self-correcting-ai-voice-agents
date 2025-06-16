"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Settings } from 'lucide-react';

// Import all modular components
import { GeminiService } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { ApiConfiguration } from './ApiConfiguration';
import { VoiceInterface } from './VoiceInterface';
import { TranscriptDisplay } from './TranscriptDisplay';
import { AnalysisDisplay } from './AnalysisDisplay';
import { INITIAL_INSTRUCTIONS, GREETING_MESSAGE } from '../constants';
import { GeminiConfig, TranscriptEntry, Analysis } from '@/app/types';

export default function GeminiDebtCollectionAgent() {
  // State management
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInstructions, setCurrentInstructions] = useState(INITIAL_INSTRUCTIONS);
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>({
    apiKey: 'AIzaSyCYs1bMuVgAPE0kNNlmaq8uCb-m-ZfPj2k',
    model: 'gemini-2.0-flash'
  });

  // Services and refs
  const geminiServiceRef = useRef(new GeminiService(geminiConfig));
  const currentTranscriptRef = useRef<TranscriptEntry[]>([]);

  // Custom hooks
  const { speak, cancel: cancelSpeech } = useSpeechSynthesis();
  
  // Handle transcript updates
  const handleTranscript = useCallback(async (customerInput: string) => {
    if (isProcessing) {
      console.log('Already processing, skipping...');
      return;
    }
    
    const newEntry: TranscriptEntry = {
      speaker: 'customer',
      text: customerInput,
      timestamp: Date.now()
    };
    
    setTranscript(prev => {
      const updated = [...prev, newEntry];
      currentTranscriptRef.current = updated;
      return updated;
    });
    
    // Process customer input with Gemini
    if (geminiConfig.apiKey && isConnected) {
      await handleGeminiResponse(customerInput);
    }
  }, [isProcessing, geminiConfig.apiKey, isConnected, currentInstructions]);

  const { startRecognition, stopRecognition } = useSpeechRecognition({
    onTranscript: handleTranscript,
    isConnected
  });

  // Handle Gemini response
  const handleGeminiResponse = useCallback(async (customerInput: string) => {
    setIsProcessing(true);
    
    try {
      const agentResponse = await geminiServiceRef.current.getAgentResponse(
        currentInstructions,
        currentTranscriptRef.current,
        customerInput
      );
      
      if (agentResponse.trim()) {
        const agentEntry: TranscriptEntry = {
          speaker: 'agent',
          text: agentResponse.trim(),
          timestamp: Date.now()
        };
        
        setTranscript(prev => {
          const updated = [...prev, agentEntry];
          currentTranscriptRef.current = updated;
          return updated;
        });
        
        // Text-to-speech
        speak(agentResponse.trim(), isMuted);
      }
    } catch (error) {
      console.error('Failed to get Gemini response:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [currentInstructions, isMuted, speak]);

  // Connection handlers
  const handleConnect = useCallback(async () => {
    if (!geminiConfig.apiKey) {
      alert('Please configure your Gemini API key first');
      setShowConfig(true);
      return;
    }

    setIsConnected(true);
    setIsRecording(true);
    setTranscript([]);
    setAnalysis(null);
    setIsProcessing(false);

    // Update service config
    geminiServiceRef.current.updateConfig(geminiConfig);

    // Start speech recognition
    startRecognition();

    // Start with agent greeting
    const greetingEntry: TranscriptEntry = {
      speaker: 'agent',
      text: GREETING_MESSAGE,
      timestamp: Date.now()
    };
    
    setTranscript([greetingEntry]);
    currentTranscriptRef.current = [greetingEntry];
    
    // Speak greeting
    setTimeout(() => {
      speak(GREETING_MESSAGE, isMuted);
    }, 1000);
  }, [geminiConfig, startRecognition, speak, isMuted]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setIsRecording(false);
    setIsProcessing(false);
    
    stopRecognition();
    cancelSpeech();
  }, [stopRecognition, cancelSpeech]);

  // Analysis handlers
  const handleAnalyze = useCallback(async () => {
    if (transcript.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await geminiServiceRef.current.analyzeConversation(transcript);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [transcript]);

  const handleApplyImprovedInstructions = useCallback(() => {
    if (analysis?.improvedInstructions) {
      setCurrentInstructions(analysis.improvedInstructions);
    }
  }, [analysis]);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleConfigChange = useCallback((config: GeminiConfig) => {
    setGeminiConfig(config);
    geminiServiceRef.current.updateConfig(config);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gemini Voice AI Debt Collection Agent
          </h1>
          <p className="text-gray-600">
            Real-time voice interaction with AI-powered conversation analysis
          </p>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configure API
          </button>
        </div>

        {/* API Configuration */}
        <ApiConfiguration
          config={geminiConfig}
          onConfigChange={handleConfigChange}
          isVisible={showConfig}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Voice Agent Interface */}
          <VoiceInterface
            isConnected={isConnected}
            isRecording={isRecording}
            isMuted={isMuted}
            isProcessing={isProcessing}
            currentInstructions={currentInstructions}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onToggleMute={handleToggleMute}
          />

          {/* Transcript and Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Transcript & Analysis</h2>
            
            <TranscriptDisplay transcript={transcript} />

            <AnalysisDisplay
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              canAnalyze={transcript.length > 0 && !!geminiConfig.apiKey}
              onAnalyze={handleAnalyze}
              onApplyImprovedInstructions={handleApplyImprovedInstructions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}