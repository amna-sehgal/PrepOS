'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Mic2, KanbanSquare, Lightbulb,
  Map, BookOpen, Settings, LogOut, Bell, ChevronDown, Menu, X,
} from 'lucide-react'

const navLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mock Interview', href: '/mock-interview', icon: Mic2 },
  { label: 'Tracker', href: '/tracker', icon: KanbanSquare },
  { label: 'Brainstorm', href: '/brainstorm', icon: Lightbulb },
  { label: 'Roadmap', href: '/roadmap', icon: Map },
  { label: 'Resources', href: '/resources', icon: BookOpen },
]

const notifications = [
  { id: 1, text: 'Razorpay interview in 3 days', type: 'urgent', time: '2h ago' },
  { id: 2, text: 'Your prep plan for Flipkart is ready', type: 'info', time: '5h ago' },
  { id: 3, text: 'Mock interview report generated', type: 'success', time: '1d ago' },
]

export default function TopNavbar() {
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const unreadCount = notifications.filter(n => n.type === 'urgent' || n.type === 'info').length

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full font-familjen"
        style={{
          background: 'rgba(247,246,253,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--void-12)',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <Image
              src="/Screenshot 2026-03-19 215740.png"
              alt="PrepOS"
              width={34}
              height={34}
              className="rounded-xl"
            />
            <span
              className="font-archivo font-black hidden sm:inline"
              style={{ fontSize: '17px', letterSpacing: '-0.04em', color: '#1A1035' }}
            >
              PrepOS
            </span>
          </Link>

          {/* ── Nav links (desktop) ── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link key={link.href} href={link.href} className="no-underline">
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: active ? 'var(--void)' : 'transparent',
                      color: active ? 'var(--mist)' : 'rgba(26,16,53,0.55)',
                      fontFamily: 'var(--font-archivo)',
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--void)'
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(26,16,53,0.55)'
                    }}
                  >
                    <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
                    {link.label}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setNotifOpen(o => !o); setUserMenuOpen(false) }}
                className="relative w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                style={{
                  background: notifOpen ? 'var(--void)' : 'transparent',
                  color: notifOpen ? 'var(--mist)' : 'rgba(26,16,53,0.5)',
                  border: '1.5px solid transparent',
                }}
              >
                <Bell size={15} strokeWidth={1.8} />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ background: 'var(--coral)', color: '#fff', fontFamily: 'var(--font-archivo)' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-10 w-72 rounded-2xl overflow-hidden shadow-xl z-50"
                    style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
                  >
                    <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--void-12)' }}>
                      <span className="font-bold text-[13px]" style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                        Notifications
                      </span>
                      <span className="font-mono-frag text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(226,75,74,0.1)', color: 'var(--coral)' }}>
                        {unreadCount} new
                      </span>
                    </div>
                    {notifications.map((n, i) => (
                      <div key={n.id}
                        className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-ghost cursor-pointer"
                        style={{ borderBottom: i < notifications.length - 1 ? '1px solid var(--void-12)' : 'none' }}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{
                            background: n.type === 'urgent' ? 'var(--coral)'
                              : n.type === 'success' ? 'var(--teal)' : 'var(--brand)',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] leading-snug" style={{ color: 'var(--void)' }}>{n.text}</p>
                          <p className="text-[10px] mt-0.5 font-mono-frag" style={{ color: 'rgba(26,16,53,0.35)' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setUserMenuOpen(o => !o); setNotifOpen(false) }}
                className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 cursor-pointer transition-all"
                style={{
                  background: userMenuOpen ? 'var(--void)' : '#fff',
                  border: '1.5px solid var(--void-12)',
                  color: userMenuOpen ? 'var(--mist)' : 'var(--void)',
                }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                  style={{
                    background: userMenuOpen ? 'rgba(238,237,254,0.2)' : 'var(--mist)',
                    color: userMenuOpen ? 'var(--mist)' : 'var(--brand)',
                    fontFamily: 'var(--font-archivo)',
                  }}
                >
                  A
                </div>
                <span className="text-[13px] font-semibold hidden sm:block" style={{ fontFamily: 'var(--font-archivo)' }}>
                  Arjun
                </span>
                <ChevronDown size={13} strokeWidth={2}
                  style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                />
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-11 w-52 rounded-2xl overflow-hidden shadow-xl z-50"
                    style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--void-12)' }}>
                      <p className="font-bold text-[13px]" style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                        Arjun Sharma
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(26,16,53,0.4)' }}>BITS Pilani</p>
                    </div>

                    <Link href="/settings" className="no-underline" onClick={() => setUserMenuOpen(false)}>
                      <div className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-ghost cursor-pointer"
                        style={{ color: 'rgba(26,16,53,0.65)' }}>
                        <Settings size={14} strokeWidth={1.8} />
                        <span className="text-[13px]">Settings</span>
                      </div>
                    </Link>

                    <div style={{ borderTop: '1px solid var(--void-12)' }}>
                      <button
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-ghost cursor-pointer"
                        style={{ color: 'var(--coral)' }}
                        onClick={() => { setUserMenuOpen(false) }}
                      >
                        <LogOut size={14} strokeWidth={1.8} />
                        <span className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-archivo)' }}>
                          Log out
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ background: 'transparent', color: 'var(--void)', border: '1.5px solid var(--void-12)' }}
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </motion.button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--void-12)' }}
            >
              <div className="px-5 py-3 flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const active = pathname === link.href
                  return (
                    <Link key={link.href} href={link.href} className="no-underline" onClick={() => setMobileOpen(false)}>
                      <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                        style={{
                          background: active ? 'var(--void)' : 'transparent',
                          color: active ? 'var(--mist)' : 'rgba(26,16,53,0.6)',
                        }}
                      >
                        <Icon size={15} strokeWidth={1.8} />
                        <span className="text-[13px] font-medium" style={{ fontFamily: 'var(--font-archivo)' }}>
                          {link.label}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click outside to close dropdowns */}
      {(userMenuOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserMenuOpen(false); setNotifOpen(false) }} />
      )}
    </>
  )
}