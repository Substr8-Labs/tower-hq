import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink, createSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { findOrCreateDemoUser } from '@/lib/users';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const USE_DATABASE = !!process.env.DATABASE_URL;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  
  if (!token) {
    return NextResponse.redirect(`${APP_URL}/login?error=missing_token`);
  }
  
  // Verify the magic link
  const email = verifyMagicLink(token);
  
  if (!email) {
    return NextResponse.redirect(`${APP_URL}/login?error=invalid_or_expired`);
  }
  
  try {
    // Find or create user
    let userId: string;
    
    if (USE_DATABASE) {
      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        user = await prisma.user.create({
          data: { email },
        });
      }
      
      userId = user.id;
    } else {
      // Demo mode: in-memory users
      const user = findOrCreateDemoUser(email);
      userId = user.id;
    }
    
    // Create session
    await createSession(userId);
    
    // Check if user has completed onboarding
    const hasOnboarded = await checkOnboardingStatus(userId);
    
    if (hasOnboarded) {
      return NextResponse.redirect(`${APP_URL}/app`);
    } else {
      return NextResponse.redirect(`${APP_URL}/onboarding`);
    }
  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=auth_failed`);
  }
}

async function checkOnboardingStatus(userId: string): Promise<boolean> {
  if (USE_DATABASE) {
    const tower = await prisma.tower.findUnique({ where: { userId } });
    return !!tower;
  }
  
  // Demo mode: always show onboarding for new users
  return false;
}
