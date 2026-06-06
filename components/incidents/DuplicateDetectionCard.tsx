interface PossibleDuplicate {
  incidentId: string;
  similarityReason: string;
  confidence: number;
}

interface DuplicateDetectionCardProps {
  possibleDuplicates: PossibleDuplicate[];
  mergeRecommendation: string;
  confidence: number;
}

const MERGE_LABELS: Record<string, { label: string; style: string; action: string }> = {
  review_merge: {
    label: "Review Before Merge",
    style: "bg-orange-900 text-orange-300 border-orange-700",
    action: "Review before dispatching separate resources. This may be related to an active incident.",
  },
  auto_group_for_review: {
    label: "Group for Review",
    style: "bg-yellow-900 text-yellow-300 border-yellow-700",
    action: "Group this incident with similar reports for coordinated operator review.",
  },
  no_merge: {
    label: "No Merge Required",
    style: "bg-green-900 text-green-300 border-green-700",
    action: "No matching duplicate detected. Treat as a new independent incident.",
  },
};

export default function DuplicateDetectionCard({
  possibleDuplicates,
  mergeRecommendation,
  confidence,
}: DuplicateDetectionCardProps) {
  const merge = MERGE_LABELS[mergeRecommendation] ?? MERGE_LABELS["no_merge"];
  const hasDuplicates = possibleDuplicates && possibleDuplicates.length > 0;

  return (
    <div className={`border rounded-xl p-5 ${hasDuplicates ? "bg-orange-950 border-orange-800" : "bg-slate-800 border-slate-700"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold flex items-center gap-2 ${hasDuplicates ? "text-orange-200" : "text-white"}`}>
          <span className="text-base">D</span>
          Possible Related Incidents
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono text-xs">{Math.round(confidence * 100)}% confidence</span>
          <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${merge.style}`}>
            {merge.label}
          </span>
        </div>
      </div>

      {hasDuplicates ? (
        <div className="space-y-3 mb-4">
          {possibleDuplicates.map((dup, i) => (
            <div key={i} className="bg-orange-900/30 border border-orange-800 rounded-lg p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="text-orange-200 text-sm font-medium font-mono truncate">{dup.incidentId}</div>
                <span className="text-orange-400 text-xs font-mono shrink-0">{Math.round(dup.confidence * 100)}% similar</span>
              </div>
              <p className="text-orange-300 text-sm">{dup.similarityReason}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-400 text-sm mb-4">No matching incidents detected in memory.</div>
      )}

      <div className={`rounded-lg p-3 text-sm ${hasDuplicates ? "bg-orange-900/20 border border-orange-800 text-orange-200" : "bg-slate-900 border border-slate-700 text-slate-400"}`}>
        <span className="font-semibold">Recommended operator action: </span>
        {merge.action}
      </div>
    </div>
  );
}
