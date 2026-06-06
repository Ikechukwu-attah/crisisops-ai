import Link from "next/link";

const AGENTS = [
  { num: "01", name: "Triage Agent", role: "Classify incident type, severity, urgency, and affected population" },
  { num: "02", name: "Verification Agent", role: "Detect missing information, contradictions, and clarifying questions" },
  { num: "03", name: "Duplicate Detection", role: "Compare against incident memory to flag related or repeated reports" },
  { num: "04", name: "Resource Planner", role: "Recommend response resource categories and immediate first actions" },
  { num: "05", name: "Communications Agent", role: "Draft internal dispatch notes and cautious public alert text" },
  { num: "06", name: "Risk & Safety Agent", role: "Evaluate safety, legal, and misinformation risks before approval" },
  { num: "07", name: "Decision Summary", role: "Generate operator checklist and recommended approval decision" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ─── Sticky Nav ─── */}
      <nav className="sticky top-0 z-50 h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm font-black tracking-tight">C</div>
          <span className="text-white font-bold text-base tracking-tight">CrisisOps <span className="text-red-400">AI</span></span>
          <span className="hidden sm:inline-flex ml-2 items-center gap-1.5 bg-red-950 border border-red-800/60 text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            Track 3 · Agent Society
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Dashboard</Link>
          <Link href="/memory" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Memory</Link>
          <Link href="/incidents/new" className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Analyze Incident
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                Qwen Cloud Hackathon 2026
              </span>
              <span className="inline-flex items-center gap-1.5 bg-red-950 border border-red-800/60 text-red-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                Track 3 · Agent Society
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Multi-agent
              <br />
              incident command
              <br />
              <span className="text-red-400">done right</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-4 max-w-lg">
              CrisisOps AI is not a chatbot. It is a Qwen-powered multi-agent command workflow that turns messy emergency reports into structured, human-approved response decisions in under 60 seconds.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-md">
              Built for cities, campuses, NGOs, and response teams where reports arrive through fragmented channels and operators need fast, verified decision support.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/incidents/new" className="bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors">
                Analyze an Incident
              </Link>
              <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors border border-slate-700">
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Right — Product Preview Mockup */}
          <div className="hidden lg:block">
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
              {/* Mock titlebar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/60 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-slate-700/60 rounded px-3 py-1 text-xs text-slate-400 font-mono">crisisops.ai/incidents/a1b2c3</div>
                </div>
              </div>
              {/* Mock incident result */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-sm">Flooding + Trapped Residents</div>
                    <div className="text-slate-500 text-xs mt-0.5">Main Street · 2 min ago</div>
                  </div>
                  <span className="bg-red-950 border border-red-800 text-red-300 text-xs font-bold px-2.5 py-1 rounded-full">CRITICAL</span>
                </div>

                {/* Agent timeline mockup */}
                <div className="bg-slate-800/50 rounded-xl p-3 space-y-2">
                  <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">Agent Pipeline</div>
                  {["Triage Agent", "Verification Agent", "Duplicate Detection", "Resource Planner"].map((name) => (
                    <div key={name} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-slate-300 text-xs">{name}</div>
                      <div className="flex-1 h-px bg-slate-700"></div>
                      <div className="text-slate-600 text-xs font-mono">qwen-max</div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
                    <div className="text-slate-300 text-xs">Communications Agent</div>
                    <div className="flex-1 h-px bg-slate-700"></div>
                    <div className="text-slate-600 text-xs font-mono">qwen-max</div>
                  </div>
                  {["Risk & Safety Agent", "Decision Summary"].map((name) => (
                    <div key={name} className="flex items-center gap-2.5 opacity-40">
                      <div className="w-4 h-4 rounded-full bg-slate-700 shrink-0"></div>
                      <div className="text-slate-500 text-xs">{name}</div>
                    </div>
                  ))}
                </div>

                {/* Approval panel mockup */}
                <div className="bg-green-950/40 border border-green-800/40 rounded-xl p-3">
                  <div className="text-xs text-green-400 font-semibold mb-1.5">Approval Required</div>
                  <div className="text-slate-400 text-xs leading-relaxed">No public alert will be sent until an operator reviews and approves this plan.</div>
                  <div className="flex gap-2 mt-2.5">
                    <div className="bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">Approve Plan</div>
                    <div className="bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-semibold">Request Info</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metrics Strip ─── */}
      <section className="border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="text-center py-6 md:py-0 md:px-10">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Manual Processing</div>
            <div className="text-4xl font-black text-slate-400 mb-2">8–15 min</div>
            <div className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
              Read · classify · verify · draft communication · check duplicates · prepare checklist
            </div>
          </div>
          <div className="text-center py-6 md:py-0 md:px-10">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">AI-Assisted Processing</div>
            <div className="text-4xl font-black text-red-400 mb-2">&lt;60 sec</div>
            <div className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Triage · verify · deduplicate · recommend resources · draft alert · flag risks · checklist
            </div>
          </div>
          <div className="text-center py-6 md:py-0 md:px-10">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">Human Control</div>
            <div className="text-4xl font-black text-green-400 mb-2">Always</div>
            <div className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              No alert sent · no resource dispatched · no action taken without explicit operator approval
            </div>
          </div>
        </div>
      </section>

      {/* ─── Qwen Cloud Proof ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — copy */}
          <div>
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Powered By</div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-5">
              Qwen Cloud at every
              <br />
              <span className="text-blue-400">step of the pipeline</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-6">
              Every agent call routes through the Qwen Cloud OpenAI-compatible endpoint. <strong className="text-white">qwen-max</strong> powers all 7 agent reasoning tasks requiring deep analysis. <strong className="text-white">qwen-plus</strong> handles utility and test calls.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              All 7 agent outputs are validated with Zod schemas before being stored. When JSON parsing fails, the client automatically retries with a repair prompt — ensuring structured, reliable output even when models produce imperfect responses.
            </p>
            <div className="space-y-3">
              {[
                { label: "Base URL", value: "dashscope-intl.aliyuncs.com/compatible-mode/v1" },
                { label: "Agent model", value: "qwen-max · all 7 agents" },
                { label: "Utility model", value: "qwen-plus · health + test routes" },
                { label: "Validation", value: "Zod schemas + JSON repair retry" },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <div>
                    <span className="text-slate-500 text-sm">{row.label}: </span>
                    <span className="text-slate-200 text-sm font-mono">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — technical card */}
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm">Q</div>
              <div>
                <div className="text-white font-bold">Qwen Cloud</div>
                <div className="text-slate-400 text-xs">OpenAI-compatible · Alibaba Cloud DashScope</div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 mb-5 overflow-x-auto">
              <div className="text-slate-500 text-xs font-mono mb-3">Pipeline flow</div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {[
                  { label: "Report", cls: "bg-slate-800 text-slate-300" },
                  { label: "→", cls: "text-slate-600" },
                  { label: "Qwen ×7", cls: "bg-blue-900 text-blue-300" },
                  { label: "→", cls: "text-slate-600" },
                  { label: "Zod", cls: "bg-purple-900 text-purple-300" },
                  { label: "→", cls: "text-slate-600" },
                  { label: "DB", cls: "bg-slate-800 text-slate-300" },
                  { label: "→", cls: "text-slate-600" },
                  { label: "Approval", cls: "bg-green-900 text-green-300" },
                  { label: "→", cls: "text-slate-600" },
                  { label: "Audit", cls: "bg-yellow-900 text-yellow-300" },
                ].map((item, i) => (
                  <span key={i} className={`${item.cls} px-2 py-1 rounded`}>{item.label}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Agents", value: "7" },
                { label: "Validation", value: "Zod" },
                { label: "Agent model", value: "qwen-max" },
                { label: "Util model", value: "qwen-plus" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-white font-black text-xl mb-1">{s.value}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              API key loaded from environment only — never committed or exposed to browser
            </div>
          </div>
        </div>
      </section>

      {/* ─── Operator Workflow ─── */}
      <section className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center mb-14">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">How It Works</div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">The operator workflow</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "Incident Intake",
                body: "Operator submits a messy, incomplete incident report — raw field text, partial descriptions, contradictory accounts.",
                accent: "text-slate-400",
                ring: "border-slate-700",
              },
              {
                step: "02",
                title: "Agent Analysis",
                body: "7 Qwen Cloud agents run sequentially in under 60 seconds — triage, verify, deduplicate, plan resources, draft comms, flag risks.",
                accent: "text-blue-400",
                ring: "border-blue-800/50",
              },
              {
                step: "03",
                title: "Human Approval",
                body: "Operator reviews all agent outputs. Chooses: Approve · Approve with Edits · Reject · Request More Info. Nothing is sent automatically.",
                accent: "text-green-400",
                ring: "border-green-800/50",
              },
              {
                step: "04",
                title: "Audit Log",
                body: "Every agent action and operator decision is written to an append-only audit log with timestamps — full accountability chain.",
                accent: "text-yellow-400",
                ring: "border-yellow-800/50",
              },
            ].map((card) => (
              <div key={card.step} className={`bg-slate-900 border ${card.ring} rounded-2xl p-6`}>
                <div className={`text-4xl font-black ${card.accent} mb-4 font-mono`}>{card.step}</div>
                <div className="text-white font-bold text-base mb-2">{card.title}</div>
                <div className="text-slate-500 text-sm leading-relaxed">{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7-Agent Grid ─── */}
      <section className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center mb-14">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">The Pipeline</div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Seven specialized agents</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              Each agent receives prior agents&apos; outputs as context. Every output is Zod-validated and stored.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {AGENTS.map((agent) => (
              <div key={agent.num} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-slate-400">
                  {agent.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{agent.name}</div>
                  <div className="text-slate-500 text-xs mt-1 leading-relaxed">{agent.role}</div>
                </div>
                <div className="text-slate-600 text-xs font-mono shrink-0 pt-0.5">qwen-max</div>
              </div>
            ))}
          </div>

          {/* Step 8 — full width, green */}
          <div className="bg-green-950/40 border border-green-800/60 rounded-xl px-5 py-4 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-900 border border-green-700 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-green-300">
              08
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">Human Operator Approval</div>
              <div className="text-slate-400 text-xs mt-1 leading-relaxed">
                Review all 7 agent outputs · Approve, Approve with Edits, Reject, or Request More Info · No action is ever taken without an explicit operator decision
              </div>
            </div>
            <span className="bg-green-900 text-green-300 text-xs px-2.5 py-1 rounded-full font-semibold shrink-0">Required</span>
          </div>
        </div>
      </section>

      {/* ─── Safety Section ─── */}
      <section className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Human-in-the-Loop</div>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-5">
                Safety is enforced
                <br />
                <span className="text-green-400">at every step</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-4">
                CrisisOps AI does not replace emergency responders. It helps operators organize messy reports, identify missing details, draft safe communication, and make faster human-approved decisions.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                No action — no public alert, no resource dispatch, no escalation — is finalized until an operator reviews and explicitly approves the plan. The Risk &amp; Safety Agent evaluates every plan before it reaches the approval stage.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-5">Safety Guarantees</div>
              <div className="space-y-4">
                {[
                  { icon: "shield", label: "No auto-sent public alerts", body: "Every communications draft is marked requiresApproval: true and shown with a prominent warning." },
                  { icon: "lock", label: "No auto-dispatched resources", body: "Resource Planner recommends categories only. A human operator decides deployment." },
                  { icon: "check", label: "Mandatory approval decision", body: "Operators must choose: Approve / Approve with Edits / Reject / Request More Info." },
                  { icon: "log", label: "Append-only audit trail", body: "All agent actions and operator decisions are logged with timestamps. Nothing is overwritten." },
                  { icon: "eye", label: "Risk evaluated before approval", body: "Risk & Safety Agent flags unverified claims, legal risks, and misinformation before operator sees the plan." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-900/60 border border-green-800 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{item.label}</div>
                      <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Memory + Audit ─── */}
      <section className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center mb-14">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Persistence</div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">Memory and accountability</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Memory */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-800 flex items-center justify-center text-purple-400 font-black text-sm">M</div>
                <div>
                  <div className="text-white font-bold">Incident Memory</div>
                  <div className="text-slate-500 text-xs">Persistent cross-incident context</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                The system maintains a persistent IncidentMemory store. When a new report arrives, the Duplicate Detection and Resource Planner agents query memory by keyword — injecting the top 3 matching records as context into their prompts.
              </p>
              <div className="space-y-2">
                {["Flood at Main Street — 42 residents evacuated", "Gas leak response — Central Market 2024", "Bridge inspection trigger — Riverside Road"].map((mem) => (
                  <div key={mem} className="flex items-center gap-2.5 bg-slate-800/50 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div>
                    <div className="text-slate-400 text-xs">{mem}</div>
                  </div>
                ))}
              </div>
              <Link href="/memory" className="inline-flex items-center gap-1.5 mt-5 text-purple-400 hover:text-purple-300 text-xs font-semibold transition-colors">
                View Memory Store →
              </Link>
            </div>

            {/* Audit Log */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-yellow-900/60 border border-yellow-800 flex items-center justify-center text-yellow-400 font-black text-sm">A</div>
                <div>
                  <div className="text-white font-bold">Audit Log</div>
                  <div className="text-slate-500 text-xs">Append-only · never modified</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                Every agent result and every operator action writes an entry to the append-only AuditLog. The full decision chain is preserved — from incident intake through final operator approval.
              </p>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { type: "incident_created", time: "10:02:01", color: "text-slate-400" },
                  { type: "agent_completed · triage-agent", time: "10:02:08", color: "text-blue-400" },
                  { type: "agent_completed · duplicate-agent", time: "10:02:24", color: "text-blue-400" },
                  { type: "analysis_complete · 7/7 agents", time: "10:02:51", color: "text-green-400" },
                  { type: "approval_submitted · APPROVED", time: "10:04:13", color: "text-green-400" },
                ].map((entry) => (
                  <div key={entry.type} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                    <div className="text-slate-600 shrink-0">{entry.time}</div>
                    <div className={`${entry.color} truncate`}>{entry.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Product Workflow ─── */}
      <section className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="text-center mb-14">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">How It Works</div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight">From messy report to approved decision</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">In under 60 seconds.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
            {[
              { label: "Incident Report", sub: "Raw field input", color: "bg-slate-800 border-slate-700 text-white", sub_color: "text-slate-500" },
              { label: "7 Qwen Agents", sub: "qwen-max · sequential", color: "bg-blue-950 border-blue-800 text-blue-200", sub_color: "text-blue-500" },
              { label: "Zod Validation", sub: "Structured output", color: "bg-slate-800 border-slate-700 text-white", sub_color: "text-slate-500" },
              { label: "Human Approval", sub: "Operator decides", color: "bg-green-950 border-green-800 text-green-200", sub_color: "text-green-600" },
              { label: "Audit Log", sub: "Full chain recorded", color: "bg-slate-800 border-slate-700 text-white", sub_color: "text-slate-500" },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-col sm:flex-row items-center">
                <div className={`border rounded-2xl px-6 py-5 text-center ${step.color} min-w-[9rem]`}>
                  <div className="font-bold text-sm leading-snug">{step.label}</div>
                  <div className={`text-xs mt-1 ${step.sub_color}`}>{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-slate-600 text-xl font-light px-3 rotate-90 sm:rotate-0">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5">Get Started</div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-5">
            Ready to see it in action?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Use one of the four pre-loaded demo scenarios to see the full 7-agent pipeline run in under 60 seconds — then approve the result and check the audit log.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/incidents/new" className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-colors">
              Analyze a Demo Incident
            </Link>
            <Link href="/dashboard" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-4 rounded-xl font-bold text-base transition-colors border border-slate-700">
              View Dashboard
            </Link>
            <Link href="/memory" className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-4 rounded-xl font-bold text-base transition-colors border border-slate-700">
              Explore Memory Store
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-xs font-black">C</div>
            <span className="text-white font-bold">CrisisOps <span className="text-red-400">AI</span></span>
          </div>
          <div className="text-slate-500 text-sm text-center">
            Qwen Cloud Global AI Hackathon 2026 · Track 3: Agent Society
          </div>
          <div className="text-slate-600 text-xs text-right">
            Next.js · TypeScript · Tailwind · Prisma · Qwen Cloud · MIT
          </div>
        </div>
      </footer>
    </div>
  );
}
