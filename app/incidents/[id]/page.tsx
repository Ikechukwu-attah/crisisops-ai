import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import IncidentSummaryCard from "@/components/incidents/IncidentSummaryCard";
import SeverityBadge from "@/components/incidents/SeverityBadge";
import ConfidenceMeter from "@/components/incidents/ConfidenceMeter";
import AgentCard from "@/components/incidents/AgentCard";
import AgentWorkflowTimeline from "@/components/incidents/AgentWorkflowTimeline";
import DuplicateDetectionCard from "@/components/incidents/DuplicateDetectionCard";
import MissingInfoList from "@/components/incidents/MissingInfoList";
import ResourceRecommendationCard from "@/components/incidents/ResourceRecommendationCard";
import PublicAlertDraft from "@/components/incidents/PublicAlertDraft";
import ApprovalPanel from "@/components/incidents/ApprovalPanel";
import AuditTimeline from "@/components/incidents/AuditTimeline";

async function getIncident(id: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/incidents/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function IncidentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident) notFound();

  const agentResultMap: Record<string, unknown> = {};
  const agentResultTimestamps: Record<string, string> = {};

  for (const ar of incident.agentResults ?? []) {
    try { agentResultMap[ar.agentName] = JSON.parse(ar.outputJson); } catch { agentResultMap[ar.agentName] = ar.outputJson; }
    agentResultTimestamps[ar.agentName] = ar.createdAt;
  }

  const verification = agentResultMap["verification"] as Record<string, unknown> | undefined;
  const duplicate = agentResultMap["duplicate"] as Record<string, unknown> | undefined;
  const resourcePlanner = agentResultMap["resourcePlanner"] as Record<string, unknown> | undefined;
  const communications = agentResultMap["communications"] as Record<string, unknown> | undefined;
  const riskSafety = agentResultMap["riskSafety"] as Record<string, unknown> | undefined;
  const decisionSummary = agentResultMap["decisionSummary"] as Record<string, unknown> | undefined;

  const latestApproval = incident.approvals?.[0] ?? null;

  const AGENT_ORDER = ["triage", "verification", "duplicate", "resourcePlanner", "communications", "riskSafety", "decisionSummary"];

  return (
    <AppShell>
      <Header title="Incident Analysis" subtitle={`Report #${id.slice(0, 12)} · Qwen Cloud · 7 Agents`} />
      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Summary */}
        <IncidentSummaryCard incident={incident} />

        {/* Severity + Confidence row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            {incident.severity && <SeverityBadge severity={incident.severity} />}
            {incident.urgency && (
              <span className="px-3 py-1 rounded border border-slate-600 bg-slate-700 text-slate-300 text-sm font-semibold uppercase">
                {incident.urgency}
              </span>
            )}
            {incident.incidentType && (
              <span className="px-3 py-1 rounded border border-slate-600 bg-slate-700 text-slate-400 text-sm capitalize">
                {incident.incidentType}
              </span>
            )}
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            {incident.confidence != null ? (
              <ConfidenceMeter confidence={incident.confidence} label="Overall Analysis Confidence" />
            ) : (
              <div className="text-slate-500 text-sm">Confidence not available</div>
            )}
          </div>
        </div>

        {/* Agent Pipeline Timeline */}
        <AgentWorkflowTimeline
          agentResults={incident.agentResults ?? []}
          currentStatus={incident.status}
        />

        {/* Missing Info — high-priority warning */}
        {verification && (
          <MissingInfoList
            missingInformation={(verification.missingInformation as string[]) ?? []}
            clarifyingQuestions={(verification.clarifyingQuestions as string[]) ?? []}
          />
        )}

        {/* Duplicate Detection — dedicated card */}
        {duplicate && (
          <DuplicateDetectionCard
            possibleDuplicates={(duplicate.possibleDuplicates as Array<{ incidentId: string; similarityReason: string; confidence: number }>) ?? []}
            mergeRecommendation={(duplicate.mergeRecommendation as string) ?? "no_merge"}
            confidence={(duplicate.confidence as number) ?? 0}
          />
        )}

        {/* Resource Recommendations */}
        {resourcePlanner && (
          <ResourceRecommendationCard
            resources={(resourcePlanner.recommendedResources as Array<{ resourceType: string; priority: string; reason: string }>) ?? []}
            constraints={(resourcePlanner.constraints as string[]) ?? []}
            firstActions={(resourcePlanner.firstActions as string[]) ?? []}
          />
        )}

        {/* Operator Checklist from Decision Summary */}
        {decisionSummary && (decisionSummary.operatorChecklist as string[])?.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Operator Checklist</h3>
              {decisionSummary.recommendedDecision ? (
                <span className="bg-slate-700 border border-slate-600 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
                  Recommended: {String(decisionSummary.recommendedDecision).replace(/_/g, " ")}
                </span>
              ) : null}
            </div>
            <ol className="space-y-2">
              {(decisionSummary.operatorChecklist as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
            {decisionSummary.finalSummary ? (
              <div className="mt-4 pt-4 border-t border-slate-700 text-slate-400 text-sm leading-relaxed">
                {String(decisionSummary.finalSummary)}
              </div>
            ) : null}
          </div>
        )}

        {/* Risk Assessment */}
        {riskSafety && (
          <div className={`border rounded-xl p-5 ${
            riskSafety.riskLevel === "high" ? "bg-red-950 border-red-800" :
            riskSafety.riskLevel === "medium" ? "bg-orange-950 border-orange-800" :
            "bg-slate-800 border-slate-700"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-white font-semibold">Risk & Safety Assessment</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                riskSafety.riskLevel === "high" ? "bg-red-900 border-red-700 text-red-300" :
                riskSafety.riskLevel === "medium" ? "bg-orange-900 border-orange-700 text-orange-300" :
                "bg-green-900 border-green-700 text-green-300"
              }`}>
                {String(riskSafety.riskLevel ?? "unknown").toUpperCase()} RISK
              </span>
              <span className={`text-xs px-2 py-0.5 rounded border ${
                riskSafety.safeToPublishPublicAlert
                  ? "bg-green-900 border-green-700 text-green-300"
                  : "bg-red-900 border-red-700 text-red-300"
              }`}>
                Alert: {riskSafety.safeToPublishPublicAlert ? "Safe to review" : "Not safe — needs verification"}
              </span>
            </div>
            {(riskSafety.riskFlags as string[])?.length > 0 && (
              <div className="mb-3">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Risk Flags</div>
                <div className="flex flex-wrap gap-2">
                  {(riskSafety.riskFlags as string[]).map((flag, i) => (
                    <span key={i} className="bg-red-900/40 border border-red-800 text-red-300 text-xs px-2 py-0.5 rounded">{flag}</span>
                  ))}
                </div>
              </div>
            )}
            {(riskSafety.recommendedHumanReviewNotes as string[])?.map((note, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300 mb-1">
                <span className="text-yellow-400 shrink-0 mt-0.5">!</span> {note}
              </div>
            ))}
          </div>
        )}

        {/* Communications */}
        {communications && (
          <PublicAlertDraft
            publicAlertDraft={(communications.publicAlertDraft as string) ?? ""}
            internalDispatchNote={(communications.internalDispatchNote as string) ?? ""}
            followUpMessageToReporter={(communications.followUpMessageToReporter as string) ?? ""}
            sensitiveContentFlags={(communications.sensitiveContentFlags as string[]) ?? []}
            requiresApproval={true}
          />
        )}

        {/* Agent Cards — detailed collapsible view */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Detailed Agent Outputs
            </div>
            <span className="text-slate-600 text-xs">Expand each agent to inspect structured output</span>
          </div>
          {AGENT_ORDER.map((agentName) => {
            const ar = incident.agentResults?.find((r: { agentName: string }) => r.agentName === agentName);
            if (!ar) return null;
            let parsed: unknown;
            try { parsed = JSON.parse(ar.outputJson); } catch { parsed = ar.outputJson; }
            return (
              <AgentCard
                key={agentName}
                agentName={agentName}
                outputJson={parsed}
                confidence={ar.confidence}
                storedAt={ar.createdAt}
              />
            );
          })}
        </div>

        {/* Approval Panel — always prominent */}
        <ApprovalPanel
          incidentId={id}
          currentStatus={incident.status}
          existingApproval={latestApproval}
        />

        {/* Audit Timeline */}
        {incident.auditLogs?.length > 0 && (
          <AuditTimeline logs={incident.auditLogs} />
        )}
      </div>
    </AppShell>
  );
}
