import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, Inter, Newsreader } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { AppearanceProvider } from "@/components/site/Appearance";
import { Header } from "@/components/site/Header";
import { PageTransition } from "@/components/site/PageTransition";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cristiansanchezaguilera.com"),
  title: "Cristian Sanchez-Aguilera — Founder, Builder & GTM Operator",
  description:
    "Cristian broke into enterprise tech sales at 19, learned GTM at Varonis, Swap, and DataSnipper, and now builds and sells Syntri.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cristian Sanchez-Aguilera — Founder, Builder & GTM Operator",
    description:
      "Sales, product, and engineering in one loop—from enterprise SaaS at 19 to building and selling Syntri.",
    url: "https://cristiansanchezaguilera.com",
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
      className={`${GeistSans.variable} ${GeistMono.variable} ${newsreader.variable} ${inter.variable} ${fraunces.variable} ${plex.variable}`}
    >
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
