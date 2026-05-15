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
import { createClient } from '@/lib/supabase/client'
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

function StatCard({ s, i }: { s: any, i: number }) {
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

function ScoreRow({ r, i, total }: { r: any, i: number, total: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      variants={fadeUp}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex items-center gap-4 px-5 py-4 transition-colors cursor-default"
      style={{ borderBottom: i < total - 1 ? '1px solid rgba(26,16,53,0.06)' : 'none' }}
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
  type UserState = {
    name: string
    college: string
  }

  const [user, setUser] = useState<UserState>({
    name: '',
    college: '',
  })
  const [readiness, setReadiness] = useState(0)
  const [completedInterviews, setCompletedInterviews] = useState<any[]>([])
  const subScores = [
    {
      label: 'DSA',
      val: Math.round(
        completedInterviews
          .filter((i: any) => i.type === 'DSA')
          .reduce((sum: number, i: any) => sum + (i.score || 0), 0) /
        (completedInterviews.filter((i: any) => i.type === 'DSA').length || 1)
      ),
      icon: Activity,
    },
    {
      label: 'System Design',
      val: Math.round(
        completedInterviews
          .filter((i: any) => i.type === 'System Design')
          .reduce((sum: number, i: any) => sum + (i.score || 0), 0) /
        (completedInterviews.filter((i: any) => i.type === 'System Design').length || 1)
      ),
      icon: BrainCircuit,
    },
    {
      label: 'Behavioural',
      val: Math.round(
        completedInterviews
          .filter((i: any) => i.type === 'Behavioural')
          .reduce((sum: number, i: any) => sum + (i.score || 0), 0) /
        (completedInterviews.filter((i: any) => i.type === 'Behavioural').length || 1)
      ),
      icon: Trophy,
    },
  ]

  const [continueItems, setContinueItems] = useState<any[]>([])
  const [roadmap, setRoadmap] = useState<any>(null)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const GreetIcon = greetingIcon(hour)
  const readinessCount = useCountUp(readiness, 1000, 400)
  const supabase = createClient()
  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([])
  const [mockCount, setMockCount] = useState(0)
  const [companyCount, setCompanyCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [recentScores, setRecentScores] = useState<any[]>([])
  const stats = [
    { label: 'Mock Interviews', value: mockCount, suffix: '', sub: '+3 this week', color: 'var(--brand)', bg: 'rgba(83,74,183,0.08)', icon: Mic2 },
    {
      label: 'Day Streak',
      value: streak,
      suffix: '',
      sub: 'Keep going 🔥',
      color: 'var(--amber)',
      bg: 'rgba(239,159,39,0.08)',
      icon: Flame
    },
    { label: 'Companies', value: companyCount, suffix: '', sub: '', color: 'var(--teal)', bg: 'rgba(29,158,117,0.08)', icon: Building2 },
    {
      label: 'Roadmap',
      value: roadmap?.progress || 0,
      suffix: '%',
      sub: roadmap?.title || 'No roadmap',
      color: 'var(--coral)',
      bg: 'rgba(226,75,74,0.08)',
      icon: TrendingUp
    },
  ]
  useEffect(() => {
    if (!completedInterviews.length) return

    const scores = completedInterviews
      .map((item: any) => item.score)
      .filter((s: number) => s !== null)

    if (scores.length === 0) return

    const avg =
      scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length

    setReadiness(Math.round(avg))
  }, [completedInterviews])

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) return

      const authUser = data.user

      setUser({
        name: authUser.user_metadata?.full_name || '',
        college: authUser.user_metadata?.college_name || '',
      })
    }

    fetchUser()
  }, [])
  useEffect(() => {
    const fetchInterviews = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      console.log("INTERVIEWS:", data, error)

      if (data) {
        const enrichedData = data.map((item: any) => {
          const summary = (item.transcript || []).length > 0 && item.transcript[item.transcript.length - 1].isSummary
            ? item.transcript[item.transcript.length - 1]
            : null;
          return {
            ...item,
            score: summary?.score !== undefined ? summary.score : item.score,
            correct: summary?.correct !== undefined ? summary.correct : item.correct,
            partial: summary?.partial !== undefined ? summary.partial : item.partial,
            wrong: summary?.wrong !== undefined ? summary.wrong : item.wrong,
          };
        });

        const upcoming = enrichedData.filter(
          (item: any) => !item.score
        )

        setUpcomingInterviews(upcoming)
        
        setMockCount(enrichedData.length)

        const uniqueCompanies = new Set(enrichedData.map((item: any) => item.company))
        setCompanyCount(uniqueCompanies.size)
        const completed = enrichedData.filter((item: any) => typeof item.score === 'number')

        setCompletedInterviews(completed)
        setRecentScores(
          completed
            .slice(-5)
            .reverse()
            .map((item: any) => ({
              role: item.role,
              type: item.type || 'Mock',
              date: item.date || 'Recently',
              score: item.score || 0,
              breakdown: {
                correct: item.correct || 0,
                partial: item.partial || 0,
                wrong: item.wrong || 0,
              },
            }))
        )
      }
    }

    fetchInterviews()
  }, [])
  useEffect(() => {
    if (!completedInterviews.length){
      setStreak(0)
      return
    }

    // Step 1: extract valid dates only
    const validDates = completedInterviews
      .map((item: any) => {
        if (!item.date) return null
        const d = new Date(item.date)
        return isNaN(d.getTime()) ? null : d
      })
      .filter(Boolean) as Date[]

    if (validDates.length === 0) {
      setStreak(0)
      return
    }

    // Step 2: convert to unique day strings (normalized to midnight)
    const uniqueDays = Array.from(
      new Set(
        validDates.map((d) =>
          new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
        )
      )
    )

    // Step 3: sort descending (latest first)
    uniqueDays.sort((a, b) => b - a)

    // Step 4: calculate streak
    let streakCount = 0
    const today = new Date().setHours(0, 0, 0, 0)

    for (let i = 0; i < uniqueDays.length; i++) {
      const expectedDay = today - i * 24 * 60 * 60 * 1000

      if (uniqueDays[i] === expectedDay) {
        streakCount++
      } else {
        break
      }
    }

    setStreak(streakCount)
  }, [completedInterviews])
  useEffect(() => {
    const fetchRoadmap = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('prep_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      console.log("ROADMAP:", data, error)

      if (data && data.length > 0) {
        setRoadmap(data[0])
      } else {
        setRoadmap(null)
      }
    }

    fetchRoadmap()
  }, [])
  useEffect(() => {
    const items = []

    // 1. Latest interview
    if (upcomingInterviews.length > 0) {
      const latest = upcomingInterviews[0]

      items.push({
        type: 'Mock Interview',
        icon: Target,
        title: `${latest.company} — ${latest.role}`,
        desc: latest.round || 'Upcoming round',
        href: '/mock-interview',
        accent: 'var(--brand)',
        accentBg: 'rgba(83,74,183,0.08)',
        progress: latest.score || 0,
      })
    }

    // 2. Roadmap
    if (roadmap) {
      items.push({
        type: 'Roadmap',
        icon: Map,
        title: roadmap.title || 'Your roadmap',
        desc: `${roadmap.progress || 0}% completed`,
        href: '/roadmap',
        accent: 'var(--coral)',
        accentBg: 'rgba(226,75,74,0.08)',
        progress: roadmap.progress || 0,
      })
    }

    setContinueItems(items)
  }, [upcomingInterviews, roadmap])
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
              Hey, {user.name?.split(' ')[0] || 'there'}
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
                {recentScores.map((r, i) => (
                  <ScoreRow key={i} r={r} i={i} total={recentScores.length} />
                ))}
              </motion.div>
            </motion.div>

            {/* Roadmap Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.45 }}
              className="rounded-2xl p-5"
              style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Map size={16} strokeWidth={1.8} style={{ color: 'var(--coral)' }} />
                  <p
                    className="font-mono-frag text-[11px] tracking-[0.09em]"
                    style={{ color: 'rgba(26,16,53,0.38)' }}
                  >
                    ROADMAP PROGRESS
                  </p>
                </div>

                <Link
                  href="/roadmap"
                  className="text-[12px] font-semibold"
                  style={{ color: 'var(--brand)' }}
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="font-bold text-[14px]">
                      {roadmap?.title || 'No roadmap yet'}
                    </p>
                    <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.45)' }}>
                      {roadmap?.progress !== undefined ? `${roadmap.progress}%` : '0%'}
                    </span>
                  </div>

                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(26,16,53,0.06)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${roadmap?.progress || 0}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--coral)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(83,74,183,0.05)' }}>
                    <p className="text-[10px]">Completed</p>
                    <p className="font-bold text-[18px]">
                      {roadmap?.completed || 0}
                    </p>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'rgba(239,159,39,0.05)' }}>
                    <p className="text-[10px]">In Progress</p>
                    <p className="font-bold text-[18px]">
                      {roadmap?.inProgress || 0}
                    </p>
                  </div>

                  <div className="rounded-xl p-3" style={{ background: 'rgba(226,75,74,0.05)' }}>
                    <p className="text-[10px]">Left</p>
                    <p className="font-bold text-[18px]">
                      {roadmap?.left || 0}
                    </p>
                  </div>
                </div>
              </div>
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
                    initial={{ width: 0 }} animate={{ width: `${readiness}%` }}
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