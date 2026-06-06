interface ConfidenceMeterProps {
  confidence: number;
  label?: string;
}

export default function ConfidenceMeter({ confidence, label = "Confidence" }: ConfidenceMeterProps) {
  const pct = Math.round((confidence ?? 0) * 100);
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-orange-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono font-semibold text-white">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
