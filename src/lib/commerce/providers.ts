import "server-only";
import Stripe from "stripe";
import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { siteOrigin } from "./config";
import { createAccessToken } from "./tokens";
import type { Purchase } from "./rules";
import { getPlaybook } from "../playbooks";

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith(process.env.COMMERCE_MODE === "live" ? "sk_live_" : "sk_test_")) throw new Error("Stripe mode/key mismatch");
  return new Stripe(key, { maxNetworkRetries: 2, timeout: 10000 });
}
function storage() {
  if (process.env.COMMERCE_S3_ENDPOINT && new URL(process.env.COMMERCE_S3_ENDPOINT).protocol !== "https:") throw new Error("Private storage requires HTTPS");
  return new S3Client({ region: process.env.COMMERCE_S3_REGION, endpoint: process.env.COMMERCE_S3_ENDPOINT || undefined,
    credentials: { accessKeyId: process.env.COMMERCE_S3_ACCESS_KEY_ID || "", secretAccessKey: process.env.COMMERCE_S3_SECRET_ACCESS_KEY || "" } });
}
export async function verifyFile(fileKey: string) {
  const file = await storage().send(new HeadObjectCommand({ Bucket: process.env.COMMERCE_S3_BUCKET, Key: fileKey }));
  if (file.ContentType !== "application/pdf" || !file.ContentLength) throw new Error("Approved PDF is unavailable");
}
export async function readFile(fileKey: string) {
  const file = await storage().send(new GetObjectCommand({ Bucket: process.env.COMMERCE_S3_BUCKET, Key: fileKey }));
  if (!file.Body || file.ContentType !== "application/pdf") throw new Error("PDF is unavailable");
  return file.Body.transformToWebStream();
}

export async function emailAccess(purchase: Purchase, key: string, expiresAt = purchase.access_expires_at.getTime()) {
  const token = createAccessToken(purchase.session_id, expiresAt, process.env.COMMERCE_ACCESS_SECRET || "");
  const link = `${siteOrigin()}/resources/access#${token}`;
  const title = getPlaybook(purchase.slug)?.title || "Your playbook";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify({ from: process.env.COMMERCE_EMAIL_FROM, to: [purchase.email], subject: `${title} — your digital playbook`,
      text: `Thank you for purchasing ${title} from Northmark Press.\n\nAccess your PDF: ${link}\n\nThis private link expires on ${new Date(expiresAt).toUTCString()}. You can request a fresh link anytime at ${siteOrigin()}/resources/access using your purchase email.\n\nPlease keep your access link private.\nCristian Sanchez\nNorthmark Press` }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Access email could not be sent");
}
