interface AgentWorkflowTimelineProps {
  agentResults: Array<{ agentName: string; outputJson: string; confidence?: number | null }>;
  currentStatus: string;
}

const PIPELINE_STEPS = [
  { key: "triage", num: "01", label: "Triage Agent", desc: "Classify type, severity, urgency" },
  { key: "verification", num: "02", label: "Verification Agent", desc: "Detect missing info and contradictions" },
  { key: "duplicate", num: "03", label: "Duplicate Detection", desc: "Compare against incident memory" },
  { key: "resourcePlanner", num: "04", label: "Resource Planner", desc: "Recommend resources and first actions" },
  { key: "communications", num: "05", label: "Communications Agent", desc: "Draft internal and public messages" },
  { key: "riskSafety", num: "06", label: "Risk & Safety Agent", desc: "Evaluate risks before approval" },
  { key: "decisionSummary", num: "07", label: "Decision Summary", desc: "Generate operator checklist" },
];

function getStepStatus(
  key: string,
  agentResults: Array<{ agentName: string; outputJson: string }>,
): "completed" | "failed" | "pending" {
  const result = agentResults.find((r) => r.agentName === key);
  if (!result) return "pending";
  try {
    const parsed = JSON.parse(result.outputJson);
    if (parsed && typeof parsed === "object" && "error" in parsed) return "failed";
    return "completed";
  } catch {
    return "failed";
  }
}

const STATUS_CONFIG = {
  completed: {
    dot: "bg-green-500",
    badge: "bg-green-900 text-green-300 border-green-700",
    badgeText: "Completed",
    numBg: "bg-green-900 text-green-400",
  },
  failed: {
    dot: "bg-red-500",
    badge: "bg-red-900 text-red-300 border-red-700",
    badgeText: "Failed",
    numBg: "bg-red-900 text-red-400",
  },
  pending: {
    dot: "bg-slate-600",
    badge: "bg-slate-700 text-slate-400 border-slate-600",
    badgeText: "Pending",
    numBg: "bg-slate-800 text-slate-500",
  },
};

export default function AgentWorkflowTimeline({ agentResults, currentStatus }: AgentWorkflowTimelineProps) {
  const approvalStatus =
    currentStatus === "APPROVED" || currentStatus === "APPROVED_WITH_EDITS"
      ? "approved"
      : currentStatus === "REJECTED"
      ? "rejected"
      : currentStatus === "PENDING_VERIFICATION"
      ? "more_info"
      : "awaiting";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Agent Pipeline</h3>
        <span className="text-slate-500 text-xs font-mono">Powered by Qwen Cloud · qwen-max</span>
      </div>

      <div className="space-y-2">
        {PIPELINE_STEPS.map((step) => {
          const status = getStepStatus(step.key, agentResults);
          const cfg = STATUS_CONFIG[status];
          const result = agentResults.find((r) => r.agentName === step.key);
          let confidence: number | null = null;
          if (result?.confidence != null) confidence = result.confidence;

          return (
            <div key={step.key} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center shrink-0 ${cfg.numBg}`}>
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium">{step.label}</div>
                <div className="text-slate-500 text-xs">{step.desc}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {confidence != null && (
                  <span className="text-slate-500 font-mono text-xs">{Math.round(confidence * 100)}%</span>
                )}
                <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${cfg.badge}`}>
                  {cfg.badgeText}
                </span>
              </div>
            </div>
          );
        })}

        {/* Human approval step */}
        <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg border ${
          approvalStatus === "approved"
            ? "bg-green-950 border-green-800"
            : approvalStatus === "rejected"
            ? "bg-red-950 border-red-800"
            : "bg-slate-900 border-slate-700"
        }`}>
          <div className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center shrink-0 ${
            approvalStatus === "approved" ? "bg-green-900 text-green-300" :
            approvalStatus === "rejected" ? "bg-red-900 text-red-300" :
            "bg-slate-700 text-slate-400"
          }`}>
            08
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium">Human Operator Approval</div>
            <div className="text-slate-500 text-xs">Review all agent outputs · No action taken without explicit decision</div>
          </div>
          <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${
            approvalStatus === "approved"
              ? "bg-green-900 text-green-300 border-green-700"
              : approvalStatus === "rejected"
              ? "bg-red-900 text-red-300 border-red-700"
              : approvalStatus === "more_info"
              ? "bg-orange-900 text-orange-300 border-orange-700"
              : "bg-yellow-900 text-yellow-300 border-yellow-700"
          }`}>
            {approvalStatus === "approved" ? "Approved" :
             approvalStatus === "rejected" ? "Rejected" :
             approvalStatus === "more_info" ? "More Info Requested" :
             "Awaiting Review"}
          </span>
        </div>
      </div>
    </div>
  );
}
