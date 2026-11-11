import { ImageResponse } from "next/og";
import { ResourceShareImage } from "@/components/site/ResourceShareImage";
export const alt = "Cold Call Practice Scorecard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<ResourceShareImage title="Cold Call Practice Scorecard" subtitle="Rehearse. Observe. Retry one moment." category="CONVERSATION PRACTICE" />, { ...size }); }
