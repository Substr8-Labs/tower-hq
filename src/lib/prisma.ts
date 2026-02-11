import { PrismaClient } from "@prisma/client";

// PrismaClient singleton for serverless environments
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ============================================================================
// Database abstraction layer
// Uses Prisma in production, in-memory store for demo/development without DB
// ============================================================================

export interface StoredMessage {
  id: string;
  channelSlug: string;
  role: "user" | "assistant";
  content: string;
  persona?: string;
  createdAt: Date;
}

// In-memory fallback for demo mode (no DATABASE_URL configured)
const inMemoryMessages: StoredMessage[] = [];
const USE_DATABASE = !!process.env.DATABASE_URL;

export const db = {
  messages: {
    findMany: async (channelSlug: string): Promise<StoredMessage[]> => {
      if (USE_DATABASE) {
        // TODO: Wire up proper Prisma queries with channel lookup
        // For now, falling back to in-memory
        // const channel = await prisma.channel.findFirst({ where: { slug: channelSlug } });
        // if (!channel) return [];
        // const messages = await prisma.message.findMany({
        //   where: { channelId: channel.id },
        //   orderBy: { createdAt: 'asc' },
        // });
        // return messages.map(m => ({ ...m, channelSlug }));
      }
      
      // In-memory fallback
      return inMemoryMessages
        .filter((m) => m.channelSlug === channelSlug)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },
    
    create: async (data: Omit<StoredMessage, "id" | "createdAt">): Promise<StoredMessage> => {
      if (USE_DATABASE) {
        // TODO: Wire up proper Prisma queries
        // const channel = await prisma.channel.findFirst({ where: { slug: data.channelSlug } });
        // if (!channel) throw new Error(`Channel not found: ${data.channelSlug}`);
        // const message = await prisma.message.create({
        //   data: {
        //     channelId: channel.id,
        //     role: data.role,
        //     content: data.content,
        //     persona: data.persona,
        //   },
        // });
        // return { ...message, channelSlug: data.channelSlug };
      }
      
      // In-memory fallback
      const message: StoredMessage = {
        ...data,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };
      inMemoryMessages.push(message);
      return message;
    },
  },
  
  // Add more models as needed
  towers: {
    findByUserId: async (userId: string) => {
      if (USE_DATABASE) {
        return prisma.tower.findUnique({
          where: { userId },
          include: { channels: true },
        });
      }
      return null;
    },
    
    create: async (data: { userId: string; companyName: string; companyContext?: string }) => {
      if (USE_DATABASE) {
        return prisma.tower.create({
          data: {
            userId: data.userId,
            companyName: data.companyName,
            companyContext: data.companyContext,
            channels: {
              create: [
                { name: 'Welcome', slug: 'welcome', sortOrder: 0 },
                { name: 'General', slug: 'general', sortOrder: 1 },
                { name: 'Engineering', slug: 'engineering', sortOrder: 2 },
                { name: 'Product', slug: 'product', sortOrder: 3 },
                { name: 'Marketing', slug: 'marketing', sortOrder: 4 },
                { name: 'Finance', slug: 'finance', sortOrder: 5 },
                { name: 'Decisions', slug: 'decisions', sortOrder: 6, isDecisionsChannel: true },
              ],
            },
          },
          include: { channels: true },
        });
      }
      return null;
    },
  },
};
