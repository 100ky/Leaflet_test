import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Fonty Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata aplikace
export const metadata: Metadata = {
  title: "České spalovny",
  description: "Aplikace zobrazující spalovny v České republice",
};

// Viewport konfigurace (Next.js 15+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Kořenové rozložení aplikace
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" style={{ scrollBehavior: 'auto' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ scrollBehavior: 'auto' }}
      >
        {children}
      </body>
    </html>
  );
}
