'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { HugeiconsIcon } from '@hugeicons/react'
import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

// One-tap light/dark switch: sun and moon swap with a quarter turn. Reads the
// resolved theme so the icon tells the truth after hydration.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const dark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/60 transition-[background-color,color,scale] ease-snap hover:bg-foreground/[0.06] hover:text-foreground active:scale-[0.97] sm:size-9 dark:hover:bg-foreground/[0.12]"
    >
      <span className="relative flex size-4 items-center justify-center">
        <HugeiconsIcon
          icon={Sun03Icon}
          size={16}
          strokeWidth={2}
          className={cn(
            'transition-transform duration-200 ease-snap motion-reduce:transition-none',
            dark ? 'scale-0 -rotate-90' : 'scale-100 rotate-0'
          )}
        />
        <HugeiconsIcon
          icon={Moon02Icon}
          size={16}
          strokeWidth={2}
          className={cn(
            'absolute transition-transform duration-200 ease-snap motion-reduce:transition-none',
            dark ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
          )}
        />
      </span>
    </button>
  )
}
