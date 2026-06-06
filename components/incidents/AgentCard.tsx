"use client";

import { useState } from "react";
import ConfidenceMeter from "./ConfidenceMeter";

interface AgentCardProps {
  agentName: string;
  outputJson: unknown;
  confidence?: number | null;
  error?: boolean;
}

const AGENT_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  triage: { label: "Triage Agent", icon: "T", description: "Classifies incident type, severity, and urgency" },
  verification: { label: "Verification Agent", icon: "V", description: "Identifies missing info and contradictions" },
  duplicate: { label: "Duplicate Detection", icon: "D", description: "Checks for similar or duplicate incidents" },
  resourcePlanner: { label: "Resource Planner", icon: "R", description: "Recommends response resources" },
  communications: { label: "Communications Agent", icon: "C", description: "Drafts internal and public messages" },
  riskSafety: { label: "Risk & Safety Agent", icon: "S", description: "Evaluates safety and approval requirements" },
  decisionSummary: { label: "Decision Summary", icon: "X", description: "Creates final operator decision plan" },
};

function renderValue(val: unknown, depth = 0): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-slate-500">null</span>;
  if (typeof val === "boolean") return <span className="text-purple-400">{val.toString()}</span>;
  if (typeof val === "number") return <span className="text-blue-400">{val}</span>;
  if (typeof val === "string") return <span className="text-green-400">"{val}"</span>;
  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="text-slate-500">[]</span>;
    return (
      <ul className={`mt-1 space-y-1 ${depth > 0 ? "ml-4" : ""}`}>
        {val.map((item, i) => (
          <li key={i} className="text-slate-300">• {renderValue(item, depth + 1)}</li>
        ))}
      </ul>
    );
  }
  if (typeof val === "object") {
    return (
      <div className={`space-y-1 ${depth > 0 ? "ml-4" : ""}`}>
        {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
          <div key={k}>
            <span className="text-slate-400 text-xs">{k}: </span>
            {renderValue(v, depth + 1)}
          </div>
        ))}
      </div>
    );
  }
  return <span className="text-slate-300">{String(val)}</span>;
}

export default function AgentCard({ agentName, outputJson, confidence, error }: AgentCardProps) {
  const [open, setOpen] = useState(false);
  const meta = AGENT_LABELS[agentName] ?? { label: agentName, icon: "?", description: "" };
  const hasError = error || (outputJson && typeof outputJson === "object" && "error" in (outputJson as Record<string, unknown>));

  return (
    <div className={`bg-slate-800 border rounded-lg overflow-hidden ${hasError ? "border-red-800" : "border-slate-700"}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-750 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${hasError ? "bg-red-900 text-red-300" : "bg-slate-700 text-slate-300"}`}>
            {meta.icon}
          </div>
          <div>
            <div className="text-white text-sm font-medium">{meta.label}</div>
            <div className="text-slate-500 text-xs">{meta.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {confidence != null && (
            <span className="text-xs font-mono text-slate-400">{Math.round(confidence * 100)}%</span>
          )}
          {hasError ? <span className="text-xs text-red-400 font-medium">ERROR</span> : null}
          <span className="text-slate-500 text-sm">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-700">
          {confidence != null && (
            <div className="pt-3 mb-3">
              <ConfidenceMeter confidence={confidence} />
            </div>
          )}
          <div className="text-xs font-mono text-slate-300 space-y-1 mt-2">
            {renderValue(outputJson)}
          </div>
        </div>
      )}
    </div>
  );
}
