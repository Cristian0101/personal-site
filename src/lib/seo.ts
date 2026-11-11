export const SITE_URL = "https://www.cristiansanchezaguilera.com";
export const PERSON_ID = `${SITE_URL}/#cristian-sanchez-aguilera`;

export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Cristian Sanchez-Aguilera",
  url: SITE_URL,
  jobTitle: "Founder, seller, and product builder",
  sameAs: [
    "https://github.com/Cristian0101",
    "https://linkedin.com/in/cristian-sanchez-aguilera",
    "https://x.com/CristianXIV",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Northmark Industries",
  },
};

export function graphSchema(...nodes: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
