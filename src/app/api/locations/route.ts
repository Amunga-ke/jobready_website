import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all active counties
    const counties = await prisma.county
      .findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      })
      .catch(() => []);

    // Count active listings grouped by county name
    const counts = await prisma.listing
      .groupBy({
        by: ['county'],
        where: { status: 'ACTIVE', county: { not: '' } },
        _count: true,
      })
      .catch(() => []);

    const countMap = new Map(counts.map((c) => [c.county, c._count]));

    return NextResponse.json({
      locations: counties.map((county) => ({
        id: county.id,
        name: county.name,
        slug: county.slug,
        type: 'COUNTY',
        _count: { listings: countMap.get(county.name) || 0 },
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
