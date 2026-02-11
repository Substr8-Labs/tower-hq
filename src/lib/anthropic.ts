import Anthropic from '@anthropic-ai/sdk';
import { PersonaAgent } from './agents';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

/**
 * Send a message to Claude with persona context
 * Uses the user's Claude subscription token
 */
export async function getAIResponse(
  claudeToken: string,
  persona: PersonaAgent,
  messages: ChatMessage[],
  companyContext?: string
): Promise<AIResponse> {
  try {
    // Create Anthropic client with user's token
    const anthropic = new Anthropic({
      apiKey: claudeToken,
    });

    // Build the system prompt with company context
    let systemPrompt = persona.systemPrompt;
    if (companyContext) {
      systemPrompt += `\n\n## Company Context\n${companyContext}`;
    }

    // Prepare messages for Anthropic
    const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: apiMessages,
    });

    // Extract text content
    const textBlock = response.content.find((block) => block.type === 'text');
    const content = textBlock?.type === 'text' ? textBlock.text : null;
    
    if (!content) {
      return {
        content: getFallbackResponse(persona),
        error: 'Empty response from Claude',
      };
    }

    return { content };
  } catch (error) {
    console.error('Claude API error:', error);
    
    // Check for specific error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('401') || errorMessage.includes('authentication')) {
      return {
        content: `${persona.emoji} Your Claude token appears to be invalid or expired. Please update it in Settings.`,
        error: 'Invalid token',
      };
    }
    
    return {
      content: getFallbackResponse(persona),
      error: errorMessage,
    };
  }
}

function getFallbackResponse(persona: PersonaAgent): string {
  return `${persona.emoji} I'm having trouble connecting right now. Let me get back to you on this.`;
}
