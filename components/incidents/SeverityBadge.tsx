interface SeverityBadgeProps {
  severity: string;
  size?: "sm" | "md";
}

const SEVERITY_STYLES: Record<string, string> = {
  low: "bg-blue-900 text-blue-300 border-blue-700",
  medium: "bg-yellow-900 text-yellow-300 border-yellow-700",
  high: "bg-orange-900 text-orange-300 border-orange-700",
  critical: "bg-red-900 text-red-300 border-red-700",
};

export default function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const styles = SEVERITY_STYLES[severity?.toLowerCase()] ?? "bg-slate-800 text-slate-400 border-slate-600";
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span className={`inline-flex items-center rounded border font-semibold uppercase tracking-wider ${styles} ${sizeClass}`}>
      {severity ?? "unknown"}
    </span>
  );
}
