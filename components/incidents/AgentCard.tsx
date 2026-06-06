"use client";

import { useState } from "react";
import ConfidenceMeter from "./ConfidenceMeter";

interface AgentCardProps {
  agentName: string;
  outputJson: unknown;
  confidence?: number | null;
  storedAt?: string;
}

const AGENT_META: Record<string, {
  label: string;
  num: string;
  role: string;
  inputUsed: string;
  keyFields: string[];
  color: string;
}> = {
  triage: {
    label: "Triage Agent",
    num: "01",
    role: "Classifies incident type, severity, urgency, affected population, and key risks from raw report text.",
    inputUsed: "Raw incident report · Location hint · Incident memory",
    keyFields: ["incidentType", "severity", "urgency", "summary", "affectedPeople", "location", "keyRisks"],
    color: "text-red-400 bg-red-950 border-red-800",
  },
  verification: {
    label: "Verification Agent",
    num: "02",
    role: "Detects missing information, contradictions, and generates clarifying questions to improve report quality.",
    inputUsed: "Raw report · Triage output",
    keyFields: ["isActionable", "missingInformation", "clarifyingQuestions", "contradictions", "verificationRisk"],
    color: "text-yellow-400 bg-yellow-950 border-yellow-800",
  },
  duplicate: {
    label: "Duplicate Detection Agent",
    num: "03",
    role: "Compares the current incident against memory records to identify similar or duplicate reports.",
    inputUsed: "Triage output · Incident memory",
    keyFields: ["possibleDuplicates", "mergeRecommendation"],
    color: "text-orange-400 bg-orange-950 border-orange-800",
  },
  resourcePlanner: {
    label: "Resource Planner Agent",
    num: "04",
    role: "Recommends response resource categories, immediate first actions, and operational constraints.",
    inputUsed: "Triage output · Verification output · Incident memory",
    keyFields: ["recommendedResources", "firstActions", "constraints"],
    color: "text-blue-400 bg-blue-950 border-blue-800",
  },
  communications: {
    label: "Communications Agent",
    num: "05",
    role: "Drafts internal dispatch notes, a cautious public alert, and a reporter follow-up message.",
    inputUsed: "Triage · Verification · Resource plan",
    keyFields: ["internalDispatchNote", "publicAlertDraft", "followUpMessageToReporter", "sensitiveContentFlags"],
    color: "text-purple-400 bg-purple-950 border-purple-800",
  },
  riskSafety: {
    label: "Risk & Safety Agent",
    num: "06",
    role: "Evaluates safety, legal, ethical, and misinformation risks across all prior agent outputs.",
    inputUsed: "All prior agent outputs",
    keyFields: ["riskLevel", "riskFlags", "safeToPublishPublicAlert", "recommendedHumanReviewNotes"],
    color: "text-pink-400 bg-pink-950 border-pink-800",
  },
  decisionSummary: {
    label: "Decision Summary Agent",
    num: "07",
    role: "Synthesizes all outputs into a final operator checklist and recommended approval decision.",
    inputUsed: "All prior agent outputs",
    keyFields: ["finalSummary", "recommendedDecision", "operatorChecklist", "statusRecommendation"],
    color: "text-emerald-400 bg-emerald-950 border-emerald-800",
  },
};

function renderFieldValue(val: unknown): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-slate-600 italic">Not provided</span>;
  if (typeof val === "boolean") {
    return (
      <span className={val ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
        {val ? "Yes" : "No"}
      </span>
    );
  }
  if (typeof val === "number") return <span className="text-blue-400 font-mono">{val}</span>;
  if (typeof val === "string" && val.trim() === "") return <span className="text-slate-600 italic">Not provided</span>;
  if (typeof val === "string") return <span className="text-slate-200">{val}</span>;
  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="text-slate-600 italic">None detected</span>;
    return (
      <ul className="space-y-1 mt-1">
        {val.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-slate-300">
            <span className="text-slate-600 shrink-0">•</span>
            {typeof item === "object" ? (
              <div className="space-y-0.5">
                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-500 text-xs">{k}: </span>
                    <span className="text-slate-300">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span>{String(item)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof val === "object") {
    return (
      <div className="space-y-1 mt-1 pl-2 border-l border-slate-700">
        {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="flex items-start gap-2">
            <span className="text-slate-500 text-xs shrink-0">{k}:</span>
            <span className="text-slate-300 text-xs">{String(v)}</span>
          </div>
        ))}
      </div>
    );
  }
  return <span className="text-slate-300">{String(val)}</span>;
}

export default function AgentCard({ agentName, outputJson, confidence, storedAt }: AgentCardProps) {
  const [open, setOpen] = useState(false);
  const meta = AGENT_META[agentName];
  const data = outputJson as Record<string, unknown> | null;
  const hasError = data && "error" in data;
  const isValidated = data && !hasError;

  const colorParts = meta?.color?.split(" ") ?? [];
  const textColor = colorParts[0] ?? "text-slate-400";
  const bgColor = colorParts[1] ?? "bg-slate-900";
  const borderColor = colorParts[2] ?? "border-slate-700";

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${hasError ? "border-red-800 bg-red-950/20" : "border-slate-700 bg-slate-800"}`}>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {/* Number badge */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${bgColor} ${borderColor} ${textColor}`}>
          {meta?.num ?? "?"}
        </div>

        {/* Label + role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-semibold">{meta?.label ?? agentName}</span>
            {hasError ? (
              <span className="bg-red-900 border border-red-700 text-red-300 text-xs px-1.5 py-0.5 rounded font-semibold">ERROR</span>
            ) : isValidated ? (
              <span className="bg-green-900 border border-green-700 text-green-300 text-xs px-1.5 py-0.5 rounded font-semibold">Validated</span>
            ) : null}
          </div>
          <div className="text-slate-500 text-xs truncate">{meta?.role ?? ""}</div>
        </div>

        {/* Confidence + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {confidence != null && !hasError && (
            <span className="text-xs font-mono text-slate-400">{Math.round(confidence * 100)}%</span>
          )}
          <span className="text-slate-600 text-xs">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-700 px-4 pb-4 pt-3 space-y-4">
          {/* Confidence meter */}
          {confidence != null && !hasError && (
            <ConfidenceMeter confidence={confidence} label="Agent Confidence" />
          )}

          {/* Metadata rows */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-slate-500 w-24 shrink-0 font-semibold uppercase tracking-wide">Role</span>
              <span className="text-slate-300">{meta?.role ?? "—"}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-500 w-24 shrink-0 font-semibold uppercase tracking-wide">Input Used</span>
              <span className="text-slate-300">{meta?.inputUsed ?? "—"}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-500 w-24 shrink-0 font-semibold uppercase tracking-wide">Validation</span>
              <span className={hasError ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}>
                {hasError ? "Failed — stored as error" : "Passed Zod schema · Stored to database"}
              </span>
            </div>
            {storedAt && (
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-24 shrink-0 font-semibold uppercase tracking-wide">Stored</span>
                <span className="text-slate-400">{new Date(storedAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Structured output */}
          <div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Structured Output</div>
            {hasError ? (
              <div className="bg-red-950 border border-red-800 rounded-lg p-3 text-red-300 text-xs font-mono">
                {String((data as Record<string, unknown>).error)}
              </div>
            ) : (
              <div className="space-y-3">
                {(meta?.keyFields ?? Object.keys(data ?? {})).map((field) => {
                  const val = data ? data[field] : undefined;
                  return (
                    <div key={field} className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">{field}</div>
                      <div className="text-sm">{renderFieldValue(val)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
