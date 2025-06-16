import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceInterfaceProps {
  isConnected: boolean;
  isRecording: boolean;
  isMuted: boolean;
  isProcessing: boolean;
  currentInstructions: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMute: () => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isConnected,
  isRecording,
  isMuted,
  isProcessing,
  currentInstructions,
  onConnect,
  onDisconnect,
  onToggleMute
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Voice Agent</h2>
      
      {/* Current Instructions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Current Instructions:</h3>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {currentInstructions}
        </p>
      </div>

      {/* Voice Interface */}
      <div className="flex flex-col items-center space-y-6">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Phone className="w-12 h-12 text-white" />
              </div>
              <button
                onClick={onConnect}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Start Call
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                {isRecording ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Mic className="w-12 h-12 text-white" />
                  </motion.div>
                ) : (
                  <MicOff className="w-12 h-12 text-white" />
                )}
              </div>
              
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={onToggleMute}
                  className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-500'} text-white hover:opacity-80 transition-opacity`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={onDisconnect}
                  className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                {isProcessing ? "AI is responding..." : (isRecording ? "Listening... Speak now" : "Call connected")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};