"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import MemoryInsightCard from "@/components/memory/MemoryInsightCard";

interface MemoryRecord {
  id: string;
  memoryType: string;
  title: string;
  content: string;
  tags: string;
  createdAt: string;
}

const MEMORY_TYPES = ["incident", "location", "decision", "template"];

const MEMORY_TYPE_META: Record<string, { label: string; desc: string; color: string }> = {
  incident: {
    label: "Incident Memory",
    desc: "Past incidents with outcomes, resource use, and resolution notes.",
    color: "text-blue-300",
  },
  location: {
    label: "Location Memory",
    desc: "Recurring problem areas, known infrastructure weaknesses, and repeated hazard zones.",
    color: "text-purple-300",
  },
  decision: {
    label: "Decision Memory",
    desc: "Prior operator approvals, rejected recommendations, and edited alert templates.",
    color: "text-green-300",
  },
  template: {
    label: "Template Memory",
    desc: "Approved public alert formats and internal dispatch message templates.",
    color: "text-orange-300",
  },
};

export default function MemoryPage() {
  const [memories, setMemories] = useState<MemoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState("");

  async function loadMemories() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/memory");
      const data = await res.json();
      setMemories(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await fetch("/api/memory/seed", { method: "POST" });
      await loadMemories();
    } catch (e) {
      setError(String(e));
    } finally {
      setSeeding(false);
    }
  }

  useEffect(() => { loadMemories(); }, []);

  const grouped = MEMORY_TYPES.reduce<Record<string, MemoryRecord[]>>((acc, type) => {
    acc[type] = memories.filter((m) => m.memoryType === type);
    return acc;
  }, {});

  return (
    <AppShell>
      <Header title="Incident Memory" subtitle="Persistent cross-session memory that informs agent reasoning" />
      <div className="p-6">

        {/* Explanation banner */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-white font-semibold mb-2 flex items-center gap-2">
                <span className="text-purple-400 font-bold text-base">M</span>
                How Memory Works
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Incident memory helps CrisisOps AI recognize recurring locations, repeated hazards, similar past reports,
                and historical response patterns. When a new incident is analyzed, the orchestrator retrieves the top 3
                most relevant memory records by keyword match and injects them into the Duplicate Detection, Resource Planner,
                and Triage agent prompts.
              </p>
            </div>
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
            >
              {seeding ? "Seeding..." : "Re-seed Demo Memory"}
            </button>
          </div>

          {/* Memory type legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700">
            {MEMORY_TYPES.map((type) => {
              const meta = MEMORY_TYPE_META[type];
              return (
                <div key={type} className="text-xs">
                  <div className={`font-semibold mb-0.5 ${meta.color}`}>{meta.label}</div>
                  <div className="text-slate-500">{meta.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-slate-400 text-sm">
            <span className="text-white font-bold">{memories.length}</span> memory records
          </div>
          {MEMORY_TYPES.map((type) => {
            const count = grouped[type]?.length ?? 0;
            if (!count) return null;
            const meta = MEMORY_TYPE_META[type];
            return (
              <div key={type} className="text-xs text-slate-500">
                <span className={`font-semibold ${meta.color}`}>{count}</span> {type}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm mb-4">{error}</div>
        )}

        {loading && (
          <div className="text-slate-400 text-center py-12">Loading memory records...</div>
        )}

        {!loading && memories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-slate-600 text-5xl mb-4 font-black">M</div>
            <div className="text-slate-400 font-medium mb-1">No memory records found</div>
            <div className="text-slate-600 text-sm mb-4">Seed demo memory to populate this panel and enable memory-informed agent reasoning.</div>
            <button
              onClick={handleSeed}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
            >
              Seed Demo Memory
            </button>
          </div>
        )}

        {!loading && memories.length > 0 && (
          <div className="space-y-8">
            {MEMORY_TYPES.map((type) => {
              const records = grouped[type];
              if (!records?.length) return null;
              const meta = MEMORY_TYPE_META[type];
              return (
                <div key={type}>
                  <div className="mb-3">
                    <div className={`text-sm font-semibold ${meta.color}`}>
                      {meta.label} <span className="text-slate-600 font-normal">({records.length})</span>
                    </div>
                    <div className="text-slate-600 text-xs mt-0.5">{meta.desc}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {records.map((m) => (
                      <MemoryInsightCard key={m.id} memory={m} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
