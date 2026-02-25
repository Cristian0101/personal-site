import type { Metadata } from "next";
import { GeistPixelGrid } from "geist/font/pixel";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cristian Sanchez-Aguilera",
  description:
    "Founder of Syntri AI. 20-year-old solo builder racing to YC Summer 2026.",
  openGraph: {
    title: "Cristian Sanchez-Aguilera",
    description:
      "Founder of Syntri AI. Building the first agentic BDR platform.",
    url: "https://cristiansanchezaguilera.com",
    siteName: "Cristian Sanchez-Aguilera",
  },
  twitter: {
    card: "summary",
    title: "Cristian Sanchez-Aguilera",
    description: "Founder of Syntri AI. Building in public.",
    creator: "@CristianXIV",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistPixelGrid.variable}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
