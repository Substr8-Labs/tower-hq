// Prisma client singleton placeholder
// For demo: using in-memory storage until database is configured

export interface StoredMessage {
  id: string;
  channelSlug: string;
  role: "user" | "assistant";
  content: string;
  persona?: string;
  createdAt: Date;
}

// In-memory store for demo
const messages: StoredMessage[] = [];

export const db = {
  messages: {
    findMany: async (channelSlug: string) => {
      return messages
        .filter((m) => m.channelSlug === channelSlug)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },
    create: async (data: Omit<StoredMessage, "id" | "createdAt">) => {
      const message: StoredMessage = {
        ...data,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };
      messages.push(message);
      return message;
    },
  },
};
