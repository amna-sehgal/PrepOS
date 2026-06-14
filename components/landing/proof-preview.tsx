'use client'

import { motion, cubicBezier } from 'framer-motion'
import Image from 'next/image'
import { FadeIn, Reveal, ScalePop } from '../motion'

// // ─── Social Proof Strip ───────────────────────────────────────────────────────
// const stats = [
//   { num: '2,400+', label: 'students prepping' },
//   { num: '18,000+', label: 'mock sessions done' },
//   { num: '340+', label: 'offers logged' },
//   { num: '60+', label: 'colleges onboarded' },
// ]

// export function ProofStrip() {
//   return (
//     <FadeIn delay={0.3}>
//       <div className="border-t border-b border-void/[0.08] bg-[#F0EEF9] py-3.5 px-8">
//         <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 flex-wrap">
//           {stats.map((s, i) => (
//             <div key={s.label} className="flex items-center gap-8">
//               <div className="flex items-center gap-2">
//                 <span className="font-archivo font-black text-[18px] tracking-[-0.02em] text-void">
//                   {s.num}
//                 </span>
//                 <span className="font-familjen text-[13px] text-void/50">{s.label}</span>
//               </div>

//               {i < stats.length - 1 && (
//                 <div className="w-px h-5 bg-void/10 hidden sm:block" />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </FadeIn>
//   )
// }

// ─── App Preview Shell ────────────────────────────────────────────────────────
export function AppPreview() {
  return (
    <Reveal delay={0.15} className="px-6 md:px-12 max-w-5xl mx-auto pt-0 pb-0">
      <ScalePop delay={0.1}>
        
        {/* ultra tight wrapper */}
        <div className="relative flex items-center justify-center overflow-hidden leading-none">

          {/* glow (kept subtle, but not pushing layout) */}
          <div className="absolute w-[180px] h-[180px] bg-[#AFA9EC] blur-[90px] opacity-15 rounded-full" />
          <div className="absolute w-[160px] h-[160px] bg-[#534AB7] blur-[90px] opacity-10 rounded-full" />

          {/* image container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: cubicBezier(0.22, 1, 0.36, 1),
            }}
            className="relative z-10 flex items-center justify-center"
          >
            <Image
              src="/Student stress-pana.png"
              alt="PrepOS Illustration"
              width={520}
              height={520}
              className="object-contain block"
              priority
            />
          </motion.div>

        </div>

      </ScalePop>
    </Reveal>
  )
}