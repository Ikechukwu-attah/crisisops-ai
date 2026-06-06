"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApprovalPanelProps {
  incidentId: string;
  currentStatus: string;
  existingApproval?: {
    decision: string;
    operatorName?: string | null;
    notes?: string | null;
    createdAt: string | Date;
  } | null;
}

const DECISION_LABELS = {
  approve: { label: "Approve", style: "bg-green-600 hover:bg-green-500 text-white", desc: "Mark as approved and ready for execution" },
  approve_with_edits: { label: "Approve with Edits", style: "bg-blue-600 hover:bg-blue-500 text-white", desc: "Approve with modifications to the plan" },
  reject: { label: "Reject", style: "bg-red-600 hover:bg-red-500 text-white", desc: "Reject this incident plan" },
  request_more_info: { label: "Request More Info", style: "bg-yellow-600 hover:bg-yellow-500 text-white", desc: "Send back for additional verification" },
} as const;

type Decision = keyof typeof DECISION_LABELS;

const FINALIZED_STATUSES = ["APPROVED", "APPROVED_WITH_EDITS", "REJECTED"];

export default function ApprovalPanel({ incidentId, currentStatus, existingApproval }: ApprovalPanelProps) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [operatorName, setOperatorName] = useState("");
  const [notes, setNotes] = useState("");
  const [editedPlan, setEditedPlan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isFinalized = FINALIZED_STATUSES.includes(currentStatus);

  if (isFinalized && existingApproval) {
    const decLabel = DECISION_LABELS[existingApproval.decision as Decision]?.label ?? existingApproval.decision;
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Approval Decision</h3>
        <div className="bg-green-950 border border-green-800 rounded-lg p-4">
          <div className="text-green-300 font-semibold text-sm mb-1">{decLabel}</div>
          {existingApproval.operatorName && (
            <div className="text-slate-400 text-xs">By: {existingApproval.operatorName}</div>
          )}
          {existingApproval.notes && (
            <div className="text-slate-300 text-sm mt-2">{existingApproval.notes}</div>
          )}
          <div className="text-slate-500 text-xs mt-2">{new Date(existingApproval.createdAt).toLocaleString()}</div>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (!decision) return;
    setSubmitting(true);
    setError("");

    try {
      let editedPlanJson = undefined;
      if (decision === "approve_with_edits" && editedPlan.trim()) {
        try { editedPlanJson = JSON.parse(editedPlan); } catch { editedPlanJson = { text: editedPlan }; }
      }

      const res = await fetch(`/api/incidents/${incidentId}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, operatorName, notes, editedPlanJson }),
      });

      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      router.refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-2">Human Approval Required</h3>
      <p className="text-slate-400 text-sm mb-5">
        Review all agent outputs above before making a decision. Public alerts will not be sent without explicit approval.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {(Object.entries(DECISION_LABELS) as [Decision, typeof DECISION_LABELS[Decision]][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setDecision(key)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              decision === key
                ? `${val.style} border-white`
                : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            <div className="font-semibold text-sm">{val.label}</div>
            <div className="text-xs opacity-75 mt-0.5">{val.desc}</div>
          </button>
        ))}
      </div>

      {decision === "approve_with_edits" && (
        <div className="mb-4">
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Edited Plan (JSON or text)
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm font-mono resize-none focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder='{"editedSummary": "...", "editedChecklist": [...]}'
            value={editedPlan}
            onChange={(e) => setEditedPlan(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Operator Name
          </label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Your name"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Notes (optional)
          </label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Review notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!decision || submitting}
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white"
      >
        {submitting ? "Submitting..." : decision ? `Submit: ${DECISION_LABELS[decision].label}` : "Select a Decision Above"}
      </button>
    </div>
  );
}
