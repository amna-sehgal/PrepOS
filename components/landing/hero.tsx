'use client'

import { motion, cubicBezier } from 'framer-motion'
import Link from 'next/link'
import RotatingText from '@/components/ui/RotatingText'

const ease = cubicBezier(0.22, 1, 0.36, 1)

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center overflow-hidden">

      {/* Subtle radial glow behind headline */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[400px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(83,74,183,0.25) 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex flex-col items-center"
      >

        {/* Kicker pill */}
        <motion.div variants={item} className="mb-7">
          <span
            className="inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-2"
            style={{ background: 'var(--mist)', border: '1px solid var(--lavender)' }}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--brand)' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--mist)' }} />
            </span>
            <span className="font-mono-frag text-[11px] tracking-[0.08em]"
              style={{ color: 'var(--indigo-dark, #3C3489)' }}>
              Built for Indian college students
            </span>
          </span>
        </motion.div>

        {/* Headline with rotating word */}
        <motion.h1
          variants={item}
          className="font-archivo font-black leading-[1.05] tracking-[-0.04em] mb-4 flex flex-col items-center gap-2"
          style={{ fontSize: 'clamp(44px, 7vw, 72px)', color: 'var(--void)' }}
        >
          {/* First line: "Your entire [rotating chip]" */}
          <span className="flex items-center gap-3 flex-wrap justify-center">
            Your entire

            {/* Rotating text chip — void bg, mist text, italic, brand-style */}
            <RotatingText
              texts={['mock prep.', 'roadmap.', 'tracker.', 'brainstorm.', 'interview OS.']}
              mainClassName="px-3 py-1 rounded-xl justify-center"
              style={{
                background: 'var(--void)',
                color: 'var(--mist)',
                fontFamily: 'var(--font-archivo)',
                fontStyle: 'italic',
                fontSize: 'clamp(44px, 7vw, 72px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                minWidth: '14ch',
                display: 'inline-flex',
              }}
              staggerFrom="last"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2200}
            />
          </span>

          {/* Second line */}
          <span>One OS.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={item}
          className="font-familjen text-[17px] leading-relaxed max-w-[560px] mb-9"
          style={{ color: 'rgba(26,16,53,0.5)' }}
        >
          From brainstorming project ideas to cracking your Razorpay interview —
          PrepOS is the guided system that takes you all the way.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex items-center gap-3 flex-wrap justify-center">
          <Link href="/auth/signup">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative inline-flex items-center gap-2 font-archivo font-bold text-[14px] rounded-full cursor-pointer"
              style={{
                backgroundColor: '#1A1035', color: '#F7F6FD',
                paddingLeft: '28px', paddingRight: '20px',
                paddingTop: '14px', paddingBottom: '14px',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#26215C')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#1A1035')}
            >
              <span
                className="relative inline-flex items-center justify-center rounded-full text-xs"
                style={{ width: '22px', height: '22px', backgroundColor: 'rgba(175,169,236,0.2)', color: '#AFA9EC' }}
              >
                →
              </span>
              <span>Start prepping free</span>
            </motion.div>
          </Link>

          <Link href="#how-it-works">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative inline-flex items-center font-archivo font-bold text-[14px] rounded-full cursor-pointer"
              style={{
                backgroundColor: '#EEEDFE', color: '#1A1035',
                paddingLeft: '28px', paddingRight: '28px',
                paddingTop: '14px', paddingBottom: '14px',
                border: '1px solid #AFA9EC',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#AFA9EC')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#EEEDFE')}
            >
              See how it works
            </motion.div>
          </Link>
        </motion.div>

        {/* Fine print */}
        <motion.p
          variants={item}
          className="font-familjen text-xs mt-4"
          style={{ color: 'rgba(26,16,53,0.35)' }}
        >
          No credit card · Works for tier 1, 2 &amp; 3 colleges
        </motion.p>

        {/* Social proof strip */}
        <motion.div
          variants={item}
          className="flex items-center gap-3 mt-8 flex-wrap justify-center"
        >
          <div className="flex -space-x-2">
            {['P', 'A', 'R', 'K', 'S'].map((l, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2"
                style={{
                  background: ['#534AB7', '#1D9E75', '#EF9F27', '#E24B4A', '#AFA9EC'][i],
                  color: '#fff',
                  borderColor: 'var(--ghost)',
                  fontFamily: 'var(--font-archivo)',
                }}
              >
                {l}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="text-[12px]" style={{ color: '#EF9F27' }}>★</span>
              ))}
            </div>
            <span className="font-familjen text-[12px]" style={{ color: 'rgba(26,16,53,0.45)' }}>
              <span className="font-semibold" style={{ color: 'var(--void)' }}>2,400+</span> students prepping
            </span>
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}