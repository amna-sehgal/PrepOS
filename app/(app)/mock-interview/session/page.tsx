'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, Send, Lightbulb, Clock, ChevronRight,
  X, CheckCircle2, MinusCircle, XCircle, AlertCircle,
} from 'lucide-react'

const ease = cubicBezier(0.22, 1, 0.36, 1)

type Feedback = {
  text: string
  score: number
  status: 'correct' | 'partial' | 'incorrect'
  hint: string
}

type Message = {
  role: 'ai' | 'user'
  text: string
  feedback?: Feedback
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

const fallbackHint = 'Start with your main idea, then add a concrete example and explain your reasoning clearly.'

function getTimeLimit(config: Config | null) {
  if (!config) return 0

  const type = config.type?.toLowerCase() || ''
  const difficulty = config.difficulty?.toLowerCase() || ''

  if (type.includes('hr') || type.includes('behavioural')) {
    if (difficulty.includes('beginner')) return 15 * 60
    if (difficulty.includes('advanced')) return 25 * 60
    return 20 * 60
  }

  if (type.includes('dsa')) {
    if (difficulty.includes('beginner')) return 30 * 60
    if (difficulty.includes('advanced')) return 60 * 60
    return 45 * 60
  }

  if (type.includes('system')) {
    if (difficulty.includes('beginner')) return 30 * 60
    if (difficulty.includes('advanced')) return 60 * 60
    return 45 * 60
  }

  if (type.includes('mixed')) {
    if (difficulty.includes('beginner')) return 25 * 60
    if (difficulty.includes('advanced')) return 45 * 60
    return 35 * 60
  }

  if (difficulty.includes('beginner')) return 20 * 60
  if (difficulty.includes('advanced')) return 45 * 60
  return 30 * 60
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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentHint, setCurrentHint] = useState(fallbackHint)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [timeExpired, setTimeExpired] = useState(false)

  // Load config from localStorage
  useEffect(() => {
    const storedSessionId = localStorage.getItem('prepos_session_id')
    console.log("🔥 SESSION ID FROM LOCALSTORAGE:", storedSessionId)

    if (!storedSessionId) {
      router.push('/mock-interview')
      return
    }

    setSessionId(storedSessionId)

    const loadSession = async () => {
      const res = await fetch(`/api/mock/${storedSessionId}`)
      const data = await res.json()

      setConfig({
        role: data.role,
        difficulty: data.difficulty,
        type: data.interview_type,
        company: data.company,
        hints: data.hints !== false,
      })
      setTotalQ(data.totalQuestions)

      const transcript = Array.isArray(data.transcript) ? data.transcript : []
      const restoredMessages = transcript.filter((entry: any) => entry.role === 'ai' || entry.role === 'user').map((entry: any) => ({
        role: entry.role,
        text: entry.text,
        feedback: entry.feedback ? {
          text: entry.feedback.text,
          score: entry.feedback.score,
          status: entry.feedback.status,
          hint: entry.feedback.hint,
        } : undefined,
        questionIndex: entry.questionIndex,
      }))

      if (restoredMessages.length > 0) {
        setMessages(restoredMessages)
      } else {
        setMessages([
          {
            role: 'ai',
            text: data.firstQuestion,
            questionIndex: 0,
          },
        ])
      }

      const activeQuestion = [...transcript].reverse().find((entry: any) => entry.role === 'ai' && entry.questionIndex !== undefined && !entry.feedback)
      setCurrentQ(typeof activeQuestion?.questionIndex === 'number' ? activeQuestion.questionIndex : 0)
      setFinished(transcript.some((entry: any) => entry.role === 'system' && entry.isSummary))
      setShowHint(false)
      setInitialized(true)
    }

    loadSession()
  }, [router])

  // Session timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!sessionId || !config || !initialized || finished) {
      if (finished && sessionId) {
        localStorage.removeItem(`prepos_timer_${sessionId}`)
      }
      return
    }

    const limit = getTimeLimit(config)
    const timerKey = `prepos_timer_${sessionId}`
    const savedTimer = localStorage.getItem(timerKey)

    if (savedTimer) {
      try {
        const parsed = JSON.parse(savedTimer)
        const elapsedSeconds = Math.floor((Date.now() - parsed.startedAt) / 1000)
        const remaining = Math.max((parsed.limit || limit) - elapsedSeconds, 0)
        setTimeRemaining(remaining)
        setTimeExpired(remaining <= 0)
        setElapsed(Math.min(elapsedSeconds, parsed.limit || limit))
      } catch {
        localStorage.removeItem(timerKey)
        const startedAt = Date.now()
        localStorage.setItem(timerKey, JSON.stringify({ startedAt, limit }))
        setTimeRemaining(limit)
      }
    } else {
      const startedAt = Date.now()
      localStorage.setItem(timerKey, JSON.stringify({ startedAt, limit }))
      setTimeRemaining(limit)
    }
  }, [sessionId, config, initialized, finished])

  useEffect(() => {
    if (!sessionId || !config || timeExpired || finished) return

    const limit = getTimeLimit(config)
    if (limit <= 0) return

    const timerKey = `prepos_timer_${sessionId}`
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          localStorage.removeItem(timerKey)
          setTimeExpired(true)
          return 0
        }

        const next = prev - 1
        const startedAt = Number(JSON.parse(localStorage.getItem(timerKey) || '{}')?.startedAt || Date.now())
        localStorage.setItem(timerKey, JSON.stringify({ startedAt, limit }))
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionId, config, timeExpired, finished])

  useEffect(() => {
    if (!timeExpired || !sessionId || finished) return

    const completeInterview = async () => {
      try {
        await fetch(`/api/mock/${sessionId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'timeout' }),
        })
      } catch (err) {
        console.error('Failed to auto-complete interview:', err)
      }
    }

    completeInterview()
  }, [timeExpired, sessionId, finished])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, awaitingFeedback])

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const formatCountdown = (s: number) => {
    const minutes = Math.floor(s / 60)
    const seconds = s % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const handleSend = async () => {
    if (!input.trim() || awaitingFeedback || !sessionId) return

    const answer = input.trim()

    setMessages((m) => [...m, { role: 'user', text: answer }])
    setInput('')
    setAwaitingFeedback(true)

    const res = await fetch(`/api/mock/${sessionId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer,
        questionIndex: currentQ,
      }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: data.error || 'Something went wrong fetching the evaluation. Please try again.',
        },
      ])
      setAwaitingFeedback(false)
      return
    }

    const hintText = typeof data.hint === 'string' && data.hint.trim()
      ? data.hint.trim()
      : fallbackHint

setCurrentHint(hintText)
setShowHint(false)

    setMessages((m) => [
      ...m,
      {
        role: 'ai',
        text: data.feedback,
        feedback: {
          text: data.feedback,
          score: data.score,
          status: data.status,
          hint: hintText,
        },
      },
    ])

    if (data.finished) {
      setFinished(true)
      setAwaitingFeedback(false)

      const finalFeedbacks = [
        ...messages.filter((m) => m.role === 'ai' && m.feedback).map((m) => m.feedback),
        { text: data.feedback, score: data.score, status: data.status, hint: data.hint }
      ]

      const reportData = {
        config,
        elapsed,
        feedbacks: finalFeedbacks,
        completedAt: new Date().toISOString(),
        weakAreas: data.reportInfo?.weakAreas || ['System Design Basics', 'General Problem Solving'],
        reviseTopics: data.reportInfo?.reviseTopics || ['Data Structures', 'Algorithmic Patterns', 'Code Optimization']
      }

      localStorage.setItem(`prepos_report_${sessionId}`, JSON.stringify(reportData))
      return
    }

    setTimeout(() => {
      setShowHint(false)
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: data.nextQuestion,
          questionIndex: currentQ + 1,
        },
      ])

      setCurrentQ((q) => q + 1)
      setAwaitingFeedback(false)
    }, 900)
  }
  const handleViewReport = () => {
    const sessionId = localStorage.getItem('prepos_session_id')
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
            style={{ color: timeRemaining <= 60 ? 'var(--coral)' : 'rgba(26,16,53,0.45)' }}>
            <Clock size={12} strokeWidth={1.8} />{formatCountdown(timeRemaining)} left
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
                      {currentHint || fallbackHint}
                    </p>
                    <button onClick={() => setShowHint(false)} className="cursor-pointer flex-shrink-0">
                      <X size={12} strokeWidth={2} style={{ color: 'rgba(26,16,53,0.3)' }} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button key="hint-btn"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => {
                    setCurrentHint((prev) => prev || fallbackHint)
                    setShowHint(true)
                  }}
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