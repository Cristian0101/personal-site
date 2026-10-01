import type { Metadata } from "next";
import Image from "next/image";
import { BuildingBoard } from "@/components/site/BuildingBoard";
import { businesses, parentCompany } from "@/lib/businesses";

export const metadata: Metadata = {
  title: "Businesses — Northmark Industries",
  description:
    "Cristian Sanchez-Aguilera is the owner and founder of Northmark, the parent company behind each venture across software, memberships, open-source projects, and services.",
  alternates: { canonical: "/businesses" },
};

export default function BusinessesPage() {
  return (
    <main id="main" className="doc businesses-doc">
      <header className="page-intro">
        <p className="blog-doc__label">Parent Company &amp; Ventures</p>
        <h1>Businesses</h1>
        <p className="blog-doc__lede">
          Owner and founder of <strong>{parentCompany.shortName}</strong> ({parentCompany.name}) — the parent company to all my businesses. Practical software, memberships, open-source tools, and services built to help people get in, perform, build, and grow.
        </p>
      </header>

      <figure className="northmark-banner">
        <Image
          src={parentCompany.banner}
          alt="Northmark — Software and education for people who sell and build"
          width={1024}
          height={341}
          priority
        />
      </figure>

      <BuildingBoard />
    </main>
  );
}
