"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CHAPTERS, OUTRO, PLACES } from "@/data/timeline";
import Reveal from "./Reveal";

export default function Outro() {
  const reduced = useReducedMotion();

  // Stationsfolge für den Ausklang (aufeinanderfolgende Doppelungen entfernen)
  const stations: string[] = [];
  for (const c of CHAPTERS) {
    const name = PLACES[c.place].name;
    if (stations[stations.length - 1] !== name) stations.push(name);
  }

  return (
    <>
      {/* ---- Ankommen: das letzte Jahr, für sich allein auf der Karte ---- */}
      <section className="relative flex min-h-[70svh] flex-col items-center justify-center px-6 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[58vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/55 blur-3xl"
        />
        <div className="relative">
          <Reveal>
            <div aria-hidden="true" className="flex items-center justify-center gap-3">
              <span className="hairline h-px w-14 bg-ink/25" />
              <span className="h-1.5 w-1.5 rotate-45 bg-rust/80" />
              <span className="hairline h-px w-14 bg-ink/25" />
            </div>
          </Reveal>
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 16, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="tabular mt-7 font-serif text-7xl text-ink md:text-9xl"
          >
            {OUTRO.yearValue}
          </motion.p>
          <Reveal delay={280}>
            <h2 className="mt-5 font-serif text-2xl italic text-ink md:text-3xl">{OUTRO.title}</h2>
          </Reveal>
        </div>
      </section>

      {/* ---- Lesen: die letzte Buchseite ---- */}
      <footer className="relative bg-paper pb-32 pt-16 text-center shadow-[0_-50px_70px_-35px_rgba(42,37,28,0.4)] sm:pt-24">

        <div className="mx-auto max-w-xl px-6 sm:px-8">
          <Reveal>
            <div className="space-y-5">
              {OUTRO.dedication.map((absatz, i) => (
                <p key={i} className="font-serif text-lg italic leading-relaxed text-ink/80">
                  {absatz}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-14 font-sans text-[10px] uppercase leading-loose tracking-[0.2em] text-ink-soft">
              {stations.join("  ·  ")}
            </p>
            <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              {OUTRO.closing}
            </p>
          </Reveal>
        </div>
      </footer>
    </>
  );
}
