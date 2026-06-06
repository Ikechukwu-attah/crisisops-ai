import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function resolveStatus(status: string, agentResults: Array<{ agentName: string; outputJson: string }>) {
  if (status !== "PENDING_APPROVAL") return status;
  const triage = agentResults.find((r) => r.agentName === "triage");
  if (!triage) return status;
  try {
    const parsed = JSON.parse(triage.outputJson);
    if (parsed && typeof parsed === "object" && "error" in parsed) return "ANALYSIS_FAILED";
  } catch { /* keep status */ }
  return status;
}

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        approvals: { orderBy: { createdAt: "desc" }, take: 1 },
        agentResults: { select: { agentName: true, outputJson: true } },
        _count: { select: { agentResults: true } },
      },
    });
    const resolved = incidents.map((inc) => ({
      ...inc,
      status: resolveStatus(inc.status, inc.agentResults),
    }));
    return NextResponse.json(resolved);
  } catch (err) {
    console.error("[API] incidents list error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
