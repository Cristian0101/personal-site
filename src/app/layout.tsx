import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistPixel = localFont({
  src: "../../public/fonts/GeistPixelSquare.woff2",
  variable: "--font-geist-pixel",
  display: "swap",
  weight: "500",
});

export const metadata: Metadata = {
  title: "Cristian Sanchez-Aguilera",
  description: "Founder, builder, and go-to-market operator based in New York.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistPixel.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
