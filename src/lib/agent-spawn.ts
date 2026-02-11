/**
 * Agent Spawning System
 * 
 * Handles async agent execution via OpenClaw sessions_spawn pattern.
 * For TowerHQ, this allows personas to work independently.
 */

import { PersonaAgent, PERSONA_AGENTS } from './agents';

const OPENCLAW_GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
const OPENCLAW_API_TOKEN = process.env.OPENCLAW_API_TOKEN;

export interface SpawnRequest {
  persona: PersonaAgent;
  task: string;
  context?: string;
  channelSlug: string;
  userId: string;
}

export interface SpawnResult {
  sessionKey: string;
  status: 'spawned' | 'error';
  message?: string;
}

/**
 * Spawn an agent to handle a task asynchronously.
 * The agent runs in its own session and posts back when done.
 */
export async function spawnAgent(request: SpawnRequest): Promise<SpawnResult> {
  const { persona, task, context, channelSlug, userId } = request;
  
  // Build the full prompt with persona context
  const fullTask = buildAgentTask(persona, task, context);
  
  try {
    // Call OpenClaw sessions_spawn endpoint
    const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/sessions/spawn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(OPENCLAW_API_TOKEN && { 'Authorization': `Bearer ${OPENCLAW_API_TOKEN}` }),
      },
      body: JSON.stringify({
        task: fullTask,
        label: `towerhq-${persona.id}-${Date.now()}`,
        // Agent config would go here if we had separate agent IDs
        // For now, we inject persona via system prompt in the task
        model: getModelForPersona(persona),
        thinking: persona.thinkingLevel || 'low',
        runTimeoutSeconds: 300, // 5 min max
        cleanup: 'keep', // Keep session for debugging
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Spawn failed:', error);
      return {
        sessionKey: '',
        status: 'error',
        message: `Failed to spawn agent: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      sessionKey: data.sessionKey || data.label,
      status: 'spawned',
    };
  } catch (error) {
    console.error('Spawn error:', error);
    return {
      sessionKey: '',
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Build a complete task prompt for an agent
 */
function buildAgentTask(
  persona: PersonaAgent,
  task: string,
  context?: string
): string {
  let prompt = `You are ${persona.name}, the ${persona.role}. ${persona.emoji}

${persona.systemPrompt}

---

## Your Task

${task}`;

  if (context) {
    prompt += `

## Context

${context}`;
  }

  prompt += `

---

Provide a thorough response. When you're done, your response will be posted to the #${persona.channels[0]} channel.`;

  return prompt;
}

/**
 * Get the appropriate model for a persona based on their role
 */
function getModelForPersona(persona: PersonaAgent): string {
  // Bucky gets a thinking model for deep research
  if (persona.id === 'bucky') {
    return 'claude-sonnet-4-20250514'; // Fast but capable
  }
  
  // Most personas use the default model
  return 'claude-sonnet-4-20250514';
}

/**
 * Check the status of a spawned agent session
 */
export async function checkAgentStatus(sessionKey: string): Promise<{
  status: 'running' | 'completed' | 'error' | 'unknown';
  result?: string;
}> {
  try {
    const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/sessions/${sessionKey}`, {
      headers: {
        ...(OPENCLAW_API_TOKEN && { 'Authorization': `Bearer ${OPENCLAW_API_TOKEN}` }),
      },
    });

    if (!response.ok) {
      return { status: 'unknown' };
    }

    const data = await response.json();
    
    // Parse session status
    if (data.running) {
      return { status: 'running' };
    }
    
    if (data.error) {
      return { status: 'error', result: data.error };
    }
    
    return { 
      status: 'completed',
      result: data.lastMessage || data.result,
    };
  } catch (error) {
    console.error('Status check error:', error);
    return { status: 'unknown' };
  }
}

/**
 * Simple in-memory queue for pending agent tasks
 * In production, use Redis or a proper message queue
 */
interface QueuedTask {
  id: string;
  request: SpawnRequest;
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  sessionKey?: string;
}

const taskQueue: Map<string, QueuedTask> = new Map();

export function queueTask(request: SpawnRequest): string {
  const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  taskQueue.set(taskId, {
    id: taskId,
    request,
    createdAt: new Date(),
    status: 'pending',
  });
  
  // Start processing immediately
  processTask(taskId);
  
  return taskId;
}

async function processTask(taskId: string): Promise<void> {
  const task = taskQueue.get(taskId);
  if (!task) return;
  
  task.status = 'running';
  
  const result = await spawnAgent(task.request);
  
  if (result.status === 'spawned') {
    task.sessionKey = result.sessionKey;
    task.status = 'running'; // Will be updated when session completes
  } else {
    task.status = 'failed';
    task.result = result.message;
  }
}

export function getTaskStatus(taskId: string): QueuedTask | undefined {
  return taskQueue.get(taskId);
}
