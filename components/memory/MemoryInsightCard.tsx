interface MemoryInsightCardProps {
  memory: {
    id: string;
    memoryType: string;
    title: string;
    content: string;
    tags: string;
    createdAt: string | Date;
  };
}

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  incident: { bg: "bg-blue-900", text: "text-blue-300", label: "Incident" },
  location: { bg: "bg-purple-900", text: "text-purple-300", label: "Location" },
  decision: { bg: "bg-green-900", text: "text-green-300", label: "Decision" },
  template: { bg: "bg-orange-900", text: "text-orange-300", label: "Template" },
};

export default function MemoryInsightCard({ memory }: MemoryInsightCardProps) {
  const style = TYPE_STYLES[memory.memoryType] ?? { bg: "bg-slate-800", text: "text-slate-300", label: memory.memoryType };
  const tags = memory.tags?.split(",").filter(Boolean) ?? [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${style.bg} ${style.text} mb-1`}>
            {style.label}
          </span>
          <h4 className="text-white text-sm font-semibold">{memory.title}</h4>
        </div>
        <span className="text-slate-600 text-xs shrink-0">{new Date(memory.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed mb-3">{memory.content}</p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <span key={i} className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
