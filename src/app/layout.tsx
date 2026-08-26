import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import "./globals.css";

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
  other: { "theme-color": "#070A10" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
