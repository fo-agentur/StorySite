"use client";

import { CHAPTERS, type Chapter } from "@/data/timeline";
import Reveal from "./Reveal";

/**
 * Ein Kapitel als schwebende Papierkarte über der großen Karte.
 */
export default function TimelineChapter({ chapter }: { chapter: Chapter }) {
  const total = CHAPTERS.length;

  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-titel`}
      className="relative w-full max-w-xl border border-ink/25 bg-paper/[0.94] shadow-[0_18px_60px_-18px_rgba(42,37,28,0.4)] backdrop-blur-md"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-1.5 border border-ink/10" />
      <div className="relative px-6 py-9 sm:px-9 sm:py-10 md:px-11 md:py-12">
        <Reveal>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="hairline h-px w-10 shrink-0 bg-rust/70" />
            <p className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-ink-soft">
              Kapitel {chapter.chapter}
              <span aria-hidden="true"> / </span>
              <span className="text-ink-faint">{total}</span>
              {" · "}
              <span className="tabular">{chapter.year}</span>
              {chapter.kicker && (
                <>
                  {" · "}
                  <span className="text-ink/70">{chapter.kicker}</span>
                </>
              )}
            </p>
          </div>
          <h2
            id={`${chapter.id}-titel`}
            className="mt-4 font-serif text-3xl leading-[1.08] tracking-tight text-ink md:text-[2.6rem]"
          >
            {chapter.title}
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="prose-book mt-7 text-[1.04rem] text-ink/90 md:text-[1.09rem]">
            {chapter.body.map((absatz, i) => (
              <p key={i} className={i === 0 ? "dropcap" : undefined}>
                {absatz}
              </p>
            ))}
          </div>
        </Reveal>

        {chapter.quote && (
          <Reveal delay={100}>
            <figure className="mt-9 border-l-2 border-rust/60 pl-5 md:pl-6">
              <blockquote className="font-serif text-[1.3rem] italic leading-snug text-ink md:text-[1.5rem]">
                {chapter.quote.text}
              </blockquote>
              {chapter.quote.source && (
                <figcaption className="mt-3 font-sans text-[9.5px] uppercase tracking-[0.22em] text-ink-soft">
                  {chapter.quote.source}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  );
}
