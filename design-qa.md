# Design QA — ASCII Operator Loop Hero

## Comparison target

- Source visual truth: `/Users/cristiansanchez/.codex/generated_images/01a021a2-85e1-7321-802a-c219cb071bc2/exec-1c03a1ba-4dbe-4947-a6a3-ba7b6e28e806.png`
- Browser-rendered implementation: `/Users/cristiansanchez/cristiansanchezaguilera/qa-hero-ascii.jpg`
- Combined comparison evidence: `/Users/cristiansanchez/cristiansanchezaguilera/qa-hero-comparison.jpg`
- Route and state: `http://localhost:3000/#top`, dark theme, hero at rest, SALES loop node active.
- Source pixels: 1672 × 941.
- Implementation capture: 3055 × 1719 pixels from a 2048 × 1152 CSS-pixel viewport at reported device pixel ratio 0.67.
- Normalization: implementation capture resized to 1672 × 941 before placing source and implementation side by side.

## Findings

- No actionable P0, P1, or P2 fidelity issues remain.
- The source's diagonal raster wave is intentionally replaced by a live ASCII vortex. This is a user-directed material change, not a missing asset.
- The source's generated headline and supporting copy are intentionally not reproduced. The implementation uses the verified personal story and the selected composition only.
- The existing proof rail remains below the hero to preserve the site's section architecture and create a visible transition into the ecosystem.

## Required fidelity surfaces

- Fonts and typography: the implementation preserves the site's Geist sans and Instrument Serif pairing. The mixed sans/serif headline and small tracked metadata match the source hierarchy without copying its generated wording.
- Spacing and layout rhythm: the hero is full width, uses the source's asymmetric split, keeps the primary statement on the left, and places the operating loop inside the right-side ASCII vortex. There is no horizontal overflow at the inspected desktop or compact responsive viewport.
- Colors and tokens: the existing dark navy, signal blue, muted text, fine borders, and low-contrast metadata remain intact. The ASCII field uses the same blue token family and stays subordinate to the content.
- Image quality and asset fidelity: no raster hero image is used. The field is rendered from live monospace text, so it remains sharp at changing viewport sizes and avoids compression artifacts.
- Copy and content: the hero identifies Cristian, states the sales-and-software thesis, names the customer-to-product behavior, and keeps the verified New York location and enterprise-sales-at-19 fact.

## Focused region comparison

- Headline: the implementation preserves the source's dominant left-side hierarchy, but uses the approved personal thesis and italic serif emphasis on “software.”
- Operating loop: the implementation preserves the circular Sales → Customers → Product → Ship composition. Each label is a real keyboard-focusable tab and reveals one short statement.
- Motion field: the implementation follows the source's flow into a center vortex using an animated ASCII density ramp. Pointer motion shifts the focal center; reduced-motion mode freezes the field.
- Transition: the same fixed ASCII field remains faintly visible behind the ecosystem and later sections, preventing the hero from reading as a detached landing-page panel.

## Interaction and responsive verification

- Clicking the CUSTOMERS loop tab changed `aria-selected` to CUSTOMERS and revealed “Hear what the pitch missed.”
- The loop cycles one chapter at a time and restarts its interval after manual selection.
- Compact responsive capture retained the complete headline, CTAs, loop, Now signal, and ASCII field with no measured horizontal overflow.
- `prefers-reduced-motion` stops the ASCII animation and collapses transition durations through the existing global motion contract.
- Fresh browser session: zero console warnings or errors.

## Comparison history

- Initial live pass: a development-only Fast Refresh warning appeared because a hook dependency array changed during hot reload. The local server was restarted, the page was recaptured, and the issue overlay disappeared. A clean browser tab then reported zero warnings/errors.
- Post-fix pass: full-width hero, ASCII field, loop labels, proof transition, and compact responsive state remained intact. No additional P0/P1/P2 visual fix was required.

## Automated verification

- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed, including TypeScript, static generation, and route generation.
- The sandboxed Turbopack attempt could not start its local compiler process; the permitted production build completed successfully.

## Follow-up polish

- P3: tune ASCII density and speed after observing the animation on the user's preferred physical mobile device.

final result: passed
