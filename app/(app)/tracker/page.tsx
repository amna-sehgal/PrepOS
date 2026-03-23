'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useState } from 'react'
import {
  Plus, X, Download, Sparkles, CalendarClock, Building2,
  ChevronDown, FileText, Trash2, Edit3, CheckCircle2,
  Clock, AlertTriangle, ArrowRight, KanbanSquare, GripVertical,
  Briefcase, Tag, StickyNote, Calendar, Save, ExternalLink,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
}

// ── Types ─────────────────────────────────────────────────
type Status = 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected'
type Entry = {
  id: string
  company: string
  role: string
  appliedDate: string
  interviewDate: string
  round: string
  status: Status
  notes: string
  prepPlan?: string
}

// ── Column config ─────────────────────────────────────────
const columns: { status: Status; color: string; bg: string; border: string; dim: string }[] = [
  { status: 'Applied',   color: 'var(--brand)',  bg: 'rgba(83,74,183,0.07)',   border: 'rgba(83,74,183,0.2)',   dim: 'rgba(83,74,183,0.12)' },
  { status: 'OA',        color: 'var(--amber)',  bg: 'rgba(239,159,39,0.07)',  border: 'rgba(239,159,39,0.2)',  dim: 'rgba(239,159,39,0.12)' },
  { status: 'Interview', color: '#8B5CF6',       bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)',  dim: 'rgba(139,92,246,0.12)' },
  { status: 'Offer',     color: 'var(--teal)',   bg: 'rgba(29,158,117,0.07)', border: 'rgba(29,158,117,0.2)',  dim: 'rgba(29,158,117,0.12)' },
  { status: 'Rejected',  color: 'var(--coral)',  bg: 'rgba(226,75,74,0.07)',  border: 'rgba(226,75,74,0.2)',   dim: 'rgba(226,75,74,0.12)' },
]

// ── Mock data ─────────────────────────────────────────────
const initialEntries: Entry[] = [
  { id: '1', company: 'Razorpay',   role: 'SDE Intern',      appliedDate: '2025-03-10', interviewDate: '2025-03-24', round: 'Technical Round 1', status: 'Interview', notes: 'Focus on system design basics', prepPlan: '**Day 1–2:** Arrays & Strings\n**Day 3–4:** Trees & Graphs\n**Day 5:** OS Fundamentals\n**Day 6:** Mock Interview\n**Day 7:** Rest & Review' },
  { id: '2', company: 'Flipkart',   role: 'SDE Intern',      appliedDate: '2025-03-12', interviewDate: '2025-03-28', round: 'Online Assessment', status: 'OA',        notes: 'Check past OA problems on LeetCode' },
  { id: '3', company: 'Google',     role: 'STEP Intern',     appliedDate: '2025-03-01', interviewDate: '',           round: '',                  status: 'Applied',   notes: 'Applied via referral' },
  { id: '4', company: 'Atlassian',  role: 'PM Intern',       appliedDate: '2025-02-20', interviewDate: '2025-04-03', round: 'HR Round',          status: 'Interview', notes: 'Prepare STAR stories' },
  { id: '5', company: 'CRED',       role: 'Frontend Intern', appliedDate: '2025-03-05', interviewDate: '',           round: 'Offer Extended',    status: 'Offer',     notes: 'Deadline to respond: Apr 10' },
  { id: '6', company: 'Swiggy',     role: 'SDE Intern',      appliedDate: '2025-02-15', interviewDate: '',           round: '',                  status: 'Rejected',  notes: 'Rejected after OA round' },
  { id: '7', company: 'Zepto',      role: 'SDE Intern',      appliedDate: '2025-03-18', interviewDate: '',           round: '',                  status: 'Applied',   notes: '' },
  { id: '8', company: 'PhonePe',    role: 'SDE Intern',      appliedDate: '2025-03-20', interviewDate: '',           round: '',                  status: 'OA',        notes: 'OA on HackerRank' },
]

// ── Helpers ───────────────────────────────────────────────
function daysUntil(dateStr: string) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  return diff
}
function daysStyle(d: number | null) {
  if (d === null) return null
  if (d <= 3)  return { color: 'var(--coral)', bg: 'rgba(226,75,74,0.1)' }
  if (d <= 7)  return { color: 'var(--amber)', bg: 'rgba(239,159,39,0.1)' }
  return { color: 'var(--teal)', bg: 'rgba(29,158,117,0.1)' }
}
function colFor(status: Status) {
  return columns.find(c => c.status === status)!
}
function exportCSV(entries: Entry[]) {
  const headers = ['Company', 'Role', 'Applied Date', 'Interview Date', 'Round', 'Status', 'Notes']
  const rows = entries.map(e => [e.company, e.role, e.appliedDate, e.interviewDate, e.round, e.status, e.notes].map(v => `"${v}"`).join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'prepos_tracker.csv'; a.click()
  URL.revokeObjectURL(url)
}

const blankEntry = (): Entry => ({
  id: Date.now().toString(),
  company: '', role: '', appliedDate: new Date().toISOString().split('T')[0],
  interviewDate: '', round: '', status: 'Applied', notes: '',
})

// ── Sparkline ─────────────────────────────────────────────
function Sparkline({ count, color }: { count: number; color: string }) {
  const bars = [0.3, 0.5, 0.4, 0.8, 1.0].map((h, i) => ({
    height: Math.max(4, Math.round(h * Math.min(count + 2, 5) * 4)),
    active: i >= 5 - Math.min(count, 5),
  }))
  return (
    <div className="flex items-end gap-0.5" style={{ height: '20px' }}>
      {bars.map((b, i) => (
        <div key={i} className="w-1 rounded-sm transition-all"
          style={{
            height: `${b.height}px`,
            background: b.active ? color : `${color}30`,
          }} />
      ))}
    </div>
  )
}

// ── Add / Edit Modal ──────────────────────────────────────
function EntryModal({ entry, onSave, onClose }: { entry: Entry; onSave: (e: Entry) => void; onClose: () => void }) {
  const [form, setForm] = useState<Entry>({ ...entry })
  const set = (k: keyof Entry, v: string) => setForm(f => ({ ...f, [k]: v }))

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
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
      >
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--void-12)' }}>
          <h2 className="font-black text-[18px] tracking-tight"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            {entry.company ? 'Edit entry' : 'Add company'}
          </h2>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose} className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(26,16,53,0.06)' }}>
            <X size={14} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.5)' }} />
          </motion.button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                <Building2 size={11} strokeWidth={1.8} /> Company
              </label>
              <input value={form.company} onChange={e => set('company', e.target.value)}
                placeholder="e.g. Razorpay"
                className="rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widests uppercase"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                <Briefcase size={11} strokeWidth={1.8} /> Role
              </label>
              <input value={form.role} onChange={e => set('role', e.target.value)}
                placeholder="e.g. SDE Intern"
                className="rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                <Calendar size={11} strokeWidth={1.8} /> Applied On
              </label>
              <input type="date" value={form.appliedDate} onChange={e => set('appliedDate', e.target.value)}
                className="rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                <CalendarClock size={11} strokeWidth={1.8} /> Interview Date
              </label>
              <input type="date" value={form.interviewDate} onChange={e => set('interviewDate', e.target.value)}
                className="rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widests uppercase"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                <Tag size={11} strokeWidth={1.8} /> Round
              </label>
              <input value={form.round} onChange={e => set('round', e.target.value)}
                placeholder="e.g. Technical Round 1"
                className="rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                <KanbanSquare size={11} strokeWidth={1.8} /> Status
              </label>
              <div className="relative">
                <select value={form.status} onChange={e => set('status', e.target.value as Status)}
                  className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all appearance-none cursor-pointer"
                  style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}>
                  {columns.map(c => <option key={c.status}>{c.status}</option>)}
                </select>
                <ChevronDown size={13} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(26,16,53,0.4)' }} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
              <StickyNote size={11} strokeWidth={1.8} /> Notes
            </label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Any prep notes, links, reminders..."
              rows={3} className="resize-none rounded-xl px-3 py-2.5 text-[13px] outline-none transition-all"
              style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
              onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
              onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
          </div>
        </div>

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
            onClick={() => { if (form.company && form.role) onSave(form) }}
            disabled={!form.company || !form.role}
            className="px-5 py-2 rounded-xl text-[13px] font-bold cursor-pointer flex items-center gap-1.5 transition-all"
            style={{
              background: form.company && form.role ? 'var(--void)' : 'rgba(26,16,53,0.1)',
              color: form.company && form.role ? 'var(--mist)' : 'rgba(26,16,53,0.3)',
              fontFamily: 'var(--font-archivo)',
            }}>
            <Save size={13} strokeWidth={2} /> Save entry
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Prep Plan Modal ───────────────────────────────────────
function PrepPlanModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const [loading, setLoading] = useState(!entry.prepPlan)
  const [plan, setPlan] = useState(entry.prepPlan || '')

  useState(() => {
    if (!entry.prepPlan) {
      setTimeout(() => {
        setPlan(`**Day 1–2:** Core DSA topics for ${entry.company} — Arrays, Strings, HashMaps\n**Day 3–4:** Trees, Graphs, BFS/DFS patterns\n**Day 5:** ${entry.role.includes('PM') ? 'Product sense, metrics, prioritisation frameworks' : 'Dynamic Programming essentials'}\n**Day 6:** Full mock interview (${entry.company} style)\n**Day 7:** Review weak areas, rest, confidence boost`)
        setLoading(false)
      }, 1800)
    }
  })

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
        style={{ background: 'var(--void)', border: '1.5px solid rgba(238,237,254,0.1)' }}
      >
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(238,237,254,0.1)' }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles size={13} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'rgba(238,237,254,0.4)' }}>
                AI PREP PLAN
              </span>
            </div>
            <p className="font-black text-[16px]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--mist)' }}>
              {entry.company} · {entry.role}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose} className="cursor-pointer w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(238,237,254,0.08)' }}>
            <X size={14} strokeWidth={2} style={{ color: 'rgba(238,237,254,0.5)' }} />
          </motion.button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={22} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
              </motion.div>
              <p className="font-mono-frag text-[11px] tracking-[0.08em]"
                style={{ color: 'rgba(238,237,254,0.4)' }}>
                Generating your prep plan...
              </p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {plan.split('\n').map((line, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="text-[13px] leading-relaxed mb-2"
                  style={{ color: 'rgba(238,237,254,0.75)' }}>
                  {line.startsWith('**') ? (
                    <>
                      <span className="font-bold" style={{ color: 'var(--lavender)' }}>
                        {line.match(/\*\*(.*?)\*\*/)?.[1]}
                      </span>
                      {line.replace(/\*\*(.*?)\*\*/, '')}
                    </>
                  ) : line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </div>

        {!loading && entry.interviewDate && (
          <div className="px-6 pb-5">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.2)' }}>
              <CalendarClock size={13} strokeWidth={1.8} style={{ color: 'var(--amber)' }} />
              <p className="text-[12px]" style={{ color: 'rgba(238,237,254,0.6)' }}>
                Interview on <span className="font-semibold" style={{ color: 'var(--amber)' }}>
                  {new Date(entry.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                {daysUntil(entry.interviewDate) !== null && (
                  <> · <span style={{ color: daysUntil(entry.interviewDate)! <= 3 ? 'var(--coral)' : 'var(--amber)' }}>
                    {daysUntil(entry.interviewDate)} days left
                  </span></>
                )}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Kanban card ───────────────────────────────────────────
function KanbanCard({
  entry, col, onEdit, onDelete, onPrepPlan, onMove,
}: {
  entry: Entry
  col: typeof columns[0]
  onEdit: () => void
  onDelete: () => void
  onPrepPlan: () => void
  onMove: (dir: 'left' | 'right') => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const days = daysUntil(entry.interviewDate)
  const ds = daysStyle(days)
  const colIdx = columns.findIndex(c => c.status === entry.status)
  const isUrgent = days !== null && days <= 3

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(26,16,53,0.09)' }}
      transition={{ duration: 0.3, ease }}
      className="rounded-2xl p-4 cursor-default relative group"
      style={{ background: '#fff', border: `1.5px solid ${isUrgent ? 'rgba(226,75,74,0.25)' : 'var(--void-12)'}` }}
    >
      {/* Urgent top accent line */}
      {isUrgent && (
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
          style={{ background: 'var(--coral)' }}
        />
      )}

      {/* Company + role */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-[13px] flex-shrink-0"
            style={{ background: col.dim, color: col.color, fontFamily: 'var(--font-archivo)' }}>
            {entry.company[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[13px] truncate"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              {entry.company}
            </p>
            <p className="text-[11px] truncate" style={{ color: 'rgba(26,16,53,0.45)' }}>{entry.role}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(o => !o)}
            className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(26,16,53,0.06)' }}>
            <ChevronDown size={12} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.45)' }} />
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-8 w-44 rounded-xl overflow-hidden z-20 shadow-lg"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                {[
                  { label: 'Edit entry', icon: Edit3, action: () => { onEdit(); setMenuOpen(false) } },
                  { label: 'AI Prep Plan', icon: Sparkles, action: () => { onPrepPlan(); setMenuOpen(false) } },
                  ...(colIdx > 0 ? [{ label: 'Move left', icon: ArrowRight, action: () => { onMove('left'); setMenuOpen(false) }, flip: true }] : []),
                  ...(colIdx < columns.length - 1 ? [{ label: 'Move right', icon: ArrowRight, action: () => { onMove('right'); setMenuOpen(false) } }] : []),
                  { label: 'Delete', icon: Trash2, action: () => { onDelete(); setMenuOpen(false) }, danger: true },
                ].map((item, i) => (
                  <button key={i} onClick={item.action}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] transition-colors hover:bg-ghost cursor-pointer"
                    style={{
                      color: (item as any).danger ? 'var(--coral)' : 'rgba(26,16,53,0.65)',
                      borderBottom: i < 3 ? '1px solid rgba(26,16,53,0.05)' : 'none',
                    }}>
                    <item.icon size={12} strokeWidth={1.8}
                      style={{ transform: (item as any).flip ? 'rotate(180deg)' : undefined }} />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Round pill */}
      {entry.round && (
        <p className="text-[11px] mb-2 font-mono-frag truncate" style={{ color: 'rgba(26,16,53,0.4)' }}>
          {entry.round}
        </p>
      )}

      {/* Interview date + days left */}
      {entry.interviewDate && ds && (
        <div className="flex items-center gap-1.5 mb-2">
          <CalendarClock size={11} strokeWidth={1.8} style={{ color: ds.color }} />
          <span className="text-[11px]" style={{ color: 'rgba(26,16,53,0.45)' }}>
            {new Date(entry.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <motion.span
            animate={isUrgent ? { scale: [1, 1.1, 1], opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="font-mono-frag text-[10px] px-1.5 py-0.5 rounded-full font-semibold ml-auto"
            style={{ background: ds.bg, color: ds.color }}>
            {days}d
          </motion.span>
        </div>
      )}

      {/* Notes snippet */}
      {entry.notes && (
        <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'rgba(26,16,53,0.4)' }}>
          {entry.notes}
        </p>
      )}

      {/* Applied date footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5"
        style={{ borderTop: '1px solid rgba(26,16,53,0.06)' }}>
        <span className="text-[10px] font-mono-frag" style={{ color: 'rgba(26,16,53,0.3)' }}>
          Applied {new Date(entry.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
        {entry.prepPlan && (
          <motion.button whileHover={{ scale: 1.05 }} onClick={onPrepPlan}
            className="inline-flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
            style={{ color: 'var(--brand)', fontFamily: 'var(--font-archivo)' }}>
            <FileText size={10} strokeWidth={1.8} /> Prep plan
          </motion.button>
        )}
      </div>

      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />}
    </motion.div>
  )
}

// ── Pipeline Health Bar ───────────────────────────────────
function PipelineBar({ entries }: { entries: Entry[] }) {
  const total = entries.length
  if (total === 0) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.2 }}
      className="rounded-2xl px-5 py-4 mb-7"
      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'rgba(26,16,53,0.38)' }}>
          APPLICATION PIPELINE
        </p>
        <p className="font-mono-frag text-[10px]" style={{ color: 'rgba(26,16,53,0.35)' }}>
          {total} total
        </p>
      </div>

      {/* Segmented bar */}
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-3">
        {columns.map(col => {
          const count = entries.filter(e => e.status === col.status).length
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <motion.div
              key={col.status}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease, delay: 0.3 + columns.indexOf(col) * 0.05 }}
              className="h-full rounded-sm"
              style={{ background: col.color }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {columns.map(col => {
          const count = entries.filter(e => e.status === col.status).length
          return (
            <div key={col.status} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
              <span className="text-[11px]" style={{ color: 'rgba(26,16,53,0.5)' }}>
                {col.status}
              </span>
              <span className="font-mono-frag text-[10px] font-semibold" style={{ color: col.color }}>
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function TrackerPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [modalEntry, setModalEntry] = useState<Entry | null>(null)
  const [prepEntry, setPrepEntry] = useState<Entry | null>(null)

  const openAdd = (status: Status = 'Applied') => setModalEntry({ ...blankEntry(), status })
  const openEdit = (e: Entry) => setModalEntry({ ...e })

  const saveEntry = (e: Entry) => {
    setEntries(prev =>
      prev.find(x => x.id === e.id)
        ? prev.map(x => x.id === e.id ? e : x)
        : [...prev, e]
    )
    setModalEntry(null)
  }

  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id))

  const moveEntry = (id: string, dir: 'left' | 'right') => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = columns.findIndex(c => c.status === e.status)
      const newIdx = dir === 'right' ? Math.min(idx + 1, columns.length - 1) : Math.max(idx - 1, 0)
      return { ...e, status: columns[newIdx].status }
    }))
  }

  const totalActive = entries.filter(e => e.status !== 'Rejected').length
  const interviews = entries.filter(e => e.status === 'Interview').length
  const offers = entries.filter(e => e.status === 'Offer').length
  const urgent = entries.filter(e => {
    const d = daysUntil(e.interviewDate); return d !== null && d <= 3
  }).length

  const statMax = Math.max(totalActive, 1)

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative px-5 md:px-8 py-8 md:py-10">

        {/* ── Header ── */}
        <motion.div variants={container} initial="hidden" animate="show"
          className="flex items-start justify-between mb-7 flex-wrap gap-4">
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.15)' }}>
              <KanbanSquare size={11} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
              <span className="font-mono-frag text-[10px] tracking-[0.1em]" style={{ color: 'var(--brand)' }}>
                INTERVIEW TRACKER
              </span>
            </div>
            <h1 className="font-black text-[28px] md:text-[34px] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              Your pipeline
            </h1>
            <p className="text-[14px] mt-1" style={{ color: 'rgba(26,16,53,0.45)' }}>
              Track every company, round, and deadline in one place.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => exportCSV(entries)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-all"
              style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'rgba(26,16,53,0.6)', fontFamily: 'var(--font-archivo)' }}>
              <Download size={13} strokeWidth={1.8} /> Export CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 4px 14px rgba(26,16,53,0.15)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAdd()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold cursor-pointer transition-all"
              style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
              <Plus size={14} strokeWidth={2} /> Add Company
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Stats strip — with progress bars ── */}
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Active', value: totalActive, max: statMax, color: 'var(--brand)', bg: 'rgba(83,74,183,0.08)' },
            { label: 'In Interview', value: interviews, max: statMax, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
            { label: 'Offers', value: offers, max: statMax, color: 'var(--teal)', bg: 'rgba(29,158,117,0.08)' },
            { label: 'Urgent', value: urgent, max: statMax, color: 'var(--coral)', bg: 'rgba(226,75,74,0.08)' },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp}
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(26,16,53,0.07)' }}
              className="rounded-2xl px-5 py-4 transition-all"
              style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
              <p className="font-black text-[28px] leading-none tracking-tight mb-1"
                style={{ fontFamily: 'var(--font-archivo)', color: s.color }}>
                {s.value}
              </p>
              <p className="text-[11px] font-semibold mb-3"
                style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                {s.label}
              </p>
              {/* Progress bar */}
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(26,16,53,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  animate={{ width: s.max > 0 ? `${(s.value / s.max) * 100}%` : '0%' }}
                  transition={{ duration: 0.8, ease, delay: 0.2 + i * 0.08 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Pipeline health bar ── */}
        <PipelineBar entries={entries} />

        {/* ── Kanban board ── */}
        <div className="grid gap-4 pb-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', alignItems: 'stretch' }}>
          {columns.map((col, colIndex) => {
            const colEntries = entries.filter(e => e.status === col.status)
            return (
              <motion.div
                key={col.status}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: colIndex * 0.07 }}
                className="flex flex-col rounded-2xl overflow-hidden"
                style={{ background: col.bg, border: `1.5px solid ${col.border}` }}
              >
                {/* Column header with sparkline */}
                <div className="flex items-center justify-between px-4 py-3.5"
                  style={{ borderBottom: `1px solid ${col.border}` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="font-bold text-[13px]"
                      style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                      {col.status}
                    </span>
                    <span className="font-mono-frag text-[11px] px-1.5 py-0.5 rounded-full"
                      style={{ background: col.dim, color: col.color }}>
                      {colEntries.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sparkline */}
                    <Sparkline count={colEntries.length} color={col.color} />
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => openAdd(col.status)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer"
                      style={{ background: col.dim, color: col.color }}>
                      <Plus size={13} strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3 p-3 flex-1 overflow-y-auto">
                  <AnimatePresence>
                    {colEntries.map(entry => (
                      <KanbanCard
                        key={entry.id}
                        entry={entry}
                        col={col}
                        onEdit={() => openEdit(entry)}
                        onDelete={() => deleteEntry(entry.id)}
                        onPrepPlan={() => setPrepEntry(entry)}
                        onMove={dir => moveEntry(entry.id, dir)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Empty state */}
                  {colEntries.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-8 gap-2 rounded-xl cursor-pointer"
                      style={{ border: `1.5px dashed ${col.border}` }}
                      onClick={() => openAdd(col.status)}
                    >
                      <Plus size={18} strokeWidth={1.5} style={{ color: col.color, opacity: 0.5 }} />
                      <p className="text-[11px] font-mono-frag" style={{ color: col.color, opacity: 0.5 }}>
                        Add entry
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {modalEntry && (
          <EntryModal key="entry-modal" entry={modalEntry} onSave={saveEntry} onClose={() => setModalEntry(null)} />
        )}
        {prepEntry && (
          <PrepPlanModal key="prep-modal" entry={prepEntry} onClose={() => setPrepEntry(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}