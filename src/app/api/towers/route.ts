import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { companyName, companyContext } = await request.json();
    
    if (!companyName?.trim()) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }
    
    // Create tower with default channels
    const tower = await db.towers.create({
      userId: session.userId,
      companyName: companyName.trim(),
      companyContext: companyContext?.trim(),
    });
    
    return NextResponse.json({ tower });
  } catch (error) {
    console.error('Create tower error:', error);
    return NextResponse.json(
      { error: 'Failed to create tower' },
      { status: 500 }
    );
  }
}
