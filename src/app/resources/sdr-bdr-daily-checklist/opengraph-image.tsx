import { ImageResponse } from "next/og";
import { ResourceShareImage } from "@/components/site/ResourceShareImage";
export const alt = "SDR/BDR Daily Operating Checklist: prioritize, prepare, and close the loop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<ResourceShareImage daily />, { ...size }); }
