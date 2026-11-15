import type { Playbook } from "../playbooks";

const checkoutVariables: Record<string, string> = {
  "master-interviews": "POLAR_MASTER_INTERVIEWS_CHECKOUT_URL",
  "sdr-bdr-job-mastery": "POLAR_SDR_BDR_JOB_MASTERY_CHECKOUT_URL",
  "break-up-your-tam": "POLAR_BREAK_UP_YOUR_TAM_CHECKOUT_URL",
  "science-of-a-cold-call": "POLAR_COLD_CALL_CHECKOUT_URL",
  "science-of-a-cold-email": "POLAR_COLD_EMAIL_CHECKOUT_URL",
};

/** Keep checkout closed until production delivery is verified. */
export function polarCheckoutUrl(book: Playbook, env: Record<string, string | undefined> = process.env): string | null {
  if (env.POLAR_CHECKOUT_ENABLED !== "true") return null;
  const variable = checkoutVariables[book.slug];
  if (!variable || !env[variable]) return null;
  try {
    const url = new URL(env[variable]!);
    if (url.protocol !== "https:" || url.hostname !== "buy.polar.sh" || url.port || url.username || url.password || url.hash || !url.pathname.startsWith("/polar_cl_")) return null;
    return url.href;
  } catch {
    return null;
  }
}
