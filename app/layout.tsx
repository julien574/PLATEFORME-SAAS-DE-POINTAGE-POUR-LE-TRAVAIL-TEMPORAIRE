import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tempo — Pointage intérimaire",
  description: "Prototype de gestion des temps pour le travail temporaire",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#102e2c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
