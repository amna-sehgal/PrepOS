'use client'

import { motion, cubicBezier } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { loginSchema } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ease = cubicBezier(0.22, 1, 0.36, 1)

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const stats = [
  {
    value: '01',
    label: 'Track Interviews',
  },
  {
    value: '02',
    label: 'Practice with AI',
  },
  {
    value: '03',
    label: 'Improve Faster',
  },
]
const feed = [
  {
    name: 'Mock Interviews',
    action: 'Practice realistic interview scenarios with',
    company: 'instant AI feedback',
    time: '24/7',
    color: '#AFA9EC',
    bg: 'rgba(175,169,236,0.15)',
  },
  {
    name: 'Interview Tracker',
    action: 'Stay organized across applications, rounds, and',
    company: 'upcoming deadlines',
    time: 'Smart',
    color: '#1D9E75',
    bg: 'rgba(29,158,117,0.15)',
  },
  {
    name: 'Prep Roadmaps',
    action: 'Generate personalized preparation plans built around',
    company: 'your target role',
    time: 'AI',
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.15)',
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
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

    const result = loginSchema.safeParse({
      email,
      password,
    })

    if (!result.success) {
      console.log('login validation errors:', result.error.flatten().fieldErrors)
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    })

    if (error) {
      console.log('login error:', error.message)
      setLoading(false)
      return
    }

    console.log('login success')
    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="h-screen overflow-hidden flex font-familjen" style={{ background: 'var(--ghost)' }}>

      {/* ── LEFT: Form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="max-w-sm w-full">

          <motion.div variants={item} className="mb-1">
            <span className="font-mono-frag text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--brand)' }}>
              Welcome back
            </span>
          </motion.div>

          <motion.h1 variants={item}
            className="font-black text-[36px] leading-[1.05] tracking-[-0.03em] mb-2"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            Log back in
          </motion.h1>

          <motion.p variants={item} className="text-[15px] mb-5" style={{ color: 'rgba(26,16,53,0.5)' }}>
            Pick up right where you left off.
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
            <span className="text-xs" style={{ color: 'rgba(26,16,53,0.35)' }}>or log in with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--void-12)' }} />
          </motion.div>

          <motion.form variants={item} onSubmit={handleSubmit} className="flex flex-col gap-3">

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                Email
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="arjun@iit.ac.in"
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all duration-200"
                style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold tracking-wide uppercase"
                  style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] no-underline"
                  style={{ color: 'var(--brand)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-xl px-4 py-3 pr-11 text-[14px] outline-none transition-all duration-200"
                  style={{ background: '#fff', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--void-12)')} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                  style={{ color: 'rgba(26,16,53,0.4)' }}>
                  {showPass ? 'Hide' : 'Show'}
                </button>
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
                <><span>Log in</span><span>→</span></>
              )}
            </motion.button>

          </motion.form>

          <motion.p variants={item} className="text-[13px] text-center mt-6" style={{ color: 'rgba(26,16,53,0.5)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold no-underline" style={{ color: 'var(--brand)' }}>
              Sign up free
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* ── RIGHT: Premium panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="hidden lg:flex flex-col justify-center flex-1 relative overflow-hidden px-14 py-16"
        style={{ background: 'var(--void)' }}
      >
        {/* Subtle glow */}
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'rgba(83,74,183,0.18)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'rgba(175,169,236,0.1)', filter: 'blur(60px)' }} />

        <div className="relative z-10">

          {/* Label */}
          <p className="font-mono-frag text-[10px] tracking-[0.12em] mb-6"
            style={{ color: 'rgba(175,169,236,0.5)' }}>
            PREPOS · INTERVIEW OPERATING SYSTEM
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.1 }}
                className="rounded-2xl px-4 py-4 text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="font-black text-[22px] leading-none tracking-tight mb-1"
                  style={{ fontFamily: 'var(--font-archivo)', color: 'var(--mist)' }}>
                  {s.value}
                </p>
                <p className="text-[10px]" style={{ color: 'rgba(247,246,253,0.35)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Feed */}
          <p className="font-mono-frag text-[10px] tracking-[0.1em] mb-3"
            style={{ color: 'rgba(175,169,236,0.4)' }}>
            WHAT YOU CAN DO
          </p>

          <div className="flex flex-col gap-2 mb-6">
            {feed.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ background: f.bg, color: f.color, fontFamily: 'var(--font-archivo)' }}>
                  {f.name[0]}
                </div>
                <p className="flex-1 text-[12px]" style={{ color: 'rgba(247,246,253,0.6)' }}>
                  <span className="font-semibold" style={{ color: 'var(--mist)' }}>{f.name}</span>
                  {' '}{f.action}{' '}
                  <span style={{ color: f.color }}>{f.company}</span>
                </p>
                <span className="font-mono-frag text-[10px] flex-shrink-0"
                  style={{ color: 'rgba(247,246,253,0.25)' }}>
                  {f.time}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.9 }}
            className="rounded-2xl px-5 py-4"
            style={{ background: 'rgba(83,74,183,0.25)', border: '1px solid rgba(175,169,236,0.2)' }}
          >
            <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'rgba(238,237,254,0.8)' }}>
              "PrepOS helped me land my SDE intern at Razorpay. The mock interview feedback was scarily accurate."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--lavender)', color: 'var(--void)', fontFamily: 'var(--font-archivo)' }}>
                R
              </div>
              <div>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
                  Riya Desai
                </p>
                <p className="text-[10px]" style={{ color: 'rgba(238,237,254,0.4)' }}>
                  BITS Pilani · SDE Intern @ Razorpay
                </p>
              </div>
            </div>
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