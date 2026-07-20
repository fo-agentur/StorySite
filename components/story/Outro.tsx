"use client";

import { CHAPTERS, OUTRO, PLACES } from "@/data/timeline";
import Reveal from "./Reveal";

export default function Outro() {
  // Stationsfolge für den Ausklang (aufeinanderfolgende Doppelungen entfernen)
  const stations: string[] = [];
  for (const c of CHAPTERS) {
    const name = PLACES[c.place].name;
    if (stations[stations.length - 1] !== name) stations.push(name);
  }

  return (
    <footer className="relative px-6 pb-36 pt-[15vh]">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-14 bg-ink/25" />
            <span className="h-1.5 w-1.5 rotate-45 bg-rust/80" />
            <span className="h-px w-14 bg-ink/25" />
          </div>
          <p className="tabular mt-10 font-serif text-5xl text-ink/85">{OUTRO.yearValue}</p>
          <h2 className="mt-4 font-serif text-3xl italic text-ink md:text-4xl">
            {OUTRO.title}
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-10 space-y-5">
            {OUTRO.dedication.map((absatz, i) => (
              <p key={i} className="font-serif text-lg italic leading-relaxed text-ink/80">
                {absatz}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={250}>
          <p className="mt-16 font-sans text-[10px] uppercase leading-loose tracking-[0.2em] text-ink-soft">
            {stations.join("  ·  ")}
          </p>
          <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.22em] text-ink-faint">
            {OUTRO.closing}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
