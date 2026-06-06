interface PublicAlertDraftProps {
  publicAlertDraft: string;
  internalDispatchNote: string;
  followUpMessageToReporter: string;
  sensitiveContentFlags: string[];
  requiresApproval: boolean;
}

export default function PublicAlertDraft({
  publicAlertDraft,
  internalDispatchNote,
  followUpMessageToReporter,
  sensitiveContentFlags,
}: PublicAlertDraftProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="text-orange-400">C</span> Communication Drafts
        </h3>
        <span className="bg-red-900 border border-red-700 text-red-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Requires Human Approval
        </span>
      </div>

      <div className="bg-red-950 border border-red-900 rounded-lg p-3">
        <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">WARNING</div>
        <p className="text-red-200 text-sm">
          Public alerts must be reviewed and approved by an authorized operator before distribution.
          Do not send without explicit approval.
        </p>
      </div>

      <div>
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Public Alert Draft</div>
        <div className="bg-slate-900 border border-orange-800 rounded-lg p-3 text-slate-200 text-sm leading-relaxed">
          {publicAlertDraft}
        </div>
      </div>

      <div>
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Internal Dispatch Note</div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm leading-relaxed">
          {internalDispatchNote}
        </div>
      </div>

      <div>
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Follow-up to Reporter</div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-300 text-sm leading-relaxed">
          {followUpMessageToReporter}
        </div>
      </div>

      {sensitiveContentFlags?.length > 0 && (
        <div>
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Sensitive Content Flags</div>
          <div className="flex flex-wrap gap-2">
            {sensitiveContentFlags.map((flag, i) => (
              <span key={i} className="bg-orange-900 text-orange-300 border border-orange-700 px-2 py-0.5 rounded text-xs">
                {flag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
