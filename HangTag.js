// A garment hang-tag on a string — the "Bane Brothers" label on the customer pages.
export default function HangTag({ title = "Bane Brothers", subtitle = "Bespoke Tailoring", className = "" }) {
  return (
    <div className={`inline-block origin-top -rotate-3 ${className}`} style={{ animation: "tag-sway 5s ease-in-out infinite" }}>
      <svg viewBox="0 0 40 28" className="w-10 h-7 mx-auto -mb-1 text-brass" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M20 26 Q8 14 14 4 Q20 -2 26 4 Q32 14 20 26" />
      </svg>
      <div
        className="relative bg-card border border-brass/60 px-5 pt-5 pb-3 text-center shadow-sm"
        style={{ clipPath: "polygon(12% 0, 88% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)" }}
      >
        <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-brass/70 bg-paper" aria-hidden="true" />
        <p className="font-display text-xl leading-tight text-ink">{title}</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-brass-dark mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
