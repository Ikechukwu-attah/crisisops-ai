"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/incidents/new", label: "New Incident", icon: "+" },
  { href: "/dashboard", label: "Dashboard", icon: "≡" },
  { href: "/memory", label: "Memory", icon: "◈" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-700 flex flex-col min-h-screen">
      <div className="p-4 border-b border-slate-700">
        <Link href="/" className="block">
          <div className="text-red-500 font-bold text-lg tracking-tight">CrisisOps</div>
          <div className="text-slate-400 text-xs">AI Incident Command</div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-red-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="text-slate-600 text-xs">Track 3: Agent Society</div>
        <div className="text-slate-600 text-xs">Powered by Qwen Cloud</div>
      </div>
    </aside>
  );
}
