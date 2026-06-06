import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

async function getHealthData() {
  const qwenConfigured =
    typeof process.env.QWEN_API_KEY === "string" &&
    process.env.QWEN_API_KEY.length > 0 &&
    process.env.QWEN_API_KEY !== "your_qwen_api_key_here";

  const qwenBaseUrl = process.env.QWEN_BASE_URL ?? "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
  const qwenAgentModel = process.env.QWEN_AGENT_MODEL ?? "qwen-max";
  const qwenModel = process.env.QWEN_MODEL ?? "qwen-plus";

  let dbOk = false;
  let incidentCount = 0;
  let memoryCount = 0;
  let pendingApproval = 0;

  try {
    [incidentCount, memoryCount, pendingApproval] = await Promise.all([
      prisma.incident.count(),
      prisma.incidentMemory.count(),
      prisma.incident.count({ where: { status: "PENDING_APPROVAL" } }),
    ]);
    dbOk = true;
  } catch { /* db unavailable */ }

  return { qwenConfigured, qwenBaseUrl, qwenAgentModel, qwenModel, dbOk, incidentCount, memoryCount, pendingApproval };
}

export default async function HealthPage() {
  const h = await getHealthData();
  const allGreen = h.qwenConfigured && h.dbOk;

  const checks = [
    {
      label: "Qwen API Key",
      ok: h.qwenConfigured,
      detail: h.qwenConfigured ? "Configured" : "Missing or placeholder — set QWEN_API_KEY",
    },
    {
      label: "Qwen Base URL",
      ok: true,
      detail: h.qwenBaseUrl,
    },
    {
      label: "Agent Model",
      ok: true,
      detail: h.qwenAgentModel,
    },
    {
      label: "Utility Model",
      ok: true,
      detail: h.qwenModel,
    },
    {
      label: "Database",
      ok: h.dbOk,
      detail: h.dbOk ? "SQLite · Prisma ORM · Connected" : "Connection failed — check DATABASE_URL",
    },
  ];

  const stats = [
    { label: "Total Incidents", value: String(h.incidentCount) },
    { label: "Pending Approval", value: String(h.pendingApproval) },
    { label: "Memory Records", value: String(h.memoryCount) },
    { label: "Agents per Run", value: "7" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="h-14 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-xs font-black">C</div>
          <span className="text-white font-bold text-sm">CrisisOps <span className="text-red-400">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link>
          <Link href="/incidents/new" className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
            New Incident
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Status headline */}
        <div className="flex items-center gap-4 mb-10">
          <div className={`w-4 h-4 rounded-full shrink-0 ${allGreen ? "bg-green-400" : "bg-red-500"}`} />
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight">
              {allGreen ? "All Systems Operational" : "System Issue Detected"}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              CrisisOps AI · /health · {new Date().toUTCString()}
            </p>
          </div>
        </div>

        {/* Checks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-slate-800">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Service Checks</div>
          </div>
          <div className="divide-y divide-slate-800">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center gap-4 px-5 py-3.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${check.ok ? "bg-green-400" : "bg-red-500"}`} />
                <div className="text-white text-sm font-medium w-36 shrink-0">{check.label}</div>
                <div className={`text-sm font-mono truncate ${check.ok ? "text-slate-400" : "text-red-400"}`}>
                  {check.detail}
                </div>
                <div className={`ml-auto text-xs font-bold shrink-0 ${check.ok ? "text-green-400" : "text-red-400"}`}>
                  {check.ok ? "OK" : "FAIL"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-white text-2xl font-black mb-1">{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* JSON endpoint note */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">JSON Endpoint</div>
          <div className="font-mono text-sm text-slate-300">GET /api/health</div>
          <div className="mt-2 bg-slate-950 rounded-lg px-4 py-3 font-mono text-xs text-slate-400 leading-relaxed">
            {`{ "status": "ok", "service": "crisisops-ai", "qwenConfigured": ${h.qwenConfigured}, "host": "alibaba-cloud-ready" }`}
          </div>
        </div>
      </div>
    </div>
  );
}
