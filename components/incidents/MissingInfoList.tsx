interface MissingInfoListProps {
  missingInformation: string[];
  clarifyingQuestions: string[];
}

export default function MissingInfoList({ missingInformation, clarifyingQuestions }: MissingInfoListProps) {
  if (!missingInformation?.length && !clarifyingQuestions?.length) return null;

  return (
    <div className="bg-yellow-950 border border-yellow-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-lg">!</span>
        <h3 className="text-yellow-300 font-semibold">Missing Information Detected</h3>
      </div>

      {missingInformation?.length > 0 && (
        <div className="mb-4">
          <div className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">Required Information</div>
          <ul className="space-y-1">
            {missingInformation.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-yellow-200">
                <span className="text-yellow-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {clarifyingQuestions?.length > 0 && (
        <div>
          <div className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">Follow-up Questions</div>
          <ul className="space-y-1">
            {clarifyingQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-yellow-200">
                <span className="text-yellow-500">Q{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
