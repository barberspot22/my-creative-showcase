## Problem

On `/crm`, the section intro block in `#estrutura` (heading "Dois módulos, cada um com sua própria lógica.") is meant to stay pinned on the left while the numbered list scrolls on the right. Today it doesn't behave as fixed:

- The `ProductSwitcher` above it is `position: sticky; top: 0` (~46px tall), but `.crmSectionIntro` uses `top: 70px` with no accounting for the switcher — they can visually collide and the heading gets pushed under the switcher on some viewports.
- The mobile media query (`max-width: 760px`) forces `.crmSectionIntro { position: static }`. At tablet widths just above that (e.g. 768px, the current preview) the grid stays 2-column but the intro no longer feels anchored, so as the user scrolls the list the heading scrolls away and overlaps the next section's text.

## Fix (CSS-only, `src/imported.css`)

1. Make `.crmSectionIntro` reliably sticky:
   - Keep `position: sticky; align-self: start`.
   - Change `top` to sit just below the `ProductSwitcher` (approx `top: 60px`) and add a small `padding-bottom` so descenders don't touch the list rows behind it.
   - Add `z-index: 1` so the pinned heading paints above the scrolling column, and a subtle background matching `.crmStructure` (`background: var(--cream)` in default theme / `#050807` in the dark override on line 1165) so text doesn't bleed through.

2. Keep it sticky on tablet, only drop to static on true mobile:
   - Remove `.crmSectionIntro { position: static }` from the `@media (max-width: 760px)` block, or narrow it to `@media (max-width: 620px)` so 768px preview keeps the sticky behavior.

3. No changes to `src/routes/crm.tsx` markup or copy.

## Files touched

- `src/imported.css` — update `.crmSectionIntro` rule (~line 125 block) and the mobile override (~line 127 block).

## Verification

- Load `/crm` at 768px and desktop: scroll through `#estrutura` and confirm the heading stays pinned under the ProductSwitcher and never overlaps the "RECOVER DENTRO DO CRM" section below.
- At <620px, intro flows inline as before.
