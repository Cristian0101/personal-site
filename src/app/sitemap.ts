import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";
import { allResources } from "@/lib/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/businesses", "/blog", "/rules", "/resources", ...allResources.map(resource => resource.path)];
  const postPaths = getAllSlugs().map((slug) => `/blog/${slug}`);

  return [...staticPaths, ...postPaths].map((pathname) => ({
    url: `${SITE_URL}${pathname}`,
  }));
}
