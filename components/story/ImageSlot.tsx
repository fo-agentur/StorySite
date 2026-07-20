"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ChapterImage } from "@/data/timeline";

/**
 * Bildrahmen mit sanfter Parallaxe beim Scrollen.
 * Ohne gesetztes Bild erscheint ein ruhiger, gestalteter Platzhalter —
 * das Layout bleibt in jedem Fall intakt.
 */
export default function ImageSlot({ image }: { image: ChapterImage }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [18, -18]);

  const kind = image.kind ?? "foto";
  const aspect = (image.aspect ?? "4/3").replace("/", " / ");
  const label =
    kind === "feldpost"
      ? "Feldpostbrief · Faksimile folgt"
      : kind === "dokument"
        ? "Dokument folgt"
        : "Fotografie folgt";

  return (
    <figure ref={ref} className="my-12">
      <motion.div style={{ y }}>
        <div className="border border-ink/25 bg-paper-deep/70 p-1.5 sm:p-2">
          <div
            className="relative overflow-hidden border border-ink/10"
            style={{ aspectRatio: aspect }}
          >
            {image.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
                  kind === "feldpost" ? "feldpost-lines" : ""
                }`}
              >
                <PlaceholderIcon kind={kind} />
                <span className="px-4 text-center font-sans text-[10px] uppercase tracking-[0.24em] text-ink-faint">
                  {label}
                </span>
              </div>
            )}
          </div>
        </div>
        {image.caption && (
          <figcaption className="mt-3 font-serif text-sm italic leading-relaxed text-ink-soft">
            {image.caption}
          </figcaption>
        )}
      </motion.div>
    </figure>
  );
}

function PlaceholderIcon({ kind }: { kind: "foto" | "feldpost" | "dokument" }) {
  const stroke = "var(--color-ink-faint)";
  if (kind === "feldpost") {
    return (
      <svg width="36" height="26" viewBox="0 0 36 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="24" stroke={stroke} />
        <path d="M1 2l17 12L35 2" stroke={stroke} />
      </svg>
    );
  }
  if (kind === "dokument") {
    return (
      <svg width="26" height="32" viewBox="0 0 26 32" fill="none" aria-hidden="true">
        <path d="M1 1h17l7 7v23H1z" stroke={stroke} />
        <path d="M18 1v7h7M6 14h14M6 19h14M6 24h10" stroke={stroke} />
      </svg>
    );
  }
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="34" height="26" stroke={stroke} />
      <circle cx="11.5" cy="9.5" r="3" stroke={stroke} />
      <path d="M1 22.5l9.5-7.5 6.5 5 8.5-8.5L35 21" stroke={stroke} />
    </svg>
  );
}
