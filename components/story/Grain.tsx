"use client";

/**
 * Dezente Papierkörnung + Vignette über der ganzen Seite.
 * Rein dekorativ, keine Interaktion.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export default function Grain() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: NOISE }}
      />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
