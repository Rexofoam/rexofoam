import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "MapleSEA Tracker",
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
      <body className="antialiased min-h-screen flex flex-col">
        <div className="flex-1">
          {children}
        </div>
        <ToastProvider />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
