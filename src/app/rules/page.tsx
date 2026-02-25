'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

const rules = [
  "When in a hole, sometimes the way out is digging deeper. Parry the punches.",
  "Don't be moved by the volatility of life. As above, so below.",
  "Experiences are just that — this too will pass. Make it a story worth telling that others wished they had the courage to live.",
  "Without a project, a hobby, or a dream — life is mundane.",
  "When overthinking takes over, move. Both physically and mentally.",
  "Always think from first principles.",
  "Being granted life also means being granted death. Neither should be wasted.",
  "Not everyone needs to understand. That's okay.",
  "Always remain introspective.",
  "Build first, fix later. Speed and momentum compound exponentially.",
  "Much of life is people playing along to fit in. You don't always have to play.",
  "Pick your battles. Sometimes sharpening the axe is the smarter move.",
  "The only thing you truly own is your mind. Treat it accordingly.",
  "Your future self is watching you right now — through the memories you're making.",
  "Unless a mistake is catastrophic, it's just feedback. Seek failure.",
  "Repetition without iteration is just wasted motion. Seek iterations.",
  "People want to do the smart work before the hard work. Do the hard work first, then optimize both.",
  "Focus will be the scarcest resource of your generation. Snipe each task with aggression, precision, and intention.",
  "Humans are far less rational than you think.",
  "Your environment shapes you subconsciously. Be deliberate about what you absorb.",
  "Read people when you first meet them. It tells you everything.",
  "You can learn something from anyone — even those you never want to become.",
  "When receiving advice, ask: does this person have my best interest in mind? What do they gain from me thinking this way?",
  "If you can't find the motivation to change for yourself — change for the people watching.",
  "Protect your childlike imagination. Society will try to sand you down into the same shape as everyone else living life on autopilot.",
  "In two generations, nearly everyone alive today will be forgotten. It will be okay.",
  "Observe your thoughts — don't become them. When your mind has discourse, add a second judge.",
  "Game theory is real. Learn to play it consciously.",
  "Once your goals are achieved, helping others becomes the purpose.",
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

export default function RulesPage() {
  return (
    <main className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-[var(--bg)] px-6 py-20`}>
      <div className="max-w-[560px] md:max-w-[780px] mx-auto">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}>
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] font-[family-name:var(--font-geist-sans)] hover:text-[var(--text)] transition-colors duration-200 mb-14">
            <ArrowLeft size={12} />
            Back
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-14">
          <p className="text-[10px] font-medium tracking-[0.14em] uppercase text-[var(--muted)] font-[family-name:var(--font-geist-sans)] mb-3">
            Rules
          </p>
          <h1 className="font-[family-name:var(--font-geist-mono)] text-3xl md:text-4xl font-normal text-[var(--text)] leading-tight mb-3">
            29 Things I Know So Far
          </h1>
          <p className="text-sm text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light leading-[1.7]">
            Principles collected from doing, failing, and paying attention. Updated as I learn.
          </p>
        </motion.div>

        {/* Rules List */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-0">
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group flex gap-6 py-5 border-b border-[var(--border)]">
              <span className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[var(--border)] group-hover:text-emerald-500 transition-colors duration-300 pt-0.5 select-none min-w-[24px] shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm text-[var(--muted)] font-[family-name:var(--font-geist-sans)] font-light leading-[1.8] group-hover:text-[var(--text)] transition-colors duration-300">
                {rule}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <p className="mt-16 text-[11px] text-[var(--muted)] font-[family-name:var(--font-geist-sans)] tracking-wide">
          © 2026 Cristian Sanchez-Aguilera
        </p>

      </div>
    </main>
  )
}
