// The button recipes, in a module of their own (not inside a 'use client'
// file) so both server and client components can import them.

/* The glass pill, the primary action (Email in the bar and the hero): a
   top-lit white face with an inner highlight ring and a soft drop. The whites
   and the near-black label are hardcoded on purpose: a lit object, identical
   in both themes, the one exception to the token rule. Callers add sizing, put
   `glassPillFace` as the element's background, and render an absolute
   rounded-full span carrying `glassPillShadow` under a `relative` label. */
export const glassPill =
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-[13px]/4 font-semibold text-[#1f1f1f] transition-[scale,filter] ease-snap hover:scale-[1.02] hover:brightness-105 active:scale-[0.97]'
export const glassPillFace = 'linear-gradient(to bottom, #ffffff 0%, #f3f3f3 55%, #e8e8e8 100%)'
export const glassPillShadow =
  'inset 0 1px 0 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 -8px 14px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.35)'

// The matching quiet pill for the pair's second action (Resume): same
// geometry, on tokens, no drop shadow. A tonal fill under the hairline gives
// it the same visual mass as the solid face next to it.
export const outlinePillBase =
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-[13px]/4 font-semibold transition-[background-color,scale] ease-snap active:scale-[0.97]'
// Its tone on the page ground; a card with a ground of its own passes its own tone.
export const outlinePillTone =
  'border-foreground/15 bg-foreground/[0.06] text-foreground hover:bg-foreground/10 dark:border-foreground/20 dark:bg-foreground/10 dark:hover:bg-foreground/[0.14]'
export const outlinePill = `${outlinePillBase} ${outlinePillTone}`
