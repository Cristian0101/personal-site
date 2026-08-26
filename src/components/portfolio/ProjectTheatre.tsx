"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useState, type CSSProperties } from "react";

const projects = [
  {
    name: "Syntri",
    title: "BDR operating system",
    meta: "FOUNDER · PRODUCT · GTM · ENGINEERING",
    description: "A unified territory and signal system built from the problems I lived as a BDR.",
    image: "/images/project-syntri.png",
    imageAlt: "Abstract blue topographic territory with connected account signal nodes",
    href: "https://app.syntriai.com",
    cta: "Explore Syntri",
    tone: "blue",
    markers: ["Signals / ranked", "Pipeline / contextualized", "Next action / ready"],
  },
  {
    name: "BLDR",
    title: "From BDR to builder.",
    meta: "EDUCATION · PRODUCT · COMMUNITY",
    description: "A practical path from sales operator to shipping real production software with AI agents.",
    image: "/images/project-bldr.png",
    imageAlt: "Abstract violet system of modular planes becoming a coherent software structure",
    href: "https://whop.com/bldr-e4e2/",
    cta: "Explore BLDR",
    tone: "violet",
    markers: ["Sales / context", "Code / structure", "Product / shipped"],
  },
  {
    name: "Project 160",
    title: "Performance as a system.",
    meta: "PERSONAL SOFTWARE · DATA · PERFORMANCE",
    description: "A private operating system for training, recovery, planning, and deliberate progress.",
    image: "/images/project-160.png",
    imageAlt: "Abstract recovery rings, training blocks and performance paths on a dark field",
    href: undefined,
    cta: "Private system",
    tone: "cyan",
    markers: ["Training / planned", "Recovery / observed", "Progress / reviewed"],
  },
  {
    name: "Lab",
    title: "I prototype a lot.",
    meta: "KOVRANTA · MERIDIA · AMPHIVIA · EXPERIMENTS",
    description: "Small systems for exploring founder motion, decisions, careers, and whatever feels worth testing next.",
    image: "/images/project-lab.png",
    imageAlt: "Four connected abstract experimental systems suspended in a dark coordinate field",
    href: undefined,
    cta: "Ongoing experiments",
    tone: "mixed",
    markers: ["Kovranta", "Meridia", "Amphivia"],
  },
] as const;

type ProjectTheatreProps = {
  activeProject: number;
  onActiveProjectChange: (index: number) => void;
};

export function ProjectTheatre({ activeProject, onActiveProjectChange }: ProjectTheatreProps) {
  const project = projects[activeProject];
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);

  const selectProject = useCallback(
    (index: number) => {
      if (index === activeProject) return;
      setDirection(index > activeProject ? 1 : -1);
      onActiveProjectChange(index);
    },
    [activeProject, onActiveProjectChange],
  );

  const step = (amount: number) => {
    const next = (activeProject + amount + projects.length) % projects.length;
    setDirection(amount > 0 ? 1 : -1);
    onActiveProjectChange(next);
  };

  return (
    <section className="project-theatre" id="work" aria-labelledby="work-heading">
      <div className="chapter-rail" aria-hidden="true">
        <span>02</span>
        <span>WORK</span>
      </div>

      <div className="project-index" role="tablist" aria-label="Selected work">
        {projects.map((item, index) => (
          <button
            key={item.name}
            role="tab"
            aria-selected={activeProject === index}
            aria-controls="project-scene"
            className={activeProject === index ? "is-active" : ""}
            onClick={() => selectProject(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.name}</strong>
          </button>
        ))}
      </div>

      <div
        className={`project-stage project-stage--${project.tone}`}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        tabIndex={0}
        aria-label={`${project.name} project scene. Use left and right arrow keys to change projects.`}
      >
        <div className="project-stage__topline">
          <span>{String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <span>{project.name.toUpperCase()}</span>
          <span>SELECTED WORK</span>
        </div>

        <div className="project-canvas" id="project-scene" role="tabpanel">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              className="project-canvas__media"
              key={project.name}
              custom={direction}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * 28, scale: 1.015 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -20, scale: 0.995 }}
              transition={{ duration: reduceMotion ? 0.18 : 0.68, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={project.image} alt={project.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 76vw" />
              <div className="project-canvas__shade" />
              <div className="project-markers" aria-hidden="true">
                {project.markers.map((marker, index) => (
                  <span key={marker} style={{ "--marker-index": index } as CSSProperties}>{marker}</span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="project-caption"
            key={`${project.name}-caption`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h2 id="work-heading">{project.title}</h2>
              <p>{project.description}</p>
              <span>{project.meta}</span>
            </div>
            {project.href ? (
              <a href={project.href} target="_blank" rel="noreferrer">
                {project.cta} <ArrowUpRight size={14} />
              </a>
            ) : (
              <span className="project-caption__status">{project.cta}</span>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="project-mobile-controls">
          <button onClick={() => step(-1)} aria-label="Previous project"><ArrowLeft size={18} /></button>
          <span>{String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
          <button onClick={() => step(1)} aria-label="Next project"><ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
