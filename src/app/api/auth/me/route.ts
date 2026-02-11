import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getDemoUser } from '@/lib/users';

const USE_DATABASE = !!process.env.DATABASE_URL;

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  
  try {
    let user;
    
    if (USE_DATABASE) {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          createdAt: true,
          tower: {
            select: {
              id: true,
              companyName: true,
            },
          },
        },
      });
    } else {
      // Demo mode
      const demoUser = getDemoUser(session.userId);
      if (demoUser) {
        user = {
          id: demoUser.id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          avatarUrl: null,
          createdAt: new Date(),
          tower: null,
        };
      }
    }
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
