/**
 * Session management using secure HTTP-only cookies + database storage.
 * 
 * Sessions and magic links are stored in Neon (Postgres) for serverless compatibility.
 */

import { cookies } from 'next/headers';
import { randomBytes, createHash } from 'crypto';
import { prisma } from './prisma';

const SESSION_COOKIE = 'tower_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

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
  
  // Store hashed token in database
  await prisma.session.create({
    data: {
      userId,
      token: hashedToken,
      expiresAt,
    },
  });
  
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
  
  // Find session in database
  const session = await prisma.session.findUnique({
    where: { token: hashedToken },
  });
  
  if (!session) return null;
  
  // Check expiration
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  
  return { userId: session.userId };
}

export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const hashedToken = hashToken(token);
    await prisma.session.deleteMany({ where: { token: hashedToken } });
  }
  
  cookies().delete(SESSION_COOKIE);
}

// Magic link tokens (short-lived, single use)

export async function createMagicLink(email: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  
  // Store in database
  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt,
      userId: user?.id,
    },
  });
  
  return token;
}

export async function verifyMagicLink(token: string): Promise<string | null> {
  // Find the magic link
  const link = await prisma.magicLink.findUnique({
    where: { token },
  });
  
  if (!link) return null;
  
  // Single use - delete immediately
  await prisma.magicLink.delete({ where: { id: link.id } });
  
  // Check if used or expired
  if (link.used) return null;
  if (link.expiresAt < new Date()) return null;
  
  return link.email;
}
