import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Načtení Sans fontu Geist pro běžný text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Načtení Mono fontu Geist pro kód nebo speciální text
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata stránky - zobrazují se například v záložkách prohlížeče
export const metadata: Metadata = {
  title: "Mapa Spaloven ČR",
  description: "Aplikace zobrazující spalovny v České republice",
};

// Hlavní rozložení aplikace - obal pro všechny stránky
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
