import { GeminiConfig, Analysis, TranscriptEntry } from '@/app/types';

export class GeminiService {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  updateConfig(config: GeminiConfig) {
    this.config = config;
  }

  async callAPI(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  async getAgentResponse(
    currentInstructions: string,
    transcript: TranscriptEntry[],
    customerInput: string
  ): Promise<string> {
    const conversationContext = transcript.map(entry => 
      `${entry.speaker}: ${entry.text}`
    ).join('\n');

    const prompt = `${currentInstructions}

Current conversation:
${conversationContext}
Customer just said: "${customerInput}"

Respond as the debt collection agent. Keep your response brief (1-2 sentences), professional, and focused on debt collection. Do not repeat what the customer said. Be conversational and natural.`;

    return this.callAPI(prompt);
  }

  async analyzeConversation(transcript: TranscriptEntry[]): Promise<Analysis> {
    const conversationText = transcript.map(entry => 
      `${entry.speaker}: ${entry.text}`
    ).join('\n');

    const analysisPrompt = `Analyze this debt collection conversation and provide a detailed assessment:

CONVERSATION:
${conversationText}

ANALYSIS CRITERIA:
1. Negotiation Score (1-10): How well does the agent negotiate? Does the agent offer payment plans, show flexibility, or work with the customer to find solutions?
2. Relevance Score (1-10): Does the agent stay on topic and provide relevant responses to customer queries?

Provide your analysis in this exact JSON format:
{
  "negotiationScore": [number 1-10],
  "relevanceScore": [number 1-10],
  "flaws": [array of specific issues identified],
  "reasoning": "Detailed explanation of the scores and issues",
  "improvedInstructions": "Enhanced instructions that address the identified flaws"
}

Focus on identifying:
- Lack of payment plan options
- Missing empathy or understanding
- Irrelevant responses to customer concerns
- Inflexibility in negotiation
- Poor customer service approach`;

    try {
      const response = await this.callAPI(analysisPrompt);
      
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing if JSON is not properly formatted
        return {
          negotiationScore: 5,
          relevanceScore: 7,
          flaws: ["Unable to parse detailed analysis"],
          reasoning: response,
          improvedInstructions: "Please review the conversation and provide more specific debt collection instructions."
        };
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }
}