/**
 * Session management using secure HTTP-only cookies.
 * 
 * For MVP: Simple token-based sessions stored in cookies.
 * Production: Consider using iron-session or similar.
 */

import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';

const SESSION_COOKIE = 'tower_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// In-memory session store (replace with DB in production)
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  
  // Store hashed token
  sessions.set(hashedToken, { userId, expiresAt });
  
  // Set cookie with unhashed token
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  
  return token;
}

export async function getSession(): Promise<{ userId: string } | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  
  const hashedToken = hashToken(token);
  const session = sessions.get(hashedToken);
  
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    sessions.delete(hashedToken);
    return null;
  }
  
  return { userId: session.userId };
}

export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const hashedToken = hashToken(token);
    sessions.delete(hashedToken);
  }
  
  cookies().delete(SESSION_COOKIE);
}

// Magic link tokens (short-lived, single use)
const magicLinks = new Map<string, { email: string; expiresAt: Date }>();

export function createMagicLink(email: string): string {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  
  magicLinks.set(token, { email, expiresAt });
  
  return token;
}

export function verifyMagicLink(token: string): string | null {
  const link = magicLinks.get(token);
  if (!link) return null;
  
  // Single use - delete immediately
  magicLinks.delete(token);
  
  if (link.expiresAt < new Date()) return null;
  
  return link.email;
}
