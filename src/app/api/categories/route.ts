import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapToCategories } from '@/lib/data-mapper';

export async function GET() {
  try {
    // Fetch root categories (no parent) with type JOB, ordered by listing count.
    // Include their subcategories (children) for the hierarchical structure.
    const categories = await db.category.findMany({
      where: {
        parentId: null,
        isActive: true,
        type: 'JOB',
      },
      include: {
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            listingCount: true,
          },
          orderBy: { listingCount: 'desc' },
        },
      },
      orderBy: { listingCount: 'desc' },
    });

    return NextResponse.json({
      categories: mapToCategories(categories as any),
    });
  } catch (error) {
    console.error('[GET /api/categories] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}
