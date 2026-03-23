'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, Send, Lightbulb, Clock, ChevronRight,
  X, CheckCircle2, MinusCircle, XCircle, AlertCircle,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)

// ── Mock questions by type ────────────────────────────────
const mockQuestions: Record<string, string[]> = {
  'DSA': [
    'Given an array of integers, find the two numbers that add up to a target sum. What is the most optimal approach?',
    'Explain how you would detect a cycle in a linked list. Walk me through your approach.',
    'Given a binary tree, write a function to find the maximum path sum between any two nodes.',
    'How would you implement an LRU cache? What data structures would you use and why?',
    'Given a string, find the length of the longest substring without repeating characters.',
  ],
  'System Design': [
    'Design a URL shortener like bit.ly. Walk me through your high-level architecture.',
    'How would you design a notification system that handles 10 million users?',
    'Design the backend for a real-time collaborative document editor.',
    'How would you design a distributed rate limiter for an API gateway?',
  ],
  'HR / Behavioural': [
    'Tell me about a time you had a conflict with a teammate. How did you resolve it?',
    'Describe a project you are most proud of. What was your specific contribution?',
    'Why do you want to work at this company? What excites you about this role?',
    'Tell me about a time you failed. What did you learn from it?',
  ],
  'Mixed': [
    'Given an array of integers, find the two numbers that add up to a target sum.',
    'Tell me about a challenging technical problem you solved. What was your approach?',
    'Design a simple rate limiter for an API. What data structures would you use?',
  ],
}

const mockFeedback = [
  {
    text: 'Good approach! You correctly identified the brute force O(n²) solution. Mentioning the HashMap approach for O(n) time complexity would have strengthened your answer significantly.',
    score: 78, status: 'partial' as const,
    hint: 'Think about using a HashMap to store complements as you iterate.',
  },
  {
    text: "Excellent! Floyd's cycle detection algorithm was the optimal approach and you explained it clearly. The time and space complexity analysis was accurate.",
    score: 92, status: 'correct' as const,
    hint: 'Consider the two-pointer approach — one slow pointer, one fast pointer.',
  },
  {
    text: 'Your recursive DFS approach was on the right track, but you missed handling the case where the path must go through the root. The base case for leaf nodes needed more clarity.',
    score: 61, status: 'incorrect' as const,
    hint: 'At each node: max gain from left + node value + max gain from right.',
  },
  {
    text: 'Great answer! Using a HashMap + doubly linked list is the optimal approach. You correctly identified O(1) for both get and put operations.',
    score: 88, status: 'correct' as const,
    hint: 'Think about what data structure gives O(1) insertion and deletion.',
  },
  {
    text: 'You got the sliding window technique right but missed the edge case for single-character strings. Otherwise a solid answer.',
    score: 74, status: 'partial' as const,
    hint: 'Use a HashSet to track characters in the current window.',
  },
]

type Message = {
  role: 'ai' | 'user'
  text: string
  feedback?: typeof mockFeedback[0]
  questionIndex?: number
}

type Config = {
  role: string; difficulty: string; type: string; company: string; hints: boolean
}

function getQCount(difficulty: string) {
  if (difficulty === 'Beginner') return 3
  if (difficulty === 'Advanced') return 5
  return 4
}

export default function MockInterviewSessionPage() {
  const router = useRouter()
  const [config, setConfig] = useState<Config | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [awaitingFeedback, setAwaitingFeedback] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [finished, setFinished] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [totalQ, setTotalQ] = useState(4)
  const [initialized, setInitialized] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load config from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('prepos_interview_config')
    if (!raw) { router.push('/mock-interview'); return }
    const cfg: Config = JSON.parse(raw)
    setConfig(cfg)
    const qs = mockQuestions[cfg.type] || mockQuestions['DSA']
    const count = Math.min(getQCount(cfg.difficulty), qs.length)
    setTotalQ(count)
    setMessages([{
      role: 'ai',
      text: `Welcome${cfg.company ? ` to your ${cfg.company}` : ''} ${cfg.type} interview! I'm your AI interviewer. We'll go through ${count} questions. Take your time — quality matters more than speed.\n\nQ1: ${qs[0]}`,
      questionIndex: 0,
    }])
    setInitialized(true)
  }, [router])

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, awaitingFeedback])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSend = () => {
    if (!input.trim() || awaitingFeedback || !config) return
    const userMsg: Message = { role: 'user', text: input.trim() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setAwaitingFeedback(true)
    setShowHint(false)

    const qs = mockQuestions[config.type] || mockQuestions['DSA']
    const fb = mockFeedback[currentQ % mockFeedback.length]

    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: fb.text, feedback: fb, questionIndex: currentQ }])

      const nextQ = currentQ + 1
      if (nextQ < totalQ) {
        setTimeout(() => {
          setMessages(m => [...m, {
            role: 'ai',
            text: `Good. Let's continue.\n\nQ${nextQ + 1}: ${qs[nextQ]}`,
            questionIndex: nextQ,
          }])
          setCurrentQ(nextQ)
          setAwaitingFeedback(false)
        }, 700)
      } else {
        setTimeout(() => {
          setMessages(m => [...m, {
            role: 'ai',
            text: "That wraps up the interview! You did well overall. Let me compile your full performance report...",
          }])
          setFinished(true)
          setAwaitingFeedback(false)

          // Save results to localStorage
          const results = {
            config,
            elapsed,
            feedbacks: [...Array(totalQ)].map((_, i) => mockFeedback[i % mockFeedback.length]),
            completedAt: new Date().toISOString(),
          }
          const sessionId = Date.now().toString()
          localStorage.setItem(`prepos_report_${sessionId}`, JSON.stringify(results))
          localStorage.setItem('prepos_latest_session_id', sessionId)
        }, 700)
      }
    }, 1400)
  }

  const handleViewReport = () => {
    const sessionId = localStorage.getItem('prepos_latest_session_id')
    if (sessionId) router.push(`/mock-interview/report/${sessionId}`)
  }

  const progress = (currentQ / totalQ) * 100

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ghost)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Sparkles size={24} strokeWidth={1.8} style={{ color: 'var(--brand)' }} />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col font-familjen" style={{ height: 'calc(100vh - 56px)', background: 'var(--ghost)' }}>

      {/* Top bar */}
      <div className="flex-shrink-0 px-5 md:px-8 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--void-12)', background: '#fff' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full" style={{ background: 'var(--teal)' }} />
            <span className="font-mono-frag text-[11px]" style={{ color: 'var(--teal)' }}>LIVE</span>
          </div>
          <div className="h-4 w-px" style={{ background: 'var(--void-12)' }} />
          <span className="text-[12px] font-semibold hidden sm:block"
            style={{ fontFamily: 'var(--font-archivo)', color: 'rgba(26,16,53,0.5)' }}>
            {config?.role} · {config?.type} · {config?.difficulty}
            {config?.company && ` · ${config.company}`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono-frag text-[12px]"
            style={{ color: 'rgba(26,16,53,0.45)' }}>
            <Clock size={12} strokeWidth={1.8} />{formatTime(elapsed)}
          </span>
          <span className="text-[12px] font-semibold"
            style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
            Q{Math.min(currentQ + 1, totalQ)}/{totalQ}
          </span>
          {finished && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleViewReport}
              className="px-4 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer flex items-center gap-1.5"
              style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
              View Report <ChevronRight size={13} strokeWidth={2} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 flex-shrink-0" style={{ background: 'rgba(26,16,53,0.06)' }}>
        <motion.div className="h-full" style={{ background: 'var(--brand)' }}
          initial={{ width: 0 }} animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease }} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

              {msg.role === 'ai' && (
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'var(--void)' }}>
                    <Sparkles size={14} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="rounded-2xl rounded-tl-sm px-4 py-3"
                      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                      <p className="text-[13px] leading-relaxed whitespace-pre-line"
                        style={{ color: 'var(--void)' }}>
                        {msg.text}
                      </p>
                    </div>
                    {msg.feedback && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}>
                        {msg.feedback.status === 'correct' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ background: 'rgba(29,158,117,0.1)', color: 'var(--teal)', fontFamily: 'var(--font-archivo)' }}>
                            <CheckCircle2 size={11} strokeWidth={2} /> Correct · {msg.feedback.score}/100
                          </span>
                        )}
                        {msg.feedback.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ background: 'rgba(239,159,39,0.1)', color: 'var(--amber)', fontFamily: 'var(--font-archivo)' }}>
                            <MinusCircle size={11} strokeWidth={2} /> Partial · {msg.feedback.score}/100
                          </span>
                        )}
                        {msg.feedback.status === 'incorrect' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={{ background: 'rgba(226,75,74,0.1)', color: 'var(--coral)', fontFamily: 'var(--font-archivo)' }}>
                            <XCircle size={11} strokeWidth={2} /> Needs work · {msg.feedback.score}/100
                          </span>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {msg.role === 'user' && (
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3"
                  style={{ background: 'var(--void)' }}>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--mist)' }}>{msg.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* AI typing dots */}
        <AnimatePresence>
          {awaitingFeedback && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--void)' }}>
                <Sparkles size={14} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14 }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!finished && (
        <div className="flex-shrink-0 px-5 md:px-8 py-4 max-w-3xl w-full mx-auto"
          style={{ borderTop: '1px solid var(--void-12)', background: '#fff' }}>

          {/* Hint */}
          {config?.hints && !awaitingFeedback && (
            <AnimatePresence>
              {showHint ? (
                <motion.div key="hint"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="mb-3 overflow-hidden">
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)' }}>
                    <Lightbulb size={13} strokeWidth={1.8}
                      style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 1 }} />
                    <p className="text-[12px] flex-1" style={{ color: 'rgba(26,16,53,0.65)' }}>
                      {mockFeedback[currentQ % mockFeedback.length].hint}
                    </p>
                    <button onClick={() => setShowHint(false)} className="cursor-pointer flex-shrink-0">
                      <X size={12} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.3)' }} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button key="hint-btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setShowHint(true)}
                  className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: 'rgba(239,159,39,0.08)', color: 'var(--amber)',
                    border: '1px solid rgba(239,159,39,0.2)', fontFamily: 'var(--font-archivo)',
                  }}>
                  <Lightbulb size={11} strokeWidth={1.8} /> Need a hint?
                </motion.button>
              )}
            </AnimatePresence>
          )}

          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder={awaitingFeedback ? 'Waiting for feedback...' : 'Type your answer... (Shift+Enter for new line)'}
              disabled={awaitingFeedback}
              rows={2}
              className="flex-1 resize-none rounded-xl px-4 py-3 text-[13px] outline-none transition-all"
              style={{
                background: 'var(--ghost)',
                border: '1.5px solid var(--void-12)',
                color: 'var(--void)',
                opacity: awaitingFeedback ? 0.5 : 1,
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
              onBlur={e => (e.target.style.borderColor = 'var(--void-12)')}
            />
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
              onClick={handleSend}
              disabled={!input.trim() || awaitingFeedback}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 transition-all"
              style={{
                background: input.trim() && !awaitingFeedback ? 'var(--void)' : 'rgba(26,16,53,0.08)',
                color: input.trim() && !awaitingFeedback ? 'var(--mist)' : 'rgba(26,16,53,0.3)',
              }}>
              <Send size={15} strokeWidth={1.8} />
            </motion.button>
          </div>
        </div>
      )}

      {/* Finished banner */}
      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 px-5 md:px-8 py-4 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--void-12)', background: 'var(--void)' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={15} strokeWidth={1.8} style={{ color: 'var(--lavender)' }} />
            <p className="text-[13px] font-semibold" style={{ color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
              Interview complete — your report is ready!
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={handleViewReport}
            className="px-5 py-2 rounded-xl text-[13px] font-bold cursor-pointer flex items-center gap-2"
            style={{ background: 'var(--brand)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
            View Report <ChevronRight size={14} strokeWidth={2} />
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}