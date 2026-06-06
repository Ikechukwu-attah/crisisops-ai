import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        agentResults: { orderBy: { createdAt: "asc" } },
        approvals: { orderBy: { createdAt: "desc" } },
        auditLogs: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!incident) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (err) {
    console.error("[API] incident get error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
