// components/ui/Button.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'dark-primary' | 'dark-ghost'

const variants: Record<ButtonVariant, {
  base: string
  fill: string
  textRest: string
  textHover: string
}> = {
  // Light bg: mist → void fill
  'primary': {
    base: 'bg-mist text-void',
    fill: 'bg-void',
    textRest: 'text-void',
    textHover: 'group-hover:text-mist',
  },
  // Light bg: transparent + border → void fill  
  'outline': {
    base: 'bg-transparent text-void/50 ring-1 ring-void/15',
    fill: 'bg-void',
    textRest: 'text-void/50',
    textHover: 'group-hover:text-mist',
  },
  // Dark bg: mist → indigo fill
  'dark-primary': {
    base: 'bg-mist text-void',
    fill: 'bg-indigo',
    textRest: 'text-void',
    textHover: 'group-hover:text-mist',
  },
  // Dark bg: ghost → mist fill
  'dark-ghost': {
    base: 'bg-transparent text-[#9D97C2] ring-1 ring-white/15',
    fill: 'bg-mist',
    textRest: 'text-[#9D97C2]',
    textHover: 'group-hover:text-void',
  },
}

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  children: ReactNode
  withArrow?: boolean
  className?: string
}

export function Button({
  href,
  onClick,
  variant = 'primary',
  children,
  withArrow = false,
  className = '',
}: ButtonProps) {
  const v = variants[variant]

  const inner = (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className={`
        group relative inline-flex items-center gap-2
        font-archivo font-bold text-[13px] rounded-full
        overflow-hidden cursor-pointer
        ${v.base} ${className}
      `}
      style={{ padding: '10px 24px' }}
    >
      {/* ── Wave fill: rises bottom-up ── */}
      <span
        className={`
          absolute inset-0 rounded-full ${v.fill}
          translate-y-full group-hover:translate-y-0
          transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]
        `}
        aria-hidden
      />

      {/* Arrow dot (optional) */}
      {withArrow && (
        <span className={`
          relative z-10 w-[20px] h-[20px] rounded-full
          bg-void/10 flex items-center justify-center text-xs
          transition-colors duration-300 delay-75
          ${v.textHover}
        `}>
          →
        </span>
      )}

      {/* Label */}
      <span className={`
        relative z-10 transition-colors duration-300 delay-75
        ${v.textRest} ${v.textHover}
      `}>
        {children}
      </span>
    </motion.div>
  )

  if (href) {
    return <Link href={href} className="no-underline">{inner}</Link>
  }

  return <div onClick={onClick}>{inner}</div>
}