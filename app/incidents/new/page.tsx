"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";

const DEMO_SCENARIOS = [
  {
    label: "Flooding + Trapped Residents",
    tag: "Tests: triage · missing info · memory · resource planning",
    color: "bg-blue-950 border-blue-700 text-blue-200 hover:border-blue-500",
    icon: "~",
    data: {
      rawReport:
        "Flooding around Main Street. Water is entering the ground floor of an apartment building. Power is out. Road access is blocked. Elderly residents may be trapped inside.",
      reporterName: "Field Officer A",
      reporterContact: "radio-unit-4",
      locationRaw: "Main Street apartment area",
      incidentType: "flood",
    },
  },
  {
    label: "Conflicting Fire / Gas Leak",
    tag: "Tests: contradiction detection · verification risk · unverified claims",
    color: "bg-orange-950 border-orange-700 text-orange-200 hover:border-orange-500",
    icon: "!",
    data: {
      rawReport:
        "People are reporting a fire near Central Market, but another caller says it may be a gas leak. Smoke is visible. The exact location is unclear, possibly near the east entrance.",
      reporterName: "Dispatch Center",
      reporterContact: "dispatch-01",
      locationRaw: "Central Market east entrance",
      incidentType: "fire",
    },
  },
  {
    label: "Duplicate Flooding Report",
    tag: "Tests: duplicate detection · merge recommendation · location overlap",
    color: "bg-yellow-950 border-yellow-700 text-yellow-200 hover:border-yellow-500",
    icon: "=",
    data: {
      rawReport:
        "Another message came in about flooding near Main Street. Caller says water is rising fast and people are still inside the same apartment building.",
      reporterName: "Community Hotline",
      reporterContact: "hotline-dispatch",
      locationRaw: "Main Street",
      incidentType: "flood",
    },
  },
  {
    label: "Rumor / Misinformation Risk",
    tag: "Tests: risk flagging · conservative alert · approval enforcement",
    color: "bg-red-950 border-red-700 text-red-200 hover:border-red-500",
    icon: "?",
    data: {
      rawReport:
        "There are rumors online that a bridge has collapsed near Riverside Road. Traffic is stopped, but there is no official confirmation yet.",
      reporterName: "Social Media Monitor",
      reporterContact: "monitor-team",
      locationRaw: "Riverside Road bridge",
      incidentType: "infrastructure",
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
    if (!form.rawReport.trim()) {
      setError("Report text is required. Paste or type the incident report before running analysis.");
      return;
    }
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

        {/* Demo scenario section */}
        <div className="mb-6 bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-white text-sm font-semibold">Demo Scenarios</div>
            <span className="bg-blue-900 text-blue-300 text-xs px-2 py-0.5 rounded font-medium">Click to fill</span>
          </div>
          <p className="text-slate-500 text-xs mb-4">
            Demo scenarios are designed to test triage, verification, duplicate detection, memory, risk review, and human approval.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_SCENARIOS.map((s) => (
              <button
                key={s.label}
                onClick={() => fillScenario(s)}
                className={`text-left px-4 py-3 rounded-lg border transition-colors ${s.color}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-black w-5">{s.icon}</span>
                  <span className="text-sm font-semibold">{s.label}</span>
                </div>
                <div className="text-xs opacity-60 pl-7">{s.tag}</div>
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
              placeholder="Paste or type the raw incident report here. Include any details you have, even if incomplete or contradictory..."
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
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Agents analyzing report...
              </span>
            ) : (
              "Run Agent Analysis"
            )}
          </button>
        </form>

        {loading && (
          <div className="mt-5 bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-slate-300 text-sm font-semibold">Qwen Cloud Agent Pipeline Running</span>
            </div>
            <div className="space-y-2.5">
              {[
                { num: "01", name: "Triage Agent" },
                { num: "02", name: "Verification Agent" },
                { num: "03", name: "Duplicate Detection Agent" },
                { num: "04", name: "Resource Planner Agent" },
                { num: "05", name: "Communications Agent" },
                { num: "06", name: "Risk & Safety Agent" },
                { num: "07", name: "Decision Summary Agent" },
              ].map((agent) => (
                <div key={agent.num} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-slate-600 text-xs w-5">{agent.num}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <span className="text-slate-400">{agent.name}</span>
                  <span className="text-slate-600 text-xs ml-auto">qwen-max</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-slate-600">
              Each agent validates output with Zod · Invalid JSON is retried with a repair prompt
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
