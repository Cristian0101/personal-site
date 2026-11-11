import { ImageResponse } from "next/og";
import { ResourceShareImage } from "@/components/site/ResourceShareImage";
export const alt = "TAM Segmentation Worksheet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<ResourceShareImage title="TAM Segmentation Worksheet" subtitle="Define the market. Check the evidence. Choose a segment." category="ACCOUNT PLANNING" />, { ...size }); }
