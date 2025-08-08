import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Maplesea Character Lookup",
  description: "MapleStory SEA character lookup and stats viewer",
  icons: {
    icon: "/tab-logo.ico",
  },
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
        <ToastProvider />
        <Analytics />
      </body>
    </html>
  );
}
