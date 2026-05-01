import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapToCategories } from '@/lib/data-mapper';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { jobCount: 'desc' },
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
