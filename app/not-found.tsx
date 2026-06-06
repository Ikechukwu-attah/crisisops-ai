import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-slate-700 text-8xl font-black mb-4 tracking-tight">404</div>
        <h1 className="text-white text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          This incident or page does not exist. It may have been deleted or the ID is incorrect.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/incidents/new"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            New Incident
          </Link>
        </div>
      </div>
    </div>
  );
}
