import OpenAI from 'openai';
import { PersonaAgent } from './agents';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

/**
 * Send a message to OpenAI with persona context
 */
export async function getAIResponse(
  persona: PersonaAgent,
  messages: ChatMessage[],
  companyContext?: string
): Promise<AIResponse> {
  try {
    // Build the system prompt with company context
    let systemPrompt = persona.systemPrompt;
    if (companyContext) {
      systemPrompt += `\n\n## Company Context\n${companyContext}`;
    }

    // Prepare messages for OpenAI
    const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: apiMessages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        content: getFallbackResponse(persona),
        error: 'Empty response from AI',
      };
    }

    return { content };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      content: getFallbackResponse(persona),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function getFallbackResponse(persona: PersonaAgent): string {
  return `${persona.emoji} I'm having trouble connecting right now. Let me get back to you on this.`;
}
