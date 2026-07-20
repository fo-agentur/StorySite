# Helmut — Ein Leben zwischen den Zeiten

Eine animierte Scrollytelling-Website über die Kindheitsjahre von **Helmut Ortner**
(Wien, 1942–1955), nach seinen eigenen Lebenserinnerungen.

Beim Scrollen wandert man durch die Jahre 1911–1955: links läuft das Jahr mit,
rechts unten zeigt eine stilisierte Karte Mitteleuropas die Odyssee der Familie
(Südtirol → Wien → Stützenhofen → Solbad Hall …).

---

## 1. Lokal starten

Voraussetzung: **Node.js ab Version 18** (LTS empfohlen) — Download: https://nodejs.org

```bash
npm install     # einmalig: Abhängigkeiten installieren
npm run dev     # Entwicklungsserver starten
```

Dann im Browser öffnen: **http://localhost:3000**

Für eine fertige statische Version: `npm run build` → das Ergebnis liegt im Ordner `out/`.

## 2. Texte ändern

**Alle Inhalte stehen in einer einzigen Datei: [`data/timeline.ts`](data/timeline.ts).**

Jedes Kapitel ist ein Objekt im Array `CHAPTERS`:

| Feld        | Bedeutung                                                        |
| ----------- | ---------------------------------------------------------------- |
| `year`      | Anzeige der Jahreszahl, z. B. `"1944/45"`                        |
| `yearValue` | Zahl für den mitlaufenden Jahreszähler                           |
| `title`     | Kapitelüberschrift                                               |
| `kicker`    | kleine Ortszeile über dem Titel                                  |
| `place`     | Ort für die Karte (`"wien"`, `"suedtirol"`, `"hall"` …)          |
| `body`      | die Absätze — **ein String pro Absatz**, einfach Text bearbeiten |
| `quote`     | optionales herausgehobenes Zitat                                 |
| `image`     | Bild bzw. Platzhalter (siehe unten)                              |

Die Kapiteltexte wurden aus den Lebenserinnerungen übernommen und behutsam
gekürzt — die Stellen sind mit `// TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch`
markiert. Absätze können beliebig ersetzt, ergänzt oder gestrichen werden.

Auch Intro (`HERO`) und Schlusswort (`OUTRO`, Widmung der Familie) stehen in
derselben Datei.

## 3. Fotos & Feldpostbriefe einsetzen

1. Bilddatei in den Ordner **`public/bilder/`** legen, z. B. `public/bilder/taufe-1942.jpg`
2. Im jeweiligen Kapitel in `data/timeline.ts` beim Feld `image` den Pfad eintragen:

```ts
image: {
  src: "/bilder/taufe-1942.jpg",   // ← diese Zeile ergänzen
  alt: "Taufe in der Johann-Nepomuk-Kirche",
  caption: "Die Taufe am 24. Februar 1942.",
  kind: "foto",                    // "foto" | "feldpost" | "dokument"
  aspect: "4/3",                   // optional: Seitenverhältnis des Rahmens
},
```

Solange kein `src` gesetzt ist, zeigt die Seite einen ruhigen, gestalteten
Platzhalter — das Layout bleibt immer intakt.

## 4. Auf Vercel veröffentlichen / aktualisieren

Die Seite ist als statischer Export gebaut (`output: "export"`) und läuft ohne
Server. Zwei Wege für Updates:

**Weg A — Vercel CLI (schnell):**

```bash
npm i -g vercel
vercel --prod
```

**Weg B — über GitHub (komfortabel):** Projekt in ein GitHub-Repository schieben
und auf https://vercel.com „Import Project“ wählen. Danach löst jeder `git push`
automatisch ein Update aus. Framework-Preset: Next.js, keine weiteren Einstellungen nötig.

## 5. Gestaltung & Barrierefreiheit

- Farbwelt und Schriften: [`app/globals.css`](app/globals.css) (`@theme`-Block) und
  [`app/layout.tsx`](app/layout.tsx) (EB Garamond + Inter, Google Fonts, beim Build eingebettet).
- Karte: [`components/story/ScrollMap.tsx`](components/story/ScrollMap.tsx) —
  Orte und Koordinaten stehen in `data/timeline.ts` unter `PLACES`.
- `prefers-reduced-motion` wird respektiert: Bei reduzierter Bewegung erscheinen
  alle Inhalte ohne Animationen, die Seite bleibt voll lesbar.
- Komponenten: `Hero`, `TimelineChapter`, `ScrollMap`, `YearIndicator`, `ImageSlot`,
  `Outro`, `Reveal`, `Grain` unter [`components/story/`](components/story).
