'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
  BookOpen, Search, ExternalLink, Star, StarOff,
  BrainCircuit, Layers, MessageSquare, Building2,
  Youtube, BookMarked, Code2, ArrowUpRight, Filter,
  Flame, Trophy, Zap, GraduationCap, FileText,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

// ── Types ──────────────────────────────────────────────
type Category = 'DSA' | 'System Design' | 'Behavioural' | 'Company' | 'Courses' | 'Books'
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
type Resource = {
  id: string; title: string; description: string
  category: Category; difficulty: Difficulty
  url: string; tags: string[]; featured: boolean; free: boolean
}

// ── Category config ────────────────────────────────────
const catConfig: Record<Category, {
  label: string; color: string; bg: string; border: string; icon: typeof BookOpen
}> = {
  DSA:           { label: 'DSA',            color: 'var(--brand)',  bg: 'rgba(83,74,183,0.08)',  border: 'rgba(83,74,183,0.2)',  icon: BrainCircuit },
  'System Design': { label: 'System Design', color: '#8B5CF6',      bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', icon: Layers },
  Behavioural:   { label: 'Behavioural',    color: 'var(--teal)',   bg: 'rgba(29,158,117,0.08)', border: 'rgba(29,158,117,0.2)', icon: MessageSquare },
  Company:       { label: 'Company Prep',   color: 'var(--coral)',  bg: 'rgba(226,75,74,0.08)',  border: 'rgba(226,75,74,0.2)',  icon: Building2 },
  Courses:       { label: 'Courses',        color: 'var(--amber)',  bg: 'rgba(239,159,39,0.08)', border: 'rgba(239,159,39,0.2)', icon: Youtube },
  Books:         { label: 'Books & Blogs',  color: '#06B6D4',       bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.2)',  icon: BookMarked },
}

const difficultyConfig: Record<Difficulty, { color: string; bg: string }> = {
  Beginner:     { color: 'var(--teal)',  bg: 'rgba(29,158,117,0.1)' },
  Intermediate: { color: 'var(--amber)', bg: 'rgba(239,159,39,0.1)' },
  Advanced:     { color: 'var(--coral)', bg: 'rgba(226,75,74,0.1)'  },
  'All Levels': { color: 'var(--brand)', bg: 'rgba(83,74,183,0.1)'  },
}

// ── Resource data ──────────────────────────────────────
const resources: Resource[] = [
  // DSA
  { id: '1', title: 'Striver\'s A2Z DSA Sheet', description: 'The most complete DSA roadmap for Indian college students. 450+ problems organised by topic with video solutions.', category: 'DSA', difficulty: 'All Levels', url: 'https://takeuforward.org/strivers-a2z-dsa-course', tags: ['Most Popular', 'Free', 'Videos'], featured: true, free: true },
  { id: '2', title: 'NeetCode 150', description: 'The 150 most important LeetCode problems curated for FAANG interviews. Clean explanations and Python solutions.', category: 'DSA', difficulty: 'Intermediate', url: 'https://neetcode.io', tags: ['FAANG Focus', 'Free', 'Python'], featured: true, free: true },
  { id: '3', title: 'Love Babbar\'s DSA Sheet', description: '450 handpicked DSA problems with a topic-wise breakdown. Widely used across tier 2 & 3 college students.', category: 'DSA', difficulty: 'Beginner', url: 'https://450dsa.com', tags: ['450 Problems', 'Free', 'Tier 2 Friendly'], featured: false, free: true },
  { id: '4', title: 'LeetCode', description: 'The gold standard for interview prep. 3000+ problems, company-tagged questions, and weekly contests.', category: 'DSA', difficulty: 'All Levels', url: 'https://leetcode.com', tags: ['Industry Standard', 'Contests'], featured: false, free: false },
  { id: '5', title: 'Codeforces', description: 'Best platform for competitive programming. Regular rounds help you build speed and pattern recognition.', category: 'DSA', difficulty: 'Advanced', url: 'https://codeforces.com', tags: ['Competitive', 'Rated Contests', 'CP'], featured: false, free: true },

  // System Design
  { id: '6', title: 'System Design Primer', description: 'The most starred GitHub repo for system design. Covers scalability, databases, caching, load balancing and more.', category: 'System Design', difficulty: 'Intermediate', url: 'https://github.com/donnemartin/system-design-primer', tags: ['GitHub', 'Free', 'Comprehensive'], featured: true, free: true },
  { id: '7', title: 'ByteByteGo Newsletter', description: 'Alex Xu\'s weekly system design newsletter. Real-world architecture breakdowns of systems like YouTube, WhatsApp, and more.', category: 'System Design', difficulty: 'Intermediate', url: 'https://bytebytego.com', tags: ['Newsletter', 'Real-world', 'Visual'], featured: true, free: false },
  { id: '8', title: 'Designing Data-Intensive Applications', description: 'The bible of distributed systems. Deep dives into databases, replication, partitioning, and consistency.', category: 'System Design', difficulty: 'Advanced', url: '#', tags: ['Book', 'Deep Dive', 'Must Read'], featured: false, free: false },
  { id: '9', title: 'High Scalability Blog', description: 'Real architecture teardowns of companies like Instagram, Twitter, and Netflix. Excellent for senior roles.', category: 'System Design', difficulty: 'Advanced', url: 'http://highscalability.com', tags: ['Case Studies', 'Free', 'Blog'], featured: false, free: true },

  // Behavioural
  { id: '10', title: 'STAR Method Guide', description: 'Master the Situation-Task-Action-Result framework for behavioural interviews. Includes 50+ question bank with sample answers.', category: 'Behavioural', difficulty: 'Beginner', url: '#', tags: ['Free', 'Framework', 'Starter'], featured: true, free: true },
  { id: '11', title: 'Amazon Leadership Principles', description: 'Deep dive into Amazon\'s 16 leadership principles with example stories and what interviewers look for.', category: 'Behavioural', difficulty: 'All Levels', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', tags: ['Amazon', 'Free', 'LP Questions'], featured: false, free: true },
  { id: '12', title: 'Life Stories Method', description: 'Think in terms of life stories, not STAR bullets. This framework helps you stand out in PM and senior eng roles.', category: 'Behavioural', difficulty: 'Intermediate', url: '#', tags: ['PM Friendly', 'Free', 'Storytelling'], featured: false, free: true },

  // Company
  { id: '13', title: 'Glassdoor Interview Experiences', description: 'Real interview questions and experiences from people who\'ve interviewed at your target companies.', category: 'Company', difficulty: 'All Levels', url: 'https://glassdoor.com', tags: ['Real Experiences', 'Free', 'All Companies'], featured: true, free: true },
  { id: '14', title: 'LeetCode Company Tags', description: 'Filter LeetCode problems by company. Focus on the last 6 months of questions for your target company.', category: 'Company', difficulty: 'All Levels', url: 'https://leetcode.com/company', tags: ['Premium', 'Company Tagged', 'Focused'], featured: false, free: false },
  { id: '15', title: 'Exponent PM Interview Prep', description: 'Product Manager interview prep with real mock interviews, frameworks, and company-specific guides for Flipkart, Google, and more.', category: 'Company', difficulty: 'Intermediate', url: 'https://www.tryexponent.com', tags: ['PM Focus', 'Mock Interviews'], featured: false, free: false },
  { id: '16', title: 'Razorpay Interview Guide', description: 'Aggregated interview experiences and common patterns from Razorpay SDE interviews. DSA-heavy with some OS and networking.', category: 'Company', difficulty: 'Intermediate', url: '#', tags: ['Razorpay', 'Free', 'Indian Startup'], featured: false, free: true },

  // Courses
  { id: '17', title: 'Striver\'s DSA Playlist (YouTube)', description: '200+ hours of free DSA content by Raj Vikramaditya. The most comprehensive free resource for Indian students.', category: 'Courses', difficulty: 'All Levels', url: 'https://youtube.com/@takeUforward', tags: ['YouTube', 'Free', '200+ Hours'], featured: true, free: true },
  { id: '18', title: 'NeetCode YouTube', description: 'Clean, fast DSA explanations with visual animations. Best for understanding patterns quickly before an interview.', category: 'Courses', difficulty: 'Intermediate', url: 'https://youtube.com/@NeetCode', tags: ['YouTube', 'Free', 'Visual'], featured: true, free: true },
  { id: '19', title: 'Gaurav Sen System Design', description: 'System design explained simply. HLD and LLD videos are the go-to for Indian interviews at product companies.', category: 'Courses', difficulty: 'Intermediate', url: 'https://youtube.com/@gkcs', tags: ['YouTube', 'Free', 'HLD & LLD'], featured: false, free: true },
  { id: '20', title: 'CS50 by Harvard', description: 'The best intro to CS fundamentals. Free on edX — covers C, Python, data structures, algorithms, web, and AI.', category: 'Courses', difficulty: 'Beginner', url: 'https://cs50.harvard.edu', tags: ['edX', 'Free', 'Fundamentals'], featured: false, free: true },

  // Books
  { id: '21', title: 'Cracking the Coding Interview', description: 'The classic interview prep book. 189 programming questions and solutions across all major CS topics.', category: 'Books', difficulty: 'Intermediate', url: '#', tags: ['Book', 'Classic', 'Must Have'], featured: true, free: false },
  { id: '22', title: 'System Design Interview (Alex Xu)', description: 'Vol 1 & 2 cover 16 real system design problems with detailed solutions. Best book for system design rounds.', category: 'Books', difficulty: 'Intermediate', url: '#', tags: ['Book', 'Top Rated', 'Vol 1 & 2'], featured: true, free: false },
  { id: '23', title: 'GeeksforGeeks', description: 'The Wikipedia of CS interview prep. Articles on every DSA topic, OS, DBMS, and networking concept.', category: 'Books', difficulty: 'All Levels', url: 'https://geeksforgeeks.org', tags: ['Website', 'Free', 'Reference'], featured: false, free: true },
  { id: '24', title: 'roadmap.sh', description: 'Visual, interactive career roadmaps for frontend, backend, DevOps, and more. Great for structured learning.', category: 'Books', difficulty: 'All Levels', url: 'https://roadmap.sh', tags: ['Website', 'Free', 'Visual Roadmaps'], featured: false, free: true },
]

const CATEGORIES: Category[] = ['DSA', 'System Design', 'Behavioural', 'Company', 'Courses', 'Books']

// ── Resource card ──────────────────────────────────────
function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const [saved, setSaved] = useState(false)
  const cat = catConfig[resource.category]
  const CatIcon = cat.icon
  const diff = difficultyConfig[resource.difficulty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: index * 0.04 }}
      whileHover={{ y: -3, boxShadow: `0 16px 40px ${cat.color}14` }}
      className="rounded-2xl p-5 flex flex-col gap-3 relative group transition-all"
      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
    >
      {/* Featured badge */}
      {resource.featured && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: index * 0.04 + 0.2, type: 'spring', stiffness: 300 }}
          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
          style={{ background: 'var(--amber)', color: '#fff', fontFamily: 'var(--font-archivo)' }}>
          <Flame size={8} strokeWidth={2.5} /> TOP PICK
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: cat.bg }}>
            <CatIcon size={16} strokeWidth={1.8} style={{ color: cat.color }} />
          </div>
          <div>
            <span className="font-mono-frag text-[9px] tracking-[0.1em] uppercase"
              style={{ color: cat.color }}>{cat.label}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: diff.bg, color: diff.color, fontFamily: 'var(--font-archivo)' }}>
                {resource.difficulty}
              </span>
              {!resource.free && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(26,16,53,0.06)', color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                  Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
          onClick={() => setSaved(s => !s)}
          className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0"
          style={{ background: saved ? 'rgba(239,159,39,0.1)' : 'rgba(26,16,53,0.05)' }}>
          {saved
            ? <Star size={13} strokeWidth={2} style={{ color: 'var(--amber)', fill: 'var(--amber)' }} />
            : <Star size={13} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.3)' }} />}
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-black text-[14px] leading-snug tracking-tight mb-1.5"
          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
          {resource.title}
        </h3>
        <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: 'rgba(26,16,53,0.55)' }}>
          {resource.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {resource.tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
            style={{ background: 'var(--ghost)', color: 'rgba(26,16,53,0.5)', fontFamily: 'var(--font-archivo)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <motion.a
        href={resource.url} target="_blank" rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold no-underline transition-all"
        style={{
          background: cat.bg,
          color: cat.color,
          border: `1.5px solid ${cat.border}`,
          fontFamily: 'var(--font-archivo)',
        }}>
        Visit Resource <ArrowUpRight size={13} strokeWidth={2} />
      </motion.a>
    </motion.div>
  )
}

// ── Main page ──────────────────────────────────────────
export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [freeOnly, setFreeOnly] = useState(false)
  const [savedOnly, setSavedOnly] = useState(false)

  const filtered = useMemo(() => {
    let list = resources
    if (activeCategory !== 'All') list = list.filter(r => r.category === activeCategory)
    if (freeOnly) list = list.filter(r => r.free)
    if (search) list = list.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  }, [activeCategory, freeOnly, search])

  const catCounts = useMemo(() =>
    CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: resources.filter(r => r.category === c).length }), {} as Record<Category, number>),
    [])

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <BookOpen size={11} strokeWidth={1.8} style={{ color: '#06B6D4' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: '#06B6D4' }}>
                RESOURCE HUB
              </span>
            </div>
            <h1 className="font-black text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              Resource Library
            </h1>
            <p className="text-[14px] mt-1" style={{ color: 'rgba(26,16,53,0.45)' }}>
              {resources.length} curated resources — everything you need to crack your interviews.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Free', value: resources.filter(r => r.free).length, color: 'var(--teal)', bg: 'rgba(29,158,117,0.08)' },
              { label: 'Top Picks', value: resources.filter(r => r.featured).length, color: 'var(--amber)', bg: 'rgba(239,159,39,0.08)' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                <span className="font-black text-[20px] leading-none"
                  style={{ fontFamily: 'var(--font-archivo)', color: s.color }}>{s.value}</span>
                <span className="text-[12px]" style={{ color: 'rgba(26,16,53,0.45)' }}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Filter bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.1 }}
          className="flex flex-wrap gap-3 items-center mb-7 p-4 rounded-2xl"
          style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(26,16,53,0.35)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-8 pr-4 py-2 rounded-xl text-[13px] outline-none transition-all"
              style={{ background: 'var(--ghost)', border: '1.5px solid transparent', color: 'var(--void)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
              onBlur={e => (e.target.style.borderColor = 'transparent')} />
          </div>

          <div className="h-5 w-px hidden sm:block" style={{ background: 'var(--void-12)' }} />

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory('All')}
              className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer transition-all"
              style={{
                background: activeCategory === 'All' ? 'var(--void)' : 'transparent',
                color: activeCategory === 'All' ? 'var(--mist)' : 'rgba(26,16,53,0.45)',
                fontFamily: 'var(--font-archivo)',
              }}>
              All <span className="ml-1 font-mono-frag text-[10px] opacity-60">{resources.length}</span>
            </motion.button>

            {CATEGORIES.map(cat => {
              const cfg = catConfig[cat]; const Icon = cfg.icon; const active = activeCategory === cat
              return (
                <motion.button key={cat} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer transition-all"
                  style={{
                    background: active ? cfg.bg : 'transparent',
                    color: active ? cfg.color : 'rgba(26,16,53,0.45)',
                    border: active ? `1.5px solid ${cfg.border}` : '1.5px solid transparent',
                    fontFamily: 'var(--font-archivo)',
                  }}>
                  <Icon size={11} strokeWidth={2} />
                  {cfg.label}
                  <span className="font-mono-frag text-[10px] opacity-60">{catCounts[cat]}</span>
                </motion.button>
              )
            })}
          </div>

          <div className="h-5 w-px hidden sm:block" style={{ background: 'var(--void-12)' }} />

          {/* Toggle filters */}
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => setFreeOnly(f => !f)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all"
              style={{
                background: freeOnly ? 'rgba(29,158,117,0.1)' : 'transparent',
                color: freeOnly ? 'var(--teal)' : 'rgba(26,16,53,0.4)',
                border: freeOnly ? '1.5px solid rgba(29,158,117,0.25)' : '1.5px solid transparent',
                fontFamily: 'var(--font-archivo)',
              }}>
              <GraduationCap size={11} strokeWidth={2} /> Free only
            </motion.button>
          </div>
        </motion.div>

        {/* ── Category sections ── */}
        {activeCategory === 'All' && !search ? (
          // Show by category when not filtering
          <div className="flex flex-col gap-10">
            {CATEGORIES.map((cat, ci) => {
              const catResources = resources.filter(r => r.category === cat)
              const cfg = catConfig[cat]; const Icon = cfg.icon
              const displayResources = freeOnly ? catResources.filter(r => r.free) : catResources
              if (displayResources.length === 0) return null
              return (
                <motion.div key={cat}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: ci * 0.07 }}>

                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: cfg.bg }}>
                      <Icon size={15} strokeWidth={1.8} style={{ color: cfg.color }} />
                    </div>
                    <div>
                      <h2 className="font-black text-[17px] tracking-tight"
                        style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                        {cfg.label}
                      </h2>
                    </div>
                    <div className="flex-1 h-px ml-2" style={{ background: 'var(--void-12)' }} />
                    <span className="font-mono-frag text-[10px]" style={{ color: 'rgba(26,16,53,0.35)' }}>
                      {displayResources.length} resources
                    </span>
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayResources
                      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                      .map((r, i) => (
                        <ResourceCard key={r.id} resource={r} index={i} />
                      ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // Flat grid when filtering/searching
          <AnimatePresence mode="wait">
            <motion.div key={`${activeCategory}-${search}-${freeOnly}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(83,74,183,0.08)' }}>
                    <Search size={22} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
                  </div>
                  <p className="font-black text-[16px]"
                    style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                    No resources found
                  </p>
                  <p className="text-[13px]" style={{ color: 'rgba(26,16,53,0.4)' }}>
                    Try a different search or category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((r, i) => (
                    <ResourceCard key={r.id} resource={r} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}