import { ImageResponse } from "next/og";
import { ResourceShareImage } from "@/components/site/ResourceShareImage";
export const alt = "Cold Email Teardown Checklist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<ResourceShareImage title="Cold Email Teardown Checklist" subtitle="Check the evidence. Read it back. Rewrite." category="MESSAGE REVIEW" />, { ...size }); }
