import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const DECISION_TO_STATUS: Record<string, string> = {
  approve: "APPROVED",
  approve_with_edits: "APPROVED_WITH_EDITS",
  reject: "REJECTED",
  request_more_info: "PENDING_VERIFICATION",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { decision, operatorName, editedPlanJson, notes } = body;

    if (!decision) {
      return NextResponse.json({ error: "decision is required" }, { status: 400 });
    }

    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const approval = await prisma.approval.create({
      data: {
        incidentId: id,
        decision,
        operatorName,
        editedPlanJson: editedPlanJson ? JSON.stringify(editedPlanJson) : null,
        notes,
      },
    });

    const newStatus = DECISION_TO_STATUS[decision] ?? "PENDING_APPROVAL";
    await prisma.incident.update({
      where: { id },
      data: { status: newStatus },
    });

    await prisma.auditLog.create({
      data: {
        incidentId: id,
        action: "approval_submitted",
        detailsJson: JSON.stringify({ decision, operatorName, notes }),
      },
    });

    return NextResponse.json({ success: true, approval, newStatus });
  } catch (err) {
    console.error("[API] approval error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
