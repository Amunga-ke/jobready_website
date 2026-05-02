import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import UpdateDetailPage from "./UpdateDetailPage";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function UpdateSlugPage({ params }: Props) {
  const { slug } = await params;

  const update = await prisma.jobUpdate.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!update) {
    notFound();
  }

  return <UpdateDetailPage update={update} />;
}
