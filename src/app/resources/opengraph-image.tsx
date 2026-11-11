import { ImageResponse } from "next/og";
import { ResourceShareImage } from "@/components/site/ResourceShareImage";
export const alt = "Free practical resources for breaking into tech sales";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<ResourceShareImage library={true} />, { ...size }); }
