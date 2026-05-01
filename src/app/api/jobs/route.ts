import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapJobToView, mapToClosingSoon, mapToRecent, mapToFeatured, mapToGovernment, mapToCasual } from '@/lib/data-mapper';
import type { Prisma } from '@prisma/client';

/** The include shape shared across every job query. */
const JOB_INCLUDE = {
  company: { select: { id: true, name: true, slug: true, logoUrl: true, isGovernment: true } },
  category: { select: { id: true, name: true, slug: true } },
  subcategory: { select: { id: true, name: true, slug: true } },
  location: { select: { id: true, name: true, slug: true, type: true } },
  tags: { select: { tagId: true, jobId: true, tagIdRef: { select: { id: true, name: true, slug: true } } } },
} satisfies Prisma.JobInclude;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type'); // featured | government | casual | closing
    const categorySlug = searchParams.get('category');
    const limitParam = searchParams.get('limit');
    const statusParam = searchParams.get('status');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    // Build the where clause
    const where: Prisma.JobWhereInput = {};

    // Status filter (default: PUBLISHED)
    if (statusParam && statusParam !== 'ALL') {
      where.status = statusParam as any;
    } else if (!statusParam) {
      where.status = 'PUBLISHED';
    }

    // Type-based filters
    if (type === 'featured') {
      where.isFeatured = true;
    } else if (type === 'government') {
      where.isGovernment = true;
    } else if (type === 'casual') {
      where.isCasual = true;
    } else if (type === 'closing') {
      where.deadlineAt = { not: null, gte: new Date() };
    }

    // Category filter
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    // Fetch
    const jobs = await db.job.findMany({
      where,
      include: JOB_INCLUDE,
      orderBy: { postedAt: 'desc' },
      take: limit,
    });

    // Map based on the `type` query param — default returns full Job objects
    if (type === 'closing') {
      return NextResponse.json({ jobs: mapToClosingSoon(jobs as any) });
    }
    if (type === 'featured') {
      return NextResponse.json({ jobs: mapToFeatured(jobs as any) });
    }
    if (type === 'government') {
      return NextResponse.json({ jobs: mapToGovernment(jobs as any) });
    }
    if (type === 'casual') {
      return NextResponse.json({ jobs: mapToCasual(jobs as any) });
    }
    if (type === 'recent') {
      return NextResponse.json({ jobs: mapToRecent(jobs as any) });
    }

    // Default: return full Job objects
    return NextResponse.json({ jobs: jobs.map((j) => mapJobToView(j as any)) });
  } catch (error) {
    console.error('[GET /api/jobs] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 },
    );
  }
}
