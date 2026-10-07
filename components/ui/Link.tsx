import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface LinkProps extends ComponentProps<typeof NextLink> {
  variant?: 'default' | 'muted'
}

export function Link({ className, variant = 'default', ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        'link-hover-effect underline-offset-2',
        variant === 'default'
          ? 'text-foreground'
          : 'text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
