# TowerHQ Multi-Agent System

## Overview

TowerHQ uses a multi-agent architecture where each persona operates as an independent agent with its own context window.

## Personas

| ID | Name | Role | Emoji | Primary Channels |
|----|------|------|-------|------------------|
| ada | Ada | CTO | 🧠 | engineering, general, decisions |
| grace | Grace | CPO | 🎯 | product, general, decisions |
| tony | Tony | CMO | 📣 | marketing, general, decisions |
| val | Val | CFO | 📊 | finance, general, decisions |
| bucky | Bucky | Research | 🔮 | research |
| ori | Ori | Guide | 🧭 | onboarding |

## Message Routing

### Channel-Based Routing (Synchronous)
When a user posts in a channel, the default persona for that channel responds:

```
User posts in #engineering → Ada responds
User posts in #marketing → Tony responds
User posts in #research → Bucky responds
```

### @Mention Routing (Asynchronous)
When a user @mentions a different persona, that persona is spawned asynchronously:

```
User posts in #engineering: "@bucky research competitor X"
  ↓
Message routed to Ada's channel, but...
  ↓
Bucky is spawned as a separate agent
  ↓
Bucky runs in background (sessions_spawn)
  ↓
Results posted back when complete
```

## API Endpoints

### POST /api/channels/[slug]/messages
Send a message to a channel.

**Request:**
```json
{
  "content": "What's our architecture for user auth?",
  "userId": "user-123"
}
```

**Response (Synchronous):**
```json
{
  "userMessage": {...},
  "assistantMessage": {...},
  "async": false,
  "persona": {"id": "ada", "name": "Ada", "emoji": "🧠"}
}
```

**Response (Async - when @mentioning another persona):**
```json
{
  "userMessage": {...},
  "assistantMessage": {"content": "🔮 *Bucky is working on this...*"},
  "async": true,
  "taskId": "task-123456",
  "persona": {"id": "bucky", "name": "Bucky", "emoji": "🔮"}
}
```

### GET /api/tasks/[taskId]
Check status of an async task.

**Response:**
```json
{
  "id": "task-123456",
  "status": "running" | "completed" | "failed",
  "persona": {"id": "bucky", "name": "Bucky"},
  "result": "Here's what I found...",
  "sessionKey": "towerhq-bucky-123456"
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TowerHQ Frontend                      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  TowerHQ API Layer                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Message Router                       │   │
│  │  - Detects @mentions                             │   │
│  │  - Routes to channel default or spawns agent     │   │
│  └─────────────────────┬───────────────────────────┘   │
│                        │                                 │
│         ┌──────────────┼──────────────┐                 │
│         ▼              ▼              ▼                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐          │
│  │ Sync Call │  │ Async     │  │ Task      │          │
│  │ (OpenClaw)│  │ Spawn     │  │ Queue     │          │
│  └───────────┘  └───────────┘  └───────────┘          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  OpenClaw Gateway                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │              sessions_spawn                       │   │
│  │  - Isolated context per agent                    │   │
│  │  - Announces result back to channel              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Agent Configuration

Each persona has:
- **System Prompt**: Defines personality and approach
- **Thinking Level**: low/medium/high (for complex tasks)
- **Channels**: Which channels they're the default responder for

## Future Enhancements

1. **Agent-to-Agent Communication**: Ada asks Bucky for research mid-conversation
2. **Persistent Memory**: Each agent remembers past conversations
3. **Webhooks**: Notify external systems when agents complete tasks
4. **Priority Queue**: High-priority tasks processed first
