/**
 * User store for demo mode (when DATABASE_URL is not set).
 * In production, this is not used - Prisma handles users.
 */

export interface DemoUser {
  id: string;
  email: string;
  displayName?: string;
}

// In-memory user store for demo mode
export const demoUsers = new Map<string, DemoUser>();

export function findOrCreateDemoUser(email: string): DemoUser {
  // Check if user exists by email
  let user = Array.from(demoUsers.values()).find(u => u.email === email);
  
  if (!user) {
    user = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
    };
    demoUsers.set(user.id, user);
  }
  
  return user;
}

export function getDemoUser(userId: string): DemoUser | undefined {
  return demoUsers.get(userId);
}
