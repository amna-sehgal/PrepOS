'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Clock, ArrowRight } from 'lucide-react'

export default function HistoryPage() {
  const supabase = createClient()

  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (!error && data) setReports(data)

      setLoading(false)
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-ghost">
        <p className="text-sm text-void/60 font-mono">
          Loading history...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-ghost font-familjen">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-void font-archivo tracking-tight">
            Interview History
          </h1>

          <p className="mt-2 text-sm text-void/50">
            All completed mock interview reports
          </p>
        </div>

        {/* EMPTY STATE */}
        {reports.length === 0 && (
          <div className="bg-white/70 backdrop-blur border border-mist rounded-3xl p-12 text-center shadow-sm">
            <p className="text-sm text-void/60 font-mono">
              No completed interviews yet.
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="flex flex-col gap-8">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/mock-interview/report/${report.id}`}
              className="block"
            >
              <div
                className="
          group
          bg-white/80 backdrop-blur
          border border-mist
          rounded-3xl
          p-6

          flex items-center justify-between

          transition-all duration-300 ease-out

          hover:shadow-md
          hover:border-indigo/20
          hover:-translate-y-1

          cursor-pointer
        "
              >

                {/* LEFT */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-void font-archivo group-hover:text-indigo transition-colors">
                    {report.role}
                  </h3>

                  <p className="text-xs text-void/50 font-mono">
                    {report.interview_type}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-void/40 text-xs font-mono">
                    <Clock size={13} />
                    <span>
                      {new Date(report.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">

                  {/* SCORE */}
                  <div className="flex flex-col items-center">
                    <Trophy size={18} className="text-prep-teal" />

                    <span className="text-xl font-black text-void font-archivo">
                      {report.report?.score || 0}
                    </span>

                    <span className="text-[10px] text-void/40 font-mono">
                      SCORE
                    </span>
                  </div>

                  {/* ARROW */}
                  <div className="w-10 h-10 rounded-full bg-mist flex items-center justify-center group-hover:bg-indigo/10 transition">
                    <ArrowRight size={18} className="text-void/40 group-hover:text-indigo" />
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}