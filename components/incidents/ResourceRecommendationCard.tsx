interface Resource {
  resourceType: string;
  priority: string;
  reason: string;
}

interface ResourceRecommendationCardProps {
  resources: Resource[];
  constraints: string[];
  firstActions: string[];
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: "bg-red-900 text-red-300 border-red-700",
  high: "bg-orange-900 text-orange-300 border-orange-700",
  medium: "bg-yellow-900 text-yellow-300 border-yellow-700",
  low: "bg-slate-700 text-slate-300 border-slate-600",
};

export default function ResourceRecommendationCard({
  resources,
  constraints,
  firstActions,
}: ResourceRecommendationCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span className="text-blue-400">R</span> Resource Recommendations
      </h3>

      {resources?.length > 0 && (
        <div className="space-y-2 mb-4">
          {resources.map((r, i) => {
            const style = PRIORITY_STYLES[r.priority?.toLowerCase()] ?? "bg-slate-700 text-slate-300 border-slate-600";
            return (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                <span className={`px-2 py-0.5 rounded border text-xs font-semibold uppercase shrink-0 ${style}`}>
                  {r.priority}
                </span>
                <div>
                  <div className="text-slate-200 text-sm font-medium capitalize">
                    {r.resourceType?.replace(/_/g, " ")}
                  </div>
                  <div className="text-slate-500 text-xs mt-0.5">{r.reason}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {firstActions?.length > 0 && (
        <div className="mb-4">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Immediate First Actions</div>
          <ol className="space-y-1">
            {firstActions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-blue-400 font-mono shrink-0">{i + 1}.</span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}

      {constraints?.length > 0 && (
        <div>
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Constraints</div>
          <ul className="space-y-1">
            {constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-red-500">!</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
