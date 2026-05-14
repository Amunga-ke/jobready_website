import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 },
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });
        return NextResponse.json({ message: 'Re-subscribed successfully' });
      }
      return NextResponse.json({ message: 'Already subscribed' });
    }

    await prisma.newsletterSubscription.create({
      data: {
        email,
        source: source || null,
        isActive: true,
      },
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ message: 'Already subscribed' });
    }
    console.error('[POST /api/newsletter] Error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 },
    );
  }
}
