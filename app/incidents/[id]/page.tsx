import { notFound } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import IncidentSummaryCard from "@/components/incidents/IncidentSummaryCard";
import SeverityBadge from "@/components/incidents/SeverityBadge";
import ConfidenceMeter from "@/components/incidents/ConfidenceMeter";
import AgentCard from "@/components/incidents/AgentCard";
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
  for (const ar of incident.agentResults ?? []) {
    try { agentResultMap[ar.agentName] = JSON.parse(ar.outputJson); } catch { agentResultMap[ar.agentName] = ar.outputJson; }
  }

  const triage = agentResultMap["triage"] as Record<string, unknown> | undefined;
  const verification = agentResultMap["verification"] as Record<string, unknown> | undefined;
  const resourcePlanner = agentResultMap["resourcePlanner"] as Record<string, unknown> | undefined;
  const communications = agentResultMap["communications"] as Record<string, unknown> | undefined;
  const riskSafety = agentResultMap["riskSafety"] as Record<string, unknown> | undefined;
  const decisionSummary = agentResultMap["decisionSummary"] as Record<string, unknown> | undefined;

  const latestApproval = incident.approvals?.[0] ?? null;

  const AGENT_ORDER = ["triage", "verification", "duplicate", "resourcePlanner", "communications", "riskSafety", "decisionSummary"];

  return (
    <AppShell>
      <Header title="Incident Analysis" subtitle={`Report #${id.slice(0, 12)}`} />
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
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            {incident.confidence != null ? (
              <ConfidenceMeter confidence={incident.confidence} label="Overall Confidence" />
            ) : (
              <div className="text-slate-500 text-sm">Confidence not available</div>
            )}
          </div>
        </div>

        {/* Missing Info */}
        {verification && (
          <MissingInfoList
            missingInformation={(verification.missingInformation as string[]) ?? []}
            clarifyingQuestions={(verification.clarifyingQuestions as string[]) ?? []}
          />
        )}

        {/* Agent Cards */}
        <div className="space-y-3">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Agent Analysis Results</div>
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
              />
            );
          })}
        </div>

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
            <h3 className="text-white font-semibold mb-3">Operator Checklist</h3>
            <ol className="space-y-2">
              {(decisionSummary.operatorChecklist as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Risk Assessment */}
        {riskSafety && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              Risk & Safety Assessment
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                riskSafety.riskLevel === "high" ? "bg-red-900 text-red-300" :
                riskSafety.riskLevel === "medium" ? "bg-orange-900 text-orange-300" :
                "bg-green-900 text-green-300"
              }`}>
                {String(riskSafety.riskLevel).toUpperCase()}
              </span>
            </h3>
            {(riskSafety.recommendedHumanReviewNotes as string[])?.map((note, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300 mb-1">
                <span className="text-yellow-400 shrink-0">!</span> {note}
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

        {/* Approval Panel */}
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
