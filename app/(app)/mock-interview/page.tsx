'use client'

import { motion, cubicBezier, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Mic2, Target, Gauge, Layers, Building2, Lightbulb,
  Play, BrainCircuit, MessageSquare, Sparkles, ToggleLeft,
  ToggleRight, Clock, CheckCircle2, MinusCircle, Dot,
} from 'lucide-react'
import { startMockInterview } from '@/lib/actions/mock'

const ease = cubicBezier(0.22, 1, 0.36, 1)
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const roles = ['SDE Intern', 'SDE-1', 'Data Analyst', 'Product Manager', 'ML Engineer', 'Frontend Dev', 'Backend Dev', 'DevOps']
const difficulties = [
  { label: 'Beginner', qs: '3 Qs', color: 'var(--teal)', bg: 'rgba(29,158,117,0.08)', activeBg: 'var(--teal)' },
  { label: 'Intermediate', qs: '4 Qs', color: 'var(--amber)', bg: 'rgba(239,159,39,0.08)', activeBg: 'var(--amber)' },
  { label: 'Advanced', qs: '5 Qs', color: 'var(--coral)', bg: 'rgba(226,75,74,0.08)', activeBg: 'var(--coral)' },
]
const interviewTypes = [
  { label: 'DSA', icon: BrainCircuit, desc: 'Arrays, trees, graphs, DP' },
  { label: 'System Design', icon: Layers, desc: 'Scale, architecture, trade-offs' },
  { label: 'HR / Behavioural', icon: MessageSquare, desc: 'Situational, culture fit' },
  { label: 'Mixed', icon: Sparkles, desc: 'Combination of all types' },
]
const companies = ['Google', 'Amazon', 'Flipkart', 'Razorpay', 'Atlassian', 'Microsoft', 'Adobe', 'Swiggy', 'Zepto', 'CRED', 'PhonePe', 'Meesho']

// Preview conversation that cycles to feel alive
const previewSteps = [
  { type: 'ai', text: 'Q1: Given an array of integers, find the two numbers that add up to a target sum. What is the most optimal approach?' },
  { type: 'user', text: 'I would use a HashMap to store the complement of each number as I iterate. This gives O(n) time and O(n) space.' },
  { type: 'feedback', text: 'Great answer! HashMap approach is optimal. Time: O(n), Space: O(n). You nailed the trade-off explanation.', score: 91, status: 'correct' },
  { type: 'ai', text: 'Q2: How would you detect a cycle in a linked list?' },
  { type: 'user', text: "Floyd's cycle detection — two pointers, one slow one fast. If they meet, there's a cycle." },
  { type: 'feedback', text: "Excellent! Floyd's algorithm is the optimal solution. Clean explanation of the two-pointer technique.", score: 95, status: 'correct' },
]

export default function MockInterviewSetupPage() {
  const router = useRouter()
  const [role, setRole] = useState('SDE Intern')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [type, setType] = useState('DSA')
  const [company, setCompany] = useState('')
  const [hints, setHints] = useState(true)
  const [visibleSteps, setVisibleSteps] = useState(1)
  const [elapsed, setElapsed] = useState(47)
  

  // Animate preview steps in sequence
  useEffect(() => {
    if (visibleSteps >= previewSteps.length) return
    const delay = previewSteps[visibleSteps - 1].type === 'user' ? 1200 : 1800
    const t = setTimeout(() => setVisibleSteps(v => v + 1), delay)
    return () => clearTimeout(t)
  }, [visibleSteps])

  // Tick the preview timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const handleStart = async () => {
    const config = { role, difficulty, type, company, hints }

    try {
      const result = await startMockInterview(config)

      localStorage.setItem('prepos_session_id', result.sessionId)

      router.push('/mock-interview/session')
    } catch (error) {
      console.error('Failed to start interview:', error)
    }
  }

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen font-familjen flex" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* ── LEFT: Form ── */}
      <div className="flex-1 min-w-0 py-10 px-5 md:px-10 lg:px-16">
        <motion.div variants={container} initial="hidden" animate="show" className="relative max-w-xl mx-auto">

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full"
              style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.15)' }}>
              <Mic2 size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--brand)' }}>
                MOCK INTERVIEW ENGINE
              </span>
            </div>
            <h1 className="font-black text-[32px] md:text-[40px] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              Configure your interview
            </h1>
            <p className="text-[15px] mt-2" style={{ color: 'rgba(26,16,53,0.5)' }}>
              Set up your session and the AI will conduct a realistic interview.
            </p>
          </motion.div>

          <div className="flex flex-col gap-7">

            {/* Role */}
            <motion.div variants={fadeUp}>
              <label className="flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                <Target size={13} strokeWidth={1.8} /> Target Role
              </label>
              <div className="flex flex-wrap gap-2">
                {roles.map(r => (
                  <motion.button key={r} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setRole(r)}
                    className="px-3.5 py-2 rounded-xl text-[13px] font-semibold cursor-pointer transition-all"
                    style={{
                      background: role === r ? 'var(--void)' : '#fff',
                      color: role === r ? 'var(--mist)' : 'rgba(26,16,53,0.6)',
                      border: role === r ? '1.5px solid var(--void)' : '1.5px solid var(--void-12)',
                      fontFamily: 'var(--font-archivo)',
                    }}>
                    {r}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Difficulty */}
            <motion.div variants={fadeUp}>
              <label className="flex items-center gap-2 text-[12px] font-semibold tracking-widests uppercase mb-3"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                <Gauge size={13} strokeWidth={1.8} /> Difficulty
              </label>
              <div className="flex gap-3">
                {difficulties.map((d) => {
                  const active = difficulty === d.label
                  return (
                    <motion.button key={d.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setDifficulty(d.label)}
                      className="flex-1 py-3 rounded-xl text-[13px] font-bold cursor-pointer transition-all flex flex-col items-center gap-1"
                      style={{
                        background: active ? d.activeBg : '#fff',
                        color: active ? '#fff' : d.color,
                        border: `1.5px solid ${active ? d.activeBg : 'var(--void-12)'}`,
                        fontFamily: 'var(--font-archivo)',
                      }}>
                      <span>{d.label}</span>
                      <span className="text-[10px] font-normal opacity-70">{d.qs}</span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Interview Type */}
            <motion.div variants={fadeUp}>
              <label className="flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase mb-3"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                <Layers size={13} strokeWidth={1.8} /> Interview Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interviewTypes.map(t => {
                  const Icon = t.icon
                  const active = type === t.label
                  return (
                    <motion.button key={t.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setType(t.label)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-left"
                      style={{
                        background: active ? 'var(--void)' : '#fff',
                        border: `1.5px solid ${active ? 'var(--void)' : 'var(--void-12)'}`,
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: active ? 'rgba(238,237,254,0.12)' : 'rgba(83,74,183,0.08)' }}>
                        <Icon size={15} strokeWidth={1.8} style={{ color: active ? 'var(--lavender)' : 'var(--brand)' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold"
                          style={{ fontFamily: 'var(--font-archivo)', color: active ? 'var(--mist)' : 'var(--void)' }}>
                          {t.label}
                        </p>
                        <p className="text-[11px]"
                          style={{ color: active ? 'rgba(238,237,254,0.45)' : 'rgba(26,16,53,0.4)' }}>
                          {t.desc}
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Company */}
            <motion.div variants={fadeUp}>
              <label className="flex items-center gap-2 text-[12px] font-semibold tracking-widests uppercase mb-3"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                <Building2 size={13} strokeWidth={1.8} /> Target Company
                <span className="normal-case font-normal tracking-normal text-[11px]"
                  style={{ color: 'rgba(26,16,53,0.35)' }}>— optional</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {companies.map(c => (
                  <motion.button key={c} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setCompany(company === c ? '' : c)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                    style={{
                      background: company === c ? 'rgba(83,74,183,0.1)' : '#fff',
                      color: company === c ? 'var(--brand)' : 'rgba(26,16,53,0.5)',
                      border: `1.5px solid ${company === c ? 'rgba(83,74,183,0.3)' : 'var(--void-12)'}`,
                      fontFamily: 'var(--font-archivo)',
                    }}>
                    {c}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Hints toggle */}
            <motion.div variants={fadeUp}
              className="flex items-center justify-between px-5 py-4 rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(239,159,39,0.1)' }}>
                  <Lightbulb size={16} strokeWidth={1.8} style={{ color: 'var(--amber)' }} />
                </div>
                <div>
                  <p className="font-bold text-[14px]"
                    style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                    Enable hints
                  </p>
                  <p className="text-[12px]" style={{ color: 'rgba(26,16,53,0.45)' }}>
                    AI gives nudges if you get stuck
                  </p>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setHints(h => !h)} className="cursor-pointer">
                {hints
                  ? <ToggleRight size={32} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
                  : <ToggleLeft size={32} strokeWidth={1.5} style={{ color: 'rgba(26,16,53,0.25)' }} />}
              </motion.button>
            </motion.div>

            {/* Estimated time */}
            <motion.div variants={fadeUp}
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(83,74,183,0.06)', border: '1px solid rgba(83,74,183,0.12)' }}>
              <Clock size={13} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <p className="text-[12px]" style={{ color: 'rgba(26,16,53,0.55)' }}>
                Estimated time:{' '}
                <span className="font-semibold" style={{ color: 'var(--void)', fontFamily: 'var(--font-archivo)' }}>
                  {difficulty === 'Beginner' ? '10–15' : difficulty === 'Intermediate' ? '15–20' : '20–30'} min
                </span>
                &nbsp;·&nbsp; {difficulty} {type}{company ? ` · ${company}` : ''}
              </p>
            </motion.div>

            {/* Start */}
            <motion.div variants={fadeUp} className="pb-10">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(26,16,53,0.18)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="w-full py-4 rounded-2xl text-[15px] font-black cursor-pointer flex items-center justify-center gap-2"
                style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
                <Play size={16} strokeWidth={2} />
                Start Interview
                {company && <span className="font-normal text-[13px] opacity-60">· {company}</span>}
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* ── RIGHT: Live preview ── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.2 }}
        className="hidden lg:flex flex-col w-[420px] xl:w-[460px] flex-shrink-0 sticky top-0 h-screen"
        style={{ background: 'var(--void)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(83,74,183,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,158,117,0.15) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col h-full px-6 py-6">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-5 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full" style={{ background: 'var(--teal)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--teal)' }}>
                LIVE PREVIEW
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono-frag text-[11px]" style={{ color: 'rgba(247,246,253,0.35)' }}>
                {formatTime(elapsed)}
              </span>
              <span className="font-mono-frag text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(175,169,236,0.15)', color: '#AFA9EC' }}>
                Q2 / 4
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full mb-5 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'var(--brand)' }}
              initial={{ width: '0%' }}
              animate={{ width: '50%' }}
              transition={{ duration: 1, ease, delay: 0.5 }} />
          </div>

          {/* Chat messages */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <AnimatePresence>
              {previewSteps.slice(0, visibleSteps).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {step.type === 'ai' && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(175,169,236,0.15)' }}>
                        <Sparkles size={12} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex-1"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="font-mono-frag text-[9px] tracking-[0.08em] mb-1.5"
                          style={{ color: 'rgba(175,169,236,0.5)' }}>
                          QUESTION {Math.floor(i / 3) + 1} OF 4
                        </p>
                        <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(247,246,253,0.85)' }}>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {step.type === 'user' && (
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[80%]"
                        style={{ background: 'rgba(83,74,183,0.3)', border: '1px solid rgba(83,74,183,0.35)' }}>
                        <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(247,246,253,0.9)' }}>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {step.type === 'feedback' && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(175,169,236,0.15)' }}>
                        <Sparkles size={12} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="rounded-2xl rounded-tl-sm px-3.5 py-2.5"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(247,246,253,0.75)' }}>
                            {step.text}
                          </p>
                        </div>
                        {/* Score bar */}
                        <div className="flex items-center gap-2 px-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold"
                            style={{ color: 'var(--teal)', fontFamily: 'var(--font-archivo)' }}>
                            <CheckCircle2 size={10} strokeWidth={2} />
                            Correct
                          </span>
                          <div className="flex-1 h-1 rounded-full overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: 'var(--teal)' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${(step as any).score}%` }}
                              transition={{ duration: 0.8, ease, delay: 0.2 }}
                            />
                          </div>
                          <span className="font-mono-frag text-[10px]"
                            style={{ color: 'rgba(247,246,253,0.35)' }}>
                            {(step as any).score}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator when transitioning */}
            {visibleSteps < previewSteps.length && previewSteps[visibleSteps - 1].type !== 'feedback' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(175,169,236,0.15)' }}>
                  <Sparkles size={12} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--brand)' }} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom tagline */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="font-mono-frag text-[10px] tracking-[0.06em] text-center"
              style={{ color: 'rgba(247,246,253,0.2)' }}>
              REALISTIC · AI-POWERED · INSTANT FEEDBACK
            </p>
          </div>

        </div>
      </motion.div>

    </div>
  )
}