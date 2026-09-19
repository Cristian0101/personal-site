import type { Metadata } from "next";
import { BuildingBoard } from "@/components/site/BuildingBoard";
import { businesses } from "@/lib/businesses";

export const metadata: Metadata = {
  title: "Businesses — Cristian Sanchez-Aguilera",
  description:
    "The companies Cristian is building: products, memberships, open source, and a calling block that keeps the lights on.",
  alternates: { canonical: "/businesses" },
};

export default function BusinessesPage() {
  return (
    <main id="main" className="doc businesses-doc">
      <header className="page-intro">
        <p className="blog-doc__label">Companies</p>
        <h1>Businesses</h1>
        <p className="blog-doc__lede">
          {businesses.length} companies. Products, two memberships, an open-source truth checker, and a calling block that
          keeps the lights on while the rest compounds.
        </p>
      </header>
      <BuildingBoard />
    </main>
  );
}
