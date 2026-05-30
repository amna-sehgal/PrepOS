'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Map, Sparkles, Target, Building2, Clock, ChevronRight,
  CheckCircle2, Circle, Mic2, BookOpen, Code2, BrainCircuit,
  Layers, ArrowRight, RotateCcw, TrendingUp, Trophy,
  CalendarDays, Zap, Play, Activity, Star,
} from 'lucide-react'
import { generateAIRoadmap } from '@/lib/actions/roadmap'
import RoadmapHistory from '@/components/RoadmapHistory'

const ease = cubicBezier(0.22, 1, 0.36, 1)
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

// ── Types ──────────────────────────────────────────────
type Topic = { id: string; label: string; done: boolean }
type Week = {
  week: number; title: string; focus: string
  topics: Topic[]; problems: string[]
  mockInterview: { type: string; role: string } | null
  color: string; bg: string; border: string
}
type RoadmapConfig = {
  role: string
  companies: string[]
  weeks: number
  roadmap?: Week[]
}

// ── Data ───────────────────────────────────────────────
const roles = ['SDE Intern', 'SDE-1', 'Data Analyst', 'Product Manager', 'ML Engineer', 'Frontend Dev', 'Backend Dev']
const companies = ['Google', 'Amazon', 'Flipkart', 'Razorpay', 'Atlassian', 'Microsoft', 'Adobe', 'Swiggy', 'CRED', 'PhonePe']
const weekOptions = [4, 6, 8, 10, 12]

const weekColors = [
  { color: 'var(--brand)', bg: 'rgba(83,74,183,0.07)', border: 'rgba(83,74,183,0.2)' },
  { color: 'var(--teal)', bg: 'rgba(29,158,117,0.07)', border: 'rgba(29,158,117,0.2)' },
  { color: 'var(--amber)', bg: 'rgba(239,159,39,0.07)', border: 'rgba(239,159,39,0.2)' },
  { color: '#8B5CF6', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)' },
  { color: 'var(--coral)', bg: 'rgba(226,75,74,0.07)', border: 'rgba(226,75,74,0.2)' },
  { color: 'var(--brand)', bg: 'rgba(83,74,183,0.07)', border: 'rgba(83,74,183,0.2)' },
]

// ── Roadmap generator ──────────────────────────────────
function generateRoadmap(config: RoadmapConfig): Week[] {
  const { role, weeks, companies } = config
  const isPM = role.includes('PM') || role.includes('Product')
  const isML = role.includes('ML')
  const isFE = role.includes('Frontend')

  const allWeeks: Week[] = []

  // Foundation weeks
  allWeeks.push({
    week: 1, title: 'Foundations', focus: 'Core DSA & Problem Solving Setup',
    topics: [
      { id: 'w1t1', label: 'Arrays & Strings', done: true },
      { id: 'w1t2', label: 'HashMaps & Sets', done: true },
      { id: 'w1t3', label: 'Time & Space Complexity', done: false },
      { id: 'w1t4', label: 'Two Pointer Technique', done: false },
    ],
    problems: ['Two Sum', 'Valid Anagram', 'Contains Duplicate', 'Best Time to Buy/Sell Stock'],
    mockInterview: null,
    ...weekColors[0],
  })

  allWeeks.push({
    week: 2, title: 'Core Patterns',
    focus: isPM ? 'Product Thinking & Frameworks' : isML ? 'ML Foundations' : 'Sliding Window & Binary Search',
    topics: isPM ? [
      { id: 'w2t1', label: 'Product Sense Framework', done: true },
      { id: 'w2t2', label: 'Metrics & Success Criteria', done: false },
      { id: 'w2t3', label: 'User Research Methods', done: false },
      { id: 'w2t4', label: 'Prioritisation Frameworks', done: false },
    ] : [
      { id: 'w2t1', label: 'Sliding Window', done: true },
      { id: 'w2t2', label: 'Binary Search', done: false },
      { id: 'w2t3', label: 'Prefix Sums', done: false },
      { id: 'w2t4', label: 'Stack & Queue', done: false },
    ],
    problems: isPM
      ? ['Design metrics for Instagram Reels', 'Root cause: DAU dropped 10%', 'Prioritise feature backlog']
      : ['Longest Substring Without Repeating', 'Search in Rotated Array', 'Find Peak Element'],
    mockInterview: null,
    ...weekColors[1],
  })

  allWeeks.push({
    week: 3, title: 'Trees & Graphs',
    focus: isPM ? 'Go-to-Market & Roadmapping' : 'Tree Traversals & Graph BFS/DFS',
    topics: isPM ? [
      { id: 'w3t1', label: 'GTM Strategy', done: false },
      { id: 'w3t2', label: 'Product Roadmapping', done: false },
      { id: 'w3t3', label: 'Stakeholder Management', done: false },
      { id: 'w3t4', label: 'A/B Testing Fundamentals', done: false },
    ] : [
      { id: 'w3t1', label: 'Binary Trees', done: false },
      { id: 'w3t2', label: 'BFS & DFS', done: false },
      { id: 'w3t3', label: 'Graph Representations', done: false },
      { id: 'w3t4', label: 'Topological Sort', done: false },
    ],
    problems: isPM
      ? ['Launch Google Maps in a new city', 'Build a PM roadmap for Spotify podcasts']
      : ['Level Order Traversal', 'Number of Islands', 'Course Schedule', 'Word Ladder'],
    mockInterview: { type: 'DSA', role: 'Behavioural' },
    ...weekColors[2],
  })

  if (weeks >= 6) {
    allWeeks.push({
      week: 4, title: 'Dynamic Programming',
      focus: isPM ? 'Estimation & Case Studies' : 'DP Patterns & Memoisation',
      topics: isPM ? [
        { id: 'w4t1', label: 'Market Sizing', done: false },
        { id: 'w4t2', label: 'Fermi Estimation', done: false },
        { id: 'w4t3', label: 'Competitive Analysis', done: false },
        { id: 'w4t4', label: 'Case Study Walkthroughs', done: false },
      ] : [
        { id: 'w4t1', label: '1D DP (Fibonacci, Climbing Stairs)', done: false },
        { id: 'w4t2', label: '2D DP (Grid problems)', done: false },
        { id: 'w4t3', label: 'Knapsack Pattern', done: false },
        { id: 'w4t4', label: 'LCS / LIS', done: false },
      ],
      problems: isPM
        ? ['How many barbers in Delhi?', 'Estimate WhatsApp messages per day']
        : ['Coin Change', 'Longest Common Subsequence', 'House Robber', 'Edit Distance'],
      mockInterview: null,
      ...weekColors[3],
    })

    allWeeks.push({
      week: 5, title: 'System Design',
      focus: companies.includes('Google') || companies.includes('Microsoft')
        ? 'Large Scale System Design'
        : 'System Design Fundamentals',
      topics: [
        { id: 'w5t1', label: 'Scalability Principles', done: false },
        { id: 'w5t2', label: 'Load Balancing & Caching', done: false },
        { id: 'w5t3', label: 'Databases: SQL vs NoSQL', done: false },
        { id: 'w5t4', label: 'Microservices vs Monolith', done: false },
      ],
      problems: ['Design URL Shortener', 'Design Twitter Feed', 'Design a Rate Limiter'],
      mockInterview: { type: 'System Design', role: config.role },
      ...weekColors[4],
    })
  }

  if (weeks >= 8) {
    allWeeks.push({
      week: 6, title: 'Advanced Topics',
      focus: isFE ? 'Frontend Specifics' : isML ? 'ML Systems' : 'Heaps, Tries & Advanced DS',
      topics: isFE ? [
        { id: 'w6t1', label: 'React Internals & Reconciliation', done: false },
        { id: 'w6t2', label: 'Performance Optimisation', done: false },
        { id: 'w6t3', label: 'Web APIs & Browser Storage', done: false },
        { id: 'w6t4', label: 'CSS Architecture', done: false },
      ] : [
        { id: 'w6t1', label: 'Heaps & Priority Queue', done: false },
        { id: 'w6t2', label: 'Tries', done: false },
        { id: 'w6t3', label: 'Union Find', done: false },
        { id: 'w6t4', label: 'Segment Trees (optional)', done: false },
      ],
      problems: isFE
        ? ['Build a virtual DOM', 'Implement debounce/throttle', 'Design a component library']
        : ['Top K Frequent Elements', 'Find Median from Data Stream', 'Word Search II'],
      mockInterview: null,
      ...weekColors[5],
    })

    allWeeks.push({
      week: 7, title: 'Company Focus',
      focus: companies.length > 0
        ? `${companies.slice(0, 2).join(' & ')} specific prep`
        : 'Company Pattern Practice',
      topics: [
        { id: 'w7t1', label: `${companies[0] || 'Target company'} OA patterns`, done: false },
        { id: 'w7t2', label: 'Behavioural (STAR method)', done: false },
        { id: 'w7t3', label: 'Culture & values research', done: false },
        { id: 'w7t4', label: 'Past interview questions', done: false },
      ],
      problems: ['3 company-tagged LeetCode problems', 'Write 5 STAR stories', 'Mock with peer'],
      mockInterview: { type: 'Mixed', role: config.role },
      ...weekColors[0],
    })

    allWeeks.push({
      week: 8, title: 'Final Sprint',
      focus: 'Revision, Mock Interviews & Confidence',
      topics: [
        { id: 'w8t1', label: 'Revisit weak areas', done: false },
        { id: 'w8t2', label: '2 full mock interviews', done: false },
        { id: 'w8t3', label: 'Review all STAR answers', done: false },
        { id: 'w8t4', label: 'Rest & mental prep', done: false },
      ],
      problems: ['Timed contest on Codeforces', 'System design end-to-end walkthrough'],
      mockInterview: { type: 'DSA', role: config.role },
      ...weekColors[1],
    })
  }

  return allWeeks.slice(0, weeks)
}

// ── Animated progress counter ──────────────────────────
function useCountUp(target: number, delay = 0) {
  const [count, setCount] = useState(0)
  useMemo(() => {
    const t = setTimeout(() => {
      let s = 0; const step = target / 40
      const timer = setInterval(() => {
        s += step; if (s >= target) { setCount(target); clearInterval(timer) } else setCount(Math.floor(s))
      }, 20)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay])
  return count
}

// ── Setup screen ───────────────────────────────────────
function SetupScreen({ onGenerate }: { onGenerate: (c: RoadmapConfig) => void }) {
  const [role, setRole] = useState('SDE Intern')
  const [selected, setSelected] = useState<string[]>([])
  const [weeks, setWeeks] = useState(8)
  const [loading, setLoading] = useState(false)

  const toggleCompany = (c: string) =>
    setSelected(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])

  const handleGenerate = async () => {
    setLoading(true)

    try {
      const data = await generateAIRoadmap({
        role,
        companies: selected,
        weeks,
      })

      onGenerate({
        role,
        companies: selected,
        weeks,
        roadmap:
          data?.roadmap &&
            Array.isArray(data.roadmap) &&
            data.roadmap.length > 0
            ? data.roadmap
            : generateRoadmap({
              role,
              companies: selected,
              weeks,
            }),
      } as any)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show"
      className="max-w-xl mx-auto px-5 md:px-0 py-10">

      <motion.div variants={fadeUp} className="mb-10">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full"
          style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.15)' }}>
          <Map size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
          <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--brand)' }}>
            PREP ROADMAP GENERATOR
          </span>
        </div>
        <h1 className="font-black text-[32px] md:text-[42px] leading-[1.0] tracking-[-0.03em]"
          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
          Build your prep roadmap
        </h1>
        <p className="text-[15px] mt-2" style={{ color: 'rgba(26,16,53,0.5)' }}>
          Tell us your goal — we'll build a week-by-week plan to get you there.
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

        {/* Companies */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
            <Building2 size={13} strokeWidth={1.8} /> Target Companies
            <span className="normal-case font-normal tracking-normal text-[11px]"
              style={{ color: 'rgba(26,16,53,0.35)' }}>— optional, select multiple</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {companies.map(c => (
              <motion.button key={c} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => toggleCompany(c)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                style={{
                  background: selected.includes(c) ? 'rgba(83,74,183,0.1)' : '#fff',
                  color: selected.includes(c) ? 'var(--brand)' : 'rgba(26,16,53,0.5)',
                  border: `1.5px solid ${selected.includes(c) ? 'rgba(83,74,183,0.3)' : 'var(--void-12)'}`,
                  fontFamily: 'var(--font-archivo)',
                }}>
                {c}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Weeks */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
            <Clock size={13} strokeWidth={1.8} /> Available Time
          </label>
          <div className="flex gap-3">
            {weekOptions.map(w => (
              <motion.button key={w} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setWeeks(w)}
                className="flex-1 py-3 rounded-xl text-[13px] font-bold cursor-pointer transition-all flex flex-col items-center gap-0.5"
                style={{
                  background: weeks === w ? 'var(--brand)' : '#fff',
                  color: weeks === w ? '#fff' : 'var(--brand)',
                  border: `1.5px solid ${weeks === w ? 'var(--brand)' : 'rgba(83,74,183,0.2)'}`,
                  fontFamily: 'var(--font-archivo)',
                }}>
                <span className="text-[16px]">{w}</span>
                <span className="text-[10px] font-normal opacity-70">weeks</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info card */}
        <motion.div variants={fadeUp}
          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
          style={{ background: 'rgba(83,74,183,0.06)', border: '1px solid rgba(83,74,183,0.15)' }}>
          <Sparkles size={14} strokeWidth={1.8} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[13px] font-semibold mb-0.5"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              What you'll get
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(26,16,53,0.55)' }}>
              A {weeks}-week plan with daily topics, practice problems, and a mock interview every 2–3 weeks — customised for {role}{selected.length > 0 ? ` at ${selected.slice(0, 2).join(' / ')}` : ''}.
            </p>
          </div>
        </motion.div>

        {/* Generate */}
        <motion.div variants={fadeUp}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(26,16,53,0.18)' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-[15px] font-black cursor-pointer flex items-center justify-center gap-2"
            style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)', opacity: loading ? 0.8 : 1 }}>
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles size={16} strokeWidth={1.8} />
                </motion.div>
                Generating your roadmap...
              </>
            ) : (
              <>
                <Sparkles size={16} strokeWidth={1.8} />
                Generate My Roadmap
              </>
            )}
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  )
}

// ── Week card ──────────────────────────────────────────
function WeekCard({ week, index, onToggleTopic }: {
  week: Week; index: number; onToggleTopic: (weekNum: number, topicId: string) => void
}) {
  const [expanded, setExpanded] = useState(index === 0)
  const done = week.topics.filter(t => t.done).length
  const pct = Math.round((done / week.topics.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease, delay: index * 0.07 }}
      className="relative"
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-[19px] -top-4 w-0.5 h-4"
          style={{ background: `${week.color}40` }} />
      )}

      <div className="flex gap-4">
        {/* Week number circle */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          onClick={() => setExpanded(e => !e)}
          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-[13px] flex-shrink-0 cursor-pointer mt-0.5 relative z-10"
          style={{
            background: pct === 100 ? week.color : '#fff',
            color: pct === 100 ? '#fff' : week.color,
            border: `2px solid ${week.color}`,
            fontFamily: 'var(--font-archivo)',
            boxShadow: `0 0 0 4px ${week.bg}`,
          }}>
          {pct === 100 ? <CheckCircle2 size={16} strokeWidth={2.5} /> : index + 1}
        </motion.div>

        {/* Card */}
        <motion.div
          whileHover={{ boxShadow: `0 8px 28px ${week.color}18` }}
          className="flex-1 rounded-2xl overflow-hidden transition-all"
          style={{ background: '#fff', border: `1.5px solid var(--void-12)` }}
        >
          {/* Card header */}
          <div
            className="flex items-center justify-between px-5 py-4 cursor-pointer"
            onClick={() => setExpanded(e => !e)}
            style={{ borderBottom: expanded ? '1px solid rgba(26,16,53,0.06)' : 'none' }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono-frag text-[10px] tracking-[0.1em] px-2 py-0.5 rounded-full"
                  style={{ background: week.bg, color: week.color }}>
                  WEEK {week.week}
                </span>
                {week.mockInterview && (
                  <span className="inline-flex items-center gap-1 font-mono-frag text-[9px] tracking-[0.08em] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(83,74,183,0.08)', color: 'var(--brand)' }}>
                    <Mic2 size={8} strokeWidth={2} /> MOCK INTERVIEW
                  </span>
                )}
              </div>
              <p className="font-black text-[15px] tracking-tight"
                style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                {week.title}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(26,16,53,0.45)' }}>
                {week.focus || 'Focus area not generated'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              {/* Progress ring */}
              <div className="relative w-10 h-10">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none"
                    stroke={week.color + '20'} strokeWidth="3" />
                  <motion.circle cx="20" cy="20" r="16" fill="none"
                    stroke={week.color} strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 16 * (1 - pct / 100) }}
                    transition={{ duration: 0.8, ease, delay: index * 0.07 }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-[10px]"
                  style={{ fontFamily: 'var(--font-archivo)', color: week.color }}>
                  {pct}%
                </span>
              </div>

              <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight size={16} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.35)' }} />
              </motion.div>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 flex flex-col gap-4">

                  {/* Topics */}
                  <div>
                    <p className="font-mono-frag text-[10px] tracking-[0.09em] mb-2.5 flex items-center gap-1.5"
                      style={{ color: 'rgba(26,16,53,0.38)' }}>
                      <BookOpen size={10} strokeWidth={1.8} /> TOPICS TO COVER
                    </p>
                    <div className="flex flex-col gap-2">
                      {week.topics.map((topic, i) => (
                        <motion.div key={`${week.week}-${topic.id}-${i}`}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => onToggleTopic(week.week, topic.id)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                            {topic.done
                              ? <CheckCircle2 size={18} strokeWidth={2}
                                style={{ color: week.color, flexShrink: 0 }} />
                              : <Circle size={18} strokeWidth={1.8}
                                style={{ color: 'rgba(26,16,53,0.2)', flexShrink: 0 }} />
                            }
                          </motion.div>
                          <span className="text-[13px] transition-all"
                            style={{
                              color: topic.done ? 'rgba(26,16,53,0.35)' : 'var(--void)',
                              textDecoration: topic.done ? 'line-through' : 'none',
                            }}>
                            {topic.label || 'Topic not generated'}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Practice problems */}
                  <div className="rounded-xl px-4 py-3"
                    style={{ background: week.bg, border: `1px solid ${week.border}` }}>
                    <p className="font-mono-frag text-[10px] tracking-[0.09em] mb-2 flex items-center gap-1.5"
                      style={{ color: week.color }}>
                      <Code2 size={10} strokeWidth={1.8} /> PRACTICE PROBLEMS
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {week.problems.map((p, i) => (
                        <div key={`${week.week}-${p || 'Practice problem not generated'}-${i}`} className="flex items-center gap-2">
                          <ArrowRight size={10} strokeWidth={2} style={{ color: week.color, flexShrink: 0 }} />
                          <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.65)' }}>{p || 'Practice problem not generated'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mock interview suggestion */}
                  {week.mockInterview && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'var(--void)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(238,237,254,0.1)' }}>
                          <Mic2 size={14} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
                        </div>
                        <div>
                          <p className="font-bold text-[12px]"
                            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--mist)' }}>
                            Take a mock interview this week
                          </p>
                          <p className="text-[11px]" style={{ color: 'rgba(238,237,254,0.45)' }}>
                            {week.mockInterview?.type || ''} · {week.mockInterview?.role || ''}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/mock-interview?type=${encodeURIComponent(
                          week.mockInterview.type
                        )}&role=${encodeURIComponent(
                          week.mockInterview.role
                        )}&week=${week.week}`}
                        className="no-underline"
                      >
                        <motion.div whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          style={{ background: 'var(--brand)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
                          Start <Play size={10} strokeWidth={2.5} />
                        </motion.div>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Roadmap view ───────────────────────────────────────
function RoadmapView({ config, onReset }: { config: RoadmapConfig; onReset: () => void }) {
  const [weeks, setWeeks] = useState<Week[]>(config.roadmap || [])

  const toggleTopic = async (weekNum: number, topicId: string) => {
    // 1. update UI immediately (you already had this)
    setWeeks(prev =>
      prev.map(w =>
        w.week === weekNum
          ? {
            ...w,
            topics: w.topics.map(t =>
              t.id === topicId ? { ...t, done: !t.done } : t
            )
          }
          : w
      )
    )

    // 2. save to database (NEW PART)
    await fetch("/api/roadmap/toggle", {
      method: "POST",
      body: JSON.stringify({
        week: weekNum,
        topicId,
      }),
    })
  }

  const totalTopics = weeks.reduce((a, w) => a + w.topics.length, 0)
  const doneTopics = weeks.reduce((a, w) => a + w.topics.filter(t => t.done).length, 0)
  const readiness = Math.round((doneTopics / totalTopics) * 100)
  const currentWeek = weeks.findIndex(w => w.topics.some(t => !t.done)) + 1 || weeks.length
  const animReadiness = useCountUp(readiness, 400)

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.15)' }}>
              <Map size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--brand)' }}>
                YOUR ROADMAP
              </span>
            </div>
            <h1 className="font-black text-[26px] md:text-[32px] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              {config.role}
              {config.companies.length > 0 && (
                <span className="font-normal text-[18px] ml-2" style={{ color: 'rgba(26,16,53,0.4)' }}>
                  · {config.companies.slice(0, 2).join(', ')}
                </span>
              )}
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(26,16,53,0.45)' }}>
              {config.weeks}-week prep plan · Week {currentWeek} in progress
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold cursor-pointer"
            style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'rgba(26,16,53,0.55)', fontFamily: 'var(--font-archivo)' }}>
            <RotateCcw size={12} strokeWidth={1.8} /> Rebuild
          </motion.button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Overall Readiness', value: `${animReadiness}%`, icon: TrendingUp, color: 'var(--brand)' },
            { label: 'Topics Done', value: `${doneTopics}/${totalTopics}`, icon: CheckCircle2, color: 'var(--teal)' },
            { label: 'Current Week', value: `${currentWeek}/${config.weeks}`, icon: CalendarDays, color: 'var(--amber)' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-2xl px-4 py-3.5"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} strokeWidth={1.8} style={{ color: s.color }} />
                  <span className="text-[10px] font-semibold"
                    style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                    {s.label}
                  </span>
                </div>
                <p className="font-black text-[22px] leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                  {s.value}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Master progress bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl px-5 py-4"
          style={{ background: 'var(--void)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-frag text-[10px] tracking-[0.1em]"
              style={{ color: 'rgba(238,237,254,0.4)' }}>OVERALL PROGRESS</span>
            <span className="font-black text-[16px]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--lavender)' }}>
              {animReadiness}%
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(238,237,254,0.1)' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${readiness}%` }}
              transition={{ duration: 1.2, ease, delay: 0.4 }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: 'var(--lavender)' }}>
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0 w-1/2"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
            </motion.div>
          </div>
          <div className="flex justify-between">
            {weeks.map((w, i) => {
              const wpct = Math.round((w.topics.filter(t => t.done).length / w.topics.length) * 100)
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: wpct === 100 ? w.color : wpct > 0 ? w.color + '60' : 'rgba(238,237,254,0.15)' }} />
                  <span className="font-mono-frag text-[8px]" style={{ color: 'rgba(238,237,254,0.25)' }}>
                    W{w.week}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Week timeline */}
      <div className="flex flex-col gap-4">
        {weeks.map((week, i) => (
          <WeekCard key={week.week} week={week} index={i} onToggleTopic={toggleTopic} />
        ))}
      </div>

      {/* Completion message */}
      {readiness === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="mt-8 rounded-2xl px-6 py-5 text-center"
          style={{ background: 'rgba(29,158,117,0.08)', border: '1.5px solid rgba(29,158,117,0.2)' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-2">
            <Trophy size={28} strokeWidth={1.8} style={{ color: 'var(--teal)' }} />
          </motion.div>
          <p className="font-black text-[18px] mb-1"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            Roadmap complete!
          </p>
          <p className="text-[13px] mb-4" style={{ color: 'rgba(26,16,53,0.5)' }}>
            You've covered everything. Time to take a final mock and go crush it.
          </p>
          <Link href="/mock-interview" className="no-underline">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer"
              style={{ background: 'var(--teal)', color: '#fff', fontFamily: 'var(--font-archivo)' }}>
              <Mic2 size={14} strokeWidth={2} /> Take Final Mock Interview
            </motion.div>
          </Link>
        </motion.div>
      )}
    </div>
  )
}

// ── Root page ──────────────────────────────────────────
export default function RoadmapPage() {
  const [config, setConfig] = useState<RoadmapConfig | null>(null)

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!config ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease }}
            >
              <SetupScreen onGenerate={setConfig} />
              <RoadmapHistory onSelectRoadmap={setConfig} />
            </motion.div>
          ) : (
            <motion.div key="roadmap"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease }}>
              <RoadmapView config={config} onReset={() => setConfig(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
