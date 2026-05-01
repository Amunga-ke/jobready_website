import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  mapJobToView,
  mapToClosingSoon,
  mapToRecent,
  mapToFeatured,
  mapToGovernment,
  mapToCasual,
  mapToOpportunities,
} from '@/lib/data-mapper';
import type { Prisma } from '@prisma/client';

/** The include shape shared across every listing query. */
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type'); // featured | government | casual | closing | scholarship | internship | browse
    const categorySlug = searchParams.get('category');
    const locationSlug = searchParams.get('location');
    const workMode = searchParams.get('workMode');
    const levelCode = searchParams.get('level');
    const employmentType = searchParams.get('employmentType');
    const listingTypeCode = searchParams.get('listingType');
    const q = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');
    const statusParam = searchParams.get('status');
    const limit = Math.min(limitParam ? parseInt(limitParam, 10) : 20, 100);
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: Prisma.ListingWhereInput = {};

    // Status filter (default: PUBLISHED)
    if (statusParam && statusParam !== 'ALL') {
      where.status = statusParam as any;
    } else if (!statusParam) {
      where.status = 'PUBLISHED';
    }

    // Text search
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Type-based filters (legacy homepage sections)
    if (type === 'featured') {
      where.isFeatured = true;
    } else if (type === 'government') {
      where.organization = {
        organizationType: {
          code: { in: ['NATIONAL_GOV', 'COUNTY_GOV'] },
        },
      };
    } else if (type === 'casual') {
      where.listingType = { code: 'CASUAL' };
    } else if (type === 'closing') {
      where.deadlineDate = { not: null, gte: new Date() };
    } else if (type === 'scholarship') {
      where.listingType = { code: 'SCHOLARSHIP' };
    } else if (type === 'internship') {
      where.listingType = { code: 'INTERNSHIP' };
    }

    // Structured filters (for browse/listing pages)
    if (listingTypeCode) {
      where.listingType = { code: listingTypeCode };
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (locationSlug) {
      where.location = { slug: locationSlug };
    }
    if (workMode) {
      where.jobDetail = { ...(where.jobDetail as any), workMode: workMode as any };
    }
    if (levelCode) {
      where.jobDetail = {
        ...(where.jobDetail as any),
        experienceLevel: { code: levelCode as any },
      };
    }
    if (employmentType) {
      where.jobDetail = {
        ...(where.jobDetail as any),
        employmentType: { code: employmentType as any },
      };
    }

    // Count total matching records (for pagination)
    const total = await db.listing.count({ where });

    // Fetch with pagination
    const listings = await db.listing.findMany({
      where,
      include: LISTING_INCLUDE,
      orderBy: { postedAt: 'desc' },
      take: limit,
      skip: type === 'browse' ? skip : 0,
    });

    // Map based on the `type` query param — default returns full Job objects
    if (type === 'closing') {
      return NextResponse.json({ jobs: mapToClosingSoon(listings as any) });
    }
    if (type === 'featured') {
      return NextResponse.json({ jobs: mapToFeatured(listings as any) });
    }
    if (type === 'government') {
      return NextResponse.json({ jobs: mapToGovernment(listings as any) });
    }
    if (type === 'casual') {
      return NextResponse.json({ jobs: mapToCasual(listings as any) });
    }
    if (type === 'recent') {
      return NextResponse.json({ jobs: mapToRecent(listings as any) });
    }
    if (type === 'scholarship' || type === 'internship') {
      return NextResponse.json({ jobs: mapToOpportunities(listings as any) });
    }

    // Default / browse: return full Job objects with pagination metadata
    const hasMore = skip + listings.length < total;
    return NextResponse.json({
      jobs: listings.map((l) => mapJobToView(l as any)),
      total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('[GET /api/jobs] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 },
    );
  }
}
