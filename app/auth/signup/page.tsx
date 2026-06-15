'use client'

import { motion, cubicBezier } from 'framer-motion'
import { Mic2, KanbanSquare, Lightbulb, Map } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { signupSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle } from 'lucide-react'


const ease = cubicBezier(0.22, 1, 0.36, 1)

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const features = [
  {
    icon: Mic2,
    title: 'AI Mock Interviews',
    desc: 'Real questions, live feedback, detailed performance reports per answer.',
    bg: 'rgba(83,74,183,0.2)', color: 'var(--lavender)',
  },
  {
    icon: KanbanSquare,
    title: 'Smart Tracker',
    desc: 'Track every company and round. Get a prep plan 7 days before each interview.',
    bg: 'rgba(29,158,117,0.15)', color: '#1D9E75',
  },
  {
    icon: Lightbulb,
    title: 'Brainstorm Board',
    desc: 'Dump rough ideas. AI expands them into full proposals with tech stack + timeline.',
    bg: 'rgba(239,159,39,0.15)', color: '#EF9F27',
  },
  {
    icon: Map,
    title: 'Prep Roadmap',
    desc: 'Week-by-week plan built for your role, timeline, and target companies.',
    bg: 'rgba(175,169,236,0.15)', color: '#AFA9EC',
  },
]


export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [college, setCollege] = useState('')
  const [showPasswordHints, setShowPasswordHints] = useState(false)
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const strengthScore = Object.values(passwordChecks).filter(Boolean).length

  const strengthLabel =
    strengthScore <= 2
      ? 'Weak'
      : strengthScore <= 4
        ? 'Medium'
        : 'Strong'
  const supabase = createClient()
  const router = useRouter()
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      console.log('google login error:', error.message)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      college,
    })

    if (!result.success) {
      console.log('signup validation errors:', result.error.flatten().fieldErrors)
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          full_name: result.data.name,
          college_name: result.data.college,
        },
      },
    })
    const sessionExists = !!data.session

    if (!error && data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: result.data.email,
        full_name: result.data.name,
        college_name: result.data.college,
      })

      if (profileError) {
        console.log('profile insert error:', profileError.message)
        setLoading(false)
        return
      }
    }

    if (error) {
      console.log('signup error:', error.message)
      setLoading(false)
      return
    }

    console.log('signup success')
    setLoading(false)

    router.replace('/dashboard')
  }
  return (
    <div className="h-screen overflow-hidden flex font-familjen" style={{ background: 'var(--ghost)' }}>

      {/* ── LEFT: Form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-2">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-3"
        >
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="max-w-sm w-full">

          <motion.div variants={item} className="mb-1">
            <span className="font-mono-frag text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--brand)' }} >
              Get started free
            </span>
          </motion.div>

          <motion.h1 variants={item}
            className="font-black text-[36px] leading-[1.05] tracking-[-0.03em] mb-2"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            Create your account
          </motion.h1>

          <motion.p variants={item} className="text-[15px] mb-5" style={{ color: 'rgba(26,16,53,0.5)' }}>
            No credit card needed. Built for every student preparing for interviews.
          </motion.p>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-[14px] font-semibold border transition-all duration-200 mb-5 cursor-pointer"
            style={{
              background: '#fff',
              border: '1.5px solid var(--void-12)',
              color: 'var(--void)',
            }}
          >
            <GoogleIcon />
            Continue with Google
          </motion.button>

          <motion.div variants={item} className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--void-12)' }} />
            <span className="text-xs" style={{ color: 'rgba(26,16,53,0.35)' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--void-12)' }} />
          </motion.div>

          <motion.form
            variants={item}
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                Full Name
              </label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)}
                placeholder="Arjun Sharma"
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                Email Address
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="arjun@gmail.com"
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                College Name
              </label>

              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="IGDTUW / IIT Delhi / etc."
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label
                className="text-[12px] font-semibold tracking-wide uppercase"
                style={{
                  color: 'rgba(26,16,53,0.45)',
                  fontFamily: 'var(--font-archivo)',
                }}
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-[14px] outline-none transition-all duration-200"
                  style={{
                    background: '#fff',
                    border: '1.5px solid var(--void-12)',
                    color: 'var(--void)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--brand)'

                    if (strengthScore < 5) {
                      setShowPasswordHints(true)
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--void-12)'

                    setTimeout(() => {
                      setShowPasswordHints(false)
                    }, 150)
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                  style={{ color: 'rgba(26,16,53,0.4)' }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>

                {showPasswordHints &&
                  password.length > 0 &&
                  strengthScore < 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 right-0 rounded-xl p-3 z-[999]"
                      style={{
                        top: 'calc(100% + 8px)',
                        background: '#ffffff',
                        border: '1px solid var(--void-12)',
                        boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[12px] font-semibold"
                          style={{ color: 'var(--void)' }}
                        >
                          Password Strength
                        </span>

                        <span
                          className="text-[12px] font-bold"
                          style={{
                            color:
                              strengthLabel === 'Weak'
                                ? '#EF4444'
                                : strengthLabel === 'Medium'
                                  ? '#F59E0B'
                                  : '#10B981',
                          }}
                        >
                          {strengthLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-[10px]">
                        {[
                          [passwordChecks.length, '8+ chars'],
                          [passwordChecks.uppercase, 'Uppercase'],
                          [passwordChecks.lowercase, 'Lowercase'],
                          [passwordChecks.number, 'Number'],
                          [passwordChecks.special, 'Special char'],
                        ].map(([passed, label]) => (
                          <div
                            key={String(label)}
                            className="flex items-center gap-2"
                          >
                            {passed ? (
                              <CheckCircle2
                                size={12}
                                style={{ color: '#10B981' }}
                              />
                            ) : (
                              <Circle
                                size={12}
                                style={{ color: 'rgba(26,16,53,0.25)' }}
                              />
                            )}

                            <span
                              style={{
                                color: passed
                                  ? 'var(--void)'
                                  : 'rgba(26,16,53,0.55)',
                              }}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </div>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-[14px] font-bold mt-1 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderTopColor: 'var(--mist)', borderColor: 'rgba(238,237,254,0.3)' }} />
              ) : (
                <><span>Create account</span><span>→</span></>
              )}
            </motion.button>

          </motion.form>

          <motion.p variants={item} className="text-[13px] text-center mt-3" style={{ color: 'rgba(26,16,53,0.5)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold no-underline" style={{ color: 'var(--brand)' }}>
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* ── RIGHT: Premium panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="hidden lg:flex flex-col justify-center flex-1 relative overflow-hidden px-14 py-10"
        style={{ background: 'var(--void)' }}
      >
        {/* Subtle glow */}
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'rgba(83,74,183,0.18)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'rgba(29,158,117,0.12)', filter: 'blur(60px)' }} />

        <div className="relative z-10">

          <p className="font-mono-frag text-[10px] tracking-[0.12em] mb-6"
            style={{ color: 'rgba(175,169,236,0.5)' }}>
            PREPOS · WHAT YOU GET
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="font-black text-[26px] leading-[1.1] tracking-[-0.04em] mb-2"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--mist)' }}
          >
            Your interview OS.{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>All in one place.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.35 }}
            className="text-[13px] leading-relaxed mb-6"
            style={{ color: 'rgba(247,246,253,0.45)' }}
          >
            From first brainstorm to offer letter — PrepOS is the only tool you need.
          </motion.p>

          <div className="flex flex-col gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: f.bg }}>
                    <Icon size={15} strokeWidth={1.8} style={{ color: f.color }} />
                  </div>
                  <div>
                    <p className="font-bold text-[13px] mb-0.5"
                      style={{ fontFamily: 'var(--font-archivo)', color: 'var(--mist)' }}>
                      {f.title}
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(247,246,253,0.45)' }}>
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Free badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease, delay: 0.9 }}
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full"
            style={{ background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--teal)' }} />
            <span className="font-mono-frag text-[10px] tracking-[0.08em]" style={{ color: 'var(--teal)' }}>
              FREE DURING BETA · No credit card required
            </span>
          </motion.div>

        </div>
      </motion.div>

    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}