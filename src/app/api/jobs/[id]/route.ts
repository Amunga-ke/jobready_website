import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapJobToView } from '@/lib/data-mapper';
import type { Prisma } from '@prisma/client';

const JOB_INCLUDE = {
  company: { select: { id: true, name: true, slug: true, logoUrl: true, isGovernment: true } },
  category: { select: { id: true, name: true, slug: true } },
  subcategory: { select: { id: true, name: true, slug: true } },
  location: { select: { id: true, name: true, slug: true, type: true } },
  tags: { select: { tagId: true, jobId: true, tagIdRef: { select: { id: true, name: true, slug: true } } } },
} satisfies Prisma.JobInclude;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // The `id` param is treated as a slug
    const job = await db.job.findUnique({
      where: { slug: id },
      include: JOB_INCLUDE,
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ job: mapJobToView(job as any) });
  } catch (error) {
    console.error('[GET /api/jobs/[id]] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 },
    );
  }
}
