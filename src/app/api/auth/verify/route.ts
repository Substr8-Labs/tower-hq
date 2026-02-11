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
    let isNewUser = false;
    
    if (USE_DATABASE) {
      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        user = await prisma.user.create({
          data: { email },
        });
        isNewUser = true;
      }
      
      userId = user.id;
      
      // Auto-create tower if user doesn't have one
      const existingTower = await prisma.tower.findUnique({ where: { userId } });
      
      if (!existingTower) {
        // Create tower with welcome channel and default channels
        const tower = await prisma.tower.create({
          data: {
            userId,
            companyName: 'My Company', // Default, can be updated later
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
        
        // Seed welcome message from Ada
        const welcomeChannel = tower.channels.find(c => c.slug === 'welcome');
        if (welcomeChannel) {
          await prisma.message.create({
            data: {
              channelId: welcomeChannel.id,
              role: 'assistant',
              persona: 'ada',
              content: `Hey — you made it. Welcome to your tower.\n\nI'm Ada, and I handle the technical side of things around here. Grace runs product, Tony's got marketing, and Val keeps the numbers straight.\n\nWe're here when you need to think through something. No small talk required — just tell us what you're working on.`,
            },
          });
        }
      }
    } else {
      // Demo mode: in-memory users
      const user = findOrCreateDemoUser(email);
      userId = user.id;
    }
    
    // Create session
    await createSession(userId);
    
    // Always go straight to the app — welcome channel for new users, general for returning
    return NextResponse.redirect(`${APP_URL}/app/welcome`);
  } catch (error) {
    console.error('Auth verify error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=auth_failed`);
  }
}
