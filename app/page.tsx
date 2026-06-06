import Link from "next/link";

const FEATURES = [
  {
    icon: "T",
    title: "Triage Agent",
    desc: "Classifies incident type, severity (low/medium/high/critical), urgency, and affected population from raw natural-language reports.",
    color: "text-red-400",
  },
  {
    icon: "V",
    title: "Verification Agent",
    desc: "Detects missing information, vague descriptions, and contradictions. Generates clarifying questions for the reporting officer.",
    color: "text-yellow-400",
  },
  {
    icon: "R",
    title: "Resource Planning",
    desc: "Recommends resource categories, first actions, and operational constraints without making automated dispatch decisions.",
    color: "text-blue-400",
  },
  {
    icon: "C",
    title: "Public Alert Drafting",
    desc: "Generates cautious, non-alarming public alert and internal dispatch drafts — always flagged as requiring human approval.",
    color: "text-orange-400",
  },
  {
    icon: "H",
    title: "Human Approval",
    desc: "Every sensitive action requires an operator decision: Approve, Approve with Edits, Reject, or Request More Information.",
    color: "text-green-400",
  },
  {
    icon: "M",
    title: "Incident Memory",
    desc: "Retrieves relevant past incidents, locations, and approved templates to inform agent reasoning across sessions.",
    color: "text-purple-400",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-red-500 font-bold text-xl">CrisisOps</span>
          <span className="text-slate-400 text-xl"> AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">
            Dashboard
          </Link>
          <Link href="/memory" className="text-slate-400 hover:text-white text-sm transition-colors">
            Memory
          </Link>
          <Link
            href="/incidents/new"
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Analyze Incident
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Track 4: Autopilot Agent — Qwen Cloud Hackathon
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Multi-agent incident command
          <br />
          <span className="text-red-400">for fragmented emergency response</span>
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          CrisisOps AI transforms messy natural-language incident reports into structured triage, verification, resource plans,
          and approved communications in under 60 seconds.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/incidents/new"
            className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
          >
            Analyze New Incident
          </Link>
          <Link
            href="/dashboard"
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors border border-slate-700"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
          7-Agent Pipeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors">
              <div className={`text-2xl font-bold mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-8">
          System Architecture
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 font-mono text-sm text-slate-400">
          <pre className="overflow-x-auto leading-relaxed whitespace-pre">{`[Operator UI] → [Incident Intake API]
                         ↓
     [Incident Database] ←→ [Memory Store]
                         ↓
              [Agent Orchestrator]
                    ↓
     ┌──────────────────────────────────┐
     │  Triage Agent (classify)         │
     │  Verification Agent (gaps)       │
     │  Duplicate Detection Agent       │
     │  Resource Planner Agent          │
     │  Communications Agent (drafts)   │
     │  Risk & Safety Agent             │
     │  Decision Summary Agent          │
     └──────────────────────────────────┘
                    ↓
     [Structured Response Plan]
                    ↓
     [Human Approval UI] → [Audit Log]`}</pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-slate-600 text-sm">
        CrisisOps AI — Built with Qwen Cloud (qwen-max / qwen-plus) · Next.js · Prisma · SQLite
      </footer>
    </div>
  );
}
