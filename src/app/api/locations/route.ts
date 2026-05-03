import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all active counties with their listing counts
    const counties = await prisma.county.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { listings: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    return NextResponse.json({
      locations: counties.map((county) => ({
        id: county.id,
        name: county.name,
        slug: county.slug,
        type: 'COUNTY',
        _count: county._count,
      })),
    });
  } catch (error) {
    console.error('[GET /api/locations] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 },
    );
  }
}
