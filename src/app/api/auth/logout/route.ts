import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST() {
  await destroySession();
  
  return NextResponse.json({ success: true });
}

export async function GET() {
  await destroySession();
  
  return NextResponse.redirect(`${APP_URL}/login`);
}
