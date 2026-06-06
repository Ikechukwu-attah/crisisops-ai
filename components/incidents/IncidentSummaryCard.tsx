import SeverityBadge from "./SeverityBadge";

interface IncidentSummaryCardProps {
  incident: {
    id: string;
    title?: string | null;
    rawReport: string;
    reporterName?: string | null;
    reporterContact?: string | null;
    locationRaw?: string | null;
    incidentType?: string | null;
    severity?: string | null;
    urgency?: string | null;
    status: string;
    confidence?: number | null;
    createdAt: string | Date;
  };
}

const STATUS_STYLES: Record<string, string> = {
  ANALYZING: "bg-blue-900 text-blue-300",
  PENDING_APPROVAL: "bg-yellow-900 text-yellow-300",
  PENDING_VERIFICATION: "bg-orange-900 text-orange-300",
  APPROVED: "bg-green-900 text-green-300",
  APPROVED_WITH_EDITS: "bg-emerald-900 text-emerald-300",
  REJECTED: "bg-red-900 text-red-300",
  CLOSED: "bg-slate-700 text-slate-400",
};

const URGENCY_STYLES: Record<string, string> = {
  routine: "bg-slate-700 text-slate-300",
  urgent: "bg-orange-900 text-orange-300",
  immediate: "bg-red-900 text-red-300 animate-pulse",
};

export default function IncidentSummaryCard({ incident }: IncidentSummaryCardProps) {
  const statusStyle = STATUS_STYLES[incident.status] ?? "bg-slate-700 text-slate-300";
  const urgencyStyle = URGENCY_STYLES[incident.urgency ?? "routine"] ?? "bg-slate-700 text-slate-300";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-slate-500 text-xs font-mono mb-1">#{incident.id.slice(0, 12)}</div>
          <h2 className="text-white text-xl font-semibold">
            {incident.title ?? "Incident Report"}
          </h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusStyle}`}>
          {incident.status.replace(/_/g, " ")}
        </span>
      </div>

      <p className="text-slate-300 text-sm mb-4 leading-relaxed bg-slate-900 rounded-lg p-3 border border-slate-700">
        {incident.rawReport}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {incident.severity && <SeverityBadge severity={incident.severity} />}
        {incident.urgency && (
          <span className={`px-3 py-1 rounded border text-sm font-semibold uppercase tracking-wider ${urgencyStyle}`}>
            {incident.urgency}
          </span>
        )}
        {incident.incidentType && (
          <span className="px-3 py-1 rounded border border-slate-600 bg-slate-700 text-slate-300 text-sm font-medium capitalize">
            {incident.incidentType}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {incident.reporterName && (
          <div>
            <span className="text-slate-500">Reporter:</span>{" "}
            <span className="text-slate-300">{incident.reporterName}</span>
          </div>
        )}
        {incident.locationRaw && (
          <div>
            <span className="text-slate-500">Location:</span>{" "}
            <span className="text-slate-300">{incident.locationRaw}</span>
          </div>
        )}
        <div>
          <span className="text-slate-500">Created:</span>{" "}
          <span className="text-slate-300">
            {new Date(incident.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
