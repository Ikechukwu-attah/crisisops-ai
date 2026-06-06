"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";

const DEMO_SCENARIOS = [
  {
    label: "Flood + Vulnerable People",
    color: "bg-blue-900 border-blue-700 text-blue-200 hover:bg-blue-800",
    data: {
      rawReport:
        "Heavy flooding near Main Street market. Power is out. A resident says elderly people are trapped inside a nearby apartment building. Road access is blocked by water.",
      reporterName: "Field Officer A",
      reporterContact: "radio-unit-4",
      locationRaw: "Main Street market area",
      incidentType: "flood",
    },
  },
  {
    label: "Conflicting Fire Report",
    color: "bg-orange-900 border-orange-700 text-orange-200 hover:bg-orange-800",
    data: {
      rawReport:
        "Someone reported smoke near the old warehouse, but another message says it may only be dust from construction. No flames seen. People are gathering nearby.",
      reporterName: "Dispatch Center",
      reporterContact: "dispatch-01",
      locationRaw: "Old warehouse district",
      incidentType: "fire",
    },
  },
  {
    label: "Duplicate Utility Outage",
    color: "bg-yellow-900 border-yellow-700 text-yellow-200 hover:bg-yellow-800",
    data: {
      rawReport:
        "Lights are out again around East Junction. Same transformer area as yesterday. Traffic signals are down and cars are stuck.",
      reporterName: "Traffic Control",
      reporterContact: "traffic-control-2",
      locationRaw: "East Junction",
      incidentType: "utility",
    },
  },
  {
    label: "Medical Event — Public Event",
    color: "bg-red-900 border-red-700 text-red-200 hover:bg-red-800",
    data: {
      rawReport:
        "At the city sports field, several people feel dizzy during an outdoor event. It is very hot. Water supplies are low. No confirmed severe injuries yet.",
      reporterName: "Event Security",
      reporterContact: "event-security-1",
      locationRaw: "City sports field",
      incidentType: "medical",
    },
  },
];

export default function NewIncidentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    rawReport: "",
    reporterName: "",
    reporterContact: "",
    locationRaw: "",
    incidentType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fillScenario(scenario: (typeof DEMO_SCENARIOS)[0]) {
    setForm(scenario.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.rawReport.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/incidents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      router.push(`/incidents/${data.incidentId}`);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <Header title="New Incident" subtitle="Submit a raw incident report for multi-agent analysis" />
      <div className="p-6 max-w-3xl mx-auto">
        {/* Demo scenarios */}
        <div className="mb-6">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Demo Scenarios — Click to fill
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_SCENARIOS.map((s) => (
              <button
                key={s.label}
                onClick={() => fillScenario(s)}
                className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${s.color}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              Raw Incident Report <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm resize-none focus:outline-none focus:border-blue-500 leading-relaxed"
              rows={6}
              placeholder="Paste or type the raw incident report here. Include any details you have, even if incomplete..."
              value={form.rawReport}
              onChange={(e) => setForm((f) => ({ ...f, rawReport: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Reporter Name</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Field Officer, Dispatcher..."
                value={form.reporterName}
                onChange={(e) => setForm((f) => ({ ...f, reporterName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Reporter Contact</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Radio unit, phone, email..."
                value={form.reporterContact}
                onChange={(e) => setForm((f) => ({ ...f, reporterContact: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Location Hint</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Street, area, landmark..."
                value={form.locationRaw}
                onChange={(e) => setForm((f) => ({ ...f, locationRaw: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Incident Category <span className="text-slate-500">(optional)</span>
              </label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                value={form.incidentType}
                onChange={(e) => setForm((f) => ({ ...f, incidentType: e.target.value }))}
              >
                <option value="">Auto-detect</option>
                <option value="flood">Flood</option>
                <option value="fire">Fire</option>
                <option value="medical">Medical</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="security">Security</option>
                <option value="utility">Utility Outage</option>
                <option value="weather">Severe Weather</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !form.rawReport.trim()}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Agents are analyzing your report...
              </span>
            ) : (
              "Run Agent Analysis"
            )}
          </button>
        </form>

        {loading && (
          <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="text-slate-400 text-sm font-semibold mb-3">Agent Pipeline Running...</div>
            <div className="space-y-2">
              {["Triage Agent", "Verification Agent", "Duplicate Detection", "Resource Planner", "Communications Agent", "Risk & Safety Agent", "Decision Summary"].map(
                (agent) => (
                  <div key={agent} className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {agent}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
