import Link from "next/link";

const AGENTS = [
  { num: "01", name: "Triage Agent", role: "Classify incident type, severity, urgency, and affected population", color: "border-red-800 text-red-400" },
  { num: "02", name: "Verification Agent", role: "Detect missing information, contradictions, and clarifying questions", color: "border-yellow-800 text-yellow-400" },
  { num: "03", name: "Duplicate Detection", role: "Compare against incident memory to flag related or repeated reports", color: "border-orange-800 text-orange-400" },
  { num: "04", name: "Resource Planner", role: "Recommend response resource categories and immediate first actions", color: "border-blue-800 text-blue-400" },
  { num: "05", name: "Communications Agent", role: "Draft internal dispatch notes and cautious public alert text", color: "border-purple-800 text-purple-400" },
  { num: "06", name: "Risk & Safety Agent", role: "Evaluate safety, legal, and misinformation risks before approval", color: "border-pink-800 text-pink-400" },
  { num: "07", name: "Decision Summary", role: "Generate operator checklist and recommended approval decision", color: "border-emerald-800 text-emerald-400" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-xs font-black">C</div>
          <div>
            <span className="text-white font-bold text-base">CrisisOps</span>
            <span className="text-red-400 font-bold text-base"> AI</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link href="/memory" className="text-slate-400 hover:text-white text-sm transition-colors">Memory</Link>
          <Link href="/incidents/new" className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Analyze Incident
          </Link>
        </div>
      </nav>

      {/* Track Badge */}
      <div className="flex justify-center pt-10">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            Track 4: Autopilot Agent
          </span>
          <span className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            Qwen Cloud Hackathon 2026
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-16 text-center">
        <h1 className="text-5xl font-bold leading-tight mb-5">
          Multi-agent incident command
          <br />
          <span className="text-red-400">for fragmented emergency response</span>
        </h1>
        <p className="text-slate-400 text-lg mb-3 max-w-2xl mx-auto leading-relaxed">
          CrisisOps AI is not a chatbot. It is a human-approved, Qwen-powered, multi-agent command workflow
          system for turning messy incident reports into structured response decisions.
        </p>
        <p className="text-slate-500 text-sm mb-8 max-w-xl mx-auto">
          Built for cities, campuses, NGOs, and response teams where reports arrive through fragmented channels
          and operators need fast, verified decision support.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/incidents/new" className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-semibold text-base transition-colors">
            Analyze an Incident
          </Link>
          <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold text-base transition-colors border border-slate-700">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Evaluation Metrics */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Manual Processing</div>
            <div className="text-4xl font-black text-slate-400 mb-2">8–15 min</div>
            <div className="text-slate-500 text-sm leading-relaxed">
              Read report · Classify severity · Identify missing info · Check for duplicates ·
              Draft communication · Prepare checklist
            </div>
          </div>
          <div className="text-center border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">AI-Assisted Processing</div>
            <div className="text-4xl font-black text-red-400 mb-2">&lt;60 sec</div>
            <div className="text-slate-400 text-sm leading-relaxed">
              Structured triage · Missing info detected · Duplicate check · Resource recommendations ·
              Safe alert draft · Risk flags · Approval-ready plan
            </div>
          </div>
        </div>
        <p className="text-slate-600 text-xs text-center mt-3">
          AI-assisted processing — operators review and approve all outputs before action is taken.
        </p>
      </section>

      {/* Qwen Cloud Proof */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black">Q</div>
            <div>
              <div className="text-white font-semibold">Powered by Qwen Cloud</div>
              <div className="text-slate-400 text-xs">dashscope-intl.aliyuncs.com · OpenAI-compatible API</div>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-5 leading-relaxed">
            Every agent call routes through Qwen Cloud using the OpenAI-compatible endpoint.
            <strong className="text-white"> qwen-max</strong> handles all 7 agent reasoning tasks.
            <strong className="text-white"> qwen-plus</strong> handles utility and test calls.
            All outputs are validated with Zod schemas — invalid JSON is automatically retried with a repair prompt.
          </p>

          {/* Pipeline flow */}
          <div className="bg-slate-950 rounded-xl p-4 mb-5 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">Incident Report</span>
              <span className="text-slate-600">→</span>
              <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded">Qwen Agents ×7</span>
              <span className="text-slate-600">→</span>
              <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded">Zod Validation</span>
              <span className="text-slate-600">→</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded">Database</span>
              <span className="text-slate-600">→</span>
              <span className="bg-green-900 text-green-300 px-2 py-1 rounded">Human Approval</span>
              <span className="text-slate-600">→</span>
              <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded">Audit Log</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
            {[
              { label: "Agents", value: "7" },
              { label: "Model (agents)", value: "qwen-max" },
              { label: "Model (utils)", value: "qwen-plus" },
              { label: "Validation", value: "Zod + retry" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-800 rounded-lg p-3">
                <div className="text-white font-bold text-base">{s.value}</div>
                <div className="text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Agent Pipeline */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6 text-center">
          7-Agent Sequential Pipeline
        </h2>
        <div className="space-y-2">
          {AGENTS.map((agent) => (
            <div key={agent.num} className={`bg-slate-900 border ${agent.color.split(" ")[0]} rounded-xl px-5 py-4 flex items-center gap-4`}>
              <span className={`font-mono text-xs font-bold ${agent.color.split(" ")[1]} w-6 shrink-0`}>{agent.num}</span>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{agent.name}</div>
                <div className="text-slate-500 text-xs mt-0.5">{agent.role}</div>
              </div>
              <span className="text-slate-600 text-xs shrink-0">qwen-max</span>
            </div>
          ))}
          <div className="bg-green-950 border border-green-800 rounded-xl px-5 py-4 flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-green-400 w-6 shrink-0">08</span>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">Human Operator Approval</div>
              <div className="text-slate-500 text-xs mt-0.5">Review all outputs · Approve, edit, reject, or request more info · No action taken without explicit decision</div>
            </div>
            <span className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded font-semibold shrink-0">Required</span>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6 text-center">System Architecture</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-sm text-slate-400">
          <pre className="overflow-x-auto leading-relaxed whitespace-pre">{`[Operator UI]
     |
     v
[Incident Intake API]
     |
     v
[Incident Database] <-------> [Memory Store]
     |                              ^
     v                              |
[Agent Orchestrator]               |
     |                             |
     |---> [Triage Agent]          |
     |---> [Verification Agent]    |
     |---> [Duplicate Agent] ------+
     |---> [Resource Planner] ----+
     |---> [Communications Agent]
     |---> [Risk & Safety Agent]
     |---> [Decision Summary Agent]
     |
     v
[Zod Validated Structured Outputs]
     |
     v
[Human Approval UI] ---> [Audit Log]`}</pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center">
        <div className="text-slate-400 text-sm mb-1">
          <span className="text-white font-semibold">CrisisOps AI</span> — Qwen Cloud Global AI Hackathon · Track 4: Autopilot Agent
        </div>
        <div className="text-slate-600 text-xs">
          Next.js 16 · TypeScript · Tailwind CSS · Prisma · SQLite · Qwen Cloud (qwen-max / qwen-plus) · MIT License
        </div>
      </footer>
    </div>
  );
}
