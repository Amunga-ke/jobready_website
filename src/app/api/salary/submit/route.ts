import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { submitSalary } from "@/lib/services/salary-benchmark";

/**
 * POST /api/salary/submit
 *
 * Submit a salary data point for benchmarking.
 * Requires authentication.
 *
 * Body: { jobTitle, company?, industry?, county?, employmentType?, experienceLevel?, salaryAmount, salaryPeriod?, benefits? }
 * Returns: { id, jobTitle, salaryAmount, salaryPeriod, createdAt }
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      jobTitle,
      company,
      industry,
      county,
      employmentType,
      experienceLevel,
      salaryAmount,
      salaryPeriod,
      benefits,
    } = body as {
      jobTitle?: string;
      company?: string;
      industry?: string;
      county?: string;
      employmentType?: string;
      experienceLevel?: string;
      salaryAmount?: number;
      salaryPeriod?: string;
      benefits?: string[];
    };

    // Validation
    if (!jobTitle || typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: "jobTitle is required" },
        { status: 400 }
      );
    }

    if (
      salaryAmount === undefined ||
      typeof salaryAmount !== "number" ||
      salaryAmount <= 0
    ) {
      return NextResponse.json(
        { error: "salaryAmount must be a positive number" },
        { status: 400 }
      );
    }

    // Cap at reasonable maximum (10M KES per period)
    if (salaryAmount > 10_000_000) {
      return NextResponse.json(
        { error: "salaryAmount seems unrealistic. Max is 10,000,000 KES per period." },
        { status: 400 }
      );
    }

    const validPeriods = ["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "ANNUALLY"];
    const normalizedPeriod = (salaryPeriod || "MONTHLY").toUpperCase();
    if (!validPeriods.includes(normalizedPeriod)) {
      return NextResponse.json(
        {
          error: `Invalid salaryPeriod. Must be one of: ${validPeriods.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await submitSalary({
      userId: session.user.id,
      jobTitle,
      company,
      industry,
      county,
      employmentType: employmentType || "Full-time",
      experienceLevel: experienceLevel || "Mid-level",
      salaryAmount,
      salaryPeriod: normalizedPeriod,
      benefits,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[salary/submit] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit salary data" },
      { status: 500 }
    );
  }
}
