import React from 'react';
import { motion } from 'framer-motion';
import { Analysis } from '@/app/types';

interface AnalysisDisplayProps {
  analysis: Analysis | null;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onAnalyze: () => void;
  onApplyImprovedInstructions: () => void;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  analysis,
  isAnalyzing,
  canAnalyze,
  onAnalyze,
  onApplyImprovedInstructions
}) => {
  return (
    <div>
      {/* Analysis Button */}
      <div className="mb-6">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
        >
          {isAnalyzing ? "Analyzing with Gemini..." : "Analyze Conversation"}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800">Negotiation Score</h4>
              <p className="text-2xl font-bold text-blue-600">{analysis.negotiationScore}/10</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-800">Relevance Score</h4>
              <p className="text-2xl font-bold text-green-600">{analysis.relevanceScore}/10</p>
            </div>
          </div>

          {analysis.reasoning && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Analysis Reasoning:</h4>
              <p className="text-yellow-700 text-sm">{analysis.reasoning}</p>
            </div>
          )}

          {analysis.flaws.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Identified Issues:</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.flaws.map((flaw, index) => (
                  <li key={index} className="text-red-700 text-sm">{flaw}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Improved Instructions:</h4>
            <p className="text-sm text-green-700 whitespace-pre-line mb-3">
              {analysis.improvedInstructions}
            </p>
            <button
              onClick={onApplyImprovedInstructions}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Apply Improved Instructions
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
