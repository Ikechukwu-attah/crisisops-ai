"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import SeverityBadge from "@/components/incidents/SeverityBadge";

interface Incident {
  id: string;
  title?: string | null;
  incidentType?: string | null;
  severity?: string | null;
  urgency?: string | null;
  status: string;
  reporterName?: string | null;
  createdAt: string;
  approvals?: Array<{ decision: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  ANALYZING: "bg-blue-900 text-blue-300",
  PENDING_APPROVAL: "bg-yellow-900 text-yellow-300",
  PENDING_VERIFICATION: "bg-orange-900 text-orange-300",
  APPROVED: "bg-green-900 text-green-300",
  APPROVED_WITH_EDITS: "bg-emerald-900 text-emerald-300",
  REJECTED: "bg-red-900 text-red-300",
  CLOSED: "bg-slate-700 text-slate-400",
  ANALYSIS_FAILED: "bg-red-950 text-red-400 border border-red-800",
};

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetch("/api/incidents")
      .then((r) => r.json())
      .then((data) => { setIncidents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch((e) => { setError(String(e)); setLoading(false); });
  }, []);

  const filtered = incidents.filter((inc) => {
    if (filterSeverity && inc.severity?.toLowerCase() !== filterSeverity) return false;
    if (filterType && inc.incidentType?.toLowerCase() !== filterType) return false;
    if (filterStatus && inc.status !== filterStatus) return false;
    return true;
  });

  const types = [...new Set(incidents.map((i) => i.incidentType).filter(Boolean))];
  const statuses = [...new Set(incidents.map((i) => i.status))];

  return (
    <AppShell>
      <Header
        title="Incident Dashboard"
        subtitle={
          filterSeverity || filterType || filterStatus
            ? `${filtered.length} of ${incidents.length} incidents`
            : `${incidents.length} total incidents`
        }
      />
      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
          >
            <option value="">All Severities</option>
            {["low", "medium", "high", "critical"].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t!}>{t}</option>
            ))}
          </select>
          <select
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <Link
            href="/incidents/new"
            className="ml-auto bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            + New Incident
          </Link>
        </div>

        {loading && (
          <div className="text-slate-400 text-center py-12">Loading incidents...</div>
        )}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm">{error}</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-slate-500 text-4xl mb-4">—</div>
            <div className="text-slate-400 font-medium">No incidents found</div>
            <div className="text-slate-600 text-sm mt-1">
              {incidents.length > 0 ? "Try adjusting your filters" : "Submit your first incident report to get started"}
            </div>
            <Link
              href="/incidents/new"
              className="inline-block mt-4 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
            >
              Analyze First Incident
            </Link>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900">
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">ID</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Summary</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Type</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Severity</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Status</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Reporter</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Created</th>
                  <th className="text-left text-slate-400 font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc, i) => {
                  const statusStyle = STATUS_STYLES[inc.status] ?? "bg-slate-700 text-slate-400";
                  return (
                    <tr key={inc.id} className={`border-b border-slate-700/50 hover:bg-slate-750 ${i % 2 === 0 ? "" : "bg-slate-800/50"}`}>
                      <td className="px-4 py-3 font-mono text-slate-500 text-xs">{inc.id.slice(0, 10)}</td>
                      <td className="px-4 py-3 text-slate-200 max-w-[200px] truncate">
                        {inc.title ?? <span className="text-slate-500 italic">Analysis failed</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 capitalize">{inc.incidentType ?? <span className="text-slate-600">—</span>}</td>
                      <td className="px-4 py-3">
                        {inc.severity ? <SeverityBadge severity={inc.severity} size="sm" /> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusStyle}`}>
                          {inc.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{inc.reporterName ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(inc.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/incidents/${inc.id}`}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
