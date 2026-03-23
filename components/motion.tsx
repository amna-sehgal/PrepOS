'use client'

import { motion, useInView, Variants, cubicBezier } from 'framer-motion'
import { useRef } from 'react'

// ─── Reusable fade-up reveal on scroll ───────────────────────────────────────
interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  once?: boolean
}

export function Reveal({ children, delay = 0, className, once = true }: RevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: cubicBezier(0.22, 1, 0.36, 1) }}
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger children ─────────────────────────────────────────────────────────
interface StaggerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

const staggerContainer: Variants = {
  hidden: {},
  show: (staggerDelay: number = 0.1) => ({
    transition: { staggerChildren: staggerDelay },
  }),
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
}

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
}: StaggerProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      custom={staggerDelay}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

export { staggerItem }

// ─── Fade in only (no translate) ─────────────────────────────────────────────
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ─── Slide in from left/right ─────────────────────────────────────────────────
export function SlideIn({
  children,
  direction = 'left',
  delay = 0,
  className,
}: {
  children: React.ReactNode
  direction?: 'left' | 'right'
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const x = direction === 'left' ? -32 : 32

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.65, delay, ease: cubicBezier(0.22, 1, 0.36, 1) }}
    >
      {children}
    </motion.div>
  )
}

// ─── Scale pop (for cards, badges) ───────────────────────────────────────────
export function ScalePop({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.5, delay, ease: cubicBezier(0.34, 1.56, 0.64, 1) }}
    >
      {children}
    </motion.div>
  )
}