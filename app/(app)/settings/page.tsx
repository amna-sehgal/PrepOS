'use client'

import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Settings, User, Target, Bell, Lock, Trash2,
  Save, Eye, EyeOff, CheckCircle2, AlertTriangle,
  Building2, GraduationCap, Mail, Calendar, ToggleLeft,
  ToggleRight, ChevronRight, X, AlertCircle, Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ease = cubicBezier(0.22, 1, 0.36, 1)
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// ── Data ───────────────────────────────────────────────
const colleges = ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'IIIT Hyderabad', 'DTU', 'NSUT', 'Other']
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Graduate']
const roles = ['SDE Intern', 'SDE-1', 'Data Analyst', 'Product Manager', 'ML Engineer', 'Frontend Dev', 'Backend Dev', 'DevOps']
const companies = ['Google', 'Amazon', 'Flipkart', 'Razorpay', 'Atlassian', 'Microsoft', 'Adobe', 'Swiggy', 'CRED', 'PhonePe', 'Meesho', 'Zepto']

// ── Reusable components ────────────────────────────────
function SectionHeader({ icon: Icon, title, description, color = 'var(--brand)' }: {
  icon: typeof Settings; title: string; description: string; color?: string
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: color + '14' }}>
        <Icon size={16} strokeWidth={1.8} style={{ color }} />
      </div>
      <div>
        <h2 className="font-black text-[17px] tracking-tight"
          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>{title}</h2>
        <p className="text-[12px] mt-0.5" style={{ color: 'rgba(26,16,53,0.45)' }}>{description}</p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold tracking-widest uppercase"
        style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', disabled = false }: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; disabled?: boolean
}) {
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled}
      className="rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all w-full"
      style={{
        background: disabled ? 'rgba(26,16,53,0.04)' : 'var(--ghost)',
        border: '1.5px solid var(--void-12)',
        color: disabled ? 'rgba(26,16,53,0.35)' : 'var(--void)',
      }}
      onFocus={e => !disabled && (e.target.style.borderColor = 'var(--brand)')}
      onBlur={e => (e.target.style.borderColor = 'var(--void-12)')}
    />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all appearance-none cursor-pointer"
        style={{ background: 'var(--ghost)', border: '1.5px solid var(--void-12)', color: 'var(--void)' }}
        onFocus={e => (e.target.style.borderColor = 'var(--brand)')}
        onBlur={e => (e.target.style.borderColor = 'var(--void-12)')}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronRight size={13} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none rotate-90"
        style={{ color: 'rgba(26,16,53,0.4)' }} />
    </div>
  )
}

function SaveButton({ onClick, saving, saved }: { onClick: () => void; saving: boolean; saved: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: saving ? 1 : 1.02, boxShadow: saving ? 'none' : '0 4px 14px rgba(26,16,53,0.15)' }}
      whileTap={{ scale: saving ? 1 : 0.97 }}
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-all"
      style={{
        background: saved ? 'rgba(29,158,117,0.1)' : 'var(--void)',
        color: saved ? 'var(--teal)' : 'var(--mist)',
        border: saved ? '1.5px solid rgba(29,158,117,0.25)' : 'none',
        fontFamily: 'var(--font-archivo)',
      }}>
      {saving ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
          <Loader2 size={14} strokeWidth={2} />
        </motion.div>
      ) : saved ? (
        <CheckCircle2 size={14} strokeWidth={2} />
      ) : (
        <Save size={14} strokeWidth={2} />
      )}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
    </motion.button>
  )
}

function Toggle({ on, onToggle, label, description }: {
  on: boolean; onToggle: () => void; label: string; description: string
}) {
  return (
    <div className="flex items-center justify-between py-3.5 px-5 rounded-2xl transition-all"
      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
      <div>
        <p className="font-semibold text-[13px]"
          style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(26,16,53,0.45)' }}>{description}</p>
      </div>
      <motion.button whileTap={{ scale: 0.92 }} onClick={onToggle} className="cursor-pointer flex-shrink-0 ml-4">
        <AnimatePresence mode="wait" initial={false}>
          {on ? (
            <motion.div key="on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ToggleRight size={32} strokeWidth={1.5} style={{ color: 'var(--brand)' }} />
            </motion.div>
          ) : (
            <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ToggleLeft size={32} strokeWidth={1.5} style={{ color: 'rgba(26,16,53,0.25)' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// ── Delete confirm modal ───────────────────────────────
function DeleteModal({ onClose }: { onClose: () => void }) {
  const [confirm, setConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const ready = confirm === 'DELETE'

  const handleDelete = async () => {
    if (!ready) return

    setDeleting(true)

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // 1. Delete user data (IMPORTANT: order matters if FK exists)

      await supabase.from('user_settings').delete().eq('user_id', user.id)
      await supabase.from('brainstorm_cards').delete().eq('user_id', user.id)
      await supabase.from('mock_interviews').delete().eq('user_id', user.id)

      // add any other tables you created

      // 2. Sign out user
      await supabase.auth.signOut()

      // 3. Redirect to landing/login
      window.location.href = '/'

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,16,53,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>

        <div className="px-6 py-5"
          style={{ background: 'rgba(226,75,74,0.05)', borderBottom: '1px solid rgba(226,75,74,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(226,75,74,0.1)' }}>
              <AlertTriangle size={18} strokeWidth={1.8} style={{ color: 'var(--coral)' }} />
            </div>
            <div>
              <h3 className="font-black text-[16px]"
                style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                Delete your account
              </h3>
              <p className="text-[12px]" style={{ color: 'rgba(26,16,53,0.5)' }}>
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="px-4 py-3 rounded-xl text-[12px] leading-relaxed"
            style={{ background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.15)', color: 'rgba(26,16,53,0.65)' }}>
            Deleting your account will permanently remove all your mock interview history, tracker data, ideas, roadmaps, and profile. You cannot recover this data.
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold"
              style={{ color: 'rgba(26,16,53,0.5)', fontFamily: 'var(--font-archivo)' }}>
              Type <span style={{ color: 'var(--coral)', fontFamily: 'monospace' }}>DELETE</span> to confirm
            </label>
            <input value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="DELETE"
              className="rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all"
              style={{
                background: 'var(--ghost)',
                border: `1.5px solid ${ready ? 'var(--coral)' : 'var(--void-12)'}`,
                color: 'var(--void)',
              }} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid var(--void-12)' }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--ghost)', color: 'rgba(26,16,53,0.5)', border: '1.5px solid var(--void-12)', fontFamily: 'var(--font-archivo)' }}>
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: ready && !deleting ? 1.02 : 1 }}
            whileTap={{ scale: ready && !deleting ? 0.97 : 1 }}
            onClick={handleDelete}
            disabled={!ready || deleting}
            className="px-5 py-2 rounded-xl text-[13px] font-bold cursor-pointer flex items-center gap-2 transition-all"
            style={{
              background: ready ? 'var(--coral)' : 'rgba(226,75,74,0.15)',
              color: ready ? '#fff' : 'rgba(226,75,74,0.4)',
              fontFamily: 'var(--font-archivo)',
            }}>
            {deleting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={14} strokeWidth={2} />
              </motion.div>
            ) : <Trash2 size={14} strokeWidth={2} />}
            {deleting ? 'Deleting...' : 'Delete account'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Section wrapper ────────────────────────────────────
function Section({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <motion.div
      id={id}
      variants={fadeUp}
      className="rounded-2xl p-6"
      style={{ background: '#fff', border: '1.5px solid var(--void-12)' }}>
      {children}
    </motion.div>
  )
}

// ── Sticky section nav ─────────────────────────────────


// ── Main page ──────────────────────────────────────────
export default function SettingsPage() {
  const supabase = createClient()
  // Profile
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [college, setCollege] = useState('')
  const [year, setYear] = useState('')
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) return

      const user = data.user

      setName(user.user_metadata?.full_name || '')
      setEmail(user.email || '')
      setCollege(user.user_metadata?.college_name || '')
      setYear(user.user_metadata?.year || '')
    }

    fetchUser()
  }, [])
  const [savingProfile, setSavingProfile] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)

  // Password
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [savedPass, setSavedPass] = useState(false)
  const passError = newPass && confirmPass && newPass !== confirmPass
  const passStrength = newPass.length === 0 ? 0 : newPass.length < 8 ? 1 : newPass.length < 12 ? 2 : 3

  // Danger
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const simulateSave = (
    setSaving: (v: boolean) => void,
    setSaved: (v: boolean) => void
  ) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 1000)
  }

  const saveSettings = async (updates: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // STEP 1: fetch existing
    const { data: existing } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // STEP 2: merge everything safely
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,

        target_role: updates.target_role ?? existing?.target_role ?? null,
        target_companies: updates.target_companies ?? existing?.target_companies ?? null,

        notifications: {
          interviewReminder:
            updates.notifications?.interviewReminder ??
            existing?.notifications?.interviewReminder ??
            true,

          prepPlan:
            updates.notifications?.prepPlan ??
            existing?.notifications?.prepPlan ??
            true,

          streak:
            updates.notifications?.streak ??
            existing?.notifications?.streak ??
            false,

          email:
            updates.notifications?.email ??
            existing?.notifications?.email ??
            true,
        },
      }, {
        onConflict: 'user_id'   // 🔥 THIS LINE FIXES YOUR ENTIRE BUG
      })

    return error;
  }

  return (
    <div className="min-h-screen font-familjen" style={{ background: 'var(--ghost)', color: 'var(--void)' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: 'radial-gradient(circle, var(--void) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative max-w-2xl mx-auto px-5 md:px-0 py-8 md:py-10">

        {/* ── Page header ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }} className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full"
            style={{ background: 'rgba(26,16,53,0.06)', border: '1px solid var(--void-12)' }}>
            <Settings size={11} strokeWidth={1.8} style={{ color: 'rgba(26,16,53,0.5)' }} />
            <span className="font-mono-frag text-[10px] tracking-[0.1em]"
              style={{ color: 'rgba(26,16,53,0.5)' }}>SETTINGS</span>
          </div>
          <h1 className="font-black text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.03em]"
            style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
            Account Settings
          </h1>
          <p className="text-[14px] mt-1" style={{ color: 'rgba(26,16,53,0.45)' }}>
            Manage your profile, preferences, and account.
          </p>
        </motion.div>

        {/* ── Sections ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">

          {/* ── Profile ── */}
          <Section id="profile">
            <SectionHeader icon={User} title="Profile" description="Your personal information visible across PrepOS." />
            <div className="flex flex-col gap-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-[24px] flex-shrink-0 cursor-pointer"
                  style={{ background: 'var(--void)', color: 'var(--mist)', fontFamily: 'var(--font-archivo)' }}>
                  {name[0] || 'A'}
                </motion.div>
                <div>
                  <p className="font-bold text-[14px]"
                    style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>{name || 'Your Name'}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'rgba(26,16,53,0.45)' }}>{college} · {year}</p>
                </div>
              </div>

              <div className="h-px" style={{ background: 'var(--void-12)' }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <Input value={name} onChange={setName} placeholder="Arjun Sharma" />
                </Field>
                <Field label="Email">
                  <Input value={email} onChange={setEmail} placeholder="you@college.ac.in" type="email" disabled />
                </Field>
                <Field label="College">
                  <Select value={college} onChange={setCollege} options={colleges} />
                </Field>
                <Field label="Year">
                  <Select value={year} onChange={setYear} options={years} />
                </Field>
              </div>

              <div className="flex justify-end pt-1">
                <SaveButton
                  onClick={async () => {
                    setSavingProfile(true)

                    const { data, error } = await supabase.auth.updateUser({
                      data: {
                        full_name: name,
                        college_name: college,
                        year: year,
                      },
                    })

                    setSavingProfile(false)

                    if (!error) {
                      setSavedProfile(true)
                      setTimeout(() => setSavedProfile(false), 2500)
                    } else {
                      console.error(error)
                    }
                  }}
                  saving={savingProfile} saved={savedProfile} />
              </div>
            </div>
          </Section>

          {/* ── Password ── */}
          <Section id="password">
            <SectionHeader icon={Lock} title="Change Password"
              description="Use a strong password you don't use anywhere else." color="#8B5CF6" />
            <div className="flex flex-col gap-4">
              <Field label="Current Password">
                <div className="relative">
                  <Input value={currentPass} onChange={setCurrentPass}
                    placeholder="Enter current password" type={showCurrent ? 'text' : 'password'} />
                  <button onClick={() => setShowCurrent(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[11px] font-semibold"
                    style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                    {showCurrent ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Field>

              <Field label="New Password">
                <div className="relative">
                  <Input value={newPass} onChange={setNewPass}
                    placeholder="Min. 8 characters" type={showNew ? 'text' : 'password'} />
                  <button onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[11px] font-semibold"
                    style={{ color: 'rgba(26,16,53,0.4)', fontFamily: 'var(--font-archivo)' }}>
                    {showNew ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Strength bar */}
                {newPass.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="flex gap-1.5 mt-1.5">
                    {[1, 2, 3].map(i => (
                      <motion.div key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background: passStrength >= i
                            ? i === 1 ? 'var(--coral)' : i === 2 ? 'var(--amber)' : 'var(--teal)'
                            : 'rgba(26,16,53,0.08)',
                        }} />
                    ))}
                  </motion.div>
                )}
              </Field>

              <Field label="Confirm New Password">
                <Input value={confirmPass} onChange={setConfirmPass}
                  placeholder="Re-enter new password" type="password" />
                <AnimatePresence>
                  {passError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-[11px] flex items-center gap-1 mt-1"
                      style={{ color: 'var(--coral)' }}>
                      <AlertCircle size={11} strokeWidth={2} /> Passwords don't match
                    </motion.p>
                  )}
                </AnimatePresence>
              </Field>

              <div className="flex justify-end pt-1">
                <SaveButton
                  onClick={async () => {
                    if (!newPass || newPass.length < 8) {
                      alert("Password must be at least 8 characters")
                      return
                    }

                    if (newPass !== confirmPass) {
                      alert("Passwords do not match")
                      return
                    }

                    setSavingPass(true)

                    const { error } = await supabase.auth.updateUser({
                      password: newPass,
                    })

                    setSavingPass(false)

                    if (!error) {
                      setSavedPass(true)
                      setCurrentPass('')
                      setNewPass('')
                      setConfirmPass('')
                      setTimeout(() => setSavedPass(false), 2000)
                    } else {
                      console.error(error)
                      alert(error.message)
                    }
                  }}
                  saving={savingPass}
                  saved={savedPass}
                />
              </div>
            </div>
          </Section>

          {/* ── Danger zone ── */}
          <motion.div variants={fadeUp} id="danger"
            className="rounded-2xl p-6"
            style={{ background: 'rgba(226,75,74,0.04)', border: '1.5px solid rgba(226,75,74,0.2)' }}>
            <SectionHeader icon={Trash2} title="Danger Zone"
              description="Irreversible actions — proceed with caution." color="var(--coral)" />

            <div className="flex items-center justify-between flex-wrap gap-4 px-5 py-4 rounded-2xl"
              style={{ background: '#fff', border: '1.5px solid rgba(226,75,74,0.15)' }}>
              <div>
                <p className="font-bold text-[14px]"
                  style={{ fontFamily: 'var(--font-archivo)', color: 'var(--void)' }}>
                  Delete account
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'rgba(26,16,53,0.5)' }}>
                  Permanently delete your PrepOS account and all associated data.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 4px 14px rgba(226,75,74,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer flex-shrink-0"
                style={{ background: 'var(--coral)', color: '#fff', fontFamily: 'var(--font-archivo)' }}>
                <Trash2 size={13} strokeWidth={2} /> Delete account
              </motion.button>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* ── Delete modal ── */}
      <AnimatePresence>
        {deleteModalOpen && <DeleteModal key="delete-modal" onClose={() => setDeleteModalOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}