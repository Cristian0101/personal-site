"use client";

import { ArrowUpRight, Command, MagnifyingGlass, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type PaletteCommand = {
  label: string;
  detail: string;
  key: string;
  href?: string;
  action?: () => void;
};

const isTypingTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;
  return Boolean(element?.closest("input, textarea, select, [contenteditable='true']"));
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<PaletteCommand[]>(
    () => [
      { label: "Explore the ecosystem", detail: "Nine projects", key: "P", href: "#ecosystem" },
      { label: "Open Syntri", detail: "Sales execution OS", key: "S", href: "https://syntriai.com/" },
      { label: "Open BLDR", detail: "Builder education", key: "B", href: "https://whop.com/bldr-e4e2/exp_3j8U1kPZNIjBmi/app/" },
      { label: "Open Outflow", detail: "Career-entry education", key: "O", href: "https://whop.com/outflow-techsaleswhop/" },
      { label: "View GitHub", detail: "Public work", key: "G", href: "https://github.com/Cristian0101" },
      { label: "Read my story", detail: "GTM → product", key: "A", href: "#story" },
      { label: "Writing", detail: "Essays & notes", key: "W", href: "/blog" },
      { label: "LinkedIn", detail: "Connect", key: "L", href: "https://linkedin.com/in/cristian-sanchez-aguilera" },
      { label: "X", detail: "Building in public", key: "X", href: "https://x.com/CristianXIV" },
      { label: "Email Cristian", detail: "Start a conversation", key: "E", href: "mailto:cristian@syntriai.com" },
    ],
    [],
  );

  const filtered = commands.filter((command) =>
    `${command.label} ${command.detail}`.toLowerCase().includes(query.toLowerCase()),
  );

  const setOpen = useCallback((nextOpen: boolean) => {
    if (nextOpen) setQuery("");
    onOpenChange(nextOpen);
  }, [onOpenChange]);

  const runCommand = useCallback((command: PaletteCommand) => {
    command.action?.();
    if (command.href) {
      if (command.href.startsWith("#")) {
        document.querySelector(command.href)?.scrollIntoView({ behavior: "smooth" });
      } else if (command.href.startsWith("/")) {
        window.location.assign(command.href);
      } else {
        window.open(command.href, command.href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
      }
    }
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
        return;
      }

      if (event.key === "Escape" && open) {
        setOpen(false);
        return;
      }

      if (!open && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        const command = commands.find((item) => item.key.toLowerCase() === event.key.toLowerCase());
        if (command) runCommand(command);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commands, open, runCommand, setOpen]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  return (
    <>
      <button className="command-trigger" onClick={() => setOpen(true)} aria-label="Open command palette">
        <Command size={13} weight="light" />
        <span>Command</span>
        <kbd>⌘K</kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setOpen(false)}
          >
            <motion.div
              className="command-palette"
              role="dialog"
              aria-modal="true"
              aria-label="Where should we go?"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="palette-search">
                <MagnifyingGlass size={17} weight="light" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Where should we go?"
                  aria-label="Filter commands"
                />
                <button onClick={() => setOpen(false)} aria-label="Close command palette">
                  <X size={15} />
                </button>
              </div>
              <div className="palette-list" role="listbox">
                {filtered.map((command, index) => (
                  <button
                    key={command.label}
                    className="palette-option"
                    onClick={() => runCommand(command)}
                    role="option"
                    aria-selected={index === 0}
                  >
                    <span>
                      <strong>{command.label}</strong>
                      <small>{command.detail}</small>
                    </span>
                    <span className="palette-option__key">
                      {command.key} <ArrowUpRight size={12} />
                    </span>
                  </button>
                ))}
                {filtered.length === 0 ? <p className="palette-empty">No matching route.</p> : null}
              </div>
              <div className="palette-footer">
                <span>↑↓ Navigate</span>
                <span>Esc close</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
