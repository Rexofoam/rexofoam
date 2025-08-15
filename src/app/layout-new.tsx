import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import Script from "next/script";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: "MapleSEA Tracker - MapleStory SEA Character & Guild Lookup",
    template: "%s | MapleSEA Tracker",
  },
  description:
    "Track MapleStory SEA characters, guilds, and growth statistics. View equipment, skills, symbols, and monitor character progression over time with detailed analytics.",
  keywords: [
    "MapleStory SEA",
    "character lookup",
    "guild tracker",
    "MSEA",
    "character stats",
    "equipment tracker",
    "guild growth",
    "maplestory tracker",
    "combat power",
    "character progression",
    "guild analysis",
    "maple sea statistics",
  ],
  authors: [{ name: "MapleSEA Tracker" }],
  creator: "MapleSEA Tracker",
  publisher: "MapleSEA Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/tab-logo.ico",
    shortcut: "/tab-logo.ico",
    apple: "/tab-logo.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maplesea-tracker.vercel.app",
    title: "MapleSEA Tracker - Character & Guild Lookup",
    description:
      "Track MapleStory SEA characters, guilds, and growth statistics with comprehensive analytics and progression tracking.",
    siteName: "MapleSEA Tracker",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MapleSEA Tracker - MapleStory SEA Character & Guild Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MapleSEA Tracker - MapleStory SEA Analytics",
    description:
      "Track characters, guilds, and growth with detailed progression analytics",
    images: ["/images/og-image.png"],
    creator: "@maplesea_tracker",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Gaming",
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.png" />

        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MapleSEA Tracker",
              description:
                "MapleStory SEA character and guild tracking tool with detailed analytics",
              url: "https://maplesea-tracker.vercel.app",
              applicationCategory: "GameApplication",
              operatingSystem: "Web Browser",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://maplesea-tracker.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MZFCJTZS');
            `,
          }}
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F17ZE6HR64"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F17ZE6HR64');
            `,
          }}
        />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MZFCJTZS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <div className="flex-1">{children}</div>
        <StructuredData
          type="website"
          data={{
            name: "MapleSEA Tracker",
            description:
              "Track MapleStory SEA characters, guilds, and growth statistics. View equipment, skills, symbols, and monitor character progression over time with detailed analytics.",
            url: "https://maplesea-tracker.vercel.app",
          }}
        />
        <ToastProvider />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
