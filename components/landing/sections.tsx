'use client'
import { motion, cubicBezier, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { Reveal, SlideIn, StaggerReveal, staggerItem, ScalePop } from '../motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import FeedbackModal from "@/components/landing/FeedbackModal";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  MessageSquare,
} from 'lucide-react'

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
  { label: 'S', name: 'Funded startups', cos: 'Any Series A/B startup', badge: 'bg-[#1D9E75]/20 text-[#5DCAA5]' },
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

// how it works
const steps = [
  {
    num: '01',
    title: 'Set your target',
    desc: 'Choose your role, tier, and timeline. PrepOS calibrates everything to your goal.',
    tag: 'Your north star',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#534AB7" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    accentBg: 'bg-indigo/8',
  },
  {
    num: '02',
    title: 'Log your companies',
    desc: 'Add every company you\'re targeting. Reminders, prep plans, status — handled.',
    tag: 'AI-managed',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="2.5" rx="1.25" fill="#7F77DD" />
        <rect x="3" y="11" width="13" height="2.5" rx="1.25" fill="#AFA9EC" />
        <rect x="3" y="16" width="15" height="2.5" rx="1.25" fill="#AFA9EC" />
      </svg>
    ),
    accentBg: 'bg-lavender/8',
  },
  {
    num: '03',
    title: 'Practice daily',
    desc: 'Take AI mock interviews. Work through your roadmap. Watch your readiness climb.',
    tag: 'Score tracked',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 17L5 13M5 13l4-4M5 13h14M19 7v10" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    accentBg: 'bg-indigo/8',
  },
  {
    num: '04',
    title: 'Walk in ready',
    desc: 'Show up with a prep plan, a score history, and zero surprises.',
    tag: 'The payoff',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="#7F77DD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="#7F77DD" strokeWidth="2" />
      </svg>
    ),
    accentBg: 'bg-lavender/8',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const stepElements = document.querySelectorAll('[data-step]')
      let closestIndex = 0
      let closestDistance = Infinity

      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        const elementCenter = rect.top + rect.height / 2
        const viewportCenter = window.innerHeight / 2
        const distance = Math.abs(elementCenter - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  return (
    <section id="how-it-works" className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
      <Reveal>
        <p className="font-mono-frag text-[11px] uppercase tracking-[0.1em] text-indigo mb-3">
          Step by step
        </p>
        <h2 className="font-archivo font-black text-[36px] md:text-[42px] text-void mb-12">
          How PrepOS works
        </h2>
      </Reveal>

      <div ref={ref} className="relative">
        {/* Static vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-void/8" />

        <div className="flex flex-col gap-8">
          {steps.map((step, i) => {
            const isActive = i === activeIndex

            return (
              <motion.div
                key={step.num}
                data-step
                data-index={i}
                className="flex gap-4 md:gap-6 items-start"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Node */}
                <motion.div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-archivo font-bold text-[14px] flex-shrink-0"
                  animate={{
                    backgroundColor: isActive ? '#534AB7' : '#E8E6F5',
                    color: isActive ? '#F7F6FD' : '#534AB7',
                    boxShadow: isActive
                      ? '0 0 0 8px rgba(83,74,183,0.15)'
                      : '0 0 0 0px rgba(83,74,183,0)',
                  }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {step.num}
                </motion.div>

                {/* Card */}
                <motion.div
                  className="flex-1 rounded-2xl border overflow-hidden"
                  animate={{
                    backgroundColor: isActive ? 'rgba(245,242,255,0.95)' : 'rgba(248,247,252,0.6)',
                    borderColor: isActive ? 'rgba(83,74,183,0.35)' : 'rgba(0,0,0,0.08)',
                    boxShadow: isActive
                      ? '0 8px 24px rgba(83,74,183,0.15)'
                      : '0 0px 0px rgba(83,74,183,0)',
                    y: isActive ? -4 : 0,
                  }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  <div className="p-6">
                    {/* Icon + Tag row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        {step.icon}
                      </div>
                      <motion.span
                        className="font-archivo text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.02em]"
                        animate={{
                          backgroundColor: isActive ? 'rgba(83,74,183,0.18)' : 'rgba(83,74,183,0.1)',
                          color: isActive ? '#534AB7' : '#7F77DD',
                        }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                      >
                        {step.tag}
                      </motion.span>
                    </div>

                    {/* Content */}
                    <h3 className="font-archivo font-black text-[17px] text-void mb-2 tracking-[-0.01em]">
                      {step.title}
                    </h3>
                    <p className="font-familjen text-[13px] text-void/65 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
// ─── CTA Footer ───────────────────────────────────────────────────────────────
export function CTAFooter() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return (
    <>
      {/* DARK CTA SECTION */}
      <div className="bg-[#110B27] py-20 px-6 text-center relative overflow-hidden">

        {/* subtle glow background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1035]/40 to-transparent pointer-events-none" />

        <Reveal>
          <h2 className="font-archivo font-black text-[40px] md:text-[52px] tracking-[-0.04em] text-[#F5F2FF] leading-[1.05] mb-3">
            Stop winging it.
            <br />
            <span className="text-[#AFA9EC]">Start PrepOS today.</span>
          </h2>

          {/* FIX 1: brighter paragraph */}
          <p className="font-familjen text-[15px] text-[#F5F2FF] opacity-100 mb-10">
            Free for all college students. No credit card required.
          </p>

          <div className="flex items-center justify-center">
            <Link href="/auth/signup">
              <motion.div
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}

                /* FIX 2: remove any dullness, make fully solid */
                className="inline-flex items-center gap-2 font-archivo font-bold text-[14px] rounded-full cursor-pointer"

                style={{
                  backgroundColor: '#F5F2FF',
                  color: '#110B27', // darker text = more contrast (FIX)
                  paddingLeft: '34px',
                  paddingRight: '26px',
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  opacity: 1, // ensure no inherited fade
                }}
              >
                Create free account

                <span
                  className="inline-flex items-center justify-center rounded-full text-[11px]"
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#AFA9EC',
                    color: '#110B27',
                    opacity: 1,
                  }}
                >
                  →
                </span>
              </motion.div>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* FOOTER BAR */}
      <div className="bg-[#0B071A] px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

        <span className="font-archivo font-black text-[15px] text-[#F5F2FF]">
          PrepOS
        </span>

        <span className="font-familjen text-[12px] text-[#F5F2FF] opacity-90 text-center">
          Built for every college student in India.
        </span>

        <div className="flex items-center gap-5">

          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-2 text-[12px] transition-all hover:opacity-100 opacity-80"
            style={{
              color: "#C8C3FF",
            }}
          >
            <MessageSquare size={14} />
            Feedback
          </button>

          <span className="font-familjen text-[12px] text-[#AFA9EC]">
            Created by Amna ✨
          </span>

        </div>

      </div>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  )
}