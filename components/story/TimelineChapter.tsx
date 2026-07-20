"use client";

import { CHAPTERS, type Chapter } from "@/data/timeline";
import ImageSlot from "./ImageSlot";
import Reveal from "./Reveal";

export default function TimelineChapter({ chapter }: { chapter: Chapter }) {
  const total = CHAPTERS.length;

  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-titel`}
      className="relative px-5 sm:px-8"
    >
      <div className="mx-auto max-w-2xl py-[15vh] md:py-[18vh]">
        <Reveal>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-rust/70" />
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-ink-soft">
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
            className="mt-5 font-serif text-4xl leading-[1.06] tracking-tight text-ink md:text-[3.3rem]"
          >
            {chapter.title}
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="prose-book mt-10 text-[1.13rem] text-ink/90 md:text-[1.19rem]">
            {chapter.body.map((absatz, i) => (
              <p key={i} className={i === 0 ? "dropcap" : undefined}>
                {absatz}
              </p>
            ))}
          </div>
        </Reveal>

        {chapter.quote && (
          <Reveal delay={100}>
            <figure className="my-12 border-l-2 border-rust/60 pl-6 md:my-14 md:pl-8">
              <blockquote className="font-serif text-[1.5rem] italic leading-snug text-ink md:text-[1.8rem]">
                {chapter.quote.text}
              </blockquote>
              {chapter.quote.source && (
                <figcaption className="mt-4 font-sans text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                  {chapter.quote.source}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )}

        {chapter.image && (
          <Reveal delay={120}>
            <ImageSlot image={chapter.image} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
