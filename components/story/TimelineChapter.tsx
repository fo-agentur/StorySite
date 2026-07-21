"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CHAPTERS, type Chapter } from "@/data/timeline";
import Reveal from "./Reveal";

/**
 * Jedes Kapitel ist eine Zwei-Takt-Bewegung:
 *
 *  1) ANKOMMEN — die Karte ganz allein, nur Jahr und Ort. Die Kamera ist
 *     bereits (in MapStage) zu diesem Punkt unterwegs.
 *  2) LESEN — eine blickdichte Buchseite steigt über der Karte auf.
 *     Kein Text liegt je gleichzeitig auf der Karte: die Seite ist voll
 *     deckend, sobald man wirklich liest.
 */
export default function TimelineChapter({ chapter }: { chapter: Chapter }) {
  const total = CHAPTERS.length;
  const reduced = useReducedMotion();

  return (
    <>
      {/* ---- 1) Ankommen ---- */}
      <section className="relative flex min-h-[92svh] flex-col items-center justify-center px-6 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[58vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/55 blur-3xl"
        />
        <div className="relative">
          <Reveal>
            <p className="font-sans text-[11px] uppercase tracking-[0.4em] text-rust">
              Kapitel {chapter.chapter}
              <span className="text-ink-faint"> / {total}</span>
            </p>
          </Reveal>

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 16, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="tabular mt-4 font-serif text-7xl leading-none text-ink md:text-9xl"
          >
            {chapter.year}
          </motion.p>

          <Reveal delay={280}>
            <div aria-hidden="true" className="mx-auto mt-7 flex items-center justify-center gap-3">
              <span className="hairline h-px w-10 bg-ink/25" />
              <motion.span
                initial={reduced ? undefined : { scale: 0, rotate: 0 }}
                whileInView={{ scale: 1, rotate: 45 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.55 }}
                className="h-1.5 w-1.5 bg-rust/80"
              />
              <span className="hairline h-px w-10 bg-ink/25" />
            </div>
          </Reveal>

          {chapter.kicker && (
            <Reveal delay={380}>
              <p className="mt-7 font-serif text-lg italic text-ink-soft md:text-xl">
                {chapter.kicker}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---- 2) Lesen: die Buchseite ---- */}
      <section
        id={chapter.id}
        aria-labelledby={`${chapter.id}-titel`}
        className="relative bg-paper pb-24 pt-16 shadow-[0_-50px_70px_-35px_rgba(42,37,28,0.4)] sm:pb-32 sm:pt-24"
      >
        <div className="mx-auto max-w-2xl px-6 sm:px-8">
          <Reveal>
            <h2
              id={`${chapter.id}-titel`}
              className="font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-[3.2rem]"
            >
              {chapter.title}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <div className="prose-book mt-9 text-[1.1rem] text-ink/90 md:text-[1.16rem]">
              {chapter.body.map((absatz, i) => (
                <p key={i} className={i === 0 ? "dropcap" : undefined}>
                  {absatz}
                </p>
              ))}
            </div>
          </Reveal>

          {chapter.quote && (
            <Reveal delay={100}>
              <figure className="mt-11 border-l-2 border-rust/60 pl-6 md:pl-8">
                <blockquote className="font-serif text-[1.5rem] italic leading-snug text-ink md:text-[1.8rem]">
                  {chapter.quote.text}
                </blockquote>
                {chapter.quote.source && (
                  <figcaption className="mt-4 font-sans text-[9.5px] uppercase tracking-[0.22em] text-ink-soft">
                    {chapter.quote.source}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
