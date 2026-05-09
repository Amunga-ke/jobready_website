import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
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
    const existing = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      // If unsubscribed before, reactivate
      if (!existing.isActive) {
        await db.newsletterSubscription.update({
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

    await db.newsletterSubscription.create({
      data: {
        email,
        isActive: true,
        // source is optional — we don't have a source column in DB, so skip it
      },
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error: any) {
    // Prisma unique constraint violation
    if (error?.code === 'P2002') {
      return NextResponse.json({ message: 'Already subscribed' });
    }
    console.error('[POST /api/newsletter] Error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 },
    );
  }
}
