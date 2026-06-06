interface AuditLog {
  id: string;
  action: string;
  detailsJson?: string | null;
  createdAt: string | Date;
}

interface AuditTimelineProps {
  logs: AuditLog[];
}

const ACTION_STYLES: Record<string, { dot: string; label: string }> = {
  incident_created: { dot: "bg-blue-500", label: "Incident Created" },
  agent_completed: { dot: "bg-green-500", label: "Agent Completed" },
  analysis_complete: { dot: "bg-purple-500", label: "Analysis Complete" },
  approval_submitted: { dot: "bg-yellow-500", label: "Approval Submitted" },
};

export default function AuditTimeline({ logs }: AuditTimelineProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Audit Timeline</h3>
      <div className="relative">
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-700" />
        <div className="space-y-4">
          {logs.map((log, i) => {
            const meta = ACTION_STYLES[log.action] ?? { dot: "bg-slate-500", label: log.action };
            let details: Record<string, unknown> | null = null;
            try { if (log.detailsJson) details = JSON.parse(log.detailsJson); } catch {}

            return (
              <div key={log.id ?? i} className="flex items-start gap-4 relative">
                <div className={`w-3 h-3 rounded-full ${meta.dot} ring-2 ring-slate-800 shrink-0 mt-1 z-10`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-200 text-sm font-medium">{meta.label}</span>
                    <span className="text-slate-500 text-xs shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {details && (
                    <div className="text-slate-500 text-xs mt-0.5 font-mono">
                      {Object.entries(details)
                        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                        .join(" | ")}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
