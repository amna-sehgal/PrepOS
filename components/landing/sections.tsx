'use client'

import React, { useRef } from 'react'
import { motion, cubicBezier, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { Reveal, SlideIn, StaggerReveal, staggerItem, ScalePop } from '../motion'

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#AFA9EC" strokeWidth="1.5" />
        <path d="M6 9l2 2 4-4" stroke="#AFA9EC" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    iconBg: 'bg-indigo/40',
    title: 'AI mock interview engine',
    desc: 'Full AI-powered interview — role-specific questions, live hints, and a scored performance report. DSA, system design, or HR.',
    tag: 'Flagship feature',
    tagStyle: 'bg-indigo/20 text-indigo-dark',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="2" rx="1" fill="#534AB7" />
        <rect x="2" y="8" width="10" height="2" rx="1" fill="#AFA9EC" />
        <rect x="2" y="12" width="12" height="2" rx="1" fill="#AFA9EC" />
      </svg>
    ),
    iconBg: 'bg-mist',
    title: 'Smart interview tracker',
    desc: 'Log every company and date. The AI auto-generates a personalised prep plan 7 days before your interview.',
    tag: 'AI-powered reminders',
    tagStyle: 'bg-mist text-indigo-dark',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 14l3-3 2 2 5-6" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="4" r="2.5" fill="#AFA9EC" />
      </svg>
    ),
    iconBg: 'bg-mist',
    title: 'Brainstorm board',
    desc: 'Dump your raw ideas. The AI expands any idea into a full proposal with tech stack, timeline, and resume impact score.',
    tag: 'AI idea expansion',
    tagStyle: 'bg-mist text-indigo-dark',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2v4M9 12v4M2 9h4M12 9h4" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="9" r="3" fill="#AFA9EC" />
      </svg>
    ),
    iconBg: 'bg-mist',
    title: 'Prep roadmap generator',
    desc: 'Tell the AI your target role and timeline. Get a week-by-week plan. Track progress, watch your readiness score climb.',
    tag: 'Personalised to you',
    tagStyle: 'bg-mist text-indigo-dark',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
      <Reveal>
        <p className="font-mono-frag text-[11px] tracking-[0.1em] uppercase text-indigo mb-3">
          Everything you need
        </p>
        <h2 className="font-archivo font-black text-[36px] md:text-[42px] leading-[1.05] tracking-[-0.03em] text-void mb-3">
          Not a note-taking app.
          <br />A prep operating system.
        </h2>
        <p className="font-familjen text-[15px] text-void/50 leading-relaxed max-w-lg mb-12">
          Every feature is built around one goal — getting you interview-ready, faster, with less stress.
        </p>
      </Reveal>

      <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="rounded-2xl p-6 cursor-default bg-white border border-void/[0.08]"
          >
            <div className={`w-9 h-9 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
              {f.icon}
            </div>
            <h3
              className="font-archivo font-black text-[17px] tracking-[-0.02em] mb-2 text-void"
            >
              {f.title}
            </h3>
            <p
              className="font-familjen text-[13px] leading-relaxed mb-4 text-void/50"
            >
              {f.desc}
            </p>
            <span
              className={`inline-block font-archivo text-[10px] font-bold rounded-full px-3 py-1 ${f.tagStyle}`}
            >
              {f.tag}
            </span>
          </motion.div>
        ))}
      </StaggerReveal>
    </section>
  )
}

// ─── India Section ─────────────────────────────────────────────────────────────

const tiers = [
  { label: 'T1', name: 'FAANG + Dream', cos: 'Google · Microsoft · Amazon', badge: 'bg-[#534AB7] text-[#EEEDFE]' },
  { label: 'T2', name: 'Top Indian product', cos: 'Razorpay · Groww · Flipkart', badge: 'bg-[#3C3489] text-[#AFA9EC]' },
  { label: 'T3', name: 'Service + mass hiring', cos: 'TCS · Infosys · Wipro', badge: 'bg-white/[0.08] text-[#AFA9EC]/70' },
  { label: 'S',  name: 'Funded startups', cos: 'Any Series A/B startup', badge: 'bg-[#1D9E75]/20 text-[#5DCAA5]' },
]

export function IndiaSection() {
  return (
    <section id="for-colleges" className="py-20 px-6 md:px-12">
      <div
        className="rounded-2xl p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        style={{ backgroundColor: '#1A1035' }}
      >

        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1) }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-block rounded-full"
              style={{ width: '20px', height: '1.5px', backgroundColor: '#AFA9EC' }}
            />
            <p className="font-mono-frag text-[11px] tracking-[0.1em] uppercase"
               style={{ color: '#AFA9EC' }}>
              Built for India
            </p>
          </div>

          {/* Headline */}
          <h2
            className="font-archivo font-black text-[34px] md:text-[38px] leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ color: '#F7F6FD' }}
          >
            Prep that actually understands your{' '}
            <em style={{ fontStyle: 'italic', color: '#AFA9EC' }}>reality.</em>
          </h2>

          {/* Subtext */}
          <p
            className="font-familjen text-[15px] leading-relaxed mb-8"
            style={{ color: 'rgba(247,246,253,0.5)' }}
          >
            Not every student is from IIT. PrepOS understands the tier 2/3 college student targeting
            Razorpay, not Google — and calibrates everything from prep intensity to company patterns accordingly.
          </p>

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="inline-flex"
          >
            <Link
              href="/auth/signup"
              className="no-underline inline-flex items-center gap-2 font-archivo font-bold text-[13px] rounded-full"
              style={{
                color: '#F7F6FD',
                backgroundColor: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                paddingLeft: '20px',
                paddingRight: '14px',
                paddingTop: '10px',
                paddingBottom: '10px',
                letterSpacing: '-0.01em',
                transition: 'background 0.18s, border-color 0.18s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = 'rgba(175,169,236,0.15)'
                el.style.borderColor = 'rgba(175,169,236,0.3)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = 'rgba(255,255,255,0.07)'
                el.style.borderColor = 'rgba(255,255,255,0.12)'
              }}
            >
              See company tiers
              <span
                className="inline-flex items-center justify-center rounded-full text-[10px]"
                style={{ width: '18px', height: '18px', backgroundColor: 'rgba(175,169,236,0.15)', color: '#AFA9EC' }}
              >
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Tier cards */}
        <div className="flex flex-col gap-2">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = 'rgba(255,255,255,0.07)'
                el.style.borderColor = 'rgba(255,255,255,0.11)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.backgroundColor = 'rgba(255,255,255,0.04)'
                el.style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            >
              {/* Badge */}
              <span className={`font-archivo text-[11px] font-black rounded-[6px] px-2 py-1 flex-shrink-0 tracking-[0.02em] ${tier.badge}`}>
                {tier.label}
              </span>

              {/* Divider */}
              <span
                className="flex-shrink-0"
                style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.1)' }}
              />

              {/* Name */}
              <span
                className="font-familjen text-[13px] font-medium"
                style={{ color: 'rgba(247,246,253,0.9)' }}
              >
                {tier.name}
              </span>

              {/* Companies */}
              <span
                className="font-familjen text-[12px] ml-auto"
                style={{ color: 'rgba(247,246,253,0.3)', whiteSpace: 'nowrap' }}
              >
                {tier.cos}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Set your target',
    desc: 'Choose your role, tier, and timeline. PrepOS calibrates everything to your goal.',
    tag: 'Your north star',
    ring: 'bg-[#7F77DD]',
    halo: 'ring-[#7F77DD]/25',
    outerBorder: 'border-indigo-dark/40',
    numColor: 'text-mist',
    tagStyle: 'bg-[#7F77DD]/[0.12] text-indigo',
    cardStyle: 'bg-white border-void/[0.08]',
  },
  {
    num: '02',
    title: 'Log your companies',
    desc: "Add every company you're targeting. Reminders, prep plans, status — handled.",
    tag: 'AI-managed',
    ring: 'bg-[#7F77DD]',
    halo: 'ring-[#7F77DD]/25',
    outerBorder: 'border-indigo-dark/40',
    numColor: 'text-indigo-dark',
    tagStyle: 'bg-[#7F77DD]/[0.12] text-indigo',
    cardStyle: 'bg-white border-void/[0.08]',
  },
  {
    num: '03',
    title: 'Practice daily',
    desc: 'Take AI mock interviews. Work through your roadmap. Watch your readiness climb.',
    tag: 'Score tracked',
    ring: 'bg-[#7F77DD]',
    halo: 'ring-[#7F77DD]/25',
    outerBorder: 'border-indigo-dark/40',
    numColor: 'text-mist',
    tagStyle: 'bg-[#7F77DD]/[0.12] text-indigo',
    cardStyle: 'bg-white border-void/[0.08]',
  },
  {
    num: '04',
    title: 'Walk in ready',
    desc: 'Show up with a prep plan, a score history, and zero surprises.',
    tag: 'The payoff',
    ring: 'bg-[#7F77DD]',
    halo: 'ring-[#7F77DD]/25',
    outerBorder: 'border-indigo-dark/40',
    numColor: 'text-lavender',
    tagStyle: 'bg-[#7F77DD]/[0.12] text-indigo',
    cardStyle: 'bg-white border-void/[0.08]',
    isFinal: true,
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="py-0 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
      <Reveal>
        <p className="font-mono-frag text-[11px] tracking-[0.1em] uppercase text-indigo mb-3">
          Step by step
        </p>
        <h2 className="font-archivo font-black text-[36px] tracking-[-0.03em] text-void mb-12">
          How PrepOS works
        </h2>
      </Reveal>

      <div ref={ref} className="relative grid grid-cols-2 md:grid-cols-4 gap-0">

        {/* Track background */}
        <div className="absolute top-10 left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-[2px] bg-indigo/10 rounded-full hidden md:block" />

        {/* Animated track fill */}
        <motion.div
          className="absolute top-10 left-[calc(12.5%+40px)] h-[2px] bg-gradient-to-r from-indigo via-lavender to-indigo rounded-full hidden md:block"
          initial={{ width: '0%' }}
          animate={isInView ? { width: 'calc(100% - 80px)' } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />

        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            className="flex flex-col items-center text-center px-2.5"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outer halo ring - fully colored */}
            <motion.div
              className={`w-24 h-24 rounded-full border-2 ${s.outerBorder} ${s.ring} flex items-center justify-center relative z-10 shadow-lg`}
              animate={isInView ? {
                boxShadow: [
                  `0 0 0 0px rgba(83,74,183,0.3)`,
                  `0 0 0 12px rgba(83,74,183,0)`,
                ],
              } : {}}
              transition={{ delay: i * 0.18 + 0.4, duration: 0.7 }}
            >
              <div className={`flex items-center justify-center`}>
                {s.isFinal ? (
                  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
                    <path d="M5 11l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="font-archivo font-black text-[32px] tracking-wide text-white">
                    {s.num}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Stem */}
            <motion.div
              className="w-[1.5px] bg-gradient-to-b from-indigo/30 to-transparent"
              initial={{ height: 0 }}
              animate={isInView ? { height: 28 } : {}}
              transition={{ delay: i * 0.18 + 0.15, duration: 0.4 }}
            />

            {/* Card */}
            <motion.div
              className={`rounded-2xl border p-[18px] w-full cursor-default ${s.cardStyle} h-[200px] flex flex-col`}
              whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
            >
              <p className="font-archivo font-bold text-[13px] text-void tracking-[-0.01em] mb-2">
                {s.title}
              </p>
              <p className="font-familjen text-[11.5px] text-void/50 leading-relaxed mb-auto flex-grow">
                {s.desc}
              </p>
              <span className={`inline-block font-archivo text-[10px] font-bold rounded-full px-3 py-1 ${s.tagStyle}`}>
                {s.tag}
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── CTA Footer ───────────────────────────────────────────────────────────────
export function CTAFooter() {
  return (
    <>
      <div className="bg-void py-16 px-6 text-center">
        <Reveal>
          <h2 className="font-archivo font-black text-[40px] md:text-[52px] tracking-[-0.04em] text-void leading-[1.05] mb-3">
            Stop winging it.
            <br />
            <span className="text-lavender">Start PrepOS today.</span>
          </h2>
          <p className="font-familjen text-[15px] text-void/70 mb-8">
            Free for all college students. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/auth/signup">
              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97, y: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 font-archivo font-bold text-[14px] rounded-full cursor-pointer"
                style={{
                  backgroundColor: '#1A1035',
                  color: '#F7F6FD',
                  paddingLeft: '32px',
                  paddingRight: '24px',
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  border: '1px solid rgba(175,169,236,0.2)',
                  transition: 'background-color 0.18s ease',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#26215C')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#1A1035')}
              >
                Create free account
                <span
                  className="inline-flex items-center justify-center rounded-full text-[11px]"
                  style={{ width: '20px', height: '20px', backgroundColor: 'rgba(175,169,236,0.2)', color: '#AFA9EC' }}
                >
                  →
                </span>
              </motion.div>
            </Link>
            <Link href="#how-it-works">
              <motion.div
                whileHover="hover"
                initial="rest"
                className="relative inline-flex items-center font-familjen font-semibold text-[14px] text-[#9D97C2]
                           border border-white/15 rounded-full px-8 py-3.5 no-underline overflow-hidden group cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-lavender/40 rounded-full"
                  variants={{
                    rest: { scaleX: 0 },
                    hover: { scaleX: 1 }
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ originX: 0 }}
                />
                <span className="relative group-hover:text-white transition-colors duration-500">Watch a demo</span>
              </motion.div>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Footer bar */}
      <div className="bg-[#110B27] px-8 py-4 flex items-center justify-between">
        <span className="font-archivo font-black text-[16px] text-[#F5F2FF] tracking-[-0.02em]">
          PrepOS
        </span>
        <span className="font-familjen text-[12px] text-brand">
          Built for every college student in India.
        </span>
      </div>
    </>
  )
}