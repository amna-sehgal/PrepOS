'use client'

import { motion, cubicBezier, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Target, Map, BarChart3, Flame, Building2, TrendingUp,
  ArrowRight, Zap, Lightbulb, AlertTriangle, CheckCircle2,
  MinusCircle, XCircle, ChevronRight, Mic2, KanbanSquare,
  BookOpen, Clock, Sparkles, Sun, Sunset, Moon, GraduationCap,
  CalendarClock, BrainCircuit, Trophy, Activity,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)

const pageContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease } },
}
const slideRight = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
}

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0
      const step = target / (duration / 16)
      const timer = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 16)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])
  return count
}

const user = { name: 'Arjun Sharma', college: 'BITS Pilani' }

const stats = [
  { label: 'Mock Interviews', value: 12, suffix: '', sub: '+3 this week', color: 'var(--brand)', bg: 'rgba(83,74,183,0.08)', icon: Mic2 },
  { label: 'Day Streak', value: 7, suffix: '', sub: 'Personal best!', color: 'var(--amber)', bg: 'rgba(239,159,39,0.08)', icon: Flame },
  { label: 'Companies', value: 9, suffix: '', sub: '2 interviews soon', color: 'var(--teal)', bg: 'rgba(29,158,117,0.08)', icon: Building2 },
  { label: 'Roadmap', value: 64, suffix: '%', sub: 'Week 5 of 8', color: 'var(--coral)', bg: 'rgba(226,75,74,0.08)', icon: TrendingUp },
]

const continueItems = [
  {
    type: 'Mock Interview', icon: Target,
    title: 'Google SDE Intern — Round 2', desc: 'DSA · Advanced · 3 questions left',
    href: '/mock-interview', accent: 'var(--brand)', accentBg: 'rgba(83,74,183,0.08)', progress: 60,
  },
  {
    type: 'Roadmap', icon: Map,
    title: 'Week 5 — Graphs & DP', desc: '4 of 7 topics completed',
    href: '/roadmap', accent: 'var(--coral)', accentBg: 'rgba(226,75,74,0.08)', progress: 57,
  },
]

const upcomingInterviews = [
  { company: 'Razorpay', role: 'SDE Intern', round: 'Technical Round 1', date: 'Mar 24', daysLeft: 3 },
  { company: 'Flipkart', role: 'SDE Intern', round: 'Online Assessment', date: 'Mar 28', daysLeft: 7 },
  { company: 'Atlassian', role: 'PM Intern', round: 'HR Round', date: 'Apr 3', daysLeft: 13 },
]

const recentScores = [
  { role: 'Google SDE', type: 'DSA', score: 78, date: '2 days ago', breakdown: { correct: 5, partial: 2, wrong: 1 } },
  { role: 'Flipkart PM', type: 'Behavioural', score: 91, date: '4 days ago', breakdown: { correct: 7, partial: 1, wrong: 0 } },
  { role: 'Razorpay SDE', type: 'System Design', score: 63, date: '1 week ago', breakdown: { correct: 3, partial: 3, wrong: 2 } },
]

const aiActions = [
  {
    icon: AlertTriangle, title: 'Razorpay interview in 3 days',
    desc: 'Your 7-day prep plan is ready. Focus: Arrays, Trees, OS basics.',
    cta: 'View prep plan', href: '/tracker',
    accent: 'var(--coral)', bg: 'rgba(226,75,74,0.07)', border: 'rgba(226,75,74,0.18)',
  },
  {
    icon: Lightbulb, title: 'You have 2 unstructured ideas',
    desc: '"ML Resume Screener" and "DSA Visualiser" are sitting in your board.',
    cta: 'Expand with AI', href: '/brainstorm',
    accent: 'var(--brand)', bg: 'rgba(83,74,183,0.07)', border: 'rgba(83,74,183,0.18)',
  },
  {
    icon: BrainCircuit, title: 'Weak area: Dynamic Programming',
    desc: 'Based on your last 3 interviews. Revise before your next session.',
    cta: 'Start practice', href: '/mock-interview',
    accent: 'var(--amber)', bg: 'rgba(239,159,39,0.07)', border: 'rgba(239,159,39,0.18)',
  },
]

const quickActions = [
  { label: 'Start Mock Interview', icon: Mic2, href: '/mock-interview' },
  { label: 'Log a Company', icon: KanbanSquare, href: '/tracker' },
  { label: 'Drop an Idea', icon: Lightbulb, href: '/brainstorm' },
  { label: 'Resources', icon: BookOpen, href: '/resources' },
]

const subScores = [
  { label: 'DSA', val: 68, icon: Activity },
  { label: 'System Design', val: 55, icon: BrainCircuit },
  { label: 'Behavioural', val: 90, icon: Trophy },
]

function scoreColor(s: number) {
  if (s >= 80) return 'var(--teal)'
  if (s >= 60) return 'var(--amber)'
  return 'var(--coral)'
}
function daysLeftStyle(d: number) {
  if (d <= 3) return { color: 'var(--coral)', bg: 'rgba(226,75,74,0.1)' }
  if (d <= 7) return { color: 'var(--amber)', bg: 'rgba(239,159,39,0.1)' }
  return { color: 'var(--teal)', bg: 'rgba(29,158,117,0.1)' }
}
function greetingIcon(h: number) {
  if (h < 6) return Moon
  if (h < 12) return Sun
  if (h < 18) return Sunset
  return Moon
}

function StatCard({ s, i }: { s: typeof stats[0], i: number }) {
  const Icon = s.icon
  const count = useCountUp(s.value, 900, 120 + i * 80)
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(26,16,53,0.09)' }}
      className="rounded-2xl px-5 py-4 transition-all cursor-default group"
      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(26,16,53,0.38)', fontFamily: 'var(--font-archivo)' }}>
          {s.label}
        </span>
        <motion.div
          whileHover={{ rotate: 8, scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: s.bg }}
        >
          <Icon size={14} strokeWidth={1.8} style={{ color: s.color }} />
        </motion.div>
      </div>
      <p className="font-black text-[30px] leading-none tracking-tight mb-1"
        style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
        {count}{s.suffix}
      </p>
      <p className="text-[11px]" style={{ color: 'rgba(26,16,53,0.4)' }}>{s.sub}</p>
    </motion.div>
  )
}

function ScoreRow({ r, i }: { r: typeof recentScores[0], i: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      variants={fadeUp}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex items-center gap-4 px-5 py-4 transition-colors cursor-default"
      style={{ borderBottom: i < recentScores.length - 1 ? '1px solid rgba(26,16,53,0.06)' : 'none' }}
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke={scoreColor(r.score) + '20'} strokeWidth="3" />
          <motion.circle
            cx="24" cy="24" r="20" fill="none"
            stroke={scoreColor(r.score)} strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 20}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - r.score / 100) }}
            transition={{ duration: 1, ease, delay: 0.3 + i * 0.1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-[13px]"
          style={{ fontFamily: 'var(--font-archivo)', color: scoreColor(r.score) }}>
          {r.score}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-[13px]" style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>{r.role}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(26,16,53,0.06)', color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
            {r.type}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'rgba(26,16,53,0.35)' }}>
            <Clock size={10} strokeWidth={1.8} />{r.date}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="hidden sm:flex items-center gap-1.5"
          >
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(29,158,117,0.1)', color: 'var(--teal)' }}>
              <CheckCircle2 size={11} strokeWidth={2} />{r.breakdown.correct}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(239,159,39,0.1)', color: 'var(--amber)' }}>
              <MinusCircle size={11} strokeWidth={2} />{r.breakdown.partial}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(226,75,74,0.1)', color: 'var(--coral)' }}>
              <XCircle size={11} strokeWidth={2} />{r.breakdown.wrong}
            </span>
          </motion.div>
        )}
        {!hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hidden sm:flex">
            <ArrowRight size={14} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.2)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const GreetIcon = greetingIcon(hour)
  const readinessCount = useCountUp(72, 1000, 400)

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>

      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">

        {/* ── Header ── */}
        <motion.div variants={pageContainer} initial="hidden" animate="show"
          className="flex items-start justify-between mb-8 flex-wrap gap-4">

          <motion.div variants={fadeUp}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.05 }}
              className="inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.15)' }}
            >
              <GreetIcon size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--brand)' }}>
                {greeting.toUpperCase()}
              </span>
            </motion.div>

            <h1 className="font-black text-[30px] md:text-[38px] leading-[1.05] tracking-[-0.03em] flex items-center gap-3"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              Hey, {user.name.split(' ')[0]}
              <motion.div
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeInOut' }}
              >
                <GraduationCap size={30} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              </motion.div>
            </h1>

            <p className="text-[14px] mt-1 flex items-center gap-1.5" style={{ color: 'rgba(26,16,53,0.45)' }}>
              <GraduationCap size={12} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.3)' }} />
              {user.college}
              <span style={{ color: 'rgba(26,16,53,0.2)' }}>·</span>
              Here&apos;s where you stand today
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
            {quickActions.map((q, i) => {
              const Icon = q.icon
              return (
                <Link key={i} href={q.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease }}
                    whileHover={{ scale: 1.05, y: -2, boxShadow: '0 6px 20px rgba(26,16,53,0.1)' }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold cursor-pointer"
                    style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)', fontFamily: 'var(--font-archivo)' }}
                  >
                    <Icon size={13} strokeWidth={1.8} />
                    <span>{q.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </motion.div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div variants={pageContainer} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {stats.map((s, i) => <StatCard key={i} s={s} i={i} />)}
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT col ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Continue where you left off */}
            <motion.div variants={pageContainer} initial="hidden" animate="show">
              <motion.div variants={slideRight} className="flex items-center gap-2 mb-3">
                <CalendarClock size={13} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.35)' }} />
                <p className="font-mono-frag text-[11px] tracking-[0.09em]" style={{ color: 'rgba(26,16,53,0.38)' }}>
                  CONTINUE WHERE YOU LEFT OFF
                </p>
              </motion.div>

              <div className="flex flex-col gap-3">
                {continueItems.map((c, i) => {
                  const Icon = c.icon
                  return (
                    <motion.div key={i} variants={fadeUp}>
                      <Link href={c.href} className="no-underline">
                        <motion.div
                          whileHover={{ y: -3, boxShadow: '0 12px 36px rgba(26,16,53,0.09)' }}
                          whileTap={{ scale: 0.99 }}
                          className="rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer transition-all group"
                          style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
                        >
                          <motion.div
                            whileHover={{ rotate: -6, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: c.accentBg }}
                          >
                            <Icon size={20} strokeWidth={1.8} style={{ color: c.accent }} />
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono-frag text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                                style={{ background: c.accentBg, color: c.accent }}>
                                {c.type}
                              </span>
                            </div>
                            <p className="font-bold text-[14px] truncate"
                              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                              {c.title}
                            </p>
                            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(26,16,53,0.45)' }}>{c.desc}</p>

                            <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,16,53,0.06)' }}>
                              <motion.div
                                initial={{ width: 0 }} animate={{ width: `${c.progress}%` }}
                                transition={{ duration: 1, ease, delay: 0.5 + i * 0.15 }}
                                className="h-full rounded-full relative overflow-hidden"
                                style={{ background: c.accent }}
                              >
                                <motion.div
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                                  className="absolute inset-0 w-1/2"
                                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                                />
                              </motion.div>
                            </div>
                            <p className="text-[10px] mt-1 font-mono-frag" style={{ color: 'rgba(26,16,53,0.3)' }}>
                              {c.progress}% complete
                            </p>
                          </div>

                          <motion.div animate={{ x: 0 }} whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
                            <ArrowRight size={16} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.25)', flexShrink: 0 }} />
                          </motion.div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Recent mock scores */}
            <motion.div variants={pageContainer} initial="hidden" animate="show">
              <div className="flex items-center justify-between mb-3">
                <motion.div variants={slideRight} className="flex items-center gap-2">
                  <BarChart3 size={13} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.35)' }} />
                  <p className="font-mono-frag text-[11px] tracking-[0.09em]" style={{ color: 'rgba(26,16,53,0.38)' }}>
                    RECENT MOCK SCORES
                  </p>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Link href="/mock-interview" className="inline-flex items-center gap-1 text-[12px] font-semibold no-underline group"
                    style={{ color: 'var(--brand)' }}>
                    View all
                    <motion.span whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <ChevronRight size={12} strokeWidth={2} />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>

              <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                {recentScores.map((r, i) => <ScoreRow key={i} r={r} i={i} />)}
              </motion.div>
            </motion.div>

            {/* ── Dashboard illustration ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.4 }}
              className="flex items-center justify-center"
            >
              <Image
                src="/Dashboard-bro1.png"
                alt="Dashboard illustration"
                width={480}
                height={480}
                className="object-contain w-full max-w-[480px]"
                priority={false}
              />
            </motion.div>

          </div>

          {/* ── RIGHT col ── */}
          <div className="flex flex-col gap-6">

            {/* AI Suggestions */}
            <motion.div variants={pageContainer} initial="hidden" animate="show">
              <motion.div variants={slideRight} className="flex items-center gap-2 mb-3">
                <Sparkles size={13} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.35)' }} />
                <p className="font-mono-frag text-[11px] tracking-[0.09em]" style={{ color: 'rgba(26,16,53,0.38)' }}>
                  AI SUGGESTED FOR YOU
                </p>
              </motion.div>

              <div className="flex flex-col gap-3">
                {aiActions.map((a, i) => {
                  const Icon = a.icon
                  return (
                    <motion.div key={i} variants={fadeUp}>
                      <Link href={a.href} className="no-underline">
                        <motion.div
                          whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(26,16,53,0.08)' }}
                          whileTap={{ scale: 0.98 }}
                          className="rounded-2xl px-4 py-4 cursor-pointer transition-all"
                          style={{ background: a.bg, border: `1.5px solid ${a.border}` }}
                        >
                          <div className="flex items-start gap-3">
                            <motion.div
                              animate={{ scale: [1, 1.08, 1] }}
                              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: a.accent + '1a' }}
                            >
                              <Icon size={14} strokeWidth={1.8} style={{ color: a.accent }} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[13px] mb-1 leading-snug"
                                style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>{a.title}</p>
                              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'rgba(26,16,53,0.5)' }}>{a.desc}</p>
                              <motion.span
                                className="inline-flex items-center gap-1 text-[11px] font-bold"
                                style={{ color: a.accent, fontFamily: 'var(--font-archivo)' }}
                                whileHover={{ gap: '6px' }}
                              >
                                {a.cta} <ArrowRight size={11} strokeWidth={2.2} />
                              </motion.span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Upcoming interviews */}
            <motion.div variants={pageContainer} initial="hidden" animate="show">
              <div className="flex items-center justify-between mb-3">
                <motion.div variants={slideRight} className="flex items-center gap-2">
                  <CalendarClock size={13} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.35)' }} />
                  <p className="font-mono-frag text-[11px] tracking-[0.09em]" style={{ color: 'rgba(26,16,53,0.38)' }}>
                    UPCOMING INTERVIEWS
                  </p>
                </motion.div>
                <motion.div variants={fadeIn}>
                  <Link href="/tracker" className="inline-flex items-center gap-1 text-[12px] font-semibold no-underline"
                    style={{ color: 'var(--brand)' }}>
                    Tracker <ChevronRight size={12} strokeWidth={2} />
                  </Link>
                </motion.div>
              </div>

              <div className="flex flex-col gap-2">
                {upcomingInterviews.map((u, i) => {
                  const ds = daysLeftStyle(u.daysLeft)
                  return (
                    <motion.div key={i} variants={fadeUp}
                      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(26,16,53,0.07)' }}
                      className="rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all cursor-default"
                      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[13px] flex-shrink-0"
                        style={{ background: 'var(--mist)', color: 'var(--brand)', fontFamily: 'var(--font-archivo)' }}
                      >
                        {u.company[0]}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] truncate"
                          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                          {u.company}
                          <span className="font-normal text-[11px] ml-1" style={{ color: 'rgba(26,16,53,0.4)' }}>· {u.role}</span>
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(26,16,53,0.4)' }}>{u.round}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <motion.span
                          animate={u.daysLeft <= 3 ? { scale: [1, 1.06, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="font-mono-frag text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: ds.bg, color: ds.color }}
                        >
                          {u.daysLeft}d
                        </motion.span>
                        <span className="text-[10px]" style={{ color: 'rgba(26,16,53,0.3)' }}>{u.date}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Readiness score — dark card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.35 }}
              className="rounded-2xl px-5 py-5 relative overflow-hidden"
              style={{ background: 'var(--void)' }}
            >
              <div className="absolute top-0 right-0 w-40 h-90 opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'var(--brand)' }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'rgba(238,237,254,0.4)' }}>
                    OVERALL READINESS
                  </p>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles size={13} strokeWidth={1.8} style={{ color: 'rgba(238,237,254,0.25)' }} />
                  </motion.div>
                </div>

                <div className="flex items-end gap-2 mb-1">
                  <span className="font-black text-[52px] leading-none tracking-tight"
                    style={{ fontFamily: 'var(--font-archivo)', color: 'var(--mist)' }}>
                    {readinessCount}
                  </span>
                  <span className="text-[15px] mb-3" style={{ color: 'rgba(238,237,254,0.35)' }}>/100</span>
                </div>

                <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(238,237,254,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: '72%' }}
                    transition={{ duration: 1.2, ease, delay: 0.55 }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: 'var(--lavender)' }}
                  >
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                      className="absolute inset-0 w-1/2"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
                    />
                  </motion.div>
                </div>

                {subScores.map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="flex items-center justify-between mb-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(238,237,254,0.5)' }}>
                        <Icon size={11} strokeWidth={1.8} />
                        {s.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(238,237,254,0.1)' }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${s.val}%` }}
                            transition={{ duration: 0.9, ease, delay: 0.8 + i * 0.12 }}
                            className="h-full rounded-full"
                            style={{ background: s.val >= 75 ? 'var(--teal)' : s.val >= 55 ? 'var(--lavender)' : 'var(--coral)' }}
                          />
                        </div>
                        <span className="font-mono-frag text-[11px] w-7 text-right" style={{ color: 'rgba(238,237,254,0.45)' }}>
                          {s.val}
                        </span>
                      </div>
                    </div>
                  )
                })}

                <Link href="/mock-interview" className="no-underline">
                  <motion.div
                    whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(83,74,183,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 w-full rounded-xl py-2.5 text-[12px] font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
                    style={{ background: 'var(--brand)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}
                  >
                    Improve your score
                    <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                      <ArrowRight size={13} strokeWidth={2.2} />
                    </motion.span>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}