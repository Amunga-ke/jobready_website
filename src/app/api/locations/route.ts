import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapToLocations } from '@/lib/data-mapper';

export async function GET() {
  try {
    // Fetch parent-level locations (COUNTY/COUNTRY/AREA type) with their
    // child locations and job counts.
    const locations = await db.location.findMany({
      where: {
        parentLocationId: null,
      },
      include: {
        childLocations: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Also fetch child locations with job counts (they aren't in the include above)
    // We need to enrich childLocations with their own job counts
    const enrichedLocations = await Promise.all(
      locations.map(async (loc) => {
        const childWithCounts = await Promise.all(
          (loc.childLocations || []).map(async (child) => {
            const jobCount = await db.job.count({
              where: { locationId: child.id },
            });
            return {
              ...child,
              _count: { jobs: jobCount },
            };
          }),
        );
        return {
          ...loc,
          childLocations: childWithCounts,
        };
      }),
    );

    return NextResponse.json({
      locations: mapToLocations(enrichedLocations as any),
    });
  } catch (error) {
    console.error('[GET /api/locations] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 },
    );
  }
}
