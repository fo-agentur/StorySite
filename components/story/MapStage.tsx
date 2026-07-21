"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CHAPTERS, PLACES, type PlaceId } from "@/data/timeline";

/* ====================================================================
   DIE KARTE ALS BÜHNE
   Vollflächige, alt anmutende Karte Mitteleuropas (viewBox 440 × 330).
   Eine „Kamera“ fliegt beim Scrollen von Station zu Station.
   Ab dem Kriegsende erscheinen die vier Besatzungszonen (1945–1955).
   ==================================================================== */

const INK = "rgba(42,37,28";
const RUST = "rgba(157,75,50";
const CX = 220; // Bildmitte im viewBox-Raum
const CY = 165;

/** Umriss Österreichs, bewusst grob wie von Hand gezeichnet */
const AUSTRIA =
  "M -18 184 L 131 175 L 175 160 L 173 121 L 205 82 L 226 63 L 277 78 L 294 44 L 330 48 L 393 58 L 413 78 L 420 126 L 390 165 L 384 189 L 363 238 L 354 262 L 327 267 L 289 272 L 244 286 L 220 276 L 140 257 L 131 233 L 89 233 L 30 247 L -24 228 Z";

/** Donau von Passau über Enns und Krems nach Wien */
const DANUBE =
  "M 205 82 C 235 100 252 108 267 113 C 295 122 318 100 333 96 C 349 92 358 110 372 118 C 395 130 420 128 442 132";

/** Weitere Flüsse: Inn, Etsch, Thaya, March, Drau */
const RIVERS = [
  "M 24 252 C 55 228 70 212 83 207 C 105 196 122 186 129 176 C 132 148 170 100 204 81",
  "M 30 247 C 45 252 58 258 69 265 C 76 271 79 275 80 281 C 76 292 70 301 66 310",
  "M 300 58 C 315 52 330 54 340 56 C 360 60 375 58 388 62",
  "M 408 50 C 412 70 414 95 417 118",
  "M 165 260 C 200 262 240 268 274 272 C 295 274 315 275 333 277",
];

/** Deterministischer Zufall (gleich auf Server und Client) */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gebirgsschraffen für den Alpenbogen */
const HACHURES: Array<[number, number, number]> = (() => {
  const rnd = mulberry(1911);
  const marks: Array<[number, number, number]> = [];
  for (let i = 0; i < 46; i++) {
    marks.push([16 + rnd() * 244, 194 + rnd() * 74, (rnd() - 0.5) * 34]);
  }
  for (let i = 0; i < 18; i++) {
    marks.push([20 + rnd() * 150, 252 + rnd() * 52, (rnd() - 0.5) * 34]);
  }
  return marks;
})();

/** Landschafts-Beschriftungen; Niederdonau heißt ab 1945 wieder Niederösterreich */
const REGIONS: Array<{ t: string; x: number; y: number; s?: number }> = [
  { t: "TIROL", x: 100, y: 192 },
  { t: "SALZBURG", x: 190, y: 150 },
  { t: "KÄRNTEN", x: 238, y: 263 },
  { t: "STEIERMARK", x: 322, y: 224 },
  { t: "BAYERN", x: 118, y: 88 },
  { t: "BÖHMEN", x: 252, y: 22 },
  { t: "MÄHREN", x: 366, y: 26 },
  { t: "UNGARN", x: 414, y: 180, s: 8 },
  { t: "SÜDTIROL", x: 76, y: 298 },
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

/** Ab diesem Kapitel zeigt die Karte die Besatzungszonen (Kriegsende) */
const ZONEN_AB = Math.max(0, CHAPTERS.findIndex((c) => c.id === "kriegsende"));

/** Kamerafahrten: wohin die Karte pro Kapitel blickt */
const CAMERA: Record<string, { x: number; y: number; z: number }> = {
  option: { x: 95, y: 248, z: 1.9 },
  geburt: { x: 362, y: 122, z: 2.2 },
  drosendorf: { x: 330, y: 68, z: 2.1 },
  ziegelwerk: { x: 372, y: 78, z: 2.1 },
  scheidung: { x: 362, y: 62, z: 2.0 },
  vater: { x: 336, y: 34, z: 1.6 },
  kriegsende: { x: 295, y: 150, z: 1.25 },
  abschied: { x: 212, y: 190, z: 1.12 },
  nachkriegswien: { x: 366, y: 122, z: 2.3 },
  solbadhall: { x: 226, y: 158, z: 1.35 },
  schuljahre: { x: 352, y: 114, z: 1.95 },
  oma: { x: 368, y: 126, z: 2.25 },
  konsulat: { x: 215, y: 172, z: 1.15 },
  freiheit: { x: 384, y: 132, z: 1.8 },
};
const OVERVIEW = { x: CX, y: CY, z: 1.0 };

export default function MapStage({
  nodeIndex,
  year,
  progress,
}: {
  nodeIndex: number; // 0 = Prolog, 1…n = Kapitel, n+1 = Ausklang
  year: number;
  progress: number;
}) {
  const reduced = useReducedMotion();

  const chapterIndex = Math.min(Math.max(nodeIndex - 1, 0), CHAPTERS.length - 1);
  const chapter = CHAPTERS[chapterIndex];
  const inStory = nodeIndex >= 1 && nodeIndex <= CHAPTERS.length;
  const isOverview = nodeIndex === 0 || nodeIndex > CHAPTERS.length;

  // Die Karte hat jetzt den ganzen Schirm für sich — die Kamera zielt
  // beim Ankommen direkt auf den Ort, ohne Ausweichmanöver für Text.
  const cam = isOverview ? OVERVIEW : (CAMERA[chapter.id] ?? { x: PLACES[chapter.place].x, y: PLACES[chapter.place].y, z: 2.1 });

  const showZones = inStory && chapterIndex >= ZONEN_AB;
  const place = PLACES[chapter.place];
  const visited = new Set<PlaceId>();
  for (let i = 0; i <= chapterIndex; i++) {
    visited.add(CHAPTERS[i].place);
    for (const r of CHAPTERS[i].route ?? []) visited.add(r);
  }

  // Bewusst reines CSS statt Framer Motion für die Elemente, deren Ziel sich
  // über Re-Renders hinweg ändert (Kamera, Zonen, Marker, Niederdonau-Text):
  // In diesem Aufbau griff Framers `animate`-Prop bei bereits gemounteten
  // SVG-<g>/<text>-Elementen nicht zuverlässig, sobald sich nur die
  // Zielwerte änderten (neu gemountete Elemente, z. B. die Routenlinien,
  // waren davon nicht betroffen). Eine simple CSS-Transition ist hier
  // robuster und exakt genauso ruhig.
  const camTx = CX - cam.x * cam.z;
  const camTy = CY - cam.y * cam.z;
  const camTransformCss = `translate(${camTx}px, ${camTy}px) scale(${cam.z})`;
  const camTransitionCss = reduced ? "none" : "transform 2.6s cubic-bezier(0.3,0,0.16,1)";
  const zonesTransitionCss = reduced ? "none" : "opacity 2.2s ease";
  const markerTransformCss = `translate(${place.x}px, ${place.y}px)`;
  const markerTransitionCss = reduced ? "none" : "transform 1.15s cubic-bezier(0.34,1.5,0.64,1)";

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <svg
        viewBox="0 0 440 330"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <radialGradient id="parchment" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#f6f0de" />
            <stop offset="62%" stopColor="#f2ead4" />
            <stop offset="100%" stopColor="#e7dcbf" />
          </radialGradient>
          <linearGradient id="briefeFade" gradientUnits="userSpaceOnUse" x1="372" y1="118" x2="205" y2="215">
            <stop offset="0" stopColor={`${INK},0.55)`} />
            <stop offset="1" stopColor={`${INK},0)`} />
          </linearGradient>
        </defs>

        {/* ---- Kamera: alles hierin bewegt sich wie ein Kartenblatt ---- */}
        <g
          style={{
            transform: camTransformCss,
            transformOrigin: "0px 0px",
            transition: camTransitionCss,
            willChange: "transform",
          }}
        >
          {/* Papier */}
          <rect x="-140" y="-110" width="720" height="560" fill="url(#parchment)" />
          <ellipse cx="60" cy="40" rx="90" ry="50" fill={`${INK},0.014)`} />
          <ellipse cx="380" cy="270" rx="110" ry="60" fill={`${INK},0.012)`} />
          <ellipse cx="240" cy="150" rx="140" ry="90" fill={`${INK},0.008)`} />

          {/* Gradnetz */}
          {[-95, -40, 15, 70, 125, 180, 235, 290, 345, 400, 455, 510].map((gx) => (
            <line key={`gv${gx}`} x1={gx} y1={-110} x2={gx} y2={450} stroke={`${INK},0.05)`} strokeWidth="0.6" />
          ))}
          {[-75, -20, 35, 90, 145, 200, 255, 310, 365, 420].map((gy) => (
            <line key={`gh${gy}`} x1={-140} y1={gy} x2={580} y2={gy} stroke={`${INK},0.05)`} strokeWidth="0.6" />
          ))}

          {/* Landesumriss */}
          <path d={AUSTRIA} fill={`${INK},0.028)`} stroke={`${INK},0.4)`} strokeWidth="1.2" strokeLinejoin="round" />
          {/* zweite, leicht versetzte Linie: wie nachgezogene Tusche */}
          <path d={AUSTRIA} fill="none" stroke={`${INK},0.12)`} strokeWidth="2.6" strokeLinejoin="round" />

          {/* Flüsse */}
          <path d={DANUBE} fill="none" stroke={`${INK},0.22)`} strokeWidth="2.4" strokeLinecap="round" />
          <path d={DANUBE} fill="none" stroke={`${INK},0.1)`} strokeWidth="4.2" strokeLinecap="round" />
          {RIVERS.map((d) => (
            <path key={d} d={d} fill="none" stroke={`${INK},0.16)`} strokeWidth="1.3" strokeLinecap="round" />
          ))}
          <text x="252" y="93" fontSize="7.5" fill={`${INK},0.4)`} className="font-serif italic" transform="rotate(14 252 93)">Donau</text>
          {/* Neusiedler See */}
          <ellipse cx="402" cy="152" rx="5" ry="9" transform="rotate(14 402 152)" fill={`${INK},0.1)`} stroke={`${INK},0.22)`} strokeWidth="0.7" />

          {/* Alpenschraffen */}
          {HACHURES.map(([x, y, r], i) => (
            <path
              key={i}
              d={`M ${x - 5} ${y + 2.8} L ${x} ${y - 3.4} L ${x + 5} ${y + 2.8}`}
              fill="none"
              stroke={`${INK},0.2)`}
              strokeWidth="0.9"
              strokeLinecap="round"
              transform={`rotate(${r} ${x} ${y})`}
            />
          ))}

          {/* Regionen */}
          {REGIONS.map((r) => (
            <text
              key={r.t}
              x={r.x}
              y={r.y}
              fontSize={r.s ?? 9.5}
              letterSpacing="2.6"
              textAnchor="middle"
              fill={`${INK},0.3)`}
              className="font-serif"
            >
              {r.t}
            </text>
          ))}
          {/* Niederdonau / Niederösterreich — die Karte wechselt den Namen mit der Geschichte */}
          <text
            x={335} y={90} fontSize="9.5" letterSpacing="2.6" textAnchor="middle"
            fill={`${INK},0.3)`} className="font-serif"
            style={{ opacity: showZones ? 0 : 1, transition: zonesTransitionCss }}
          >
            NIEDERDONAU
          </text>
          <text
            x={335} y={90} fontSize="8.5" letterSpacing="1.8" textAnchor="middle"
            fill={`${INK},0.3)`} className="font-serif"
            style={{ opacity: showZones ? 1 : 0, transition: zonesTransitionCss }}
          >
            NIEDERÖSTERREICH
          </text>

          {/* ---- Besatzungszonen, ab dem Kriegsende 1945 ---- */}
          <g style={{ opacity: showZones ? 1 : 0, transition: zonesTransitionCss }}>
            {/* sowjetische Zone: zarte Tönung östlich der Enns */}
            <path
              d="M 267 61 L 294 44 L 330 48 L 393 58 L 413 78 L 420 126 L 390 165 L 384 189 L 373 214 L 340 240 L 300 245 L 268 244 Z"
              fill={`${RUST},0.045)`}
            />
            {/* Zonengrenzen */}
            <path d="M 131 176 C 138 200 143 218 147 243" fill="none" stroke={`${INK},0.4)`} strokeWidth="1" strokeDasharray="5 3" />
            <path d="M 147 243 C 200 236 235 240 268 244 C 300 248 330 243 373 214" fill="none" stroke={`${INK},0.4)`} strokeWidth="1" strokeDasharray="5 3" />
            <path d="M 267 60 L 267 194" stroke={`${RUST},0.65)`} strokeWidth="1.4" strokeDasharray="5 3" />
            <text x="261" y="168" fontSize="6.5" letterSpacing="1.6" fill={`${RUST},0.7)`} className="font-sans" transform="rotate(-90 261 168)">
              DEMARKATIONSLINIE
            </text>
            {/* Zonen-Beschriftung */}
            <text x="96" y="214" fontSize="7" letterSpacing="1.7" textAnchor="middle" fill={`${INK},0.42)`} className="font-sans">FRANZÖSISCHE ZONE</text>
            <text x="202" y="128" fontSize="7" letterSpacing="1.7" textAnchor="middle" fill={`${INK},0.42)`} className="font-sans">AMERIKANISCHE ZONE</text>
            <text x="330" y="104" fontSize="7" letterSpacing="1.7" textAnchor="middle" fill={`${RUST},0.6)`} className="font-sans">SOWJETISCHE ZONE</text>
            <text x="258" y="256" fontSize="7" letterSpacing="1.7" textAnchor="middle" fill={`${INK},0.42)`} className="font-sans">BRITISCHE ZONE</text>
            {/* Wien: geteilt in vier Sektoren */}
            <circle cx={PLACES.wien.x} cy={PLACES.wien.y} r="9.5" fill="none" stroke={`${RUST},0.5)`} strokeWidth="0.8" strokeDasharray="2.5 2.5" />
          </g>

          {/* ---- Die Reise ---- */}
          {inStory &&
            LEGS.filter((l) => l.at <= chapterIndex).map((l) => {
              const isCurrent = l.at === chapterIndex;
              return (
                <motion.path
                  key={`leg-${l.at}`}
                  d={l.d}
                  fill="none"
                  stroke={isCurrent ? `${RUST},0.9)` : `${INK},0.3)`}
                  strokeWidth={isCurrent ? 2 : 1.4}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduced ? 0 : 2, ease: "easeInOut" }}
                />
              );
            })}

          {/* Besondere Momente */}
          {inStory && chapter.mapExtra === "guben" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 1.8 }}>
              <path d="M 383 62 Q 352 30 298 10" fill="none" stroke={`${RUST},0.75)`} strokeWidth="1.4" strokeDasharray="3 4" />
              <path d="M 296 1 v 13 M 289.5 7.5 h 13" stroke={`${RUST},0.9)`} strokeWidth="1.5" fill="none" />
              <text x="286" y="24" textAnchor="end" fontSize="9" fill={`${INK},0.6)`} className="font-serif italic">Guben, 1. April 1945</text>
            </motion.g>
          )}
          {inStory && chapter.mapExtra === "abschied-sued" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 2 }}>
              <path d="M 372 118 Q 235 210 80 262" fill="none" stroke={`${RUST},0.65)`} strokeWidth="1.4" strokeDasharray="4 4" />
              <text x="178" y="216" fontSize="9" fill={`${INK},0.6)`} className="font-serif italic">der Transportzug nach Süden</text>
            </motion.g>
          )}
          {inStory && chapter.mapExtra === "briefe-sued" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 2 }}>
              <path d="M 372 118 Q 295 180 205 215" fill="none" stroke="url(#briefeFade)" strokeWidth="1.3" strokeDasharray="2 4" />
              <text x="196" y="233" fontSize="9" fill={`${INK},0.55)`} className="font-serif italic">die Briefe, die nie ankamen</text>
            </motion.g>
          )}
          {inStory && chapter.mapExtra === "radtouren" && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 1.6 }}>
              {["M 372 118 q 46 8 58 34", "M 372 118 q 12 46 -14 60"].map((d) => (
                <path key={d} d={d} fill="none" stroke={`${RUST},0.65)`} strokeWidth="1.3" strokeDasharray="1.5 3.5" />
              ))}
            </motion.g>
          )}

          {/* Orte */}
          {Object.values(PLACES).map((p) => {
            const isWaypoint = p.id === "enns";
            const isVisited = visited.has(p.id) && inStory;
            const isCurrent = inStory && p.id === chapter.place;
            return (
              <g key={p.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isWaypoint ? 1.8 : isVisited ? 3 : 2.4}
                  fill={isVisited ? `${INK},0.65)` : `${INK},0.06)`}
                  stroke={`${INK},0.5)`}
                  strokeWidth="0.9"
                />
                <text
                  x={p.x + (p.labelDx ?? 6)}
                  y={p.y + (p.labelDy ?? -6)}
                  textAnchor={p.labelAnchor ?? "start"}
                  fontSize={isWaypoint ? 9 : 12.5}
                  fill={isCurrent ? "#7c3a26" : `${INK},0.62)`}
                  className="font-serif italic"
                >
                  {p.name}
                </text>
              </g>
            );
          })}

          {/* Der wandernde Marker */}
          {inStory && (
            <g
              style={{
                transform: markerTransformCss,
                transition: markerTransitionCss,
                willChange: "transform",
              }}
            >
              {!reduced && (
                <motion.circle
                  r="7"
                  fill="none"
                  stroke={`${RUST},0.55)`}
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.55 }}
                  animate={{ scale: 2.1, opacity: 0 }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              {!reduced && (
                <motion.circle
                  key={`landung-${chapter.id}`}
                  r="4"
                  fill="none"
                  stroke={`${RUST},0.85)`}
                  strokeWidth="1.3"
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 5.5, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              <circle r="7.5" fill="none" stroke={`${RUST},0.4)`} strokeWidth="1" />
              <circle r="3.8" fill="#9d4b32" />
              <circle r="1.3" fill="#f4eddd" />
            </g>
          )}
        </g>

        {/* ---- Festes Kartenzubehör (bewegt sich nicht mit) ---- */}
        {/* Kompassrose */}
        <g transform="translate(46 66)" opacity="0.75">
          <circle r="17" fill="none" stroke={`${INK},0.35)`} strokeWidth="0.8" />
          <circle r="2" fill={`${INK},0.4)`} />
          <path d="M 0 -15 L 3 0 L 0 4 L -3 0 Z" fill={`${RUST},0.75)`} />
          <path d="M 0 15 L 3 0 L 0 -4 L -3 0 Z" fill={`${INK},0.3)`} transform="rotate(180)" />
          <path d="M -15 0 L 0 3 L 4 0 L 0 -3 Z" fill={`${INK},0.3)`} />
          <path d="M 15 0 L 0 3 L -4 0 L 0 -3 Z" fill={`${INK},0.3)`} />
          <text y="-21" textAnchor="middle" fontSize="8" fill={`${INK},0.55)`} className="font-serif">N</text>
          <text y="29" textAnchor="middle" fontSize="7" fill={`${INK},0.4)`} className="font-serif">S</text>
          <text x="24" y="2.5" textAnchor="middle" fontSize="7" fill={`${INK},0.4)`} className="font-serif">O</text>
          <text x="-24" y="2.5" textAnchor="middle" fontSize="7" fill={`${INK},0.4)`} className="font-serif">W</text>
        </g>
        {/* Maßstab */}
        <g transform="translate(30 306)" opacity="0.7">
          <line x1="0" y1="0" x2="79" y2="0" stroke={`${INK},0.5)`} strokeWidth="1" />
          {[0, 19.75, 39.5, 59.25, 79].map((x) => (
            <line key={x} x1={x} y1="-2.5" x2={x} y2="2.5" stroke={`${INK},0.5)`} strokeWidth="0.9" />
          ))}
          <rect x="0" y="-1.2" width="19.75" height="2.4" fill={`${INK},0.4)`} />
          <rect x="39.5" y="-1.2" width="19.75" height="2.4" fill={`${INK},0.4)`} />
          <text x="0" y="-6" fontSize="6" fill={`${INK},0.5)`} className="font-sans">0</text>
          <text x="36" y="-6" fontSize="6" fill={`${INK},0.5)`} className="font-sans">50</text>
          <text x="72" y="-6" fontSize="6" fill={`${INK},0.5)`} className="font-sans">100 km</text>
        </g>
      </svg>

      {/* Kartusche */}
      <div className="pointer-events-none absolute left-1/2 top-7 hidden -translate-x-1/2 border border-ink/30 bg-paper/80 px-6 py-2.5 text-center backdrop-blur-[2px] sm:block">
        <div className="pointer-events-none absolute inset-[3px] border border-ink/15" />
        <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-ink/70">
          Die Wege der Familie Ortner
        </p>
        <p className="mt-0.5 font-serif text-[11px] italic text-ink-soft">
          Mitteleuropa · 1939–1955
        </p>
      </div>

      {/* Anno-Stempel mit Fortschritt */}
      <div className="pointer-events-none absolute bottom-6 left-6 hidden lg:block">
        <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-ink-soft">Anno</p>
        <motion.p
          key={year}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="tabular font-serif text-5xl leading-none text-ink/90"
        >
          {year}
        </motion.p>
        <div className="relative mt-2 h-px w-24 bg-ink/20">
          <div className="absolute left-0 top-0 h-full bg-rust" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
        </div>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 lg:hidden">
        <motion.p
          key={year}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="tabular border border-line bg-paper/85 px-3 py-1 font-serif text-lg text-ink backdrop-blur-sm"
        >
          {year}
        </motion.p>
      </div>

      {/* Kartenrahmen */}
      <div className="pointer-events-none absolute inset-2 border border-ink/25 sm:inset-3">
        <div className="absolute inset-[3px] border border-ink/10" />
      </div>
    </div>
  );
}
