"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CHAPTERS, PLACES, type PlaceId } from "@/data/timeline";

/* ------------------------------------------------------------------ */
/*  Stilisierte Karte Mitteleuropas (viewBox 440 × 330).               */
/*  Der Marker wandert von Kapitel zu Kapitel, zurückgelegte Wege      */
/*  bleiben als feine Linien sichtbar.                                 */
/* ------------------------------------------------------------------ */

const INK = "rgba(42,37,28";
const RUST = "rgba(157,75,50";

/** Umriss Österreichs, bewusst grob und handgezeichnet wirkend */
const AUSTRIA =
  "M -18 184 L 131 175 L 175 160 L 173 121 L 205 82 L 226 63 L 277 78 L 294 44 L 330 48 L 393 58 L 413 78 L 420 126 L 390 165 L 384 189 L 363 238 L 354 262 L 327 267 L 289 272 L 244 286 L 220 276 L 140 257 L 131 233 L 89 233 L 30 247 L -24 228 Z";

/** Donau, von Passau über Enns und Krems nach Wien */
const DANUBE =
  "M 205 82 C 235 100 252 108 267 113 C 295 122 318 100 333 96 C 349 92 358 110 372 118 C 395 130 420 128 442 132";

/** Kleine Bergzeichen für die Alpen */
const ALPS: Array<[number, number]> = [
  [62, 250], [70, 225], [95, 240], [105, 258], [120, 222], [140, 210],
  [150, 238], [165, 262], [178, 250], [190, 225], [205, 205], [215, 245],
];

function smoothPath(pts: Array<{ x: number; y: number }>): string {
  if (pts.length === 2) {
    const [a, b] = pts;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const off = Math.min(26, len * 0.16);
    const cx = (a.x + b.x) / 2 - (dy / len) * off;
    const cy = (a.y + b.y) / 2 + (dx / len) * off;
    return `M ${a.x} ${a.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return d;
}

/** Reise-Etappen aus den Kapiteln ableiten (einmalig, Daten sind statisch) */
const LEGS: Array<{ at: number; d: string }> = (() => {
  const legs: Array<{ at: number; d: string }> = [];
  for (let i = 1; i < CHAPTERS.length; i++) {
    const stops: PlaceId[] = [
      CHAPTERS[i - 1].place,
      ...(CHAPTERS[i].route ?? []),
      CHAPTERS[i].place,
    ].filter((p, idx, arr) => idx === 0 || p !== arr[idx - 1]);
    if (stops.length > 1) {
      legs.push({
        at: i,
        d: smoothPath(stops.map((p) => ({ x: PLACES[p].x, y: PLACES[p].y }))),
      });
    }
  }
  return legs;
})();

export default function ScrollMap({
  activeIndex,
  visible,
}: {
  activeIndex: number; // 0 … CHAPTERS.length-1
  visible: boolean;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false); // mobile Einblendung

  const chapter = CHAPTERS[Math.min(Math.max(activeIndex, 0), CHAPTERS.length - 1)];
  const place = PLACES[chapter.place];

  const visited = useMemo(() => {
    const s = new Set<PlaceId>();
    for (let i = 0; i <= activeIndex; i++) {
      s.add(CHAPTERS[i].place);
      for (const r of CHAPTERS[i].route ?? []) s.add(r);
    }
    return s;
  }, [activeIndex]);

  const drawDur = reduced ? 0 : 1.8;

  return (
    <>
      {/* Mobil: Karte ein-/ausblenden */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="reisekarte"
        className={`fixed bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper/90 text-ink-soft backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M1 4l5-2 6 2 5-2v12l-5 2-6-2-5 2V4z M6 2v12 M12 4v12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Karte {open ? "ausblenden" : "anzeigen"}</span>
      </button>

      <aside
        id="reisekarte"
        aria-label="Karte der Lebensstationen"
        className={`fixed bottom-[4.6rem] right-4 z-30 w-[13.5rem] transition-opacity duration-700 md:bottom-6 md:right-6 md:block md:w-[15rem] xl:right-10 xl:w-[16.5rem] ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        } ${open ? "block" : "hidden"}`}
      >
        <div className="border border-line bg-paper/95 p-3 shadow-[0_1px_3px_rgba(42,37,28,0.1)] backdrop-blur-sm">
          <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-ink-faint">
            Die Wege der Familie · 1939–1955
          </p>

          <svg
            viewBox="0 0 440 330"
            className="mt-2 w-full"
            role="img"
            aria-label={`Karte — aktueller Ort: ${place.name}`}
          >
            <defs>
              <linearGradient
                id="briefeFade"
                gradientUnits="userSpaceOnUse"
                x1="372" y1="118" x2="205" y2="215"
              >
                <stop offset="0" stopColor={`${INK},0.55)`} />
                <stop offset="1" stopColor={`${INK},0)`} />
              </linearGradient>
            </defs>

            {/* Landesumriss */}
            <path
              d={AUSTRIA}
              fill={`${INK},0.03)`}
              stroke={`${INK},0.3)`}
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Donau */}
            <path d={DANUBE} fill="none" stroke={`${INK},0.16)`} strokeWidth="2.2" strokeLinecap="round" />
            {/* Alpen */}
            {ALPS.map(([x, y], i) => (
              <path
                key={i}
                d={`M ${x - 5} ${y + 3} L ${x} ${y - 3} L ${x + 5} ${y + 3}`}
                fill="none"
                stroke={`${INK},0.2)`}
                strokeWidth="1"
                strokeLinecap="round"
              />
            ))}
            {/* Demarkationslinie bei Enns */}
            <path d="M 267 58 L 267 195" stroke={`${RUST},0.3)`} strokeWidth="1" strokeDasharray="2 4" />
            {/* Kompass */}
            <g aria-hidden="true">
              <path d="M 24 36 L 24 18 M 24 18 l -4 7 M 24 18 l 4 7" stroke={`${INK},0.35)`} strokeWidth="1" fill="none" />
              <text x="24" y="48" textAnchor="middle" fontSize="9" fill={`${INK},0.4)`} className="font-sans">N</text>
            </g>
            {/* Regionen */}
            <text x="48" y="304" fontSize="10" fill={`${INK},0.35)`} className="font-serif italic">Südtirol</text>
            <text x="330" y="30" fontSize="10" fill={`${INK},0.35)`} className="font-serif italic">Mähren</text>

            {/* Zurückgelegte Wege */}
            {LEGS.filter((l) => l.at <= activeIndex).map((l) => {
              const isCurrent = l.at === activeIndex;
              return (
                <motion.path
                  key={`leg-${l.at}`}
                  d={l.d}
                  fill="none"
                  stroke={isCurrent ? `${RUST},0.85)` : `${INK},0.22)`}
                  strokeWidth={isCurrent ? 1.8 : 1.3}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: drawDur, ease: "easeInOut" }}
                />
              );
            })}

            {/* Besondere Momente */}
            <AnimatePresence>
              {chapter.mapExtra === "guben" && (
                <motion.g
                  key="guben"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 1.6 }}
                >
                  <path
                    d="M 383 62 Q 352 30 298 10"
                    fill="none"
                    stroke={`${RUST},0.7)`}
                    strokeWidth="1.3"
                    strokeDasharray="3 4"
                  />
                  <path d="M 296 2 v 12 M 290 8 h 12" stroke={`${RUST},0.85)`} strokeWidth="1.4" fill="none" />
                  <text x="284" y="26" textAnchor="end" fontSize="9.5" fill={`${INK},0.55)`} className="font-serif italic">
                    Guben, 1. April 1945
                  </text>
                </motion.g>
              )}
              {chapter.mapExtra === "abschied-sued" && (
                <motion.g
                  key="abschied"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 2 }}
                >
                  <path
                    d="M 372 118 Q 235 210 80 262"
                    fill="none"
                    stroke={`${RUST},0.6)`}
                    strokeWidth="1.3"
                    strokeDasharray="4 4"
                  />
                  <text x="180" y="215" fontSize="9.5" fill={`${INK},0.55)`} className="font-serif italic">
                    der Transportzug nach Süden
                  </text>
                </motion.g>
              )}
              {chapter.mapExtra === "briefe-sued" && (
                <motion.g
                  key="briefe"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 2 }}
                >
                  <path
                    d="M 372 118 Q 295 180 205 215"
                    fill="none"
                    stroke="url(#briefeFade)"
                    strokeWidth="1.2"
                    strokeDasharray="2 4"
                  />
                  <text x="196" y="234" fontSize="9.5" fill={`${INK},0.5)`} className="font-serif italic">
                    die Briefe, die nie ankamen
                  </text>
                </motion.g>
              )}
              {chapter.mapExtra === "radtouren" && (
                <motion.g
                  key="radtouren"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 1.6 }}
                >
                  {["M 372 118 q 46 8 58 34", "M 372 118 q 12 46 -14 60"].map((d) => (
                    <path
                      key={d}
                      d={d}
                      fill="none"
                      stroke={`${RUST},0.6)`}
                      strokeWidth="1.2"
                      strokeDasharray="1.5 3.5"
                    />
                  ))}
                </motion.g>
              )}
            </AnimatePresence>

            {/* Orte */}
            {Object.values(PLACES).map((p) => {
              const isWaypoint = p.id === "enns";
              const isVisited = visited.has(p.id);
              const isCurrent = p.id === chapter.place;
              return (
                <g key={p.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isWaypoint ? 1.8 : isVisited ? 3 : 2.4}
                    fill={isVisited ? `${INK},0.6)` : "none"}
                    stroke={isVisited ? "none" : `${INK},0.45)`}
                    strokeWidth="1"
                  />
                  <text
                    x={p.x + (p.labelDx ?? 6)}
                    y={p.y + (p.labelDy ?? -6)}
                    textAnchor={p.labelAnchor ?? "start"}
                    fontSize={isWaypoint ? 9 : 11.5}
                    fill={isCurrent ? "#7c3a26" : `${INK},0.55)`}
                    className="font-serif italic"
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}

            {/* Der wandernde Marker */}
            <motion.circle
              initial={false}
              animate={{ cx: place.x, cy: place.y }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 34, damping: 17, mass: 1.1 }
              }
              r="8.5"
              fill="none"
              stroke={`${RUST},0.35)`}
              strokeWidth="1"
            />
            <motion.circle
              initial={false}
              animate={{ cx: place.x, cy: place.y }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 34, damping: 17, mass: 1.1 }
              }
              r="4"
              fill="#9d4b32"
            />
          </svg>

          <div className="mt-2 flex items-baseline justify-between gap-2 border-t border-line pt-2">
            <span className="shrink-0 font-serif text-base italic text-ink">{place.name}</span>
            {place.region && (
              <span className="truncate text-right font-sans text-[9px] uppercase tracking-[0.12em] text-ink-faint">
                {place.region}
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
