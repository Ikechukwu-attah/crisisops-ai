import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        approvals: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: { select: { agentResults: true } },
      },
    });
    return NextResponse.json(incidents);
  } catch (err) {
    console.error("[API] incidents list error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
