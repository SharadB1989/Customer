// A small spool-of-thread-and-needle mark, drawn as inline SVG so it needs no
// image files and recolors with the surrounding text color (currentColor).
export default function BrandMark({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="33" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M18.5 10.5 Q24 21 18.5 31.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M29.5 10.5 Q24 21 29.5 31.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="7" y1="41" x2="35" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="13" r="2" fill="currentColor" />
    </svg>
  );
}
