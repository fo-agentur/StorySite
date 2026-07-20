"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HERO } from "@/data/timeline";
import Reveal from "./Reveal";

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <header className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Große Geisterjahreszahl im Hintergrund */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <span className="tabular font-serif text-[36vw] leading-none text-ink/[0.05] md:text-[22vw]">
          1942
        </span>
      </div>

      {/* weicher Papierschein, damit der Titel über der Karte ruhig steht */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[70vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/70 blur-3xl"
      />
      <div className="relative w-full max-w-2xl">
        <Reveal delay={100}>
          <p className="font-sans text-[11px] uppercase tracking-[0.38em] text-rust">
            {HERO.overline}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <h1 className="mt-6 font-serif text-7xl tracking-tight text-ink sm:text-8xl md:text-[9rem] md:leading-none">
            {HERO.title}
          </h1>
        </Reveal>
        <Reveal delay={500}>
          <p className="mt-5 font-serif text-2xl italic text-ink-soft md:text-3xl">
            {HERO.subtitle}
          </p>
        </Reveal>
        <Reveal delay={700}>
          <div className="mx-auto mt-10 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-12 bg-ink/25" />
            <span className="h-1.5 w-1.5 rotate-45 bg-rust/80" />
            <span className="h-px w-12 bg-ink/25" />
          </div>
        </Reveal>
        <Reveal delay={900}>
          <p className="mx-auto mt-10 max-w-md font-serif text-base leading-relaxed text-ink/85 md:text-lg">
            {HERO.lede}
          </p>
        </Reveal>
      </div>

      {/* Scroll-Einladung */}
      <div className="absolute bottom-9 inset-x-0 flex justify-center">
        <Reveal delay={1400} className="flex flex-col items-center gap-4">
          <span className="px-6 text-center font-sans text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:tracking-[0.3em]">
            {HERO.scrollHint}
          </span>
          <div className="relative h-12 w-px overflow-hidden bg-ink/15">
            {!reduced && (
              <motion.span
                className="absolute left-0 top-0 h-full w-full bg-rust/70"
                initial={{ y: "-100%" }}
                animate={{ y: "100%" }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.8,
                }}
              />
            )}
          </div>
        </Reveal>
      </div>
    </header>
  );
}
