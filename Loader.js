// A small spinning-bobbin loading indicator, used in place of plain "Loading…" text.
export default function Loader({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-8 text-muted ${className}`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-brass spool-spin" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="12 10" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );
}
