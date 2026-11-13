"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Playbook } from "@/lib/playbooks";

export function PreviewGallery({ images }: { images: Playbook["previews"] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(0);
  if (images.length < 2) return null;
  const previews = images.slice(0, 4);
  const selected = previews[active];
  return <section className="book-section" aria-labelledby="preview-heading">
    <div className="book-section__heading"><p className="book-eyebrow">Selected pages</p><h2 id="preview-heading">A look inside.</h2></div>
    <div className="book-previews">{previews.map((item, index) => <figure key={item.src}><button type="button" aria-label={`Enlarge ${item.caption}`} onClick={event => { opener.current = event.currentTarget; setActive(index); dialog.current?.showModal(); }}><Image src={item.src} width={item.width} height={item.height} alt={item.alt} sizes="(max-width: 620px) 80vw, 30vw" /></button><figcaption>{item.caption}</figcaption></figure>)}</div>
    <dialog ref={dialog} className="book-preview-dialog" aria-label="Playbook page preview" onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div><button type="button" className="book-preview-close" onClick={() => dialog.current?.close()} autoFocus>Close preview <span aria-hidden="true">×</span></button><Image src={selected.src} width={selected.width} height={selected.height} alt={selected.alt} sizes="90vw" /><p>{selected.caption}</p></div>
    </dialog>
  </section>;
}
