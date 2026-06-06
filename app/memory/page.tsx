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
      <Header title="Incident Memory" subtitle="Persistent memory used to inform agent reasoning" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-slate-400 text-sm">{memories.length} memory records</div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Re-seed Demo Memory"}
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm mb-4">{error}</div>
        )}

        {loading && (
          <div className="text-slate-400 text-center py-12">Loading memory records...</div>
        )}

        {!loading && memories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-slate-500 text-4xl mb-4">◈</div>
            <div className="text-slate-400 font-medium">No memory records found</div>
            <div className="text-slate-600 text-sm mt-1">Seed demo memory to populate this panel</div>
            <button
              onClick={handleSeed}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold"
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
              return (
                <div key={type}>
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 capitalize">
                    {type} Memory ({records.length})
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
