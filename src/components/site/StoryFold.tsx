"use client";

import { useState, type ReactNode } from "react";

const MORE_LABEL = "continue to read";

export function StoryFold({
  preview,
  rest,
}: {
  preview: ReactNode;
  rest: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`story-fold${open ? " is-open" : ""}`}>
      <div className="story-fold__preview">
        {preview}
        <button
          type="button"
          className="story-fold__more"
          aria-label="Continue to read"
          aria-expanded={open}
          aria-controls="story-fold-rest"
          tabIndex={open ? -1 : 0}
          onClick={() => setOpen(true)}
        >
          {MORE_LABEL.split("").map((char, index) =>
            char === " " ? (
              <span key={`space-${index}`} className="story-fold__space">
                {" "}
              </span>
            ) : (
              <span key={`${char}-${index}`} style={{ animationDelay: `${index * 70}ms` }}>
                {char}
              </span>
            ),
          )}
        </button>
      </div>
      <div id="story-fold-rest" className="story-fold__rest" inert={open ? undefined : true}>
        <div className="story-fold__rest-inner">{rest}</div>
      </div>
    </div>
  );
}
