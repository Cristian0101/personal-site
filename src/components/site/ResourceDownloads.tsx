"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Device = "apple" | "android" | "touch" | "desktop";
function deviceSnapshot(): Device {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "apple";
  if (/Android/.test(navigator.userAgent)) return "android";
  return matchMedia("(pointer: coarse)").matches ? "touch" : "desktop";
}
function subscribeDevice(callback: () => void) {
  const query = matchMedia("(pointer: coarse)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const serverDevice = (): Device => "desktop";

export function ResourceDownloads({ title, pdf, html, images }: {
  title: string;
  pdf: string;
  html: string;
  images: { href: string; label: string }[];
}) {
  const device = useSyncExternalStore(subscribeDevice, deviceSnapshot, serverDevice);
  const mobile = device !== "desktop";
  const [shareAsset, setShareAsset] = useState<{ file: File; path: string } | null>(null);
  const [sharing, setSharing] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!mobile || !navigator.share || !navigator.canShare) return;
    const controller = new AbortController();
    let current = true;
    fetch(pdf, { signal: controller.signal })
      .then(async response => {
        if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) throw new Error("File unavailable");
        const blob = await response.blob();
        const file = new File([blob], pdf.split("/").pop() || "worksheet.pdf", { type: "application/pdf" });
        if (current && navigator.canShare({ files: [file] })) setShareAsset({ file, path: pdf });
      })
      .catch(() => { /* The normal download remains available. */ });
    return () => { current = false; controller.abort(); };
  }, [mobile, pdf]);

  async function sharePdf() {
    if (!shareAsset || shareAsset.path !== pdf || sharing) return;
    setSharing(true);
    setNotice("");
    try {
      await navigator.share({ files: [shareAsset.file], title });
      setNotice("Check the destination you chose to confirm the file saved.");
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setNotice("Sharing is unavailable here. Open the PDF, or use the image links below.");
      }
    } finally { setSharing(false); }
  }

  return (
    <div className="resource-downloads" data-save-device={device}>
      <a className="resource-button" href={pdf} download={mobile ? undefined : pdf.split("/").pop()}>
        {mobile ? "Open the free PDF" : "Download the free PDF"} <span aria-hidden="true">↓</span>
      </a>
      {mobile && shareAsset?.path === pdf ? <button type="button" className="resource-share" onClick={sharePdf} disabled={sharing}>{sharing ? "Opening sharing options…" : "Share or save the PDF…"}</button> : null}
      <p className="resource-small">
        {device === "apple" ? "For Files: open the PDF, then use Share → Save to Files. For Photos: use the image pages below." : device === "android" ? "For Files or Downloads: open the PDF and use your browser or PDF viewer’s Download option. For your gallery: use the image pages below." : mobile ? "Open the PDF and use your browser’s save or share menu. To keep pages as photos, use the images below." : "Save the PDF to Downloads, or choose image pages below. Your browser controls the save location."}
      </p>
      <a className="resource-text-link" href={html}>Read the accessible HTML version →</a>
      <details className="resource-image-saves">
        <summary>{mobile ? "Save image pages to Photos / gallery" : "Download image pages instead"}</summary>
        <p className="resource-small">{mobile ? "Open a page image, then touch and hold it and choose Save Image, Add to Photos, or Download image if your browser offers it. If it lands in Files or Downloads, use your device’s share menu to move it to Photos. Available options vary by device and browser." : "Each PNG contains one complete worksheet page. These are image copies for reference; use the HTML version for labeled editable fields."}</p>
        <ul>{images.map(image => <li key={image.href}><a href={image.href} download={mobile ? undefined : image.href.split("/").pop()} target={mobile ? "_blank" : undefined} rel={mobile ? "noreferrer" : undefined}>{mobile ? "Open image" : "Download image"} {image.label.toLowerCase()} {mobile ? "↗" : "↓"}</a></li>)}</ul>
      </details>
      <p className="resource-small">{images.length}-page PDF. No email, account, or payment required. We can open a file or sharing menu; your device controls where it is saved.</p>
      <p className="resource-save-status" role="status">{notice}</p>
    </div>
  );
}
