'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
  Plus, X, Search, Pin, PinOff, Trash2, Edit3, Sparkles,
  Lightbulb, Zap, Rocket, Star, Tag, Save, ChevronRight,
  Code2, Trophy, TrendingUp, Clock, Users, ArrowRight,
  BookMarked, CheckCircle2,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
}

// ── Types ─────────────────────────────────────────────────
type IdeaTag = 'Hackathon' | 'Portfolio' | 'Startup' | 'Other'
type Idea = {
  id: string
  title: string
  description: string
  tag: IdeaTag
  pinned: boolean
  createdAt: string
  expanded?: ExpandedProposal
}
type ExpandedProposal = {
  problem: string
  solution: string
  features: string[]
  techStack: { name: string; reason: string }[]
  timeline: { solo: string; team: string }
  resumeScore: number
  resumeReason: string
  similarProjects: string[]
}

// ── Tag config ────────────────────────────────────────────
const tagConfig: Record<IdeaTag, { color: string; bg: string; border: string; icon: typeof Zap }> = {
  Hackathon: { color: 'var(--coral)',  bg: 'rgba(226,75,74,0.08)',  border: 'rgba(226,75,74,0.2)',  icon: Zap },
  Portfolio: { color: 'var(--brand)',  bg: 'rgba(83,74,183,0.08)',  border: 'rgba(83,74,183,0.2)',  icon: Code2 },
  Startup:   { color: 'var(--amber)',  bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.2)', icon: Rocket },
  Other:     { color: 'var(--teal)',   bg: 'rgba(29,158,117,0.08)', border: 'rgba(29,158,117,0.2)', icon: Lightbulb },
}

// ── Card accent colors (for sticky note variety) ──────────
const cardAccents = [
  { bg: '#FFFBF0', border: 'rgba(239,159,39,0.18)' },
  { bg: '#F3F2FF', border: 'rgba(83,74,183,0.18)' },
  { bg: '#F0FDF8', border: 'rgba(29,158,117,0.18)' },
  { bg: '#FFF5F5', border: 'rgba(226,75,74,0.18)' },
  { bg: '#FAFAFA', border: 'rgba(26,16,53,0.1)' },
  { bg: '#F0F4FF', border: 'rgba(83,74,183,0.15)' },
]

// ── Mock AI proposals ─────────────────────────────────────
const mockProposals: Record<string, ExpandedProposal> = {
  default: {
    problem: 'Students and developers struggle to find relevant, curated resources for interview preparation — they waste hours searching instead of actually studying.',
    solution: 'A smart, AI-curated resource aggregator that personalises prep content based on target role, company, and weak areas identified from mock interviews.',
    features: ['Role-based resource feed', 'AI difficulty tagging', 'Progress tracking per topic', 'Bookmark + notes on resources', 'Weekly digest email'],
    techStack: [
      { name: 'Next.js', reason: 'Fast SSR for SEO and performance' },
      { name: 'OpenAI API', reason: 'Content tagging and personalisation' },
      { name: 'PostgreSQL', reason: 'Relational data for user progress' },
      { name: 'Tailwind CSS', reason: 'Rapid, consistent UI' },
    ],
    timeline: { solo: '6–8 weeks', team: '3–4 weeks (team of 2)' },
    resumeScore: 8,
    resumeReason: 'Strong signal — combines AI, full-stack, and a real problem space relevant to recruiters. Good portfolio centrepiece.',
    similarProjects: ['LeetCode', 'Neetcode.io', 'roadmap.sh'],
  },
}

// ── Initial ideas ─────────────────────────────────────────
const initialIdeas: Idea[] = [
  {
    id: '1', title: 'ML Resume Screener',
    description: 'Build an ML model that screens resumes against job descriptions and gives a match score with improvement suggestions.',
    tag: 'Portfolio', pinned: true, createdAt: '2025-03-10',
    expanded: {
      problem: 'Recruiters spend 6 seconds per resume. Candidates have no feedback on why they were rejected.',
      solution: 'An ML-powered tool that scores resumes against JDs and gives actionable improvement tips.',
      features: ['Resume parsing', 'JD match scoring', 'Keyword gap analysis', 'Improvement suggestions', 'ATS simulation'],
      techStack: [
        { name: 'Python + FastAPI', reason: 'ML backend with fast inference' },
        { name: 'HuggingFace', reason: 'Pre-trained NLP models for matching' },
        { name: 'React', reason: 'Clean upload + results UI' },
        { name: 'PostgreSQL', reason: 'Store resumes and scores' },
      ],
      timeline: { solo: '5–6 weeks', team: '2–3 weeks (team of 2)' },
      resumeScore: 9,
      resumeReason: 'Extremely strong — ML + real-world problem + direct relevance to hiring. Will stand out in any SDE or ML role application.',
      similarProjects: ['Jobscan', 'Resume Worded', 'Resumake'],
    },
  },
  {
    id: '2', title: 'DSA Visualiser',
    description: 'Interactive visualisations for DSA algorithms — sorting, graph traversal, DP tables — to help students understand what\'s happening step by step.',
    tag: 'Hackathon', pinned: false, createdAt: '2025-03-14',
  },
  {
    id: '3', title: 'Campus Placement Aggregator',
    description: 'A platform that aggregates placement stats, interview experiences, and salary data from colleges across India — all in one place.',
    tag: 'Startup', pinned: true, createdAt: '2025-03-08',
  },
  {
    id: '4', title: 'Peer Mock Interview App',
    description: 'Connect students for peer-to-peer mock interviews. Match by target company, role, and availability.',
    tag: 'Startup', pinned: false, createdAt: '2025-03-17',
  },
  {
    id: '5', title: 'Competitive Programming Tracker',
    description: 'Track your Codeforces, LeetCode, and CodeChef progress in one dashboard. Set goals, track streaks, visualise growth.',
    tag: 'Portfolio', pinned: false, createdAt: '2025-03-19',
  },
  {
    id: '6', title: '24hr Hackathon Idea Generator',
    description: 'Given a theme, generate 5 hackathon project ideas with tech stack, feasibility score, and wow factor rating.',
    tag: 'Other', pinned: false, createdAt: '2025-03-21',
  },
]

const TAGS: IdeaTag[] = ['Hackathon', 'Portfolio', 'Startup', 'Other']

// ── Blank idea ────────────────────────────────────────────
const blankIdea = (): Idea => ({
  id: Date.now().toString(),
  title: '', description: '', tag: 'Portfolio',
  pinned: false, createdAt: new Date().toISOString().split('T')[0],
})

// ── Add/Edit Modal ────────────────────────────────────────
function IdeaModal({ idea, onSave, onClose }: { idea: Idea; onSave: (i: Idea) => void; onClose: () => void }) {
  const [form, setForm] = useState<Idea>({ ...idea })
  const set = (k: keyof Idea, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,16,53,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--void-12)' }}>
          <h2 className="font-black text-[18px] tracking-tight"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            {idea.title ? 'Edit idea' : 'New idea'}
          </h2>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(26,16,53,0.06)' }}>
            <X size={14} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.5)' }} />
          </motion.button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
              Idea Title
            </label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. ML Resume Screener"
              className="rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
              style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
              onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
              Description
            </label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What's the idea? Who is it for? What problem does it solve?"
              rows={4} className="resize-none rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
              style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
              onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
              Tag
            </label>
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(t => {
                const cfg = tagConfig[t]
                const Icon = cfg.icon
                const active = form.tag === t
                return (
                  <motion.button key={t} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setForm(f => ({ ...f, tag: t }))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                    style={{
                      background: active ? cfg.bg : 'var(--ghost)',
                      color: active ? cfg.color : 'rgba(26,16,53,0.5)',
                      border: `1.5px solid ${active ? cfg.border : 'var(--void-12)'}`,
                      fontFamily: 'var(--font-archivo)',
                    }}>
                    <Icon size={11} strokeWidth={1.8} /> {t}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--void-12)' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--ghost)', color: 'rgba(26,16,53,0.5)', border: '1.5px solid var(--void-12)', fontFamily: 'var(--font-archivo)' }}>
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(26,16,53,0.15)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { if (form.title) onSave(form) }}
            disabled={!form.title}
            className="px-5 py-2 rounded-xl text-[13px] font-bold cursor-pointer flex items-center gap-1.5"
            style={{
              background: form.title ? 'var(--void)' : 'rgba(26,16,53,0.1)',
              color: form.title ? 'var(--mist)' : 'rgba(26,16,53,0.3)',
              fontFamily: 'var(--font-archivo)',
            }}>
            <Save size={13} strokeWidth={2} /> Save idea
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── AI Expand Modal ───────────────────────────────────────
function ExpandModal({ idea, onClose }: { idea: Idea; onClose: () => void }) {
  const [loading, setLoading] = useState(!idea.expanded)
  const [proposal, setProposal] = useState<ExpandedProposal | null>(idea.expanded || null)

  useState(() => {
    if (!idea.expanded) {
      setTimeout(() => {
        setProposal(mockProposals.default)
        setLoading(false)
      }, 2000)
    }
  })

  const scoreColor = (s: number) => s >= 8 ? 'var(--teal)' : s >= 6 ? 'var(--amber)' : 'var(--coral)'

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: 'rgba(26,16,53,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.35, ease }}
        className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#fff', border: '1.5px solid var(--void-12)', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--void-12)' }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles size={12} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--brand)' }}>
                AI EXPANSION
              </span>
            </div>
            <h2 className="font-black text-[18px] tracking-tight"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              {idea.title}
            </h2>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ background: 'rgba(26,16,53,0.06)' }}>
            <X size={14} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.5)' }} />
          </motion.button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={28} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
              </motion.div>
              <div className="text-center">
                <p className="font-semibold text-[14px] mb-1"
                  style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                  Expanding your idea...
                </p>
                <p className="text-[12px]" style={{ color: 'rgba(26,16,53,0.4)' }}>
                  Building proposal, tech stack, timeline & resume score
                </p>
              </div>
              {/* Loading steps */}
              <div className="flex flex-col gap-2 mt-2">
                {['Analysing problem space', 'Generating feature set', 'Selecting tech stack', 'Calculating resume impact'].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4 }}
                    className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.4 }}
                      className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} />
                    <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.5)' }}>{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : proposal ? (
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5">

              {/* Problem + Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div variants={fadeUp} className="rounded-xl p-4"
                  style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.15)' }}>
                  <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2" style={{ color: 'var(--coral)' }}>
                    THE PROBLEM
                  </p>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(26,16,53,0.7)' }}>
                    {proposal.problem}
                  </p>
                </motion.div>
                <motion.div variants={fadeUp} className="rounded-xl p-4"
                  style={{ background: 'rgba(83,74,183,0.06)', border: '1px solid rgba(83,74,183,0.15)' }}>
                  <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2" style={{ color: 'var(--brand)' }}>
                    THE SOLUTION
                  </p>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(26,16,53,0.7)' }}>
                    {proposal.solution}
                  </p>
                </motion.div>
              </div>

              {/* Features */}
              <motion.div variants={fadeUp}>
                <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2.5 flex items-center gap-1.5"
                  style={{ color: 'rgba(26,16,53,0.38)' }}>
                  <CheckCircle2 size={11} strokeWidth={1.8} /> KEY FEATURES
                </p>
                <div className="flex flex-wrap gap-2">
                  {proposal.features.map((f, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="text-[12px] font-semibold px-3 py-1.5 rounded-xl"
                      style={{ background: 'var(--ghost)', color: 'rgba(26,16,53,0.65)', border: '1.5px solid var(--void-12)', fontFamily: 'var(--font-archivo)' }}>
                      {f}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Tech stack */}
              <motion.div variants={fadeUp}>
                <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2.5 flex items-center gap-1.5"
                  style={{ color: 'rgba(26,16,53,0.38)' }}>
                  <Code2 size={11} strokeWidth={1.8} /> SUGGESTED TECH STACK
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {proposal.techStack.map((t, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(83,74,183,0.08)' }}>
                        <Code2 size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
                      </div>
                      <div>
                        <p className="font-bold text-[12px]"
                          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>{t.name}</p>
                        <p className="text-[11px]" style={{ color: 'rgba(26,16,53,0.45)' }}>{t.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Timeline + Resume score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Timeline */}
                <motion.div variants={fadeUp} className="rounded-xl p-4"
                  style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid rgba(29,158,117,0.15)' }}>
                  <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-3" style={{ color: 'var(--teal)' }}>
                    TIMELINE ESTIMATE
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] flex items-center gap-1.5" style={{ color: 'rgba(26,16,53,0.55)' }}>
                        <Users size={11} strokeWidth={1.8} /> Solo
                      </span>
                      <span className="font-bold text-[12px]"
                        style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                        {proposal.timeline.solo}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] flex items-center gap-1.5" style={{ color: 'rgba(26,16,53,0.55)' }}>
                        <Users size={11} strokeWidth={1.8} /> Team of 2
                      </span>
                      <span className="font-bold text-[12px]"
                        style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                        {proposal.timeline.team}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Resume impact */}
                <motion.div variants={fadeUp} className="rounded-xl p-4"
                  style={{ background: 'var(--void)' }}>
                  <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2"
                    style={{ color: 'rgba(238,237,254,0.4)' }}>
                    RESUME IMPACT SCORE
                  </p>
                  <div className="flex items-end gap-2 mb-2">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="font-black text-[40px] leading-none"
                      style={{ fontFamily: 'var(--font-archivo)', color: scoreColor(proposal.resumeScore) }}>
                      {proposal.resumeScore}
                    </motion.span>
                    <span className="text-[14px] mb-1" style={{ color: 'rgba(238,237,254,0.3)' }}>/10</span>
                  </div>
                  <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(238,237,254,0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${proposal.resumeScore * 10}%` }}
                      transition={{ duration: 0.8, ease, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{ background: scoreColor(proposal.resumeScore) }} />
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(238,237,254,0.55)' }}>
                    {proposal.resumeReason}
                  </p>
                </motion.div>
              </div>

              {/* Similar projects */}
              <motion.div variants={fadeUp}>
                <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-2.5 flex items-center gap-1.5"
                  style={{ color: 'rgba(26,16,53,0.38)' }}>
                  <BookMarked size={11} strokeWidth={1.8} /> SIMILAR EXISTING PROJECTS
                </p>
                <div className="flex gap-2 flex-wrap">
                  {proposal.similarProjects.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-xl font-semibold"
                      style={{ background: 'var(--ghost)', color: 'rgba(26,16,53,0.55)', border: '1.5px solid var(--void-12)', fontFamily: 'var(--font-archivo)' }}>
                      <ArrowRight size={10} strokeWidth={2} /> {p}
                    </span>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Idea card ─────────────────────────────────────────────
function IdeaCard({
  idea, index, onEdit, onDelete, onPin, onExpand,
}: {
  idea: Idea; index: number
  onEdit: () => void; onDelete: () => void
  onPin: () => void; onExpand: () => void
}) {
  const cfg = tagConfig[idea.tag]
  const TagIcon = cfg.icon
  const accent = cardAccents[index % cardAccents.length]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(26,16,53,0.1)' }}
      transition={{ duration: 0.35, ease }}
      className="rounded-2xl p-4 flex flex-col gap-3 group cursor-default relative"
      style={{ background: accent.bg, border: `1.5px solid ${accent.border}` }}
    >
      {/* Pinned indicator */}
      {idea.pinned && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'var(--amber)', boxShadow: '0 2px 8px rgba(239,159,39,0.4)' }}>
          <Pin size={10} strokeWidth={2.5} style={{ color: '#fff' }} />
        </motion.div>
      )}

      {/* Tag + actions */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: 'var(--font-archivo)' }}>
          <TagIcon size={10} strokeWidth={2} /> {idea.tag}
        </span>

        {/* Action buttons — show on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={onPin}
            className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(26,16,53,0.06)' }}>
            {idea.pinned
              ? <PinOff size={11} strokeWidth={1.8} style={{ color: 'var(--amber)' }} />
              : <Pin size={11} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.4)' }} />}
          </motion.button>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(26,16,53,0.06)' }}>
            <Edit3 size={11} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.4)' }} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(226,75,74,0.08)' }}>
            <Trash2 size={11} strokeWidth={1.8} style={{ color: 'var(--coral)' }} />
          </motion.button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-black text-[15px] leading-snug tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
          {idea.title}
        </h3>
        {idea.description && (
          <p className="text-[12px] leading-relaxed line-clamp-3" style={{ color: 'rgba(26,16,53,0.55)' }}>
            {idea.description}
          </p>
        )}
      </div>

      {/* Resume score badge if expanded */}
      {idea.expanded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-1.5">
          <TrendingUp size={11} strokeWidth={1.8} style={{ color: 'var(--teal)' }} />
          <span className="text-[11px] font-semibold"
            style={{ color: 'var(--teal)', fontFamily: 'var(--font-archivo)' }}>
            Resume impact: {idea.expanded.resumeScore}/10
          </span>
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2"
        style={{ borderTop: '1px solid rgba(26,16,53,0.07)' }}>
        <span className="font-mono-frag text-[10px]" style={{ color: 'rgba(26,16,53,0.3)' }}>
          {new Date(idea.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
        <motion.button
          whileHover={{ scale: 1.04, x: 2 }} whileTap={{ scale: 0.96 }}
          onClick={onExpand}
          className="inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer px-2.5 py-1 rounded-lg transition-all"
          style={{
            background: idea.expanded ? 'rgba(83,74,183,0.1)' : 'var(--void)',
            color: idea.expanded ? 'var(--brand)' : 'var(--mist)',
            fontFamily: 'var(--font-archivo)',
          }}>
          <Sparkles size={10} strokeWidth={2} />
          {idea.expanded ? 'View proposal' : 'Expand with AI'}
          <ChevronRight size={10} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function BrainstormPage() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<IdeaTag | 'All'>('All')
  const [modalIdea, setModalIdea] = useState<Idea | null>(null)
  const [expandIdea, setExpandIdea] = useState<Idea | null>(null)

  const filtered = useMemo(() => {
    let list = [...ideas].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    if (activeTag !== 'All') list = list.filter(i => i.tag === activeTag)
    if (search) list = list.filter(i =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [ideas, activeTag, search])

  const saveIdea = (idea: Idea) => {
    setIdeas(prev =>
      prev.find(i => i.id === idea.id)
        ? prev.map(i => i.id === idea.id ? idea : i)
        : [...prev, idea]
    )
    setModalIdea(null)
  }

  const togglePin = (id: string) =>
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i))

  const deleteIdea = (id: string) =>
    setIdeas(prev => prev.filter(i => i.id !== id))

  const pinnedCount = ideas.filter(i => i.pinned).length
  const expandedCount = ideas.filter(i => i.expanded).length

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">

        {/* ── Header ── */}
        <motion.div variants={container} initial="hidden" animate="show"
          className="flex items-start justify-between mb-7 flex-wrap gap-4">
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)' }}>
              <Lightbulb size={11} strokeWidth={1.8} style={{ color: 'var(--amber)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--amber)' }}>
                IDEA LAB
              </span>
            </div>
            <h1 className="font-black text-[28px] md:text-[34px] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              Brainstorm Board
            </h1>
            <p className="text-[14px] mt-1" style={{ color: 'rgba(26,16,53,0.45)' }}>
              Dump ideas, expand them with AI into full proposals.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 4px 14px rgba(26,16,53,0.15)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalIdea(blankIdea())}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer"
              style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
              <Plus size={14} strokeWidth={2} /> New Idea
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Stats + search + filter row ── */}
        <motion.div variants={container} initial="hidden" animate="show"
          className="flex flex-wrap items-center gap-3 mb-7">

          {/* Mini stats */}
          {[
            { label: 'Total', value: ideas.length, color: 'var(--void)' },
            { label: 'Pinned', value: pinnedCount, color: 'var(--amber)', icon: Pin },
            { label: 'Expanded', value: expandedCount, color: 'var(--brand)', icon: Sparkles },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
              {s.icon && <s.icon size={12} strokeWidth={1.8} style={{ color: s.color }} />}
              <span className="font-black text-[18px] leading-none"
                style={{ fontFamily: 'var(--font-archivo)', color: s.color }}>{s.value}</span>
              <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.45)' }}>{s.label}</span>
            </motion.div>
          ))}

          {/* Search */}
          <motion.div variants={fadeUp} className="flex-1 min-w-[180px] relative">
            <Search size={13} strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(26,16,53,0.35)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ideas..."
              className="w-full pl-8 pr-4 py-2 rounded-xl text-[13px] outline-none transition-all"
              style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
              onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
          </motion.div>

          {/* Tag filter */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
            {(['All', ...TAGS] as (IdeaTag | 'All')[]).map(t => {
              const active = activeTag === t
              const cfg = t !== 'All' ? tagConfig[t] : null
              return (
                <motion.button key={t} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveTag(t)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                  style={{
                    background: active ? (cfg ? cfg.bg : 'var(--void)') : '#fff',
                    color: active ? (cfg ? cfg.color : 'var(--mist)') : 'rgba(26,16,53,0.5)',
                    border: `1.5px solid ${active ? (cfg ? cfg.border : 'var(--void)') : 'var(--void-12)'}`,
                    fontFamily: 'var(--font-archivo)',
                  }}>
                  {t}
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>

        {/* ── Masonry grid ── */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239,159,39,0.1)' }}>
              <Lightbulb size={28} strokeWidth={1.5} style={{ color: 'var(--amber)' }} />
            </div>
            <p className="font-bold text-[16px]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              {search ? 'No ideas found' : 'No ideas yet'}
            </p>
            <p className="text-[13px]" style={{ color: 'rgba(26,16,53,0.4)' }}>
              {search ? 'Try a different search term' : 'Click "New Idea" to add your first one'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
            style={{ columnGap: '1rem' }}
          >
            <AnimatePresence>
              {filtered.map((idea, i) => (
                <div key={idea.id} className="break-inside-avoid mb-4">
                  <IdeaCard
                    idea={idea} index={i}
                    onEdit={() => setModalIdea({ ...idea })}
                    onDelete={() => deleteIdea(idea.id)}
                    onPin={() => togglePin(idea.id)}
                    onExpand={() => setExpandIdea(idea)}
                  />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {modalIdea && (
          <IdeaModal key="idea-modal" idea={modalIdea} onSave={saveIdea} onClose={() => setModalIdea(null)} />
        )}
        {expandIdea && (
          <ExpandModal key="expand-modal" idea={expandIdea} onClose={() => setExpandIdea(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}