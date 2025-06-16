import React from 'react';
import { TranscriptEntry } from '@/app/types';

interface TranscriptDisplayProps {
  transcript: TranscriptEntry[];
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  const formatTranscript = () => {
    return transcript.map((entry, index) => (
      <div key={index} className={`mb-2 p-2 rounded ${
        entry.speaker === 'agent' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-green-50 border-l-4 border-green-400'
      }`}>
        <div className="flex justify-between items-start">
          <span className="font-semibold text-sm capitalize">
            {entry.speaker}:
          </span>
          <span className="text-xs text-gray-500">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm mt-1">{entry.text}</p>
      </div>
    ));
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-2">Live Transcript:</h3>
      <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto">
        {transcript.length > 0 ? (
          <div className="space-y-2">
            {formatTranscript()}
          </div>
        ) : (
          <p className="text-gray-500 italic">No conversation yet. Start the call to begin...</p>
        )}
      </div>
    </div>
  );
};