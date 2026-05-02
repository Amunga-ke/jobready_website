import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapToLocations } from '@/lib/data-mapper';

export async function GET() {
  try {
    // Fetch county-level locations (top-level in the Kenya context) with
    // their child areas and listing counts.
    const locations = await db.location.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Enrich child locations with their own listing counts
    // (children in the include above don't carry _count)
    const childIds = locations.flatMap((loc) =>
      (loc.children || []).map((child) => child.id),
    );

    // Batch-fetch listing counts for all child locations in one query
    const childListingCounts = childIds.length > 0
      ? await db.listing.groupBy({
          by: ['locationId'],
          where: {
            locationId: { in: childIds },
            status: 'PUBLISHED',
          },
          _count: { id: true },
        })
      : [];

    // Build a lookup map: locationId → count
    const countMap = new Map(
      childListingCounts.map((row) => [row.locationId, row._count.id]),
    );

    // Enrich locations with child listing counts
    const enrichedLocations = locations.map((loc) => ({
      ...loc,
      children: (loc.children || []).map((child) => ({
        ...child,
        _count: { listings: countMap.get(child.id) || 0 },
      })),
    }));

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
