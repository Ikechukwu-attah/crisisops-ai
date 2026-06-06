import { NextRequest, NextResponse } from "next/server";
import { analyzeIncident } from "@/lib/agents/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawReport, reporterName, reporterContact, locationRaw, incidentType } = body;

    if (!rawReport || typeof rawReport !== "string" || rawReport.trim().length === 0) {
      return NextResponse.json({ error: "rawReport is required" }, { status: 400 });
    }

    const incident = await analyzeIncident({
      rawReport: rawReport.trim(),
      reporterName,
      reporterContact,
      locationRaw,
      incidentType,
    });

    return NextResponse.json({
      incidentId: incident?.id,
      status: incident?.status,
      agentResults: incident?.agentResults,
    });
  } catch (err) {
    console.error("[API] analyze error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
