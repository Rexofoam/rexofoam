import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maplesea Character Lookup",
  description: "MapleStory SEA character lookup and stats viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
