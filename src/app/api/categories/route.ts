import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        subcategories: {
          where: { active: true },
          select: { id: true, name: true, slug: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { listings: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    return NextResponse.json({
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        sortOrder: c.sortOrder,
        listingCount: c._count.listings,
        subcategories: c.subcategories,
      })),
    });
  } catch (error) {
    console.error('[GET /api/categories] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}
