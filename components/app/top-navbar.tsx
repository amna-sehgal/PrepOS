'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { logout } from '@/lib/actions/auth'
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

export default function TopNavbar() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotif, setLoadingNotif] = useState(true)
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const unreadCount = notifications.filter(n => !n.is_read).length
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserName(user.user_metadata?.full_name || '')
        setCollegeName(user.user_metadata?.college_name || '')
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => subscription.unsubscribe()
  }, [])
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          setNotifications(prev => {
            const exists = prev.some(n => n.id === payload.new.id)
            if (exists) return prev
            return [payload.new, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setNotifications(data)
      }

      setLoadingNotif(false)
    }

    fetchNotifications()
  }, [])

  const clearAllNotifications = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    if (!user) return

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)

    if (!error) {
      setNotifications([])
    }
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      console.log('Starting logout...')

      const result = await logout()

      if (!result.success) {
        console.error('Logout error:', result.error)
        alert(`Logout failed: ${result.error}`)
        setLoggingOut(false)
        return
      }

      console.log('Logout successful, redirecting...')
      setUserMenuOpen(false)

      // Redirect to login
      setTimeout(() => {
        router.push('/auth/login')
      }, 100)
    } catch (err) {
      console.error('Unexpected logout error:', err)
      alert('An unexpected error occurred during logout')
      setLoggingOut(false)
    }
  }
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
              src="/Screenshot 2026-06-15 161722.png"
              alt="PrepOS"
              width={62}
              height={62}
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
                    <div
                      className="px-4 py-3 flex items-center justify-between"
                      style={{ borderBottom: '1px solid var(--void-12)' }}
                    >
                      <span
                        className="font-bold text-[13px]"
                        style={{
                          fontFamily: 'var(--font-archivo)',
                          color: 'var(--void)'
                        }}
                      >
                        Notifications
                      </span>

                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono-frag text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: 'rgba(226,75,74,0.1)',
                            color: 'var(--coral)'
                          }}
                        >
                          {unreadCount} new
                        </span>

                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-[10px] font-medium hover:opacity-70"
                            style={{ color: 'var(--coral)' }}
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-[12px]" style={{ color: 'rgba(26,16,53,0.4)' }}>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-ghost cursor-pointer"
                          style={{
                            borderBottom:
                              i < notifications.length - 1 ? '1px solid var(--void-12)' : 'none',
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{
                              background:
                                n.type === 'interview-good-luck'
                                  ? '#F59E0B'
                                  : n.type === 'brainstorm-stale'
                                    ? '#8B5CF6'
                                    : n.type === 'roadmap-stale'
                                      ? '#3B82F6'
                                      : 'var(--brand)',
                            }}
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] leading-snug" style={{ color: 'var(--void)' }}>
                              {n.text}
                            </p>

                            <p
                              className="text-[10px] mt-0.5 font-mono-frag"
                              style={{ color: 'rgba(26,16,53,0.35)' }}
                            >
                              {new Date(n.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
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
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-[13px] font-semibold hidden sm:block" style={{ fontFamily: 'var(--font-archivo)' }}>
                  {userName?.split(' ')[0] || 'User'}
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
                        {userName || 'User'}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(26,16,53,0.4)' }}>{collegeName || 'College not added'}</p>
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
                        disabled={loggingOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-ghost cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: loggingOut ? 'rgba(226,75,74,0.5)' : 'var(--coral)' }}
                        onClick={handleLogout}
                      >
                        <LogOut size={14} strokeWidth={1.8} />
                        <span className="text-[13px] font-semibold" style={{ fontFamily: 'var(--font-archivo)' }}>
                          {loggingOut ? 'Logging out...' : 'Log out'}
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