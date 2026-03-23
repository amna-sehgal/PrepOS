'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { scrollY } = useScroll()
  const [activeSection, setActiveSection] = useState('')
  const [ctaHovered, setCtaHovered] = useState(false)

  // Pill gets slightly more opaque + stronger border on scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0.82, 0.96])
  const borderOpacity = useTransform(scrollY, [0, 80], [0.12, 0.22])
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'about', 'pricing']
      for (const section of sections) {
        const el = document.querySelector(`#${section}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            return
          }
        }
      }
      setActiveSection('')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'About', id: 'about' },
    { label: 'Pricing', id: 'pricing' },
  ]

  return (
    <div className="sticky top-0 z-50 flex justify-center px-5 md:px-10 pt-4 pointer-events-none">
      <motion.header
        className="relative w-full max-w-4xl pointer-events-auto"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* Glass bg */}
        <motion.div
          className="absolute inset-0 rounded-full backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(247,246,253,var(--tw-bg-opacity, 1))',
            opacity: bgOpacity,
          }}
        />

        {/* Border */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(83,74,183,0.15)',
            opacity: borderOpacity,
          }}
        />

        {/* Shadow on scroll */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: '0 8px 32px rgba(26,16,53,0.1)',
            opacity: shadowOpacity,
          }}
        />

        {/* Always-visible pill border */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(83,74,183,0.12)' }}
        />

        <nav className="relative flex items-center justify-between h-[54px] px-5">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <Image
              src="/Screenshot 2026-03-19 215740.png"
              alt="PrepOS"
              width={30}
              height={30}
              className="rounded-lg"
            />
            <span
              className="font-archivo font-black hidden sm:inline"
              style={{ fontSize: '16px', letterSpacing: '-0.04em', color: '#1A1035' }}
            >
              PrepOS
            </span>
          </Link>

          {/* Center: Nav links — flip animation on hover */}
          <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(({ label, id }) => {
              const isActive = activeSection === id
              return (
                <Link
                  key={id}
                  href={`#${id}`}
                  className="relative no-underline overflow-hidden rounded-full px-4 py-1.5 font-familjen font-semibold group"
                  style={{
                    fontSize: '13.5px',
                    background: isActive ? '#534AB7' : 'rgba(83,74,183,0.1)',
                    color: isActive ? '#F7F6FD' : '#534AB7',
                    border: isActive ? '1px solid #534AB7' : '1px solid rgba(83,74,183,0.18)',
                    transition: 'color 0.22s ease, border-color 0.22s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#F7F6FD'
                      el.style.borderColor = '#1A1035'
                      const bg = el.querySelector('.flip-bg') as HTMLElement
                      if (bg) bg.style.transform = 'translateY(0%)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = '#534AB7'
                      el.style.borderColor = 'rgba(83,74,183,0.18)'
                      const bg = el.querySelector('.flip-bg') as HTMLElement
                      if (bg) bg.style.transform = 'translateY(101%)'
                    }
                  }}
                >
                  {/* Flip background */}
                  <span
                    className="flip-bg absolute inset-0 rounded-full"
                    style={{
                      background: isActive ? '#26215C' : '#1A1035',
                      transform: 'translateY(101%)',
                      transition: 'transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                  <span className="relative z-10">{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href="/auth/login"
              className="hidden sm:block font-familjen no-underline px-3 py-1.5 rounded-full transition-colors duration-150"
              style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(26,16,53,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1A1035')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,16,53,0.4)')}
            >
              Log in
            </Link>

            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Link
                href="/auth/signup"
                className="no-underline inline-flex items-center gap-1.5 font-archivo font-bold rounded-full"
                style={{
                  fontSize: '13px',
                  letterSpacing: '-0.01em',
                  backgroundColor: ctaHovered ? '#26215C' : '#1A1035',
                  color: '#F7F6FD',
                  paddingLeft: '16px',
                  paddingRight: '10px',
                  paddingTop: '9px',
                  paddingBottom: '9px',
                  transition: 'background-color 0.18s ease',
                }}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                Sign up free
                <span
                  className="inline-flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: 'rgba(175,169,236,0.22)',
                    color: '#AFA9EC',
                    fontSize: '10px',
                  }}
                >
                  →
                </span>
              </Link>
            </motion.div>
          </div>

        </nav>
      </motion.header>
    </div>
  )
}