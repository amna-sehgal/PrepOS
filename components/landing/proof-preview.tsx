'use client'

import { motion, cubicBezier } from 'framer-motion'
import { FadeIn, Reveal, ScalePop } from '../motion'

// ─── Social Proof Strip ───────────────────────────────────────────────────────
const stats = [
  { num: '2,400+', label: 'students prepping' },
  { num: '18,000+', label: 'mock sessions done' },
  { num: '340+', label: 'offers logged' },
  { num: '60+', label: 'colleges onboarded' },
]

export function ProofStrip() {
  return (
    <FadeIn delay={0.3}>
      <div className="border-t border-b border-void/[0.08] bg-[#F0EEF9] py-3.5 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 flex-wrap">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="font-archivo font-black text-[18px] tracking-[-0.02em] text-void">
                  {s.num}
                </span>
                <span className="font-familjen text-[13px] text-void/50">{s.label}</span>
              </div>
              {i < stats.length - 1 && (
                <div className="w-px h-5 bg-void/10 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

// ─── App Preview Shell ────────────────────────────────────────────────────────
export function AppPreview() {
  return (
    <Reveal delay={0.15} className="px-6 md:px-12 max-w-5xl mx-auto pt-10">
      <ScalePop delay={0.1}>
        <div className="bg-[#1A1035] rounded-t-2xl overflow-hidden border border-white/[0.08]">

          {/* Browser bar */}
          <div className="bg-[#110B27] px-4 py-2.5 flex items-center gap-2.5 border-b border-white/[0.05]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E24B4A]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF9F27]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]" />
            <div className="flex-1 bg-white/[0.06] rounded-full py-1 px-4 mx-3">
              <p className="font-mono-frag text-[11px] text-white/30 text-center">
                app.prepos.in/dashboard
              </p>
            </div>
          </div>

          {/* Dashboard cards */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">

            {/* Momentum card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4"
            >
              <p className="font-mono-frag text-[9px] tracking-[0.1em] uppercase text-lavender mb-2">
                Prep momentum
              </p>
              <p className="font-archivo font-black text-[18px] tracking-[-0.02em] text-[#F5F2FF] mb-1">
                84% ready
              </p>
              <p className="font-familjen text-[12px] text-[#9D97C2] leading-snug">
                Revise OS before Flipkart round.
              </p>
              <div className="h-1 bg-white/[0.08] rounded-full mt-3 overflow-hidden">
                <motion.div
                  className="h-full bg-indigo rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '84%' }}
                  transition={{ delay: 0.9, duration: 1.2, ease: cubicBezier(0.22, 1, 0.36, 1) }}
                />
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/[0.06]">
                {[['12', 'Day streak'], ['3', 'Companies'], ['1', 'Offer']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-archivo font-black text-[18px] text-[#F5F2FF]">{n}</p>
                    <p className="font-familjen text-[10px] text-[#9D97C2]">{l}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tracker card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4"
            >
              <p className="font-mono-frag text-[9px] tracking-[0.1em] uppercase text-lavender mb-3">
                Interview tracker
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  ['Razorpay · SDE', 'Interview', '#EEEDFE', '#3C3489', '#534AB7'],
                  ['Flipkart · SDE', 'OA pending', '#FAEEDA', '#633806', '#EF9F27'],
                  ['Groww · SDE', 'Offer', '#E1F5EE', '#085041', '#1D9E75'],
                  ['Swiggy · SDE', 'Interview', '#EEEDFE', '#3C3489', '#534AB7'],
                ].map(([company, status, bg, text, dot]) => (
                  <div key={company} className="flex items-center justify-between">
                    <span className="font-familjen text-[12px] font-medium text-[#F5F2FF]">
                      {company}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 font-archivo text-[10px] font-bold rounded-full px-2.5 py-[3px]"
                      style={{ background: `${bg}22`, color: bg }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: dot }}
                      />
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Prep plan card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4"
            >
              <p className="font-mono-frag text-[9px] tracking-[0.1em] uppercase text-lavender mb-2">
                7-day prep plan
              </p>
              <p className="font-archivo font-black text-[14px] text-[#F5F2FF] mb-3">
                Razorpay in 7 days
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ['Arrays & sliding window', true],
                  ['Trees & recursion', true],
                  ['Dynamic programming', false, true],
                  ['Mock HR round', false],
                ].map(([task, done, active]) => (
                  <div key={task as string} className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center
                        ${done ? 'bg-[#1D9E75]' : active ? 'bg-brand' : 'bg-white/10'}`}
                    >
                      {done && <div className="w-1.5 h-1.5 bg-[#E1F5EE] rounded-sm" />}
                    </div>
                    <span
                      className={`font-familjen text-[11px] ${
                        done
                          ? 'text-[#9D97C2] line-through'
                          : active
                          ? 'text-[#F5F2FF]'
                          : 'text-[#6B6490]'
                      }`}
                    >
                      {task as string}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </ScalePop>
    </Reveal>
  )
}