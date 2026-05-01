import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapJobToView } from '@/lib/data-mapper';
import type { Prisma } from '@prisma/client';

const LISTING_INCLUDE = {
  organization: {
    include: {
      organizationType: true,
      industry: true,
      location: true,
    },
  },
  listingType: true,
  category: true,
  location: true,
  jobDetail: {
    include: {
      employmentType: true,
      experienceLevel: true,
      educationLevel: true,
      currency: true,
    },
  },
} satisfies Prisma.ListingInclude;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // The `id` param is treated as a slug
    const listing = await db.listing.findUnique({
      where: { slug: id },
      include: LISTING_INCLUDE,
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ job: mapJobToView(listing as any) });
  } catch (error) {
    console.error('[GET /api/jobs/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 },
    );
  }
}
