'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    MessagesSquare,
    Bug,
    Sparkles,
    Paintbrush,
    Gauge,
    Star,
    Send,
    CheckCircle2,
} from 'lucide-react'

type Props = {
    open: boolean
    onClose: () => void
}

const categories = [
    {
        label: 'Bug',
        icon: Bug,
    },
    {
        label: 'Feature',
        icon: Sparkles,
    },
    {
        label: 'UI/UX',
        icon: Paintbrush,
    },
    {
        label: 'Performance',
        icon: Gauge,
    },
    {
        label: 'Other',
        icon: MessagesSquare,
    },
]
export default function FeedbackModal({
    open,
    onClose,
}: Props) {
    const [rating, setRating] = useState(5)
    const [category, setCategory] = useState('Bug')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!open) {
            setRating(5)
            setCategory('Bug')
            setMessage('')
            setLoading(false)
            setSuccess(false)
        }
    }, [open])

    async function submitFeedback() {
        console.log("submitFeedback START", Date.now());
        if (loading) return;

        console.log("Before fetch");


        console.log("submitFeedback called");

        if (!message.trim()) return;

        setLoading(true);

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating,
                    category,
                    message,
                    page: window.location.pathname,
                    browser: navigator.userAgent,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit feedback');
            }

            setSuccess(true)

            setTimeout(() => {
                onClose()
            }, 1200)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Background */}

                    <motion.div
                        className="fixed inset-0 bg-black/40 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}

                    <motion.div
                        initial={{ opacity: 0, scale: .94, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: .94, y: 20 }}
                        transition={{ duration: .25 }}
                        className="fixed left-1/2 top-1/2 z-50
            -translate-x-1/2 -translate-y-1/2
            w-[92%] max-w-lg rounded-3xl p-8"
                        style={{
                            background: '#fff',
                            border: '1px solid rgba(26,16,53,.08)',
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-5 top-5"
                        >
                            <X size={18} />
                        </button>

                        <h2
                            className="text-3xl font-black mb-2"
                            style={{
                                fontFamily: 'var(--font-archivo)',
                            }}
                        >
                            Help improve PrepOS 🚀
                        </h2>

                        <p className="text-sm opacity-60 mb-6">
                            Since this is the beta version, your feedback
                            helps us improve the experience.
                        </p>

                        {/* Rating */}

                        <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Rating
                        </label>

                        <div className="flex gap-2 mt-3 mb-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                    disabled={loading || success}
                                    key={i}
                                    onClick={() => setRating(i)}
                                >
                                    <Star
                                        size={26}
                                        fill={i <= rating ? '#F59E0B' : 'transparent'}
                                        color="#F59E0B"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Categories */}

                        <label className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Category
                        </label>

                        <div className="flex flex-wrap gap-2 mt-3 mb-6">

                            {categories.map((c) => {

                                const Icon = c.icon

                                return (

                                    <button
                                        key={c.label}
                                        onClick={() => setCategory(c.label)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                        style={{
                                            background:
                                                category === c.label
                                                    ? 'var(--void)'
                                                    : '#F7F7FA',

                                            color:
                                                category === c.label
                                                    ? 'white'
                                                    : '#333'
                                        }}
                                    >
                                        <Icon size={15} />
                                        {c.label}
                                    </button>

                                )

                            })}

                        </div>

                        {/* Message */}

                        <textarea
                            disabled={loading || success}
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what you liked, what broke, or what you'd love to see..."
                            className="w-full rounded-2xl p-4 outline-none resize-none"
                            style={{
                                border: '1px solid rgba(26,16,53,.1)'
                            }}
                        />

                        <button
                            disabled={loading || success}
                            onClick={submitFeedback}
                            className="mt-6 w-full rounded-2xl py-4
              flex items-center justify-center gap-2
              font-bold"
                            style={{
                                background: 'var(--void)',
                                color: 'white'
                            }}
                        >
                            {success ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <Send size={16} />
                            )}

                            {loading
                                ? 'Submitting...'
                                : success
                                    ? 'Thanks for helping improve PrepOS!'
                                    : 'Submit Feedback'}
                        </button>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}