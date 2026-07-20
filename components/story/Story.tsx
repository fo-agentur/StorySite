"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS, HERO, OUTRO } from "@/data/timeline";
import Grain from "./Grain";
import Hero from "./Hero";
import MapStage from "./MapStage";
import Outro from "./Outro";
import TimelineChapter from "./TimelineChapter";

/**
 * Die Karte ist die Bühne: Sie füllt den ganzen Schirm, die Kapitel
 * ziehen als Papierkarten darüber hinweg. Diese Komponente misst die
 * Scroll-Position, interpoliert das Jahr und steuert die Kartenkamera.
 */
export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState(HERO.yearValue);
  const [progress, setProgress] = useState(0);
  const [nodeIndex, setNodeIndex] = useState(0); // 0 = Prolog, 1…n = Kapitel, n+1 = Ausklang

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let centers: number[] = [];
    let years: number[] = [];
    let raf = 0;
    let fallback = 0;

    const update = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (fallback) {
        window.clearTimeout(fallback);
        fallback = 0;
      }
      if (!centers.length) return;
      const focus = window.scrollY + window.innerHeight * 0.5;

      // Jahr: stückweise linear zwischen den Stationsmitten interpolieren
      let y = years[0];
      if (focus >= centers[centers.length - 1]) {
        y = years[years.length - 1];
      } else if (focus > centers[0]) {
        for (let i = 0; i < centers.length - 1; i++) {
          if (focus <= centers[i + 1]) {
            const t =
              (focus - centers[i]) / Math.max(1, centers[i + 1] - centers[i]);
            y = years[i] + t * (years[i + 1] - years[i]);
            break;
          }
        }
      }
      setYear(Math.round(y));

      // Nächstgelegene Station bestimmt Kamera & Kartenzustand
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const d = Math.abs(centers[i] - focus);
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      setNodeIndex(nearest);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)));
      setProgress(Math.round(p * 240) / 240);
    };

    const measure = () => {
      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>("[data-story-node]")
      );
      centers = nodes.map((n) => n.offsetTop + n.offsetHeight / 2);
      years = nodes.map((n) => Number(n.dataset.year ?? "0"));
      update();
    };

    const onScroll = () => {
      if (raf || fallback) return;
      raf = requestAnimationFrame(update);
      // Fallback für gedrosselte bzw. unsichtbare Tabs, in denen
      // requestAnimationFrame pausiert (Energiesparmodus, Vorschau-Panes)
      fallback = window.setTimeout(update, 150);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    // nach dem Laden der Schriften erneut messen (Layout kann sich verschieben)
    if (document.fonts) {
      document.fonts.ready.then(() => measure()).catch(() => undefined);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (fallback) window.clearTimeout(fallback);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <MapStage nodeIndex={nodeIndex} year={year} progress={progress} />
      <Grain />

      {/* Feine Fortschrittslinie ganz oben */}
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-30 h-[2px]">
        <div
          className="h-full bg-rust/80"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>

      <main className="relative z-10">
        <div data-story-node data-year={HERO.yearValue}>
          <Hero />
        </div>
        {CHAPTERS.map((chapter) => (
          <div
            key={chapter.id}
            data-story-node
            data-year={chapter.yearValue}
            className="flex min-h-[135vh] items-center justify-center px-4 py-20 sm:px-8 lg:justify-end lg:pr-[7vw]"
          >
            <TimelineChapter chapter={chapter} />
          </div>
        ))}
        <div data-story-node data-year={OUTRO.yearValue}>
          <Outro />
        </div>
      </main>
    </div>
  );
}
