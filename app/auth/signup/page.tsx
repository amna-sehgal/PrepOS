'use client'

import { motion, cubicBezier } from 'framer-motion'
import { Mic2, KanbanSquare, Lightbulb, Map } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { signupSchema } from '@/lib/validations/auth'
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
        created_at: new Date().toISOString(),
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
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-6"
        >
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
              style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
              P
            </span>
            <span className="font-black text-lg tracking-tight"
              style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
              PrepOS
            </span>
          </Link>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="max-w-sm w-full">

          <motion.div variants={item} className="mb-1">
            <span className="font-mono-frag text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--brand)' }}>
              Get started free
            </span>
          </motion.div>

          <motion.h1 variants={item}
            className="font-black text-[36px] leading-[1.05] tracking-[-0.03em] mb-2"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            Create your account
          </motion.h1>

          <motion.p variants={item} className="text-[15px] mb-5" style={{ color: 'rgba(26,16,53,0.5)' }}>
            No credit card needed. Works for tier 1, 2 &amp; 3 colleges.
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

          <motion.form variants={item} onSubmit={handleSubmit} className="flex flex-col gap-3">

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
                College Email
              </label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="arjun@iit.ac.in"
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

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold tracking-wide uppercase"
                style={{ color: 'rgba(26,16,53,0.45)', fontFamily: 'var(--font-archivo)' }}>
                Password
              </label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
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

            {password.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex gap-1.5">
                {[8, 12, 16].map((len, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: password.length >= len ? i === 0 ? 'var(--amber)' : i === 1 ? 'var(--brand)' : 'var(--teal)' : 'var(--void-12)' }} />
                ))}
              </motion.div>
            )}

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

            <p className="text-center text-[11px]" style={{ color: 'rgba(26,16,53,0.35)' }}>
              By signing up you agree to our{' '}
              <Link href="/terms" className="underline" style={{ color: 'var(--brand)' }}>Terms</Link>
              {' '}&amp;{' '}
              <Link href="/privacy" className="underline" style={{ color: 'var(--brand)' }}>Privacy Policy</Link>
            </p>

          </motion.form>

          <motion.p variants={item} className="text-[13px] text-center mt-6" style={{ color: 'rgba(26,16,53,0.5)' }}>
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