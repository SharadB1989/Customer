// A literal tape-measure strip — the clearest "this is a tailor's app" signal
// there is. Used as a decorative header accent. Color inherits via currentColor.
export default function MeasuringTape({ className = "", units = 20 }) {
  const ticks = Array.from({ length: units + 1 }, (_, i) => i);
  const width = units * 20;
  return (
    <svg viewBox={`0 0 ${width} 24`} preserveAspectRatio="none" className={`w-full h-5 ${className}`} aria-hidden="true">
      <line x1="0" y1="20" x2={width} y2="20" stroke="currentColor" strokeWidth="1.5" />
      {ticks.map((i) => {
        const x = i * 20;
        const major = i % 5 === 0;
        return (
          <g key={i}>
            <line
              x1={x} y1={major ? 7 : 13} x2={x} y2="20"
              stroke="currentColor" strokeWidth={major ? 1.3 : 0.8} opacity={major ? 1 : 0.45}
            />
            {major && (
              <text x={x} y="6" fontSize="6" textAnchor="middle" fill="currentColor" fontFamily="monospace" opacity="0.8">
                {i}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
