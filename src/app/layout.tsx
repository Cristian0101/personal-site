import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { AppearanceProvider } from "@/components/site/Appearance";
import { Header } from "@/components/site/Header";
import { PageTransition } from "@/components/site/PageTransition";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";
import "./fonts.css";
import "./playbooks.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cristian Sanchez-Aguilera — Founder, Builder & GTM Operator",
  description:
    "Cristian broke into enterprise tech sales at 19, learned GTM at Varonis, Swap, and DataSnipper, and now builds and sells Syntri.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cristian Sanchez-Aguilera — Founder, Builder & GTM Operator",
    description:
      "Sales, product, and engineering in one loop—from enterprise SaaS at 19 to building and selling Syntri.",
    url: SITE_URL,
    siteName: "Cristian Sanchez-Aguilera",
  },
  twitter: {
    card: "summary",
    title: "Cristian Sanchez-Aguilera — Founder, Builder & GTM Operator",
    description: "From enterprise SaaS sales at 19 to building and selling Syntri.",
    creator: "@CristianXIV",
  },
  other: { "theme-color": "#fbfaf7" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-font="serif"
      data-size="regular"
      data-width="narrow"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <link rel="preload" href="/fonts/newsreader-5611c55482296524-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/newsreader-4b9bb515ce6d026f-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-e4af272ccee01ff0-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/fraunces-af4bf8399d1aacdf-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/ibm-plex-sans-26d4368bf94c0ec4-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppearanceProvider>
            <Header />
            <PageTransition>{children}</PageTransition>
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
