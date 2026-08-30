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

# Design QA — Nebula product-wall logo update

## Comparison target

- Source visual truth: `/Users/cristiansanchez/Downloads/ChatGPT Image Aug 30, 2026, 03_06_41 PM.png`.
- Implementation screenshots: `/tmp/nebula-product-wall-desktop.png` and `/tmp/nebula-profile-desktop.png`.
- Combined comparison evidence: the source image and both desktop implementation captures were opened together during the final visual review.
- Route and state: `http://127.0.0.1:3000/#ecosystem`, light theme, Nebula card visible and Nebula profile dialog open.
- Source pixels: 1254 × 1254 RGBA.
- Desktop implementation pixels and CSS viewport: 1707 × 960 at the browser's default density.
- Responsive evidence: the in-app browser measured 391 × 844 CSS pixels after a temporary narrow viewport override; the card and dialog rendered in the one-column layout. The narrow viewport compositor did not produce a reliable viewport screenshot, so mobile proof is recorded through DOM visibility, geometry, and interaction state rather than treated as visual screenshot evidence.

## Findings

- No actionable P0, P1, or P2 fidelity issues remain.
- The supplied blue-violet modular cube replaces the previous star-field N mark without changing the product-wall card, modal, copy, or animation behavior.

## Required fidelity surfaces

- Fonts and typography: unchanged existing site typography; Nebula card and dialog copy keep their prior hierarchy and wrapping.
- Spacing and layout rhythm: existing card and dialog logo frames remain intact; the mark is contained without clipping at desktop and mobile widths.
- Colors and visual tokens: the reference's deep navy, violet, and electric blue faces are preserved; the existing dark tile provides the intended contrast in the light product-wall theme.
- Image quality and asset fidelity: `public/images/project-nebula.png` is byte-for-byte identical to the supplied PNG and remains a real raster asset rendered through `next/image`.
- Copy and content: no Nebula copy changed.

## Focused region comparison

- The source mark's six separated faces, central violet top, and blue-to-violet lower faces are visible in the card and profile logo frames. The existing `object-fit: contain` treatment preserves the full silhouette and transparent margins.

## Interaction and responsive verification

- Clicking `Learn more about Nebula` opened the Nebula dialog with one visible `Nebula logo` image; closing it removed the dialog and returned to the card.
- The same card and dialog interaction passed at the 391 × 844 CSS-pixel mobile breakpoint.
- Final clean in-app browser tab reported zero relevant console warnings or errors.

## Comparison history

- Final desktop comparison: source, card, and profile captures showed the same supplied mark with no actionable P0/P1/P2 mismatch.
- Final mobile check: DOM visibility, logo presence, dialog state, and card geometry passed; screenshot capture was excluded from fidelity judgment because the narrow in-app compositor returned a blank viewport while the DOM remained rendered.

## Automated verification

- `npm run build`: passed, including TypeScript, static generation, and route generation. Next emitted only its existing multiple-lockfile workspace-root warning.
- `npm run lint`: passed.
- `git diff --check`: passed.

## Follow-up polish

- None required for this asset-only update.

final result: passed
