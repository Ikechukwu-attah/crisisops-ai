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

    // Retroactively resolve ANALYSIS_FAILED for pre-fix incidents stored as PENDING_APPROVAL
    const triage = incident.agentResults.find((r) => r.agentName === "triage");
    let status = incident.status;
    if (status === "PENDING_APPROVAL" && triage) {
      try {
        const parsed = JSON.parse(triage.outputJson);
        if (parsed && typeof parsed === "object" && "error" in parsed) status = "ANALYSIS_FAILED";
      } catch { /* keep status */ }
    }

    return NextResponse.json({ ...incident, status });
  } catch (err) {
    console.error("[API] incident get error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
