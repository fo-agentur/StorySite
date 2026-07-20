"use client";

/**
 * Links: die dünne Zeitlinie mit mitlaufendem Jahr (Desktop).
 * Oben: feine Fortschrittslinie; mobil zusätzlich ein Jahres-Chip.
 * Rein informativ — für Screenreader stehen die Jahre in den Kapiteln.
 */
export default function YearIndicator({
  year,
  progress,
  visible,
  label,
}: {
  year: number;
  progress: number;
  visible: boolean;
  label: string;
}) {
  return (
    <>
      {/* Fortschritt ganz oben */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-30 h-[2px]">
        <div
          className="h-full bg-rust/80"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>

      {/* Desktop: Zeitleiste links */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 transition-opacity duration-700 lg:flex xl:left-10 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="tabular font-serif text-[2.5rem] leading-none text-ink">
          {year}
        </span>
        <div className="relative h-44 w-px overflow-hidden bg-ink/15">
          <div
            className="absolute left-0 top-0 w-full bg-rust"
            style={{ height: `${(progress * 100).toFixed(2)}%` }}
          />
        </div>
        <div className="flex h-44 items-start justify-center">
          <span
            className="rotate-180 whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.26em] text-ink-soft"
            style={{ writingMode: "vertical-rl" }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Mobil: Jahres-Chip oben rechts */}
      <div
        aria-hidden="true"
        className={`fixed right-4 top-4 z-30 transition-opacity duration-700 lg:hidden ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="tabular border border-line bg-paper/85 px-3 py-1 font-serif text-lg text-ink backdrop-blur-sm">
          {year}
        </span>
      </div>
    </>
  );
}
