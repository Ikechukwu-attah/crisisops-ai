"use client";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <div>
        {title && <h1 className="text-white font-semibold text-lg">{title}</h1>}
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          System Online
        </span>
      </div>
    </header>
  );
}
