import { prisma } from "@/lib/db/prisma";
import { runTriageAgent } from "./triage-agent";
import { runVerificationAgent } from "./verification-agent";
import { runDuplicateAgent } from "./duplicate-agent";
import { runResourcePlannerAgent } from "./resource-planner-agent";
import { runCommunicationsAgent } from "./communications-agent";
import { runRiskSafetyAgent } from "./risk-safety-agent";
import { runDecisionSummaryAgent } from "./decision-summary-agent";
import type {
  TriageOutput,
  VerificationOutput,
  DuplicateOutput,
  ResourcePlannerOutput,
  CommunicationsOutput,
  RiskSafetyOutput,
  DecisionSummaryOutput,
} from "@/lib/validation/schemas";

interface AnalyzeIncidentInput {
  rawReport: string;
  reporterName?: string;
  reporterContact?: string;
  locationRaw?: string;
  incidentType?: string;
}

async function loadMemoryContext(locationRaw?: string, incidentType?: string): Promise<string> {
  const memories = await prisma.incidentMemory.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const keywords = [
    ...(locationRaw?.toLowerCase().split(/\s+/) ?? []),
    ...(incidentType?.toLowerCase().split(/\s+/) ?? []),
  ].filter(Boolean);

  const scored = memories.map((m) => {
    const text = `${m.title} ${m.content} ${m.tags}`.toLowerCase();
    const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    return { ...m, score };
  });

  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (top.length === 0) return "No relevant memory found.";

  return top
    .map((m) => `[${m.memoryType}] ${m.title}: ${m.content} (tags: ${m.tags})`)
    .join("\n\n");
}

async function writeAuditLog(incidentId: string, action: string, details?: unknown) {
  await prisma.auditLog.create({
    data: {
      incidentId,
      action,
      detailsJson: details ? JSON.stringify(details) : null,
    },
  });
}

async function saveAgentResult(
  incidentId: string,
  agentName: string,
  outputJson: unknown,
  confidence?: number
) {
  await prisma.agentResult.create({
    data: {
      incidentId,
      agentName,
      outputJson: JSON.stringify(outputJson),
      confidence,
    },
  });
}

export async function analyzeIncident(input: AnalyzeIncidentInput) {
  // Create incident record
  const incident = await prisma.incident.create({
    data: {
      rawReport: input.rawReport,
      reporterName: input.reporterName,
      reporterContact: input.reporterContact,
      locationRaw: input.locationRaw,
      incidentType: input.incidentType,
      status: "ANALYZING",
    },
  });

  await writeAuditLog(incident.id, "incident_created", {
    reporterName: input.reporterName,
    locationRaw: input.locationRaw,
  });

  const memoryContext = await loadMemoryContext(input.locationRaw, input.incidentType);
  const agentOutputs: Record<string, unknown> = {};

  // 1. Triage Agent
  let triageData: TriageOutput | null = null;
  {
    const result = await runTriageAgent({
      rawReport: input.rawReport,
      locationRaw: input.locationRaw,
      memoryContext,
    });
    agentOutputs["triage"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "triage", result.data ?? { error: result.error }, result.data?.confidence);
    await writeAuditLog(incident.id, "agent_completed", { agent: "triage", success: result.success });
    if (result.success && result.data) triageData = result.data;
  }

  // 2. Verification Agent
  let verificationData: VerificationOutput | null = null;
  if (triageData) {
    const result = await runVerificationAgent({ rawReport: input.rawReport, triageOutput: triageData });
    agentOutputs["verification"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "verification", result.data ?? { error: result.error }, result.data?.confidence);
    await writeAuditLog(incident.id, "agent_completed", { agent: "verification", success: result.success });
    if (result.success && result.data) verificationData = result.data;
  }

  // 3. Duplicate Detection Agent
  let duplicateData: DuplicateOutput | null = null;
  if (triageData) {
    const result = await runDuplicateAgent({
      triageOutput: triageData,
      rawReport: input.rawReport,
      memoryContext,
    });
    agentOutputs["duplicate"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "duplicate", result.data ?? { error: result.error }, result.data?.confidence);
    await writeAuditLog(incident.id, "agent_completed", { agent: "duplicate", success: result.success });
    if (result.success && result.data) duplicateData = result.data;
  }

  // 4. Resource Planner Agent
  let resourceData: ResourcePlannerOutput | null = null;
  if (triageData && verificationData) {
    const result = await runResourcePlannerAgent({
      triageOutput: triageData,
      verificationOutput: verificationData,
      memoryContext,
    });
    agentOutputs["resourcePlanner"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "resourcePlanner", result.data ?? { error: result.error }, result.data?.confidence);
    await writeAuditLog(incident.id, "agent_completed", { agent: "resourcePlanner", success: result.success });
    if (result.success && result.data) resourceData = result.data;
  }

  // 5. Communications Agent
  let commsData: CommunicationsOutput | null = null;
  if (triageData && verificationData && resourceData) {
    const result = await runCommunicationsAgent({
      triageOutput: triageData,
      verificationOutput: verificationData,
      resourcePlan: resourceData,
    });
    agentOutputs["communications"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "communications", result.data ?? { error: result.error });
    await writeAuditLog(incident.id, "agent_completed", { agent: "communications", success: result.success });
    if (result.success && result.data) commsData = result.data;
  }

  // 6. Risk & Safety Agent
  let riskData: RiskSafetyOutput | null = null;
  {
    const result = await runRiskSafetyAgent({ allAgentOutputs: agentOutputs });
    agentOutputs["riskSafety"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "riskSafety", result.data ?? { error: result.error });
    await writeAuditLog(incident.id, "agent_completed", { agent: "riskSafety", success: result.success });
    if (result.success && result.data) riskData = result.data;
  }

  // 7. Decision Summary Agent
  let summaryData: DecisionSummaryOutput | null = null;
  {
    const result = await runDecisionSummaryAgent({ allAgentOutputs: agentOutputs });
    agentOutputs["decisionSummary"] = result.data ?? { error: result.error };
    await saveAgentResult(incident.id, "decisionSummary", result.data ?? { error: result.error }, result.data?.confidence);
    await writeAuditLog(incident.id, "agent_completed", { agent: "decisionSummary", success: result.success });
    if (result.success && result.data) summaryData = result.data;
  }

  // Update incident with triage data and status
  await prisma.incident.update({
    where: { id: incident.id },
    data: {
      status: "PENDING_APPROVAL",
      incidentType: triageData?.incidentType ?? input.incidentType,
      severity: triageData?.severity,
      urgency: triageData?.urgency,
      confidence: triageData?.confidence,
      title: triageData?.summary?.slice(0, 100),
    },
  });

  await writeAuditLog(incident.id, "analysis_complete", {
    agentsRun: Object.keys(agentOutputs),
    finalStatus: "PENDING_APPROVAL",
  });

  const fullIncident = await prisma.incident.findUnique({
    where: { id: incident.id },
    include: {
      agentResults: { orderBy: { createdAt: "asc" } },
      approvals: true,
      auditLogs: { orderBy: { createdAt: "asc" } },
    },
  });

  return fullIncident;
}
