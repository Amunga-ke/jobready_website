import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const PERIOD_MAP: Record<string, string> = {
  ENTRY_LEVEL: 'month',
  INTERNSHIP: 'month',
  MID_LEVEL: 'month',
  SENIOR: 'month',
  LEAD: 'month',
  MANAGER: 'month',
  DIRECTOR: 'month',
  EXECUTIVE: 'month',
};

/**
 * POST /api/salary/predict
 *
 * Accepts job metadata and uses AI to estimate a salary range for the
 * Kenyan labour market. Returns { min, max, currency, period, note }.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, level, location, listingType } = body as {
      title?: string;
      category?: string;
      level?: string;
      location?: string;
      listingType?: string;
    };

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    // Skip prediction for non-job listings
    if (
      listingType &&
      ['SCHOLARSHIP', 'BURSARY', 'FELLOWSHIP', 'GRANT', 'VOLUNTEER', 'BOOTCAMP',
       'TRAINING', 'WORKSHOP', 'MENTORSHIP', 'CONFERENCE', 'APPRENTICESHIP'].includes(listingType)
    ) {
      return NextResponse.json({ predicted: null });
    }

    const zai = await ZAI.create();

    const prompt = `You are a Kenyan labour market salary expert. Estimate the typical monthly salary range (in KES / Kenya Shillings) for the following role in Kenya.

Job details:
- Title: ${title}
- Category: ${category || 'General'}
- Experience Level: ${level || 'Not specified'}
- Location: ${location || 'Kenya'}

Respond ONLY with a JSON object (no markdown, no explanation, no code fences) in exactly this format:
{"min": number, "max": number, "period": "month", "currency": "Ksh", "note": "brief one-sentence note"}

Rules:
- Use realistic Kenyan market rates as of 2024-2025
- Entry level roles: Ksh 20,000 - 50,000/month is typical
- Mid level: Ksh 50,000 - 150,000/month
- Senior: Ksh 100,000 - 300,000/month
- Executive: Ksh 200,000 - 800,000+/month
- Internships: Ksh 10,000 - 30,000/month
- The note should be a brief contextual explanation like "Typical range for mid-level software engineers in Nairobi"
- Round to nearest 5,000
- period should be "month" for most roles
- If the role is clearly daily-wage/casual, use "day" as period and much lower amounts`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a Kenyan labour market salary estimation tool. Always respond with valid JSON only. No markdown, no code fences, no explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';

    // Try to extract JSON from the response
    let parsed: { min: number; max: number; period: string; currency: string; note: string };
    try {
      // Strip any markdown fences if present
      const jsonStr = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse salary prediction', raw },
        { status: 500 },
      );
    }

    // Validate the parsed data
    if (
      typeof parsed.min !== 'number' ||
      typeof parsed.max !== 'number' ||
      parsed.min < 0 ||
      parsed.max < parsed.min
    ) {
      return NextResponse.json(
        { error: 'Invalid salary range from prediction', raw },
        { status: 500 },
      );
    }

    return NextResponse.json({
      predicted: {
        min: Math.round(parsed.min / 5000) * 5000,
        max: Math.round(parsed.max / 5000) * 5000,
        period: parsed.period || 'month',
        currency: parsed.currency || 'Ksh',
        note: parsed.note || 'Estimated range for this role type in Kenya',
      },
    });
  } catch (error: unknown) {
    console.error('[salary/predict] Error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
