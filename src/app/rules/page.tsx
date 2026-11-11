import type { Metadata } from 'next'
import Link from 'next/link'
import { graphSchema, PERSON_ID, personSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: '29 Things I Know So Far — Cristian Sanchez-Aguilera',
  description: 'Principles Cristian Sanchez-Aguilera has collected from doing, failing, and paying attention.',
  alternates: { canonical: '/rules' },
  openGraph: {
    title: '29 Things I Know So Far',
    description: 'Principles collected from doing, failing, and paying attention.',
    url: `${SITE_URL}/rules`,
    type: 'article',
  },
}

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

export default function RulesPage() {
  const schema = graphSchema(
    personSchema,
    {
      '@type': 'Article',
      '@id': `${SITE_URL}/rules#article`,
      headline: '29 Things I Know So Far',
      description: 'Principles collected from doing, failing, and paying attention.',
      url: `${SITE_URL}/rules`,
      mainEntityOfPage: `${SITE_URL}/rules`,
      publisher: { '@id': PERSON_ID },
    },
  )

  return (
    <main id="main" className="rules-doc">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Link href="/blog" className="blog-back">
        ← Writing
      </Link>

      <p className="blog-doc__label">Rules</p>
      <h1>29 Things I Know So Far</h1>
      <p className="blog-doc__lede">
        Principles collected from doing, failing, and paying attention. Updated as I learn.
      </p>

      <ol className="rules-list">
        {rules.map((rule, i) => (
          <li key={i}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <p style={{ margin: 0 }}>{rule}</p>
          </li>
        ))}
      </ol>

      <footer className="blog-footer">
        <p>© 2026 Cristian Sanchez-Aguilera</p>
      </footer>
    </main>
  )
}
