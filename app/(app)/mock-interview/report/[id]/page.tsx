'use client'

import { motion, cubicBezier } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Trophy, CheckCircle2, MinusCircle, XCircle, Download,
  RotateCcw, TrendingUp, BookOpen, AlertCircle, BarChart3,
  Clock, Sparkles, Activity, BrainCircuit, MessageSquare,
  ArrowRight, Target, Star,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

type Feedback = {
  text: string; score: number; status: 'correct' | 'partial' | 'incorrect'; hint: string
}
type Config = {
  role: string; difficulty: string; type: string; company: string; hints: boolean
}
type ReportData = {
  config: Config; elapsed: number; feedbacks: Feedback[]; completedAt: string;
  weakAreas?: string[]; reviseTopics?: string[]
}

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0
      const step = target / (duration / 16)
      const timer = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 16)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(t)
  }, [target, duration, delay])
  return count
}

function scoreColor(s: number) {
  if (s >= 80) return 'var(--teal)'
  if (s >= 60) return 'var(--amber)'
  return 'var(--coral)'
}
function scoreLabel(s: number) {
  if (s >= 85) return 'Excellent'
  if (s >= 70) return 'Good'
  if (s >= 55) return 'Average'
  return 'Needs Work'
}
function formatTime(s: number) {
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export default function MockInterviewReportPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<ReportData | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/mock/${id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        const formatted: ReportData = {
          config: {
            role: data.role,
            difficulty: data.difficulty,
            type: data.interview_type,
            company: data.company,
            hints: data.hints,
          },
          elapsed: data.elapsed || 0,

          // convert transcript → feedbacks
          feedbacks: (data.transcript || [])
            .filter((t: any) => t.feedback)
            .map((t: any) => t.feedback),

          completedAt: data.completedAt,
          weakAreas: data.weakAreas,
          reviseTopics: data.reviseTopics,
        }

        setData(formatted)
      } catch (err) {
        console.error('Failed to load report:', err)
        router.push('/mock-interview')
      }
    }

    fetchReport()
  }, [id, router])

  const avgScore = data
    ? Math.round(data.feedbacks.reduce((a, b) => a + b.score, 0) / data.feedbacks.length)
    : 0
  const correct = data?.feedbacks.filter(f => f.status === 'correct').length ?? 0
  const partial = data?.feedbacks.filter(f => f.status === 'partial').length ?? 0
  const wrong = data?.feedbacks.filter(f => f.status === 'incorrect').length ?? 0

  const animatedScore = useCountUp(avgScore, 900, 250)

  const weakAreas = data?.weakAreas || ['Dynamic Programming', 'Time Complexity Analysis']
  const reviseTopics = data?.reviseTopics || ['Sliding Window', 'Two Pointer', 'Graph BFS/DFS']

  const typeIcon = data?.config.type === 'DSA' ? BrainCircuit
    : data?.config.type === 'System Design' ? Activity
      : data?.config.type === 'HR / Behavioural' ? MessageSquare
        : Sparkles

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ghost)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles size={24} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
        </motion.div>
      </div>
    )
  }

  const TypeIcon = typeIcon

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <motion.div variants={container} initial="hidden" animate="show"
        className="relative max-w-2xl mx-auto px-5 md:px-0 py-10">

        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full"
            style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)' }}>
            <Trophy size={11} strokeWidth={1.8} style={{ color: 'var(--teal)' }} />
            <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--teal)' }}>
              PERFORMANCE REPORT
            </span>
          </div>
          <h1 className="font-black text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.03em]"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            Interview complete
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(83,74,183,0.08)', color: 'var(--brand)', fontFamily: 'var(--font-archivo)', fontWeight: 600 }}>
              <Target size={11} strokeWidth={1.8} /> {data.config.role}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(26,16,53,0.06)', color: 'rgba(26,16,53,0.55)', fontFamily: 'var(--font-archivo)', fontWeight: 600 }}>
              <TypeIcon size={11} strokeWidth={1.8} /> {data.config.type}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(26,16,53,0.06)', color: 'rgba(26,16,53,0.55)', fontFamily: 'var(--font-archivo)', fontWeight: 600 }}>
              <Clock size={11} strokeWidth={1.8} /> {formatTime(data.elapsed)}
            </span>
            {data.config.company && (
              <span className="inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(26,16,53,0.06)', color: 'rgba(26,16,53,0.55)', fontFamily: 'var(--font-archivo)', fontWeight: 600 }}>
                {data.config.company}
              </span>
            )}
          </div>
        </motion.div>

        {/* Score card */}
        <motion.div variants={fadeUp}
          className="rounded-2xl px-6 py-6 mb-5 relative overflow-hidden"
          style={{ background: 'var(--void)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.12] blur-3xl pointer-events-none"
            style={{ background: scoreColor(avgScore) }} />

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2"
                style={{ color: 'rgba(238,237,254,0.4)' }}>OVERALL SCORE</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="font-black text-[64px] leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-archivo)', color: scoreColor(avgScore) }}>
                  {animatedScore}
                </span>
                <span className="text-[18px] mb-2" style={{ color: 'rgba(238,237,254,0.3)' }}>/100</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold"
                  style={{ color: 'rgba(238,237,254,0.6)', fontFamily: 'var(--font-archivo)' }}>
                  {scoreLabel(avgScore)}
                </p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={12} strokeWidth={1.8}
                      style={{
                        color: i <= Math.round(avgScore / 20) ? scoreColor(avgScore) : 'rgba(238,237,254,0.2)',
                        fill: i <= Math.round(avgScore / 20) ? scoreColor(avgScore) : 'transparent'
                      }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="flex gap-3">
              {[
                { label: 'Correct', count: correct, color: 'var(--teal)', icon: CheckCircle2 },
                { label: 'Partial', count: partial, color: 'var(--amber)', icon: MinusCircle },
                { label: 'Wrong', count: wrong, color: 'var(--coral)', icon: XCircle },
              ].map((b, i) => {
                const Icon = b.icon
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl"
                    style={{ background: b.color + '1a' }}>
                    <Icon size={16} strokeWidth={2} style={{ color: b.color }} />
                    <span className="font-black text-[22px] leading-none"
                      style={{ fontFamily: 'var(--font-archivo)', color: b.color }}>{b.count}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(238,237,254,0.4)' }}>{b.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Main progress bar */}
          <div className="relative z-10 mt-5 h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(238,237,254,0.1)' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${avgScore}%` }}
              transition={{ duration: 1.1, ease, delay: 0.3 }}
              className="h-full rounded-full" style={{ background: scoreColor(avgScore) }} />
          </div>
        </motion.div>

        {/* Per-question breakdown */}
        <motion.div variants={fadeUp} className="mb-5">
          <p className="font-mono-frag text-[11px] tracking-[0.09em] mb-3 flex items-center gap-2"
            style={{ color: 'rgba(26,16,53,0.38)' }}>
            <BarChart3 size={12} strokeWidth={1.8} /> QUESTION BREAKDOWN
          </p>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
            {data.feedbacks.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="px-5 py-4 flex items-start gap-4"
                style={{ borderBottom: i < data.feedbacks.length - 1 ? '1px solid rgba(26,16,53,0.06)' : 'none' }}>

                {/* Q number */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[12px] flex-shrink-0 mt-0.5"
                  style={{
                    fontFamily: 'var(--font-archivo)',
                    background: (f.status === 'correct' ? 'var(--teal)' : f.status === 'partial' ? 'var(--amber)' : 'var(--coral)') + '18',
                    color: f.status === 'correct' ? 'var(--teal)' : f.status === 'partial' ? 'var(--amber)' : 'var(--coral)',
                  }}>
                  Q{i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Status badge */}
                  <div className="mb-1.5">
                    {f.status === 'correct' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(29,158,117,0.1)', color: 'var(--teal)', fontFamily: 'var(--font-archivo)' }}>
                        <CheckCircle2 size={10} strokeWidth={2} /> Correct
                      </span>
                    )}
                    {f.status === 'partial' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,159,39,0.1)', color: 'var(--amber)', fontFamily: 'var(--font-archivo)' }}>
                        <MinusCircle size={10} strokeWidth={2} /> Partially Correct
                      </span>
                    )}
                    {f.status === 'incorrect' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(226,75,74,0.1)', color: 'var(--coral)', fontFamily: 'var(--font-archivo)' }}>
                        <XCircle size={10} strokeWidth={2} /> Incorrect
                      </span>
                    )}
                  </div>

                  <p className="text-[13px] leading-relaxed mb-2" style={{ color: 'rgba(26,16,53,0.65)' }}>
                    {f.text}
                  </p>

                  {/* Score bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,16,53,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${f.score}%` }}
                        transition={{ duration: 0.8, ease, delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: f.status === 'correct' ? 'var(--teal)' : f.status === 'partial' ? 'var(--amber)' : 'var(--coral)' }} />
                    </div>
                    <span className="font-mono-frag text-[11px] flex-shrink-0"
                      style={{ color: 'rgba(26,16,53,0.4)' }}>{f.score}/100</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weak areas + revise */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl px-4 py-4"
            style={{ background: 'rgba(226,75,74,0.06)', border: '1.5px solid rgba(226,75,74,0.15)' }}>
            <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--coral)' }}>
              <AlertCircle size={11} strokeWidth={1.8} /> WEAK AREAS
            </p>
            {weakAreas.map((w, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--coral)' }} />
                <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.65)' }}>{w}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl px-4 py-4"
            style={{ background: 'rgba(83,74,183,0.06)', border: '1.5px solid rgba(83,74,183,0.15)' }}>
            <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--brand)' }}>
              <BookOpen size={11} strokeWidth={1.8} /> REVISE NEXT
            </p>
            {reviseTopics.map((t, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--brand)' }} />
                <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.65)' }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div variants={fadeUp}
          className="rounded-2xl px-5 py-4 mb-6"
          style={{ background: 'rgba(83,74,183,0.06)', border: '1.5px solid rgba(83,74,183,0.15)' }}>
          <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-3 flex items-center gap-1.5"
            style={{ color: 'var(--brand)' }}>
            <ArrowRight size={11} strokeWidth={1.8} /> RECOMMENDED NEXT STEPS
          </p>
          <div className="flex flex-col gap-2">
            {[
              'Revisit Dynamic Programming patterns on your Roadmap',
              'Attempt another DSA mock — aim for 80+',
              'Add this session score to your tracker',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono-frag text-[10px] mt-0.5 flex-shrink-0"
                  style={{ color: 'var(--brand)' }}>0{i + 1}</span>
                <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.65)' }}>{s}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={fadeUp} className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(26,16,53,0.15)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/mock-interview')}
            className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2"
            style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
            <RotateCcw size={14} strokeWidth={2} /> Try Again
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl text-[13px] font-bold cursor-pointer flex items-center justify-center gap-2"
            style={{ background: '#fff', color: 'var(--void)', border: '1.5px solid var(--void-12)', fontFamily: 'var(--font-archivo)' }}>
            <Download size={14} strokeWidth={1.8} /> Download PDF
          </motion.button>

          <Link href="/dashboard" className="no-underline">
            <motion.div
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="py-3.5 px-5 rounded-2xl text-[13px] font-bold cursor-pointer flex items-center gap-2"
              style={{ background: 'rgba(83,74,183,0.08)', color: 'var(--brand)', border: '1.5px solid rgba(83,74,183,0.2)', fontFamily: 'var(--font-archivo)' }}>
              <TrendingUp size={14} strokeWidth={1.8} /> Dashboard
            </motion.div>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  )
}