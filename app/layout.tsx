import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Helmut — Ein Leben zwischen den Zeiten",
  description:
    "Die Lebenserinnerungen von Helmut Ortner: eine Kindheit in Wien zwischen Krieg und Frieden, 1942–1955. Erzählt entlang der Jahre und Orte.",
};

export const viewport: Viewport = {
  themeColor: "#f4eddd",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de" className={`${garamond.variable} ${inter.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
