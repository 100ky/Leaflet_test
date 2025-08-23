import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Combustion",
  description: "Combustion app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mt-24 md:mt-20">{children}</main>
      </body>
    </html>
  );
}
