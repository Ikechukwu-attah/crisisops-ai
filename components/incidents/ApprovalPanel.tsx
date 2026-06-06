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
  approve: {
    label: "Approve Plan",
    style: "bg-green-600 hover:bg-green-500 text-white",
    borderSelected: "border-green-400",
    desc: "Confirm the plan is correct and authorize the recommended response.",
  },
  approve_with_edits: {
    label: "Approve with Edits",
    style: "bg-blue-600 hover:bg-blue-500 text-white",
    borderSelected: "border-blue-400",
    desc: "Approve the plan but modify specific details before it is recorded.",
  },
  reject: {
    label: "Reject",
    style: "bg-red-700 hover:bg-red-600 text-white",
    borderSelected: "border-red-400",
    desc: "Reject this plan. The incident remains open but no action is authorized.",
  },
  request_more_info: {
    label: "Request More Info",
    style: "bg-yellow-600 hover:bg-yellow-500 text-white",
    borderSelected: "border-yellow-400",
    desc: "Send back for additional field verification before a decision is made.",
  },
} as const;

type Decision = keyof typeof DECISION_LABELS;

const FINALIZED_STATUSES = ["APPROVED", "APPROVED_WITH_EDITS", "REJECTED"];

const DECISION_RESULT_STYLES: Record<string, string> = {
  approve: "bg-green-950 border-green-800",
  approve_with_edits: "bg-blue-950 border-blue-800",
  reject: "bg-red-950 border-red-800",
  request_more_info: "bg-yellow-950 border-yellow-800",
};

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
    const resultStyle = DECISION_RESULT_STYLES[existingApproval.decision] ?? "bg-slate-800 border-slate-700";
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <h3 className="text-white font-semibold">Approval Decision Recorded</h3>
        </div>
        <div className={`border rounded-lg p-4 ${resultStyle}`}>
          <div className="text-white font-semibold text-sm mb-1">{decLabel}</div>
          {existingApproval.operatorName && (
            <div className="text-slate-400 text-xs">Reviewed by: {existingApproval.operatorName}</div>
          )}
          {existingApproval.notes && (
            <div className="text-slate-300 text-sm mt-2 italic">{existingApproval.notes}</div>
          )}
          <div className="text-slate-500 text-xs mt-2">{new Date(existingApproval.createdAt).toLocaleString()}</div>
        </div>
        <div className="mt-3 text-slate-500 text-xs">
          Decision recorded in audit log. No further changes can be made without a new review.
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (!decision) return;
    if (!operatorName.trim()) {
      setError("Operator name is required for audit compliance.");
      return;
    }
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
      {/* Safety header */}
      <div className="bg-red-950 border border-red-900 rounded-lg p-3 mb-5">
        <div className="text-red-300 font-bold text-xs uppercase tracking-wider mb-1">Human Approval Required</div>
        <p className="text-red-200 text-sm leading-relaxed">
          No dispatch, public alert, or escalation is finalized until an operator reviews and approves the plan.
          Approving does not automatically send any communication — it records your decision in the audit log.
        </p>
      </div>

      <h3 className="text-white font-semibold mb-1">Operator Decision</h3>
      <p className="text-slate-400 text-sm mb-5">
        Review all 7 agent outputs above. Select a decision to record it in the audit trail.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {(Object.entries(DECISION_LABELS) as [Decision, typeof DECISION_LABELS[Decision]][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setDecision(key)}
            className={`p-3.5 rounded-xl border-2 text-left transition-all ${
              decision === key
                ? `${val.style} ${val.borderSelected}`
                : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            }`}
          >
            <div className="font-semibold text-sm">{val.label}</div>
            <div className="text-xs opacity-75 mt-0.5 leading-relaxed">{val.desc}</div>
          </button>
        ))}
      </div>

      {decision === "approve_with_edits" && (
        <div className="mb-4">
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Edited Plan Notes
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 text-sm font-mono resize-none focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder="Describe your edits to the recommended plan..."
            value={editedPlan}
            onChange={(e) => setEditedPlan(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Operator Name <span className="text-red-400 normal-case">*</span>
          </label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Your name or badge ID"
            value={operatorName}
            onChange={(e) => setOperatorName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Review Notes
          </label>
          <input
            type="text"
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            placeholder="Optional notes for audit log..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!decision || !operatorName.trim() || submitting}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white"
      >
        {submitting
          ? "Recording decision..."
          : decision
          ? `Record Decision: ${DECISION_LABELS[decision].label}`
          : "Select a Decision Above"}
      </button>

      <div className="mt-3 text-slate-600 text-xs text-center">
        This decision is written to the append-only audit log and cannot be undone.
      </div>
    </div>
  );
}
