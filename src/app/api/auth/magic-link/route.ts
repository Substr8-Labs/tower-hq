import { NextRequest, NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/session';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const EMAIL_API_KEY = process.env.EMAIL_SERVICE_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@towerhq.app';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }
    
    // Create magic link token
    const token = createMagicLink(email.toLowerCase());
    const magicUrl = `${APP_URL}/api/auth/verify?token=${token}`;
    
    // Send email (or log in development)
    if (EMAIL_API_KEY) {
      await sendMagicLinkEmail(email, magicUrl);
    } else {
      // Development: log the link
      console.log('\n=== MAGIC LINK (dev mode) ===');
      console.log(`Email: ${email}`);
      console.log(`Link: ${magicUrl}`);
      console.log('=============================\n');
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Magic link sent! Check your email.',
      // Include link in dev mode for testing
      ...(process.env.NODE_ENV !== 'production' && { devLink: magicUrl }),
    });
  } catch (error) {
    console.error('Magic link error:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendMagicLinkEmail(email: string, magicUrl: string): Promise<void> {
  // Using Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${EMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: email,
      subject: 'Sign in to TowerHQ',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #5865F2; font-size: 24px; margin-bottom: 24px;">
            🏰 Sign in to TowerHQ
          </h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Click the button below to sign in. This link expires in 15 minutes.
          </p>
          <a href="${magicUrl}" style="
            display: inline-block;
            background: #5865F2;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 24px 0;
          ">
            Sign In
          </a>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this email, you can safely ignore it.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #999; font-size: 12px;">
            TowerHQ — Your AI Executive Team
          </p>
        </div>
      `,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email send failed: ${error}`);
  }
}
